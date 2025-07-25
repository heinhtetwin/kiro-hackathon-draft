"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import {
  Kanban,
  Package,
  Cloud,
  Database,
  Shield,
  MessageSquare,
  Inbox,
  Settings,
  LogOut,
  User,
  Bell,
  ArrowLeft,
} from "lucide-react"

interface Project {
  id: string
  name: string
  repository: {
    name: string
    url: string
  }
  team: Array<{
    id: string
    name: string
    avatar: string
    role: string
  }>
  stats: {
    vulnerabilities: number
    awsServices: string[]
    unreadMessages: number
    notifications: number
  }
}

interface ProjectDashboardLayoutProps {
  children: React.ReactNode
  project: Project
  selectedView: string
  onViewChange: (view: string) => void
}

const data = {
  user: {
    name: "Alex Chen",
    email: "alex@devforage.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
}

export function ProjectDashboardLayout({ children, project, selectedView, onViewChange }: ProjectDashboardLayoutProps) {
  const navItems = [
    {
      title: "Overview",
      icon: Kanban,
      key: "overview",
    },
    {
      title: "Dependencies",
      icon: Package,
      key: "dependencies",
      badge: project.stats.vulnerabilities > 0 ? project.stats.vulnerabilities : undefined,
      badgeVariant: "destructive" as const,
    },
    {
      title: "AWS Services",
      icon: Cloud,
      key: "aws",
      badge: project.stats.awsServices.length,
    },
    {
      title: "Database",
      icon: Database,
      key: "database",
    },
    {
      title: "Vault",
      icon: Shield,
      key: "vault",
    },
    {
      title: "Team Chat",
      icon: MessageSquare,
      key: "chat",
      badge: project.stats.unreadMessages > 0 ? project.stats.unreadMessages : undefined,
    },
    {
      title: "Inbox",
      icon: Inbox,
      key: "inbox",
      badge: project.stats.notifications > 0 ? project.stats.notifications : undefined,
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Back to Dashboard</span>
                    <span className="truncate text-xs text-slate-600 dark:text-slate-400">DevForage</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{project.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => onViewChange(item.key)}
                      isActive={selectedView === item.key}
                      className="relative"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "secondary"}
                          className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {item.badge > 99 ? "99+" : item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">AC</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                        <AvatarFallback className="rounded-lg">AC</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{data.user.name}</span>
                        <span className="truncate text-xs">{data.user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => (window.location.href = "/")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
