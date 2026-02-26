export const API_ENDPOINTS ={
    AUTH: {
        LOGIN: '/auth/login',
    },
    POSTS: {
        // REQUIRE LOGIN
        CREATE: '/posts',
        GET_ALL_PROJECTS: '/posts',
        GET_PROJECT_DETAILS: (id: string) => `/posts/${id}`

    },
    APPLICATIONS: {
        APPLY: (postId: string) => `/applications/${postId}`,
        GET_PARTICIPANTS: (postId: string) => `/applications/posts/${postId}`,
        PATCH_ACCEPT_REQUEST: (id: string) => `/applications/${id}/accept`,
        PATCH_REJECT_REQUEST: (id: string) => `/applications/${id}/reject`,
    },
    USERS:{
        CREATE_USER: '/users',
        GET_USERS: '/users',
        GET_USER_BY_ID: (id: string) => `/users/${id}`,
        ME: '/users/me'
    },

}