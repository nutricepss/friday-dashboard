'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, INITIAL_TASKS, AGENTS, PRIORITIES } from '@/lib/types';
import { Plus, LayoutGrid, List, Trash2, Calendar, User, Flag } from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('friday-tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        })));
      } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('friday-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (taskId: string) => {
    setDraggingTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggingTask(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date() } : t
    ));
    setDraggingTask(null);
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setShowAddForm(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length,
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="glass-header rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-glow">
              Friday Task Board
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Agent coordination & task delegation
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="glass px-3 py-1.5 rounded-full text-sm text-white/80">
                {stats.total} tasks
              </span>
              <span className="glass px-3 py-1.5 rounded-full text-sm text-green-300">
                {stats.done} done
              </span>
              {stats.critical > 0 && (
                <span className="px-3 py-1.5 rounded-full text-sm text-red-300 bg-red-500/20 border border-red-500/30">
                  {stats.critical} critical
                </span>
              )}
            </div>
            
            <div className="flex glass rounded-xl p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="liquid-gradient px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity border border-white/10"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Add Task Modal */}
      {showAddForm && (
        <AddTaskModal 
          onAdd={addTask} 
          onClose={() => setShowAddForm(false)} 
        />
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(column => (
            <div
              key={column.id}
              className="glass-column rounded-2xl p-4 min-h-[500px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white/90">{column.title}</h2>
                <span className="glass px-2 py-0.5 rounded-full text-xs text-white/60">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {getTasksByStatus(column.id).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDragging={draggingTask === task.id}
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="glass-column rounded-2xl p-4">
          <div className="space-y-2">
            {tasks.map(task => (
              <ListTaskRow 
                key={task.id} 
                task={task} 
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ 
  task, 
  isDragging, 
  onDragStart, 
  onDragEnd, 
  onDelete 
}: { 
  task: Task; 
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDelete: () => void;
}) {
  const agent = AGENTS.find(a => a.id === task.agent);
  const priority = PRIORITIES.find(p => p.id === task.priority);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`glass-card rounded-xl p-4 cursor-move group ${isDragging ? 'opacity-50 scale-95' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white/90 text-sm leading-tight">{task.title}</h3>
        <button 
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-400 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-white/50 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full priority-${task.priority}`}>
          <Flag size={10} className="inline mr-1" />
          {priority?.label}
        </span>
        
        <span className={`text-xs px-2 py-0.5 rounded-full agent-${task.agent} text-white/80`}>
          <User size={10} className="inline mr-1" />
          {agent?.label}
        </span>
        
        <span className="text-xs text-white/40 flex items-center gap-1">
          <Calendar size={10} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
        </span>
      </div>
    </div>
  );
}

function ListTaskRow({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const agent = AGENTS.find(a => a.id === task.agent);
  const column = COLUMNS.find(c => c.id === task.status);
  
  return (
    <div className="glass-card rounded-xl p-3 flex items-center gap-4 group">
      <div className={`w-2 h-2 rounded-full priority-${task.priority}`} />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white/90 text-sm truncate">{task.title}</h3>
        <p className="text-white/40 text-xs">{task.description}</p>
      </div>
      
      <div className="flex items-center gap-3 text-xs">
        <span className={`px-2 py-1 rounded-full agent-${task.agent} text-white/80`}>
          {agent?.label}
        </span>
        <span className="text-white/50">{column?.title}</span>
        <span className="text-white/40">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
        </span>
      </div>
      
      <button 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/40 hover:text-red-400 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function AddTaskModal({ onAdd, onClose }: { onAdd: (t: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    agent: 'coder' as const,
    model: 'deepseek-coder',
    frequency: 'one-time' as const,
    priority: 'medium' as const,
    status: 'todo' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-white mb-4">New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/60 text-sm block mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-white placeholder:text-white/30"
              placeholder="Enter task title"
              autoFocus
            />
          </div>
          
          <div>
            <label className="text-white/60 text-sm block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 resize-none"
              placeholder="Add details..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm block mb-1">Agent</label>
              <select
                value={form.agent}
                onChange={e => setForm({ ...form, agent: e.target.value as any })}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white"
              >
                {AGENTS.map(a => (
                  <option key={a.id} value={a.id} className="bg-gray-900">{a.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-white/60 text-sm block mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as any })}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-white"
              >
                {PRIORITIES.map(p => (
                  <option key={p.id} value={p.id} className="bg-gray-900">{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="liquid-gradient px-6 py-2 rounded-xl text-white font-medium border border-white/10"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
