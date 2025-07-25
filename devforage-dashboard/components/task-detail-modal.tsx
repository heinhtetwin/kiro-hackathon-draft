"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MessageCircle, AlertCircle, Clock, CheckCircle, ExternalLink, Edit } from "lucide-react"

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

interface TaskDetailModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailModal({ task, open, onOpenChange }: TaskDetailModalProps) {
  if (!task) return null

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getPriorityIcon(task.priority)}
                <span className="text-sm text-slate-500 dark:text-slate-400">#{task.number}</span>
                <Badge variant="outline" className="capitalize">
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
              <DialogTitle className="text-xl leading-relaxed">{task.title}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignee and Due Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned to:</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-slate-900 dark:text-white">{task.assignee.name}</span>
              </div>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                Due {formatDate(task.dueDate)}
              </div>
            )}
          </div>

          {/* Labels */}
          {task.labels.length > 0 && (
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Labels:</span>
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Description:</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{task.description}</p>
          </div>

          {/* Comments Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Comments ({task.comments})</span>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </div>

            {/* Add Comment */}
            <div className="space-y-3">
              <Textarea placeholder="Add a comment..." className="min-h-[100px]" />
              <div className="flex justify-end">
                <Button size="sm">Add Comment</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
