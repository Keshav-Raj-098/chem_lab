"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { MdDashboard } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { LogOut, type LucideIcon, Briefcase, BeakerIcon, Award, BookOpen } from "lucide-react"
import type { IconType } from "react-icons/lib";
import { useEffect } from "react";
import Logo from '@/assets/image.png'
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar"
type SidebarItem = {
    name: string;
    icon: IconType | LucideIcon;
    link: string;
    pageTitle: string;
    subItems?: SidebarItem[];
}

// function LogoIcon() {
//     return (
//         <div className="flex items-center justify-center rounded-lg text-primary-foreground p-0">
//             {/* <Wallet className="h-4 w-4" /> */}
//             <img src={Logo} alt="logo" className="rounded-full" width={30} />
//         </div>
//     )
// }

export function AppSidebar({ setPageTitle }: { setPageTitle: (title: string) => void }) {
    const navigate = useRouter();
    const pathname = usePathname();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate.push("/admin/auth");
    }


    const sidebarItem: SidebarItem[] = [
        {
            name: "Dashboard",
            icon: MdDashboard,
            link: "/admin/dashboard",
            pageTitle: "Dashboard"
        },
        {
            name: "Projects",
            icon: Briefcase,
            link: "/admin/projects",
            pageTitle: "Manage your Projects",
        },
        {
            name: "Awards",
            icon: Award,
            link: "/admin/awards",
            pageTitle: "Manage your Awards",
        },
        {
            name: "Publications",
            icon: BookOpen,
            link: "/admin/publications",
            pageTitle: "Manage your Publications"
        },
    ]

    useEffect(() => {
        const currentItem = sidebarItem.find(item => item.link === pathname);
        if (currentItem) {
            setPageTitle(currentItem.pageTitle);
        }
    }, [pathname])

    const handleNavigation = (link: string, pageTitle: string) => {
        setPageTitle(pageTitle);
        navigate.push(link);
    }

    const isActive = (link: string) => {
        return pathname === link;
    }

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r" >
            <SidebarHeader className="border-b px-6 py-4">
                <div className="flex items-center gap-2">
                    <BeakerIcon />
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-[18px] font-bold italic">ChemLab</span>
                    </div>
                </div>
                <SidebarTrigger className="absolute right-2 top-2 rounded focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none data-[state=open]:bg-secondary" />
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItem.map((item, index) => {
                                const Icon = item.icon;
                                const active = isActive(item.link);

                                return (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton
                                            onClick={() => handleNavigation(item.link, item.pageTitle)}
                                            isActive={active}
                                            tooltip={item.name}
                                            className="h-10"
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="capitalize">{item.name}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}

                            tooltip="Logout"
                            className="h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}