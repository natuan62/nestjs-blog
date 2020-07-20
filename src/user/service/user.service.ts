import { User, UserRole } from './../model/user.interface';
import { UserEntity } from './../model/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/service/auth.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import {Like} from "typeorm";
@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {
    }

    async create(user: User): Promise<User> {
        try {
            let passwordHashed = await this.authService.hashPassword(user.password);

            const newUser = new UserEntity();
            newUser.name = user.name;
            newUser.username = user.username;
            newUser.email = user.email;
            newUser.password = passwordHashed;
            newUser.role = UserRole.USER;

            const { password, ...result } = await this.userRepository.save(newUser);
            return result;
        } catch (error) {
            // console.log('create() error', error);
            throw new Error(error);
        }
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
        
        const result = await paginate<User>(this.userRepository, options);
        //  console.log('pagi result', result);
        result.items.forEach(v => delete v.password);
        return result;
    }

    async paginateFilter(options: IPaginationOptions): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        queryBuilder.orderBy('user.id', 'DESC'); // Or whatever you need to do
    
        return paginate<User>(queryBuilder, options);
      }

    async findAll(): Promise<User[]> {
        const result = await this.userRepository.find();
        result.forEach(v => delete v.password);
        return result;
    }

    async findOne(id: number): Promise<User> {
        const { password, ...result } = await this.userRepository.findOne({ id });
        return result;
    }

    async updateOne(id: number, user: User): Promise<any> {
        delete user.email;
        delete user.password;
        delete user.role;

        return await this.userRepository.update(id, user);
    }

    async updateRoleOfUser(id: number, user: User): Promise<any> {
        return await this.userRepository.update(id, user);
    }

    async deleteOne(id: number): Promise<any> {
        return await this.userRepository.delete(id);
    }

    async login(user: User): Promise<string> {
        const resultValidate = await this.validateUser(user.username, user.password);
        if (resultValidate) {
            return await this.authService.generateJwt(resultValidate);
        } else {
            return 'Wrong Credentials !'
        }
    }

    async validateUser(username: string, passwordParam: string): Promise<User> {
        const { password, ...result } = await this.findByUsername(username);

        const isMatch: Boolean = await this.authService.comparePasswords(passwordParam, password);

        if (isMatch) {
            return result;
        } else {
            throw Error;
        }
    }

    async findByUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({ username });
    }

}
