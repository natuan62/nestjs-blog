import { User } from './../../user/model/user.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {

    }

    generateJwt(user: User): Observable<string>{
        return this.
    }

    hashPassword():Observable<string>{

    }

    comparePasswords():Observable<any>{

    }



}
