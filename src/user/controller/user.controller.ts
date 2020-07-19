import { RolesGuard } from './../../auth/decorator/guards/roles.guard';
import { JwtAuthGuard } from './../../auth/decorator/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Query, Post, Put, UseGuards } from '@nestjs/common';
import { User, UserRole } from './../model/user.interface';
import { UserService } from '../service/user.service';
import { Pagination } from 'nestjs-typeorm-paginate';
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

    @Get()
    async index(@Query('page') page: number = 1, @Query('limit') limit: number = 10,): Promise<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return await this.userService.paginate({
            page, limit, route: 'http://localhost:3000/users/',
        });
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

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    async updateRoleOfUser(@Param('id') id: string, @Body() user: User): Promise<User> {
        return await this.userService.updateRoleOfUser(Number(id), user);
    }


    @Delete(':id')
    async deleteOne(@Param('id') id: string): Promise<any> {
        return this.userService.deleteOne(Number(id));
    }




}
