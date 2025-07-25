"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageCircle, AlertCircle, Clock, CheckCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  number: number
  priority: "high" | "medium" | "low"
  assignee: {
    id: string
    name: string
    avatar: string
  }
  labels: string[]
  dueDate?: string
  status: string
  description: string
  comments: number
}

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case "medium":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-slate-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${getPriorityColor(
        task.priority,
      )} ${isDragging ? "opacity-50 rotate-3" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getPriorityIcon(task.priority)}
              <span className="text-xs text-slate-500 dark:text-slate-400">#{task.number}</span>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
              <AvatarFallback className="text-xs">
                {task.assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Title */}
          <h4 className="font-medium text-slate-900 dark:text-white line-clamp-2 text-sm leading-relaxed">
            {task.title}
          </h4>

          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 3).map((label) => (
                <Badge key={label} variant="secondary" className="text-xs px-2 py-0">
                  {label}
                </Badge>
              ))}
              {task.labels.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  +{task.labels.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              {task.comments > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {task.comments}
                </div>
              )}
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
