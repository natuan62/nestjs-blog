import { User } from './../../user/model/user.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {
    }

    async generateJwt(user: User): Promise<string> {
        return await this.jwtService.signAsync({ user });
    }

    hashPassword(password: string): string {
        return bcrypt.hash(password, 12);
    }

    async comparePasswords(newPassword: string, passwordHash: string): Promise<Boolean> {
        return await bcrypt.compare(newPassword, passwordHash);
    }

}
