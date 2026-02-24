// DTO de respuesta del servidor
export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        lastname: string;
        role: 'STUDENT' | 'ADMIN' | 'MODERATOR';
        bio?: string;
    };
}