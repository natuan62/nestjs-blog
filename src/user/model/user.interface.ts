export class User {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEF = 'chief',
    EDITOR = 'editor',
    USER = 'user'
}