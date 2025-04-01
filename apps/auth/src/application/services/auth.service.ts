import { Inject, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtHelperService } from './jwt-helper.service';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ApiResponse, UserRole } from '@app/common/dto-generic';
import { CreateAccountResponse } from '../../infrastructure/command-client/models/account/create-account.model';
import {
  IUserWriter,
  USER_WRITER,
} from '../../infrastructure/command-client/providers/user.writer';
import {
  ACCOUNT_WRITER,
  IAccountWriter,
} from '../../infrastructure/command-client/providers/account.writer';
import {
  ACCOUNT_READER,
  IAccountReader,
} from '../../infrastructure/query-client/providers/account.reader';
import {
  IUserReader,
  USER_READER,
} from '../../infrastructure/query-client/providers/user.reader';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ACCOUNT_READER) private readonly accountReader: IAccountReader,
    @Inject(ACCOUNT_WRITER) private readonly accountWriter: IAccountWriter,
    @Inject(USER_READER) private readonly userReader: IUserReader,
    @Inject(USER_WRITER) private readonly userWriter: IUserWriter,
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
    let createUser: CreateAccountResponse;
    try {
      createUser = await this.accountWriter.createAccount({
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
      createUser.id,
      createUser.email,
      createUser.account,
      createUser.role,
    );

    // update the refresh token for the user
    await this.userWriter.updateRefreshToken({
      id: createUser.id,
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
    const user = await this.userReader.getUserByEmail(email);
    if (!user)
      return {
        success: false,
        error: {
          code: 404,
          message: 'User not found',
        },
      };

    const passwordValid = await bcrypt.compare(password, user.password);
    if (
      !passwordValid ||
      ![UserRole[UserRole.OWNER], UserRole[UserRole.ADMIN]].includes(
        UserRole[user.role],
      )
    ) {
      return null;
    }

    const tokens = await this.jwtUtils.generateTokens(
      user.id,
      user.email,
      user.account,
      UserRole[user.role],
    );

    await this.userWriter.updateRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });

    return {
      success: true,
      data: tokens,
    };
  }

  async signout(userId: string): Promise<ApiResponse<null>> {
    await this.userWriter.updateRefreshToken({
      id: userId,
      refreshToken: null,
    });

    return {
      success: true,
      data: null,
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<ApiResponse<AuthTokensDto>> {
    const user = await this.userReader.getUserById(userId);

    if (!user || !user.refreshToken)
      return {
        success: false,
        error: {
          code: 404,
          message: 'Could not retrieve User or its RefreshToken',
        },
      };

    const tokenMatches = refreshToken === user.refreshToken;

    if (!tokenMatches)
      return {
        success: false,
        error: {
          code: 403,
          message: 'Refresh Token is Invalid',
        },
      };

    const tokens = await this.jwtUtils.generateTokens(
      user.id,
      user.email,
      user.account,
      UserRole[user.role],
    );

    await this.userWriter.updateRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });

    return {
      success: true,
      data: tokens,
    };
  }
}
