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
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { ColumnId, KanbanBoard } from '@/lib/types';
import { saveBoardToStorage } from '@/lib/storage';

interface DndProviderProps {
  children: React.ReactNode;
  board: KanbanBoard;
  onBoardChange: (board: KanbanBoard) => void;
}

export function DndProvider({ children, board, onBoardChange }: DndProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dragging over a column
    if (Object.keys(board.columns).includes(overId)) {
      const newColumnId = overId as ColumnId;
      const oldColumnId = board.tasks[activeId]?.columnId;

      if (oldColumnId && oldColumnId !== newColumnId) {
        const newBoard = { ...board };
        
        // Remove from old column
        newBoard.columns[oldColumnId].taskIds = newBoard.columns[oldColumnId].taskIds.filter(
          (id) => id !== activeId
        );
        
        // Add to new column at the end
        newBoard.columns[newColumnId].taskIds.push(activeId);
        
        // Update task column
        newBoard.tasks[activeId] = {
          ...newBoard.tasks[activeId],
          columnId: newColumnId,
          updatedAt: new Date().toISOString().split('T')[0],
        };

        onBoardChange(newBoard);
        saveBoardToStorage(newBoard);
      }
      return;
    }

    // If dragging within the same column
    const activeColumn = Object.values(board.columns).find((column) =>
      column.taskIds.includes(activeId)
    );
    const overColumn = Object.values(board.columns).find((column) =>
      column.taskIds.includes(overId)
    );

    if (!activeColumn || !overColumn || activeColumn.id !== overColumn.id) {
      return;
    }

    const oldIndex = activeColumn.taskIds.indexOf(activeId);
    const newIndex = overColumn.taskIds.indexOf(overId);

    if (oldIndex !== newIndex) {
      const newBoard = { ...board };
      newBoard.columns[activeColumn.id].taskIds = arrayMove(
        activeColumn.taskIds,
        oldIndex,
        newIndex
      );
      
      onBoardChange(newBoard);
      saveBoardToStorage(newBoard);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={Object.values(board.columns).flatMap((col) => col.taskIds)}>
        {children}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="opacity-80 rotate-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border-2 border-blue-500">
            <div className="font-semibold text-gray-900 dark:text-white">
              {board.tasks[activeId]?.title}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}