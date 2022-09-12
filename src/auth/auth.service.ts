import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { TokensObject } from '../types/auth';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      private usersService: UsersService,
   ) {}

   async signupLocal(dto: AuthDto): Promise<TokensObject> {
      await this.usersService.create({
         ...dto,
         password: await hash(dto.password, 12),
      });
   }

   async loginLocal() {}

   async logout() {}

   async refreshTokens() {}
}
