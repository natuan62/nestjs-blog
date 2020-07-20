import { RolesGuard } from './../../auth/decorator/guards/roles.guard';
import { JwtAuthGuard } from './../../auth/decorator/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Query, Post, Put, UseGuards, UploadedFile, UseInterceptors, Request } from '@nestjs/common';
import { User, UserRole } from './../model/user.interface';
import { UserService } from '../service/user.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
    async index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string,
    ): Promise<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

        if (!username) {
            return await this.userService.paginate({
                page, limit, route: 'http://localhost:3000/users/',
            });
        } else {
            return await this.userService.paginateFilter({
                page, limit, route: 'http://localhost:3000/users/',
            });
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


    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './avatars',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                return cb(null, `${randomName}${extname(file.originalname)}`)
            }
        })
    }))
    async upload(@UploadedFile() file) {
        return file;
    }
}
