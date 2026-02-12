'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Task, TaskStatus } from '@/lib/types';

interface KanbanDndProviderProps {
  children: React.ReactNode;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskReorder?: (activeId: string, overId: string) => void;
}

export function KanbanDndProvider({ children, tasks, onTaskMove, onTaskReorder }: KanbanDndProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // If dragging over a column
    if (['todo', 'in-progress', 'review', 'done'].includes(over.id as string)) {
      // Visual feedback for column hover
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping on a column
    if (['todo', 'in-progress', 'review', 'done'].includes(overId)) {
      onTaskMove(activeId, overId as TaskStatus);
      return;
    }

    // If dropping on another task (reordering within same column)
    if (onTaskReorder) {
      onTaskReorder(activeId, overId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay>
        {activeTask && (
          <div className="glass-card rounded-xl p-4 rotate-3 shadow-2xl border-2 border-blue-500/50 bg-gray-900/90 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-white/90 text-sm leading-tight">{activeTask.title}</h3>
            </div>
            {activeTask.description && (
              <p className="text-white/50 text-xs mb-3 line-clamp-2">{activeTask.description}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full priority-${activeTask.priority}`}>
                {activeTask.priority}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full agent-${activeTask.agent} text-white/80`}>
                {activeTask.agent}
              </span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}