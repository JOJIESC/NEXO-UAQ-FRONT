// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
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
// interface AuthState {
//     user: User | null;
//     isAuthenticated: boolean;
//     isLoading: boolean;
//
//     // Actions
//     setUser: (user: User) => void;
//     clearUser: () => void;
//     setLoading: (loading: boolean) => void;
// }
//
// export const useAuthStore = create<AuthState>()(
//     persist(
//         (set) => ({
//             user: null,
//             isAuthenticated: false,
//             isLoading: true,
//
//             setUser: (user) =>
//                 set({
//                     user,
//                     isAuthenticated: true,
//                     isLoading: false
//                 }),
//
//             clearUser: () =>
//                 set({
//                     user: null,
//                     isAuthenticated: false,
//                     isLoading: false
//                 }),
//
//             setLoading: (loading) =>
//                 set({ isLoading: loading }),
//         }),
//         {
//             name: 'auth-storage', // nombre en localStorage
//             storage: createJSONStorage(() => localStorage),
//             partialize: (state) => ({
//                 user: state.user,
//                 isAuthenticated: state.isAuthenticated
//             }), // Solo persiste estos campos
//         }
//     )
// );