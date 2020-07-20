import { User } from './../../user/model/user.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {
    }

    async generateJwt(user: User): Promise<string> {
        return await this.jwtService.signAsync({ user });
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async comparePasswords(newPassword: string, passwordHash: string): Promise<Boolean> {
        return await bcrypt.compare(newPassword, passwordHash);
    }

}
