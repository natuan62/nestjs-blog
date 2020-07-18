import { User } from './../model/user.interface';
import { UserEntity } from './../model/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/service/auth.service';
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

            const { password, ...result } = await this.userRepository.save(newUser);
            return result;
        } catch (error) {
            // console.log('create() error', error);
            throw new Error(error);
        }
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

    updateOne(id: number, user: User): Promise<any> {
        delete user.email;
        delete user.password;

        return this.userRepository.update(id, user);
    }

    deleteOne(id: number): Promise<any> {
        return this.userRepository.delete(id);
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
