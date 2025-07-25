"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateProjectModal } from "@/components/create-project-modal"
import { DependenciesContent } from "@/components/dependencies-content"
import { AWSServicesContent } from "@/components/aws-services-content"
import { VaultContent } from "@/components/vault-content"
import { TeamChatContent } from "@/components/team-chat-content"
import { InboxContent } from "@/components/inbox-content"
import { Plus, Github, ExternalLink, Users, AlertTriangle, TrendingUp, Activity, Clock } from "lucide-react"

// Mock projects data
const initialProjects = [
  {
    id: "1",
    name: "E-Commerce API",
    description: "RESTful API for e-commerce platform",
    repository: {
      name: "alexchen/e-commerce-api",
      url: "https://github.com/alexchen/e-commerce-api",
    },
    team: [
      { id: "1", name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", role: "Owner" },
      { id: "2", name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", role: "Developer" },
      { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", role: "Developer" },
    ],
    stats: {
      vulnerabilities: 3,
      awsServices: ["RDS", "Lambda", "S3", "CloudWatch"],
      unreadMessages: 12,
      notifications: 5,
    },
    lastActivity: "2024-01-15T10:30:00Z",
    language: "TypeScript",
    status: "active",
  },
  {
    id: "2",
    name: "React Dashboard",
    description: "Modern dashboard with analytics",
    repository: {
      name: "alexchen/react-dashboard",
      url: "https://github.com/alexchen/react-dashboard",
    },
    team: [
      { id: "1", name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", role: "Owner" },
      { id: "4", name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32", role: "Designer" },
    ],
    stats: {
      vulnerabilities: 0,
      awsServices: ["S3", "CloudFront"],
      unreadMessages: 3,
      notifications: 2,
    },
    lastActivity: "2024-01-14T15:45:00Z",
    language: "TypeScript",
    status: "active",
  },
  {
    id: "3",
    name: "ML Pipeline",
    description: "Machine learning data pipeline",
    repository: {
      name: "alexchen/ml-pipeline",
      url: "https://github.com/alexchen/ml-pipeline",
    },
    team: [{ id: "1", name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", role: "Owner" }],
    stats: {
      vulnerabilities: 1,
      awsServices: ["SageMaker", "S3", "Lambda", "EC2"],
      unreadMessages: 0,
      notifications: 8,
    },
    lastActivity: "2024-01-12T09:20:00Z",
    language: "Python",
    status: "maintenance",
  },
]

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState("overview")
  const [projects, setProjects] = useState(initialProjects)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleProjectCreated = (newProject: any) => {
    setProjects((prev) => [newProject, ...prev])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500",
      Python: "bg-green-500",
      Go: "bg-cyan-500",
      Java: "bg-red-500",
    }
    return colors[language] || "bg-gray-500"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and monitor your development projects</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Activity className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.status === "active").length}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Currently in development</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.stats.vulnerabilities, 0)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(projects.flatMap((p) => p.team.map((t) => t.id))).size}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Unique contributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors truncate">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </div>
                <Badge className={`ml-2 ${getStatusColor(project.status)} capitalize`}>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Repository Link */}
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Github className="h-4 w-4" />
                <a
                  href={project.repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.repository.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Language and Last Activity */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`} />
                  <span className="text-slate-600 dark:text-slate-400">{project.language}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  {formatDate(project.lastActivity)}
                </div>
              </div>

              {/* Team Members */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member) => (
                    <Avatar
                      key={member.id}
                      className="h-6 w-6 border-2 border-white dark:border-slate-800"
                      title={`${member.name} - ${member.role}`}
                    >
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = `/project/${project.id}`
                  }}
                >
                  Open Project
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2 border-t text-sm">
                {project.stats.vulnerabilities > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    {project.stats.vulnerabilities} vulnerabilities
                  </div>
                )}
                <div className="text-slate-600 dark:text-slate-400">
                  {project.stats.awsServices.length} AWS services
                </div>
                {project.stats.unreadMessages > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {project.stats.unreadMessages} messages
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create Project Card */}
        <Card
          className="border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all cursor-pointer group"
          onClick={() => setShowCreateModal(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Create New Project</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Import a repository from GitHub to get started
            </p>
            <Button variant="outline" className="group-hover:border-blue-500 group-hover:text-blue-600 bg-transparent">
              <Github className="h-4 w-4 mr-2" />
              Import Repository
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (selectedView) {
      case "overview":
        return renderOverview()
      case "dependencies":
        return <DependenciesContent />
      case "aws":
        return <AWSServicesContent />
      case "vault":
        return <VaultContent />
      case "chat":
        return <TeamChatContent />
      case "inbox":
        return <InboxContent />
      default:
        return renderOverview()
    }
  }

  return (
    <DashboardLayout selectedView={selectedView} onViewChange={setSelectedView}>
      {renderContent()}
      <CreateProjectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onProjectCreated={handleProjectCreated}
      />
    </DashboardLayout>
  )
}
