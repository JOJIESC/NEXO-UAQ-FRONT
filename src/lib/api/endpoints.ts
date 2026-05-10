export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
    },
    POSTS: {
        // REQUIRE LOGIN
        CREATE: '/posts',
        GET_ALL_PROJECTS: '/posts',
        GET_PROJECT_DETAILS: (id: string) => `/posts/${id}`,
        GET_MY_PROJECTS: '/posts/my-posts',
        UPDATE_PROJECT: (id: string) => `/posts/${id}`,
        DELETE_PROJECT: (id: string) => `/posts/${id}`,
    },
    APPLICATIONS: {
        APPLY: (postId: string) => `/applications/${postId}`,
        GET_PARTICIPANTS: (postId: string) => `/applications/post/${postId}`,
        PATCH_ACCEPT_REQUEST: (id: string) => `/applications/${id}/accept`,
        PATCH_REJECT_REQUEST: (id: string) => `/applications/${id}/reject`,
    },
    USERS: {
        CREATE_USER: '/users',
        GET_USERS: '/users',
        GET_USER_BY_ID: (id: string) => `/users/${id}`,
        ME: '/users/me',
        UPDATE_ME: '/users/me',
        CHANGE_PASSWORD: '/users/me/password',
        DELETE_ME: '/users/me',
    },
    NOTIFICATIONS: {
        LIST: '/notifications',
        UNREAD_COUNT: '/notifications/unread-count',
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
    },
};
