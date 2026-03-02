import {
    Frame,
    Map,
    PieChart,
    Send,
    Settings2,
    Info,
    LayoutDashboard,
    Signature,
    Search,
    StickyNote
} from "lucide-react";

// FETCH PARA VER PROYECTOS ACTIVOS Y LISTAR EN PROJECTS
// FETCH PARA DATOS DE USUARIO (NAME, LASTNAME, EMAIL)



export const navItems = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Mis posts",
            url: "/posts/my-posts",
            icon: StickyNote
        }
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
        {
            title: "About",
            url: "#",
            icon: Info
        },
        {
            title: "Search",
            url: "#",
            icon: Search
        }
    ],
    projects: [],
}
