import { Body, Controller, Post } from '@nestjs/common';
import { TokensObject } from '../types/auth';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}

   @Post('/local/signup')
   async signupLocal(@Body() dto: AuthDto) {
      await this.authService.signupLocal(dto);
   }

   @Post('/local/signin')
   async loginLocal(): Promise<TokensObject> {
      await this.authService.loginLocal();
   }

   @Post('/logout')
   async logout() {
      await this.authService.logout();
   }

   @Post('/refresh')
   async refreshTokens() {
      await this.authService.refreshTokens();
   }
}
