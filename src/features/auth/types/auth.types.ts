export interface User {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: 'STUDENT' | 'ADMIN' | 'MODERATOR';
    bio?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    lastname: string;
    bio?: string;
}