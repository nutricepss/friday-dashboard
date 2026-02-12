import { KanbanBoard, Task, ColumnId } from './types';
import { format, addDays } from 'date-fns';

const today = new Date();

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design dashboard UI',
    description: 'Create wireframes and design system for the new dashboard',
    assignee: 'coder',
    priority: 'high',
    dueDate: format(addDays(today, 3), 'yyyy-MM-dd'),
    columnId: 'in-progress',
    createdAt: format(addDays(today, -2), 'yyyy-MM-dd'),
    updatedAt: format(addDays(today, -1), 'yyyy-MM-dd'),
  },
  {
    id: 'task-2',
    title: 'Market research report',
    description: 'Analyze competitor features and market trends',
    assignee: 'researcher',
    priority: 'medium',
    dueDate: format(addDays(today, 5), 'yyyy-MM-dd'),
    columnId: 'backlog',
    createdAt: format(addDays(today, -3), 'yyyy-MM-dd'),
    updatedAt: format(addDays(today, -3), 'yyyy-MM-dd'),
  },
  {
    id: 'task-3',
    title: 'Social media campaign',
    description: 'Plan and schedule posts for Q2 launch',
    assignee: 'marketing',
    priority: 'high',
    dueDate: format(addDays(today, 2), 'yyyy-MM-dd'),
    columnId: 'review',
    createdAt: format(addDays(today, -1), 'yyyy-MM-dd'),
    updatedAt: format(today, 'yyyy-MM-dd'),
  },
  {
    id: 'task-4',
    title: 'API integration',
    description: 'Connect frontend with backend services',
    assignee: 'coder',
    priority: 'critical',
    dueDate: format(addDays(today, 1), 'yyyy-MM-dd'),
    columnId: 'in-progress',
    createdAt: format(addDays(today, -4), 'yyyy-MM-dd'),
    updatedAt: format(addDays(today, -2), 'yyyy-MM-dd'),
  },
  {
    id: 'task-5',
    title: 'Team coordination meeting',
    description: 'Weekly sync with all agents',
    assignee: 'coordinator',
    priority: 'medium',
    dueDate: format(today, 'yyyy-MM-dd'),
    columnId: 'done',
    createdAt: format(addDays(today, -7), 'yyyy-MM-dd'),
    updatedAt: format(today, 'yyyy-MM-dd'),
  },
  {
    id: 'task-6',
    title: 'Documentation update',
    description: 'Update API documentation with new endpoints',
    assignee: 'coder',
    priority: 'low',
    dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
    columnId: 'backlog',
    createdAt: format(addDays(today, -5), 'yyyy-MM-dd'),
    updatedAt: format(addDays(today, -5), 'yyyy-MM-dd'),
  },
];

export const initialBoard: KanbanBoard = {
  tasks: initialTasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {} as Record<string, Task>),
  columns: {
    backlog: {
      id: 'backlog',
      title: 'Backlog',
      taskIds: ['task-2', 'task-6'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: ['task-1', 'task-4'],
    },
    review: {
      id: 'review',
      title: 'Review',
      taskIds: ['task-3'],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: ['task-5'],
    },
  },
  columnOrder: ['backlog', 'in-progress', 'review', 'done'],
};