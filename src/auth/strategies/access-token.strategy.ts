import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from '../../config/app-config';
import { JwtPayload } from '../../types';

const { secretOrKey } = appConfig.jwt.access;

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor() {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey,
      });
   }

   validate(payload: JwtPayload): JwtPayload {
      return payload;
   }
}
