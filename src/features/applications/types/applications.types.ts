import { User } from '@/features/auth/types/auth.types';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Application {
    id: string;
    postId: string;
    applicantId: string;
    status: ApplicationStatus;
    message?: string;
    applicant?: User;
    createdAt?: string;
    updatedAt?: string;
}
