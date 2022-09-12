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
import { JwtPayload, TokensObject } from '../types/auth';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}

   @PublicRoute()
   @Post('/local/signup')
   @HttpCode(HttpStatus.CREATED)
   async signupLocal(@Body() dto: AuthDto): Promise<TokensObject> {
      return await this.authService.signupLocal(dto);
   }

   @PublicRoute()
   @Post('/local/signin')
   @HttpCode(HttpStatus.OK)
   async signinLocal(@Body() dto: AuthDto) {
      return await this.authService.signinLocal(dto);
   }

   @Post('/logout')
   @HttpCode(HttpStatus.OK)
   async logout(@GetCurrentUser('sub') id: string) {
      return await this.authService.logout(id);
   }

   @PublicRoute()
   @UseGuards(RefreshTokenGuard)
   @Post('/refresh')
   @HttpCode(HttpStatus.OK)
   async refreshTokens(@GetCurrentUser() user: JwtPayload) {
      return await this.authService.refreshTokens(user.sub, user.refreshToken);
   }
}
