import { User } from '@/features/auth/types/auth.types';

export type PostType = 'PROJECT' | 'WORKSHOP';
export type PostStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Post {
    id: string;
    title: string;
    description: string;
    type: PostType;
    status?: PostStatus;
    authorId?: string;
    author?: Pick<User, 'id' | 'name' | 'lastname' | 'email'>;
    createdAt: string;
    updatedAt?: string;
}
