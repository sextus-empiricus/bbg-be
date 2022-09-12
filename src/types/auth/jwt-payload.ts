export interface JwtPayload {
   sub: string;
   email: string;
}

export interface JwtPayloadRefresh extends JwtPayload {
   refreshToken: string;
}
