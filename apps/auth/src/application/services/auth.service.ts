import { Inject, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtHelperService } from './jwt-helper.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { AgentRole, ApiResponse } from '@app/common/dto-generic';
import { CreateAccountResponse } from '../../infrastructure/command-client/models/account/create-account.model';
import {
  AGENT_WRITER,
  IAgentWriter,
} from '../../infrastructure/command-client/providers/agent.writer';
import {
  ACCOUNT_WRITER,
  IAccountWriter,
} from '../../infrastructure/command-client/providers/account.writer';
import {
  ACCOUNT_READER,
  IAccountReader,
} from '../../infrastructure/query-client/providers/account.reader';
import {
  AGENT_READER,
  IAgentReader,
} from '../../infrastructure/query-client/providers/agent.reader';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ACCOUNT_READER) private readonly accountReader: IAccountReader,
    @Inject(ACCOUNT_WRITER) private readonly accountWriter: IAccountWriter,
    @Inject(AGENT_READER) private readonly agentReader: IAgentReader,
    @Inject(AGENT_WRITER) private readonly agentWriter: IAgentWriter,
    private readonly jwtUtils: JwtHelperService,
  ) {}

  async signup(signupDto: SignupDto): Promise<ApiResponse<AuthTokensDto>> {
    // check if account exists
    const accountExists = await this.accountReader.accountExists(
      signupDto.email,
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
    let createAgent: CreateAccountResponse;
    try {
      createAgent = await this.accountWriter.createAccount({
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        email: signupDto.email,
        phone: signupDto.phone,
        password: signupDto.password,
      });
    } catch (error) {
      return {
        success: false,
        error: {
          code: 404,
          message: 'Could not create Account',
        },
      };
    }

    const authTokens = await this.jwtUtils.generateTokens(
      createAgent.id,
      createAgent.email,
      createAgent.account,
      createAgent.role,
    );

    // update the refresh token for the agent
    await this.agentWriter.updateRefreshToken({
      id: createAgent.id,
      refreshToken: authTokens.refreshToken,
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
    const getAgent = await this.agentReader.getAgentByEmail(email);
    if (!getAgent)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Agent not found',
        },
      };

    const passwordValid = await bcrypt.compare(password, getAgent.password);
    if (
      !passwordValid ||
      ![AgentRole[AgentRole.OWNER], AgentRole[AgentRole.ADMIN]].includes(
        AgentRole[getAgent.role],
      )
    ) {
      return null;
    }

    const tokens = await this.jwtUtils.generateTokens(
      getAgent.id,
      getAgent.email,
      getAgent.account,
      AgentRole[getAgent.role],
    );

    await this.agentWriter.updateRefreshToken({
      id: getAgent.id,
      refreshToken: tokens.refreshToken,
    });

    return {
      success: true,
      data: tokens,
    };
  }

  async signout(agentId: string): Promise<ApiResponse<null>> {
    await this.agentWriter.updateRefreshToken({
      id: agentId,
      refreshToken: null,
    });

    return {
      success: true,
      data: null,
    };
  }

  async refreshTokens(
    agentId: string,
    refreshToken: string,
  ): Promise<ApiResponse<AuthTokensDto>> {
    const agent = await this.agentReader.getAgentById(agentId);

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

    await this.agentWriter.updateRefreshToken({
      id: agent.id,
      refreshToken: tokens.refreshToken,
    });

    return {
      success: true,
      data: tokens,
    };
  }
}
