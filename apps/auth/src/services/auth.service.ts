import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { JwtHelperService } from './jwt-helper.service';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { AgentDto, AgentRole, ApiResponse } from '@app/common/dto-generic';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { IAccountGrpcService } from '@app/common/grpc/interfaces/account.interface';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import { ACCOUNT_GRPC_CLIENT_PROVIDER, ACCOUNT_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/account-grpc.config';
import { AGENT_GRPC_CLIENT_PROVIDER, AGENT_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/agent-grpc.config';
import { CreateAccountRequest } from '@app/common/streams/account/create-account.model';
import { UpdateRefreshTokenRequest } from '@app/common/streams/agent/update-refresh-token.model';

/**
 * Main service class for handling authentication
 */
@Injectable()
export class AuthService implements OnModuleInit {
  // The Grpc client methods for account and agent service
  private accountQueryService: IAccountGrpcService;
  private agentQueryService: IAgentGrpcService;

  constructor(
    private readonly natsClient: NatsJetStreamClientProxy,
    @Inject(AGENT_GRPC_CLIENT_PROVIDER)
    private readonly agentGrpcClient: ClientGrpc,
    @Inject(ACCOUNT_GRPC_CLIENT_PROVIDER)
    private readonly accountGrpcClient: ClientGrpc,
    private readonly jwtUtils: JwtHelperService,
  ) {}

  onModuleInit() {
    this.accountQueryService =
      this.accountGrpcClient.getService<IAccountGrpcService>(
        ACCOUNT_GRPC_SERVICE_NAME,
      );

    this.agentQueryService = this.agentGrpcClient.getService<IAgentGrpcService>(
      AGENT_GRPC_SERVICE_NAME,
    );
  }

  async signup(signupDto: SignupDto): Promise<ApiResponse<AuthTokensDto>> {
    // check if account exists
    const { exists: accountExists } = await lastValueFrom(
      await this.accountQueryService.accountExists({
        email: signupDto.email,
      }),
    );

    if (accountExists)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Account already exists',
        },
      };

    // create an account for the new signup
    const { success: createAccountSuccess, data: createdAgent } =
      await lastValueFrom(
        this.natsClient.send<ApiResponse<AgentDto | null>, SignupDto>(
          { cmd: new CreateAccountRequest().streamKey() },
          signupDto,
        ),
      );

    if (!createAccountSuccess || !createdAgent)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Could not create Account',
        },
      };

    const authTokens = await this.jwtUtils.generateTokens(
      createdAgent.id,
      createdAgent.email,
      createdAgent.account,
      createdAgent.role,
    );

    // update the refresh token for the agent
    this.natsClient.emit<void>(new UpdateRefreshTokenRequest().streamKey(), {
      agentId: createdAgent.id,
      newToken: authTokens.refreshToken,
    });

    return {
      success: true,
      data: authTokens,
    };
  }

  async signin({
    email,
    password,
  }: SigninDto): Promise<ApiResponse<AuthTokensDto>> {
    const res = await this.agentQueryService.getAgentByEmail({
      agentEmail: email,
    });
    const agent = await lastValueFrom(
      res.pipe(
        map(async (agent) => {
          if (
            agent &&
            (await bcrypt.compare(password, agent.password)) &&
            [AgentRole[AgentRole.OWNER], AgentRole[AgentRole.ADMIN]].includes(
              AgentRole[agent.role],
            )
          ) {
            return agent;
          } else return null;
        }),
      ),
    );

    if (!agent)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Agent not found',
        },
      };

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
      AgentRole[agent.role],
    );

    this.natsClient.emit<void>(new UpdateRefreshTokenRequest().streamKey(), {
      agentId: agent.id,
      newToken: tokens.refreshToken,
    });

    return {
      success: true,
      data: tokens,
    };
  }

  signout(agentId: string): ApiResponse<null> {
    this.natsClient.emit<void>(new UpdateRefreshTokenRequest().streamKey(), {
      agentId: agentId,
      newToken: null,
    });

    return {
      success: true,
      data: null,
    };
  }

  /**
   * Validate provided refresh token and genrate and return new tokens
   */
  async refreshTokens(
    agentId: string,
    refreshToken: string,
  ): Promise<ApiResponse<AuthTokensDto>> {
    const res = await this.agentQueryService.getAgentById({
      agentId: agentId,
    });
    const agent = await lastValueFrom(res);

    if (!agent || !agent.refreshToken)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Could not retrieve Agent or its RefreshToken',
        },
      };

    const tokenMatches = refreshToken === agent.refreshToken;

    if (!tokenMatches)
      return {
        success: false,
        error: {
          code: 403,
          message: 'Refresh Token is Invalid',
        },
      };

    const tokens = await this.jwtUtils.generateTokens(
      agent.id,
      agent.email,
      agent.account,
      AgentRole[agent.role],
    );

    this.natsClient.emit<void>(new UpdateRefreshTokenRequest().streamKey(), {
      agentId: agent.id,
      newToken: tokens.refreshToken,
    });

    return {
      success: true,
      data: tokens,
    };
  }
}
