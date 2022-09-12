import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from '../../../config/app-config';
import { JwtPayload } from '../../types/auth';

const { secretOrKey } = appConfig.jwt.refresh;

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
   Strategy,
   'jwt-refresh',
) {
   constructor() {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         passReqToCallback: true,
         secretOrKey,
      });
   }

   validate(req: Request, payload: JwtPayload): JwtPayload {
      const refreshToken = req
         .get('authorization')
         .replace('Bearer', '')
         .trim();
      return { ...payload, refreshToken };
   }
}
