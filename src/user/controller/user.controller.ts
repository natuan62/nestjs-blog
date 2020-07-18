import { User } from './../model/user.interface';
import { Observable } from 'rxjs';
import { UserService } from './../service/user.service';
import { Controller, Post, Body, Get, Param, Put, Delete, Req } from '@nestjs/common';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {

    }

    @Post()
    create(@Body() user: User): Observable<User> {
        return this.userService.create(user);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<User> {
        console.log('id', id);
        
        return this.userService.findOne(Number(id));
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Put()
    updateOne(@Body() user: User, @Param('id') id: string): Observable<any> {
        return this.userService.updateOne(Number(id), user);
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<any> {
        return this.userService.deleteOne(Number(id));
    }

}
