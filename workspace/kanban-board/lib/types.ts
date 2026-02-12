export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type AgentType = 'coder' | 'researcher' | 'content_writer' | 'marketing' | 'ops' | 'coordinator' | 'friday_manager' | 'code_ninja';
export type ColumnId = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type Frequency = 'one-time' | 'hourly' | 'daily' | 'weekly' | 'complete';
export type ModelType = 'deepseek-coder' | 'kimi' | 'sonnet' | 'opus' | 'flash' | 'gemini-pro' | 'haiku' | 'local';

export interface Task {
  id: string;
  title: string;
  description: string;
  agent: AgentType;
  model: ModelType;
  frequency: Frequency;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Column {
  id: ColumnId;
  title: string;
  taskIds: string[];
}

export interface KanbanBoard {
  tasks: Record<string, Task>;
  columns: Record<ColumnId, Column>;
  columnOrder: ColumnId[];
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: Date | null;
  nextRun: Date | null;
  status: 'active' | 'paused' | 'error';
}

export interface ChatMessage {
  id: string;
  agent: AgentType;
  content: string;
  timestamp: Date;
  mentions?: AgentType[];
}

export const AGENTS: { id: AgentType; label: string; color: string; icon: string }[] = [
  { id: 'coder', label: 'Coder', color: 'bg-blue-500', icon: '💻' },
  { id: 'researcher', label: 'Researcher', color: 'bg-green-500', icon: '🔍' },
  { id: 'content_writer', label: 'Content Writer', color: 'bg-purple-500', icon: '✍️' },
  { id: 'marketing', label: 'Marketing', color: 'bg-orange-500', icon: '📢' },
  { id: 'ops', label: 'Ops', color: 'bg-gray-500', icon: '⚙️' },
  { id: 'coordinator', label: 'Coordinator', color: 'bg-indigo-500', icon: '👨‍💼' },
  { id: 'friday_manager', label: 'Friday Manager', color: 'bg-red-500', icon: '🤖' },
  { id: 'code_ninja', label: 'Code Ninja', color: 'bg-teal-500', icon: '🥷' },
];

export const MODELS: ModelType[] = [
  'deepseek-coder',
  'kimi',
  'sonnet',
  'opus',
  'flash',
  'gemini-pro',
  'haiku',
  'local'
];

export const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: 'bg-gray-200 text-gray-800' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-200 text-yellow-800' },
  { id: 'high', label: 'High', color: 'bg-orange-200 text-orange-800' },
  { id: 'critical', label: 'Critical', color: 'bg-red-200 text-red-800' },
];

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', taskIds: [] },
  { id: 'in-progress', title: 'In Progress', taskIds: [] },
  { id: 'review', title: 'Review', taskIds: [] },
  { id: 'done', title: 'Done', taskIds: [] },
];

export const COLUMN_ORDER: ColumnId[] = ['todo', 'in-progress', 'review', 'done'];

// Initial sample tasks for the kanban board
export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'HubFit Data Refresh',
    description: 'Refresh client adherence data from HubFit API twice daily',
    agent: 'coder',
    model: 'deepseek-coder',
    frequency: 'daily',
    priority: 'high',
    status: 'in-progress',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
  },
  {
    id: '2',
    title: 'Social Media Monitoring',
    description: 'Monitor Reddit r/Fitness_India and r/Indianfitness for engagement opportunities',
    agent: 'researcher',
    model: 'kimi',
    frequency: 'daily',
    priority: 'medium',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
  },
  {
    id: '3',
    title: 'Instagram Content Strategy',
    description: 'Create daily reel scripts and content calendar',
    agent: 'marketing',
    model: 'sonnet',
    frequency: 'daily',
    priority: 'medium',
    status: 'review',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(Date.now() + 259200000), // 3 days
  },
  {
    id: '4',
    title: 'Email Newsletter Cleanup',
    description: 'Organize and clean up newsletter subscriptions',
    agent: 'coordinator',
    model: 'opus',
    frequency: 'one-time',
    priority: 'low',
    status: 'done',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: '5',
    title: 'Dashboard Mobile Optimization',
    description: 'Make HubFit dashboard fully responsive for mobile devices',
    agent: 'coder',
    model: 'deepseek-coder',
    frequency: 'complete',
    priority: 'high',
    status: 'done',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: '6',
    title: 'Client Follow-up System',
    description: 'Design automated follow-up workflow for ghosting clients',
    agent: 'coordinator',
    model: 'gemini-pro',
    frequency: 'one-time',
    priority: 'critical',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(Date.now() + 345600000), // 4 days
  },
];
