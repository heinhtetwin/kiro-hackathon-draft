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
  BarChart3,
  Code2,
  Package,
  Cloud,
  Shield,
  MessageSquare,
  Inbox,
  Settings,
  LogOut,
  User,
  Bell,
} from "lucide-react"

const mockSidebarData = {
  dependencies: {
    total: 45,
    vulnerabilities: 3,
  },
  awsServices: {
    detected: ["RDS", "Lambda", "S3", "CloudWatch", "EC2"],
  },
  messages: {
    unread: 12,
  },
  notifications: {
    count: 5,
  },
}

const data = {
  user: {
    name: "Alex Chen",
    email: "alex@devforage.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: BarChart3,
      key: "overview",
    },
    {
      title: "Dependencies",
      url: "#",
      icon: Package,
      key: "dependencies",
      badge: mockSidebarData.dependencies.vulnerabilities,
      badgeVariant: "destructive" as const,
    },
    {
      title: "AWS Services",
      url: "#",
      icon: Cloud,
      key: "aws",
      badge: mockSidebarData.awsServices.detected.length,
    },
    {
      title: "Vault",
      url: "#",
      icon: Shield,
      key: "vault",
    },
    {
      title: "Team Chat",
      url: "#",
      icon: MessageSquare,
      key: "chat",
      badge: mockSidebarData.messages.unread,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      key: "inbox",
      badge: mockSidebarData.notifications.count,
    },
  ],
}

interface DashboardLayoutProps {
  children: React.ReactNode
  selectedView: string
  onViewChange: (view: string) => void
}

export function DashboardLayout({ children, selectedView, onViewChange }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Code2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">DevForage</span>
                    <span className="truncate text-xs text-slate-600 dark:text-slate-400">Developer Platform</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.map((item) => (
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
