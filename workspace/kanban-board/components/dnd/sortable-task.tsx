'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/lib/types';
import { Trash2, Calendar, User, Flag, Cpu } from 'lucide-react';
import { useState } from 'react';

interface SortableTaskProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
  isHighlighted?: boolean;
}

export function SortableTask({ task, onDelete, onClick, isHighlighted = false }: SortableTaskProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getAgentColor = () => {
    return `agent-${task.agent}`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        glass-card rounded-xl p-4 cursor-move group relative
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isHighlighted ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        hover:ring-2 hover:ring-blue-500 hover:ring-opacity-30
        transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white/90 text-sm leading-tight flex-1 pr-4">
          {task.title}
        </h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className={`
            p-1 text-white/40 hover:text-red-400 transition-all
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-white/50 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor()} flex items-center gap-1`}>
          <Flag size={10} />
          {task.priority}
        </span>
        
        <span className={`text-xs px-2 py-0.5 rounded-full ${getAgentColor()} text-white/80 flex items-center gap-1`}>
          <User size={10} />
          {task.agent.replace('_', ' ')}
        </span>
        
        <span className="text-xs text-white/40 flex items-center gap-1">
          <Cpu size={10} />
          {task.model}
        </span>
        
        {task.dueDate && (
          <span className="text-xs text-white/40 flex items-center gap-1">
            <Calendar size={10} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Drag handle indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-0.5">
          <div className="w-4 h-0.5 bg-white/30 rounded-full"></div>
          <div className="w-4 h-0.5 bg-white/30 rounded-full"></div>
          <div className="w-4 h-0.5 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}