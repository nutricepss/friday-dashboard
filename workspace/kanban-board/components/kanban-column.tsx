'use client'

import React from 'react'
import { TaskStatus } from '@/lib/types'

interface KanbanColumnProps {
  title: string
  status: TaskStatus
  children: React.ReactNode
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: TaskStatus) => void
}

export function KanbanColumn({ 
  title, 
  status, 
  children, 
  onDragOver, 
  onDrop 
}: KanbanColumnProps) {
  const getColumnColor = () => {
    switch (status) {
      case 'todo': return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900'
      case 'in-progress': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900'
      case 'review': return 'border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900'
      case 'done': return 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'
    }
  }

  const getCountColor = () => {
    switch (status) {
      case 'todo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
  }

  const count = React.Children.count(children)

  return (
    <div
      className={`flex h-full flex-col rounded-lg border ${getColumnColor()}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getCountColor()}`}>
            {count}
          </span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  )
}