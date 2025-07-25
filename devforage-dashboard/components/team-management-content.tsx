"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Crown, Code, Eye, Mail, Shield, Trash2, MoreHorizontal, Users, Activity } from "lucide-react"

// Mock team data
const mockTeamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Admin",
    status: "online",
    lastActive: "Active now",
    joinedAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Developer",
    status: "away",
    lastActive: "2 hours ago",
    joinedAt: "2023-02-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Developer",
    status: "offline",
    lastActive: "Yesterday",
    joinedAt: "2023-03-10",
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Viewer",
    status: "online",
    lastActive: "Active now",
    joinedAt: "2023-04-05",
  },
]

const mockPendingInvitations = [
  {
    id: 1,
    email: "john@company.com",
    role: "Developer",
    invitedBy: "Alex Chen",
    invitedAt: "2024-01-20",
    status: "pending",
  },
  {
    id: 2,
    email: "lisa@company.com",
    role: "Viewer",
    invitedBy: "Sarah Wilson",
    invitedAt: "2024-01-18",
    status: "pending",
  },
]

const mockAccessHistory = [
  {
    id: 1,
    user: "Sarah Wilson",
    action: "Accessed vault secrets",
    environment: "Production",
    timestamp: "2024-01-20 14:30:00",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    user: "Mike Johnson",
    action: "Updated team member role",
    target: "Emma Davis",
    timestamp: "2024-01-20 12:15:00",
    ip: "192.168.1.101",
  },
  {
    id: 3,
    user: "Alex Chen",
    action: "Invited new member",
    target: "john@company.com",
    timestamp: "2024-01-20 10:45:00",
    ip: "192.168.1.102",
  },
]

export function TeamManagementContent() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Developer")
  const { toast } = useToast()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Crown className="h-4 w-4 text-amber-500" />
      case "Developer":
        return <Code className="h-4 w-4 text-blue-500" />
      case "Viewer":
        return <Eye className="h-4 w-4 text-slate-500" />
      default:
        return <Users className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
        return <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
      case "away":
        return <div className="h-3 w-3 bg-yellow-500 rounded-full border-2 border-white dark:border-slate-800" />
      case "offline":
        return <div className="h-3 w-3 bg-slate-400 rounded-full border-2 border-white dark:border-slate-800" />
      default:
        return null
    }
  }

  const handleInviteMember = () => {
    if (!inviteEmail) return

    toast({
      title: "Invitation sent!",
      description: `Invitation sent to ${inviteEmail} as ${inviteRole}`,
    })

    setInviteEmail("")
    setInviteRole("Developer")
    setIsInviteModalOpen(false)
  }

  const handleRemoveMember = (memberName: string) => {
    toast({
      title: "Member removed",
      description: `${memberName} has been removed from the team`,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Management</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your team members, roles, and permissions</p>
        </div>
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin - Full access</SelectItem>
                    <SelectItem value="Developer">Developer - Read/write access</SelectItem>
                    <SelectItem value="Viewer">Viewer - Read-only access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMember} disabled={!inviteEmail}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamMembers.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamMembers.filter((m) => m.status === "online").length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Active members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPendingInvitations.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamMembers.filter((m) => m.role === "Admin").length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Full access</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage roles and permissions for your team</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {mockTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">{getStatusIndicator(member.status)}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-white">{member.name}</span>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{member.email}</p>
                        <p className="text-xs text-slate-500">{member.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "Admin" ? "default" : "secondary"}>{member.role}</Badge>
                      {member.role !== "Admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Pending Invitations & Access History */}
        <div className="space-y-6">
          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Members who haven't accepted their invitations yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPendingInvitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-900 dark:text-white">{invitation.email}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Invited by {invitation.invitedBy} • {invitation.invitedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{invitation.role}</Badge>
                      <Button variant="ghost" size="sm" className="text-slate-500">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Access History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access History
              </CardTitle>
              <CardDescription>Recent security and access events</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {mockAccessHistory.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="mt-1">
                        {event.action.includes("vault") ? (
                          <Shield className="h-4 w-4 text-amber-500" />
                        ) : event.action.includes("role") ? (
                          <Users className="h-4 w-4 text-blue-500" />
                        ) : (
                          <UserPlus className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{event.user}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {event.action}
                          {event.target && ` (${event.target})`}
                          {event.environment && ` - ${event.environment}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          {event.timestamp} • {event.ip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
