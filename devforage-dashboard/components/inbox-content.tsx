"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  XCircle,
  AlertTriangle,
  DollarSign,
  Shield,
  Users,
  Settings,
  Trash2,
  MoreHorizontal,
  Filter,
  Clock,
  Eye,
  EyeOff,
  Star,
  Rocket,
  Bug,
  TrendingUp,
  Server,
} from "lucide-react"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "deployment",
    title: "Deployment Successful",
    message: "e-commerce-api deployed to production successfully",
    project: "e-commerce-api",
    environment: "Production",
    timestamp: "2 minutes ago",
    read: false,
    priority: "success",
    user: "GitHub Actions",
    avatar: "/placeholder.svg?height=32&width=32",
    metadata: {
      deploymentId: "dep_123456",
      duration: "2m 34s",
      commit: "a1b2c3d",
    },
  },
  {
    id: 2,
    type: "security",
    title: "High Severity Vulnerability Detected",
    message: "Critical vulnerability found in lodash@4.17.20 - CVE-2021-23337",
    project: "dashboard-ui",
    environment: "All",
    timestamp: "15 minutes ago",
    read: false,
    priority: "critical",
    user: "Security Scanner",
    avatar: "/placeholder.svg?height=32&width=32",
    metadata: {
      cve: "CVE-2021-23337",
      severity: "High",
      package: "lodash@4.17.20",
    },
  },
  {
    id: 3,
    type: "team",
    title: "New Team Member Added",
    message: "Emma Davis has been added to the team as a Designer",
    project: "All Projects",
    environment: "N/A",
    timestamp: "1 hour ago",
    read: true,
    priority: "info",
    user: "Alex Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    metadata: {
      role: "Designer",
      invitedBy: "Alex Chen",
    },
  },
  {
    id: 4,
    type: "cost",
    title: "Cost Threshold Exceeded",
    message: "AWS costs for this month have exceeded $500 threshold",
    project: "ml-pipeline",
    environment: "Production",
    timestamp: "2 hours ago",
    read: false,
    priority: "warning",
    user: "Cost Monitor",
    avatar: "/placeholder.svg?height=32&width=32",
    metadata: {
      currentCost: "$547.23",
      threshold: "$500.00",
      increase: "9.4%",
    },
  },
  {
    id: 5,
    type: "deployment",
    title: "Deployment Failed",
    message: "Failed to deploy dashboard-ui to staging environment",
    project: "dashboard-ui",
    environment: "Staging",
    timestamp: "3 hours ago",
    read: true,
    priority: "error",
    user: "GitHub Actions",
    avatar: "/placeholder.svg?height=32&width=32",
    metadata: {
      error: "Build failed: Missing environment variable",
      deploymentId: "dep_123455",
      duration: "1m 12s",
    },
  },
  {
    id: 6,
    type: "vulnerability",
    title: "Vulnerability Scan Complete",
    message: "Weekly vulnerability scan completed - 3 new issues found",
    project: "e-commerce-api",
    environment: "All",
    timestamp: "1 day ago",
    read: true,
    priority: "warning",
    user: "Security Scanner",
    avatar: "/placeholder.svg?height=32&width=32",
    metadata: {
      newIssues: 3,
      totalIssues: 12,
      resolved: 2,
    },
  },
  {
    id: 7,
    type: "system",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance window: Jan 25, 2024 2:00-4:00 AM UTC",
    project: "All Projects",
    environment: "All",
    timestamp: "2 days ago",
    read: true,
    priority: "info",
    user: "System Admin",
    avatar: "/placeholder.svg?height=32&width=32",
    metadata: {
      maintenanceWindow: "Jan 25, 2024 2:00-4:00 AM UTC",
      expectedDowntime: "2 hours",
      services: ["API", "Dashboard", "Database"],
    },
  },
]

