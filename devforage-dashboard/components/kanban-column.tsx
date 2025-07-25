"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { Plus } from "lucide-react"

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

interface KanbanColumnProps {
  id: string
  title: string
  color: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function KanbanColumn({ id, title, color, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      <div className={`rounded-t-lg p-4 ${color}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {title} ({tasks.length})
          </h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[500px] p-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg border-2 border-dashed transition-colors ${
          isOver ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-transparent"
        }`}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-sm">No tasks</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
