import { RolesGuard } from './../../auth/decorator/guards/roles.guard';
import { JwtAuthGuard } from './../../auth/decorator/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User, UserRole } from './../model/user.interface';
import { UserService } from '../service/user.service';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post()
    async create(@Body() user: User): Promise<User | Object> {
        return await this.userService.create(user);
    }

    @Post('login')
    async login(@Body() user: User): Promise<Object> {
        let token = await this.userService.login(user);
        return {
            access_token: token
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.userService.findOne(Number(id));
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @Put()
    async updateOne(@Body() user: User, @Param('id') id: string): Promise<any> {
        return this.userService.updateOne(Number(id), user);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string): Promise<any> {
        return this.userService.deleteOne(Number(id));
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    async updateRoleOfUser(@Param('id') id: string, @Body() user: User): Promise<User> {
        return await this.userService.updateRoleOfUser(Number(id), user);
    }
}
