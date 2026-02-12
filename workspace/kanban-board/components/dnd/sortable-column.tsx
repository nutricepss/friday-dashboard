'use client';

import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/lib/types';
import { SortableTask } from './sortable-task';
import { Plus } from 'lucide-react';

interface SortableColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskDelete: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  highlightedAgent?: string | null;
}

export function SortableColumn({ 
  id, 
  title, 
  tasks, 
  onTaskDelete, 
  onTaskClick,
  onAddTask,
  highlightedAgent 
}: SortableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnColor = () => {
    switch (id) {
      case 'todo': return 'border-blue-500/20';
      case 'in-progress': return 'border-yellow-500/20';
      case 'review': return 'border-purple-500/20';
      case 'done': return 'border-green-500/20';
      default: return 'border-gray-500/20';
    }
  };

  const getColumnBg = () => {
    switch (id) {
      case 'todo': return 'bg-blue-500/5';
      case 'in-progress': return 'bg-yellow-500/5';
      case 'review': return 'bg-purple-500/5';
      case 'done': return 'bg-green-500/5';
      default: return 'bg-gray-500/5';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        glass-column rounded-2xl p-4 min-h-[500px] flex flex-col
        ${getColumnColor()} border-2
        ${isOver ? getColumnBg() : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-white/90">{title}</h2>
          <span className="glass px-2 py-0.5 rounded-full text-xs text-white/60">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(id)}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-white/30">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs mt-1">Drag tasks here or click +</p>
          </div>
        ) : (
          tasks.map(task => (
            <SortableTask
              key={task.id}
              task={task}
              onDelete={onTaskDelete}
              onClick={onTaskClick}
              isHighlighted={highlightedAgent === task.agent}
            />
          ))
        )}
        
        {isOver && tasks.length > 0 && (
          <div className="h-1 rounded-full bg-blue-500/50 animate-pulse"></div>
        )}
      </div>
    </div>
  );
}