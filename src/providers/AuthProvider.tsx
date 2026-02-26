'use client';

import { createContext, useContext, ReactNode } from 'react';
import { User } from '@/features/auth/types/auth.types';

// Definimos la forma de nuestro contexto
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
});

export function AuthProvider({
                                 children,
                                 user
                             }: {
    children: ReactNode;
    user: User | null;
}) {
    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar la sesión en cualquier Client Component
export const useAuth = () => useContext(AuthContext);