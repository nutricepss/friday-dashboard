'use client'

import { useState, useEffect } from 'react'
import { Task, TaskStatus, INITIAL_TASKS, ModelType } from '@/lib/types'
import { KanbanColumn } from './kanban-column'
import { TaskCard } from './task-card'
import { Plus, ListTodo, Grid3x3 } from 'lucide-react'

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [showAddForm, setShowAddForm] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('friday-tasks')
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks)
        // Convert date strings back to Date objects
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }))
        setTasks(tasksWithDates)
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('friday-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    const task = tasks.find(t => t.id === taskId)
    
    if (task) {
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status, updatedAt: new Date() } : t
      )
      setTasks(updatedTasks)
    }
  }

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks([...tasks, newTask])
    setShowAddForm(false)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
        return { ...task, status: newStatus, updatedAt: new Date() }
      }
      return task
    }))
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Task Board</h2>
          <div className="flex items-center gap-2 rounded-lg border p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                viewMode === 'kanban' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <ListTodo className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {showAddForm && (
        <AddTaskForm
          onAdd={addTask}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              status={column.id}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {getTasksByStatus(column.id).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={handleDragStart}
                  onDelete={deleteTask}
                />
              ))}
            </KanbanColumn>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/50"
            >
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => toggleTaskStatus(task.id)}
                className="h-4 w-4 rounded border-primary"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.title}</span>
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                    {task.agent.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {task.model}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">
                  {task.frequency}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="rounded-md p-1 text-red-500 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddTaskForm({ onAdd, onCancel }: { 
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    agent: 'coder',
    model: 'deepseek-coder',
    frequency: 'one-time',
    priority: 'medium',
    status: 'todo',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onAdd(formData)
  }

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 text-lg font-semibold">Add New Task</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Task Name</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter task name"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Assign to Agent</label>
            <select
              value={formData.agent}
              onChange={e => setFormData({ ...formData, agent: e.target.value as any })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="coder">CODER</option>
              <option value="researcher">RESEARCHER</option>
              <option value="content_writer">CONTENT_WRITER</option>
              <option value="marketing">MARKETING</option>
              <option value="ops">OPS</option>
              <option value="coordinator">COORDINATOR</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Model</label>
            <select
              value={formData.model}
              onChange={e => setFormData({ ...formData, model: e.target.value as ModelType })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="deepseek-coder">deepseek-coder</option>
              <option value="kimi">kimi</option>
              <option value="sonnet">sonnet</option>
              <option value="opus">opus</option>
              <option value="flash">flash</option>
              <option value="gemini-pro">gemini-pro</option>
              <option value="haiku">haiku</option>
              <option value="local">local</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Frequency</label>
            <select
              value={formData.frequency}
              onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="one-time">One-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Priority</label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Enter task description"
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  )
}