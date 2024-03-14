import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/interfaces/auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {

    const user = await this.validate(payload)
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, username: payload.name };
    
  }
}