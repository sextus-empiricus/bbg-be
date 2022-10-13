import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   UseGuards,
} from '@nestjs/common';
import { GetCurrentUser, PublicRoute } from '../decorators';
import { RefreshTokenGuard } from '../guards';
import { AuthResponse, JwtPayload, SuccessResponse } from '../types';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}

   @PublicRoute()
   @Post('/local/signup')
   @HttpCode(HttpStatus.CREATED)
   async signupLocal(@Body() dto: AuthDto): Promise<AuthResponse> {
      return await this.authService.signupLocal(dto);
   }

   @PublicRoute()
   @Post('/local/signin')
   @HttpCode(HttpStatus.OK)
   async signinLocal(@Body() dto: AuthDto): Promise<AuthResponse> {
      return await this.authService.signinLocal(dto);
   }

   @Post('/logout')
   @HttpCode(HttpStatus.OK)
   async logout(@GetCurrentUser('sub') id: string): Promise<SuccessResponse> {
      return await this.authService.logout(id);
   }

   @PublicRoute()
   @UseGuards(RefreshTokenGuard)
   @Post('/refresh')
   @HttpCode(HttpStatus.OK)
   async refreshTokens(
      @GetCurrentUser() user: JwtPayload,
   ): Promise<AuthResponse> {
      return await this.authService.refreshTokens(user.sub, user.refreshToken);
   }
}