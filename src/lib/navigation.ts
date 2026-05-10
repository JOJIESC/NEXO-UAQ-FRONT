import {
    Settings2,
    Info,
    LayoutDashboard,
    Search,
    StickyNote,
    Sparkles,
} from 'lucide-react';

export const navItems = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Inicio',
            url: '/home',
            icon: Sparkles,
            isActive: true,
        },
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Mis posts',
            url: '/posts/my-posts',
            icon: StickyNote,
        },
        {
            title: 'Buscar',
            url: '/search',
            icon: Search,
        },
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '/settings',
            icon: Settings2,
        },
        {
            title: 'About',
            url: '/about',
            icon: Info,
        },
    ],
    projects: [],
};
