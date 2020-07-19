import { CanActivate, ExecutionContext, Injectable, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from './../../../user/service/user.service';
import { User } from 'src/user/model/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        // roles [ 'admin' ]
        
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();

        // request.headers {
        //     authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozNywibmFtZSI6IkFuaFR1YW4iLCJ1c2VybmFtZSI6InJvb3QiLCJlbWFpbCI6ImFuaHR1YW4xMjNAZ21haWwuY29tIn0sImlhdCI6MTU5NTE0OTI1MiwiZXhwIjoxNTk1MTQ5MzUyfQ.PEWtbndFftZi4v3kPtB3_e3wHHFurcabV1EeBzrkO6E',
        //     'user-agent': 'PostmanRuntime/7.26.1',
        //     accept: '*/*',
        //     'cache-control': 'no-cache',
        //     'postman-token': '00632bc8-7418-4c3a-b7b6-522c5a37dd04',
        //     host: 'localhost:3000',
        //     'accept-encoding': 'gzip, deflate, br',
        //     connection: 'keep-alive'
        //   }

        const user: User = request?.user;
        // console.log('user', request.user);

        // user 
        //     {
        //       id: 37,
        //       name: 'AnhTuan',
        //       username: 'root',
        //       email: 'anhtuan123@gmail.com'
        //     }

        let { role } = await this.userService.findOne(user.id)
        // console.log('roles', roles);
        // console.log('role', role);
        return roles.includes(role) ? true : false;
    }
}