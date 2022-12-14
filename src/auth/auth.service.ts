import {
   ConflictException,
   ForbiddenException,
   Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { appConfig } from '../config/app-config';
import {
   AuthResponse,
   ResponseStatus,
   SuccessResponse,
   TokensObject,
} from '../types';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto';

const { secretOrKey: secretAccess } = appConfig.jwt.access;
const { secretOrKey: secretRefresh } = appConfig.jwt.refresh;
const { development } = appConfig.app;

@Injectable()
export class AuthService {
   constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
   ) {}

   async signupLocal(dto: AuthDto): Promise<AuthResponse> {
      const targetedUser = await this.usersService.getByEmail(dto.email);
      if (targetedUser) {
         throw new ConflictException('Email address already in use.');
      }
      const { createdUserId } = await this.usersService.create({
         ...dto,
         password: await hash(dto.password, 12),
      });
      const tokens = await this.getTokens(createdUserId, dto.email);
      await this.updateUserRefreshToken(createdUserId, tokens.refreshToken);
      return {
         status: ResponseStatus.success,
         tokens,
      };
   }

   async signinLocal(dto: AuthDto): Promise<AuthResponse> {
      const { email, password } = dto;
      const targetedUser = await this.usersService.getByEmail(email);
      if (!targetedUser) {
         throw new ForbiddenException('Inccorect email or password.');
      }
      const passwordMatches = await compare(password, targetedUser.password);
      if (!passwordMatches) {
         throw new ForbiddenException('Inccorect email or password.');
      }
      const tokens = await this.getTokens(targetedUser.id, email);
      await this.updateUserRefreshToken(targetedUser.id, tokens.refreshToken);
      return {
         status: ResponseStatus.success,
         tokens,
      };
   }

   async logout(userId: string): Promise<SuccessResponse> {
      await this.usersService.update(userId, { refreshToken: null });
      return {
         status: ResponseStatus.success,
      };
   }

   async refreshTokens(
      userId: string,
      refreshToken: string,
   ): Promise<AuthResponse> {
      const { user } = await this.usersService.getById(userId);
      if (!user || !user.refreshToken)
         throw new ForbiddenException('Access denied.');
      const refreshTokenMatches = await compare(
         refreshToken,
         user.refreshToken,
      );
      if (!refreshTokenMatches) throw new ForbiddenException('Access denied.');
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateUserRefreshToken(user.id, tokens.refreshToken);
      return {
         status: ResponseStatus.success,
         tokens,
      };
   }

   //utility fns():
   async getTokens(userId: string, email: string): Promise<TokensObject> {
      const oneMinute = 60 * 15;
      const oneWeek = 60 * 60 * 60 * 24 * 7;
      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(
            {
               sub: userId,
               email: email,
            },
            {
               secret: secretAccess,
               expiresIn: development ? oneWeek : oneMinute,
            },
         ),
         this.jwtService.signAsync(
            {
               sub: userId,
               email: email,
            },
            { secret: secretRefresh, expiresIn: oneWeek },
         ),
      ]);
      return {
         accessToken,
         refreshToken,
      };
   }

   async updateUserRefreshToken(
      userId: string,
      refreshToken: string,
   ): Promise<void> {
      await this.usersService.update(userId, {
         refreshToken: await hash(refreshToken, 12),
      });
   }
}
