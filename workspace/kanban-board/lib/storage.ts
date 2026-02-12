import { KanbanBoard } from './types';
import { initialBoard } from './initial-data';

const STORAGE_KEY = 'kanban-board-data';

export const loadBoardFromStorage = (): KanbanBoard => {
  if (typeof window === 'undefined') {
    return initialBoard;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load board from storage:', error);
  }

  return initialBoard;
};

export const saveBoardToStorage = (board: KanbanBoard): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (error) {
    console.error('Failed to save board to storage:', error);
  }
};

export const clearStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};