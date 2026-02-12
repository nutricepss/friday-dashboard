'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, AGENTS, PRIORITIES } from '@/lib/types';
import { format } from 'date-fns';
import { MoreVertical, Calendar, User } from 'lucide-react';

interface SortableTaskProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function SortableTask({ task, onEdit, onDelete }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const agent = AGENTS.find((a) => a.id === task.agent);
  const priority = PRIORITIES.find((p) => p.id === task.priority);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : 'hover:shadow-md transition-shadow'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
          {task.title}
        </h3>
        <button
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(task);
          }}
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priority?.color}`}
        >
          {priority?.label}
        </span>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${agent?.color} text-white`}
        >
          <User size={10} className="mr-1" />
          {agent?.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Calendar size={12} className="mr-1" />
          <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
            {dueDate ? format(dueDate, 'MMM d') : 'No due date'}
            {isOverdue && ' ⚠️'}
          </span>
        </div>
        <div className="text-xs opacity-75">
          {format(new Date(task.updatedAt), 'MMM d')}
        </div>
      </div>
    </div>
  );
}