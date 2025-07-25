"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCorners } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KanbanColumn } from "@/components/kanban-column"
import { TaskCard } from "@/components/task-card"
import { TaskDetailModal } from "@/components/task-detail-modal"
import { Search, Filter, Keyboard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock task data
const initialTasks = [
  {
    id: "task-1",
    title: "Implement user authentication",
    number: 123,
    priority: "high" as const,
    assignee: {
      id: "1",
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    labels: ["backend", "security"],
    dueDate: "2024-01-20",
    status: "todo" as const,
    description: "Implement JWT-based authentication system with refresh tokens",
    comments: 5,
  },
  {
    id: "task-2",
    title: "Design product catalog UI",
    number: 124,
    priority: "medium" as const,
    assignee: {
      id: "2",
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    labels: ["frontend", "design"],
    status: "todo" as const,
    description: "Create responsive product catalog with filtering and search",
    comments: 2,
  },
  {
    id: "task-3",
    title: "Set up CI/CD pipeline",
    number: 125,
    priority: "high" as const,
    assignee: {
      id: "4",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    labels: ["devops", "automation"],
    status: "in-progress" as const,
    description: "Configure GitHub Actions for automated testing and deployment",
    comments: 8,
  },
  {
    id: "task-4",
    title: "API rate limiting",
    number: 126,
    priority: "medium" as const,
    assignee: {
      id: "3",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    labels: ["backend", "performance"],
    status: "in-progress" as const,
    description: "Implement rate limiting to prevent API abuse",
    comments: 3,
  },
  {
    id: "task-5",
    title: "Code review: Payment integration",
    number: 127,
    priority: "high" as const,
    assignee: {
      id: "1",
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    labels: ["review", "payment"],
    status: "review" as const,
    description: "Review Stripe payment integration implementation",
    comments: 12,
  },
  {
    id: "task-6",
    title: "Database optimization",
    number: 128,
    priority: "low" as const,
    assignee: {
      id: "3",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    labels: ["database", "performance"],
    status: "done" as const,
    description: "Optimize database queries for better performance",
    comments: 6,
  },
]

const columns = [
  { id: "todo", title: "To Do", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900/20" },
  { id: "review", title: "Review", color: "bg-yellow-100 dark:bg-yellow-900/20" },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900/20" },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState<(typeof initialTasks)[0] | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { toast } = useToast()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case "k":
            event.preventDefault()
            document.getElementById("search-input")?.focus()
            break
          case "n":
            event.preventDefault()
            // Add new task functionality
            toast({
              title: "Keyboard Shortcut",
              description: "Cmd/Ctrl + N: Add new task (coming soon)",
            })
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toast])

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.labels.some((label) => label.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the task being dragged
    const activeTask = tasks.find((task) => task.id === activeId)
    if (!activeTask) return

    // Determine the new status
    let newStatus = activeTask.status
    const column = columns.find((col) => col.id === overId)
    if (column) {
      newStatus = column.id as any
    } else {
      // If dropped on a task, get the status of that task's column
      const targetTask = tasks.find((task) => task.id === overId)
      if (targetTask) {
        newStatus = targetTask.status
      }
    }

    // Update the task status
    if (newStatus !== activeTask.status) {
      setTasks((tasks) => tasks.map((task) => (task.id === activeId ? { ...task, status: newStatus } : task)))

      toast({
        title: "Task moved",
        description: `"${activeTask.title}" moved to ${columns.find((col) => col.id === newStatus)?.title}`,
      })
    }

    setActiveId(null)
  }

  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter Bar */}
      <div className="border-b bg-white dark:bg-slate-950 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                id="search-input"
                placeholder="Search tasks... (Cmd+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Keyboard className="h-4 w-4 mr-2" />
              Shortcuts
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="h-full overflow-x-auto">
            <div className="flex gap-6 p-6 min-w-max lg:min-w-0">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  tasks={getTasksByStatus(column.id)}
                  onTaskClick={setSelectedTask}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 opacity-90">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  )
}
