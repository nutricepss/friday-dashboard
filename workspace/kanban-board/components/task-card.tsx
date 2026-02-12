'use client'

import { useState } from 'react'
import { Task } from '@/lib/types'
import { Calendar, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onDragStart, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
  }

  const getAgentColor = () => {
    switch (task.agent) {
      case 'coder': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'researcher': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'content_writer': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'marketing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'ops': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
      case 'coordinator': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="cursor-move rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{task.title}</h4>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor()}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${getAgentColor()}`}>
                {task.agent.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground">
                {task.model}
              </span>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 rounded-md p-1 hover:bg-accent"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="space-y-3 border-t pt-3">
            <p className="text-sm text-muted-foreground">{task.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-medium">Frequency:</span>
                <span className="text-muted-foreground">{task.frequency}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">Created:</span>
                <span className="text-muted-foreground">{formatDate(task.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Updated: {formatDate(task.updatedAt)}
              </div>
              <button
                onClick={() => onDelete(task.id)}
                className="rounded-md p-1 text-red-500 hover:bg-red-500/10"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}