import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class User {
    id?: number;
    name?: string;

    @MinLength(5)
    username?: string;
    
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    password?: string;
    
    role?: UserRole;
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEF = 'chief',
    EDITOR = 'editor',
    USER = 'user'
}