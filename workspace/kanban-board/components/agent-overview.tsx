'use client'

import { AGENTS } from '@/lib/types'
import { Cpu, Activity } from 'lucide-react'

export function AgentOverview() {
  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'coder': return '💻'
      case 'researcher': return '🔍'
      case 'content_writer': return '✍️'
      case 'marketing': return '📢'
      case 'ops': return '⚙️'
      case 'coordinator': return '👨‍💼'
      default: return '🤖'
    }
  }

  const getStatusColor = (tasks: number) => {
    if (tasks === 0) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (tasks <= 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Cpu className="h-5 w-5" />
        <h2 className="text-xl font-bold">Agent Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map(agent => (
          <div
            key={agent.id}
            className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getAgentIcon(agent.id)}</div>
                <div>
                  <h3 className="font-semibold">{agent.label}</h3>
                  <p className="text-sm text-muted-foreground">{agent.id}</p>
                </div>
              </div>
              <div className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(agent.activeTasks)}`}>
                {agent.activeTasks} tasks
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={agent.activeTasks > 0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                    {agent.activeTasks > 0 ? 'Active' : 'Available'}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                  <div 
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(agent.activeTasks * 25, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-secondary/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Total Active Tasks</h4>
            <p className="text-sm text-muted-foreground">
              Across all agents
            </p>
          </div>
          <div className="text-2xl font-bold">
            {AGENTS.reduce((sum, agent) => sum + agent.activeTasks, 0)}
          </div>
        </div>
      </div>
    </div>
  )
}