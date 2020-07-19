import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: any) {
        // console.log('payload', payload);
        // payload {
        //     user: {
        //       id: 37,
        //       name: 'AnhTuan',
        //       username: 'root',
        //       email: 'anhtuan123@gmail.com'
        //     },
        //     iat: 1595149445,
        //     exp: 1595149545
        //   }
        return { ...payload.user };
    }
}