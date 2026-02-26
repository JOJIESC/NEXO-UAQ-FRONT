// 'use client';
//
// import { useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore';
// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
//
// interface User {
//     id: string;
//     name: string;
//     lastname: string;
//     email: string;
//     role: 'STUDENT' | 'ADMIN' | 'MODERATOR';
//     bio?: string;
// }
//
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const { setUser, clearUser, setLoading } = useAuthStore();
//
//     useEffect(() => {
//         const initAuth = async () => {
//             try {
//                 // Verificar si hay token
//                 const token = apiClient.getClientToken();
//
//                 if (!token) {
//                     clearUser();
//                     return;
//                 }
//
//                 // Obtener datos del usuario actual
//                 const user = await apiClient.get<User>(API_ENDPOINTS.USERS.ME);
//                 setUser(user);
//             } catch (error) {
//                 console.error('Error loading user:', error);
//                 clearUser();
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         initAuth();
//     }, [setUser, clearUser, setLoading]);
//
//     return <>{children}</>;
// }