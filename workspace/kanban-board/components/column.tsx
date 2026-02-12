'use client';

import { Column as ColumnType, Task } from '@/lib/types';
import { SortableTask } from './sortable-task';
import { Plus, MoreVertical } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask?: (columnId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function Column({ column, tasks, onAddTask, onEditTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'backlog':
        return 'border-blue-200 dark:border-blue-900';
      case 'in-progress':
        return 'border-yellow-200 dark:border-yellow-900';
      case 'review':
        return 'border-purple-200 dark:border-purple-900';
      case 'done':
        return 'border-green-200 dark:border-green-900';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const getColumnBg = (columnId: string) => {
    switch (columnId) {
      case 'backlog':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'in-progress':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'review':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'done':
        return 'bg-green-50 dark:bg-green-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-lg border-2 ${getColumnColor(
        column.id
      )} ${getColumnBg(column.id)} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <h2 className="font-bold text-gray-900 dark:text-white">
            {column.title}
          </h2>
          <span className="ml-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddTask?.(column.id)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Add task"
          >
            <Plus size={18} />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            <div className="mb-2">No tasks here yet</div>
            <button
              onClick={() => onAddTask?.(column.id)}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Add a task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}