export function InboxContent() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [notifications, setNotifications] = useState(mockNotifications)
  const { toast } = useToast()

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = "h-5 w-5"

    switch (type) {
      case "deployment":
        return priority === "error" ? (
          <XCircle className={`${iconClass} text-red-500`} />
        ) : (
          <Rocket className={`${iconClass} text-green-500`} />
        )
      case "security":
        return <Shield className={`${iconClass} text-red-500`} />
      case "vulnerability":
        return <Bug className={`${iconClass} text-amber-500`} />
      case "team":
        return <Users className={`${iconClass} text-blue-500`} />
      case "cost":
        return <DollarSign className={`${iconClass} text-amber-500`} />
      case "system":
        return <Server className={`${iconClass} text-slate-500`} />
      default:
        return <Bell className={`${iconClass} text-slate-500`} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20"
      case "error":
        return "border-l-red-400 bg-red-50 dark:bg-red-950/20"
      case "warning":
        return "border-l-amber-400 bg-amber-50 dark:bg-amber-950/20"
      case "success":
        return "border-l-green-400 bg-green-50 dark:bg-green-950/20"
      case "info":
        return "border-l-blue-400 bg-blue-50 dark:bg-blue-950/20"
      default:
        return "border-l-slate-400 bg-slate-50 dark:bg-slate-950/20"
    }
  }

  const getFilteredNotifications = () => {
    switch (selectedTab) {
      case "unread":
        return notifications.filter((n) => !n.read)
      case "security":
        return notifications.filter((n) => n.type === "security" || n.type === "vulnerability")
      case "deployments":
        return notifications.filter((n) => n.type === "deployment")
      case "team":
        return notifications.filter((n) => n.type === "team")
      case "costs":
        return notifications.filter((n) => n.type === "cost")
      default:
        return notifications
    }
  }

  const handleMarkAsRead = (notificationIds: number[]) => {
    setNotifications((prev) => prev.map((n) => (notificationIds.includes(n.id) ? { ...n, read: true } : n)))
    toast({
      title: "Marked as read",
      description: `${notificationIds.length} notification(s) marked as read`,
    })
  }

  const handleMarkAsUnread = (notificationIds: number[]) => {
    setNotifications((prev) => prev.map((n) => (notificationIds.includes(n.id) ? { ...n, read: false } : n)))
    toast({
      title: "Marked as unread",
      description: `${notificationIds.length} notification(s) marked as unread`,
    })
  }

  const handleDelete = (notificationIds: number[]) => {
    setNotifications((prev) => prev.filter((n) => !notificationIds.includes(n.id)))
    setSelectedNotifications([])
    toast({
      title: "Notifications deleted",
      description: `${notificationIds.length} notification(s) deleted`,
    })
  }

  const handleSelectAll = () => {
    const filteredNotifications = getFilteredNotifications()
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId) ? prev.filter((id) => id !== notificationId) : [...prev, notificationId],
    )
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-600" />
            Notifications
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Stay updated with your projects and team activities</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedNotifications.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(selectedNotifications)}>
                <Eye className="mr-2 h-4 w-4" />
                Mark Read
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleMarkAsUnread(selectedNotifications)}>
                <EyeOff className="mr-2 h-4 w-4" />
                Mark Unread
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(selectedNotifications)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter((n) => n.type === "security" || n.type === "vulnerability").length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Active issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter((n) => n.timestamp.includes("hour") || n.timestamp.includes("minute")).length}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Recent activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Feed</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                <Checkbox
                  checked={
                    selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0
                  }
                  className="mr-2"
                />
                Select All
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-sm ${getPriorityColor(
                        notification.priority,
                      )} ${!notification.read ? "border-2 border-blue-200 dark:border-blue-800" : "border border-slate-200 dark:border-slate-700"}`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={() => handleSelectNotification(notification.id)}
                          className="mt-1"
                        />
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3
                                  className={`font-semibold ${!notification.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
                                >
                                  {notification.title}
                                </h3>
                                {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage
                                      src={notification.avatar || "/placeholder.svg"}
                                      alt={notification.user}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {notification.user
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{notification.user}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{notification.timestamp}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {notification.project}
                                </Badge>
                                {notification.environment !== "N/A" && (
                                  <Badge variant="secondary" className="text-xs">
                                    {notification.environment}
                                  </Badge>
                                )}
                              </div>
                              {/* Metadata */}
                              {notification.metadata && (
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(notification.metadata).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400 capitalize">
                                          {key.replace(/([A-Z])/g, " $1").trim()}:
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead([notification.id])}
                                className="h-8 w-8 p-0"
                              >
                                {notification.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
