"use client"

import { useState } from "react"
import { ProjectDashboardLayout } from "@/components/project-dashboard-layout"
import { KanbanBoard } from "@/components/kanban-board"
import { ProjectHeader } from "@/components/project-header"
import { DependenciesContent } from "@/components/dependencies-content"
import { AWSServicesContent } from "@/components/aws-services-content"
import { VaultContent } from "@/components/vault-content"
import { TeamChatContent } from "@/components/team-chat-content"
import { InboxContent } from "@/components/inbox-content"
import { DatabaseContent } from "@/components/database-content"

// Mock project data
const mockProject = {
  id: "1",
  name: "E-Commerce API",
  repository: {
    name: "alexchen/e-commerce-api",
    url: "https://github.com/alexchen/e-commerce-api",
  },
  team: [
    { id: "1", name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", role: "Lead Developer" },
    { id: "2", name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", role: "Frontend Developer" },
    { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", role: "Backend Developer" },
    { id: "4", name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32", role: "DevOps Engineer" },
    { id: "5", name: "Tom Brown", avatar: "/placeholder.svg?height=32&width=32", role: "QA Engineer" },
    { id: "6", name: "Lisa Garcia", avatar: "/placeholder.svg?height=32&width=32", role: "Designer" },
    { id: "7", name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", role: "Product Manager" },
    { id: "8", name: "Anna Rodriguez", avatar: "/placeholder.svg?height=32&width=32", role: "Data Analyst" },
  ],
  stats: {
    vulnerabilities: 3,
    awsServices: ["RDS", "Lambda", "S3", "CloudWatch"],
    unreadMessages: 12,
    notifications: 5,
  },
}

export default function ProjectDashboard() {
  const [selectedView, setSelectedView] = useState("overview")

  const renderContent = () => {
    switch (selectedView) {
      case "overview":
        return <KanbanBoard />
      case "dependencies":
        return <DependenciesContent />
      case "aws":
        return <AWSServicesContent />
      case "database":
        return <DatabaseContent />
      case "vault":
        return <VaultContent />
      case "chat":
        return <TeamChatContent />
      case "inbox":
        return <InboxContent />
      default:
        return <KanbanBoard />
    }
  }

  return (
    <ProjectDashboardLayout project={mockProject} selectedView={selectedView} onViewChange={setSelectedView}>
      <div className="flex flex-col h-full">
        <ProjectHeader project={mockProject} />
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
      </div>
    </ProjectDashboardLayout>
  )
}
