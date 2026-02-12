import { KanbanBoard, Task, ColumnId } from './types';
import { addDays } from 'date-fns';

const today = new Date();

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design dashboard UI',
    description: 'Create wireframes and design system for the new dashboard',
    agent: 'coder',
    model: 'deepseek-coder',
    frequency: 'one-time',
    priority: 'high',
    status: 'in-progress',
    dueDate: addDays(today, 3),
    createdAt: addDays(today, -2),
    updatedAt: addDays(today, -1),
  },
  {
    id: 'task-2',
    title: 'Market research report',
    description: 'Analyze competitor features and market trends',
    agent: 'researcher',
    model: 'kimi',
    frequency: 'one-time',
    priority: 'medium',
    status: 'todo',
    dueDate: addDays(today, 5),
    createdAt: addDays(today, -3),
    updatedAt: addDays(today, -3),
  },
  {
    id: 'task-3',
    title: 'Social media campaign',
    description: 'Plan and schedule posts for Q2 launch',
    agent: 'marketing',
    model: 'sonnet',
    frequency: 'one-time',
    priority: 'high',
    status: 'review',
    dueDate: addDays(today, 2),
    createdAt: addDays(today, -1),
    updatedAt: today,
  },
  {
    id: 'task-4',
    title: 'API integration',
    description: 'Connect frontend with backend services',
    agent: 'coder',
    model: 'deepseek-coder',
    frequency: 'one-time',
    priority: 'critical',
    status: 'in-progress',
    dueDate: addDays(today, 1),
    createdAt: addDays(today, -4),
    updatedAt: addDays(today, -2),
  },
  {
    id: 'task-5',
    title: 'Team coordination meeting',
    description: 'Weekly sync with all agents',
    agent: 'coordinator',
    model: 'opus',
    frequency: 'one-time',
    priority: 'medium',
    status: 'done',
    dueDate: today,
    createdAt: addDays(today, -7),
    updatedAt: today,
  },
  {
    id: 'task-6',
    title: 'Documentation update',
    description: 'Update API documentation with new endpoints',
    agent: 'coder',
    model: 'deepseek-coder',
    frequency: 'one-time',
    priority: 'low',
    status: 'todo',
    dueDate: addDays(today, 7),
    createdAt: addDays(today, -5),
    updatedAt: addDays(today, -5),
  },
];

export const initialBoard: KanbanBoard = {
  tasks: initialTasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {} as Record<string, Task>),
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-2', 'task-6'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: ['task-1', 'task-4'],
    },
    'review': {
      id: 'review',
      title: 'Review',
      taskIds: ['task-3'],
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: ['task-5'],
    },
  },
  columnOrder: ['todo', 'in-progress', 'review', 'done'],
};