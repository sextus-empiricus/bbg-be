import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { appConfig } from '../../config/app-config';
import { TokensObject } from '../types/auth';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto';

const { secretOrKey: secretAccess } = appConfig.jwt.access;
const { secretOrKey: secretRefresh } = appConfig.jwt.refresh;

@Injectable()
export class AuthService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      private usersService: UsersService,
      private jwtService: JwtService,
   ) {}

   async signupLocal(dto: AuthDto): Promise<TokensObject> {
      const { createdUserId } = await this.usersService.create({
         ...dto,
         password: await hash(dto.password, 12),
      });
      const tokens = await this.getTokens(createdUserId, dto.email);
      await this.updateUserRefreshToken(createdUserId, tokens.refreshToken);
      return tokens;
   }

   async signinLocal(dto: AuthDto): Promise<TokensObject> {
      const { email, password } = dto;
      const targetedUser = await this.usersService.getByEmail(email);
      if (!targetedUser) {
         throw new ForbiddenException('Inccorect email or passport.');
      }
      const passwordMatches = await compare(password, targetedUser.password);
      if (!passwordMatches) {
         throw new ForbiddenException('Inccorect email or passport.');
      }
      const tokens = await this.getTokens(targetedUser.id, email);
      await this.updateUserRefreshToken(targetedUser.id, tokens.refreshToken);
      return tokens;
   }

   async logout(userId: string) {
      await this.usersService.update(userId, { refreshToken: null });
   }

   async refreshTokens(userId: string, refrestTokenHash: string) {
      const { user } = await this.usersService.getById(userId);
      if (!user || !user.refreshToken)
         throw new ForbiddenException('Access denied.');
      const refreshTokenMatches = compare(refrestTokenHash, user.refreshToken);
      if (!refreshTokenMatches) throw new ForbiddenException('Access denied.');
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateUserRefreshToken(user.id, tokens.refreshToken);
      return tokens;
   }

   //utility fns():
   private async getTokens(
      userId: string,
      email: string,
   ): Promise<TokensObject> {
      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(
            {
               sub: userId,
               email: email,
            },
            { secret: secretAccess, expiresIn: 60 * 15 },
         ),
         this.jwtService.signAsync(
            {
               sub: userId,
               email: email,
            },
            { secret: secretRefresh, expiresIn: 60 * 60 * 60 * 24 * 7 },
         ),
      ]);
      console.log({
         accessToken,
         refreshToken,
      });
      return {
         accessToken,
         refreshToken,
      };
   }

   private async updateUserRefreshToken(userId: string, refreshToken: string) {
      await this.usersService.update(userId, {
         refreshToken: await hash(refreshToken, 12),
      });
   }
}
