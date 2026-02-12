#!/usr/bin/env python3
"""
Agent Spawner - Spawns sub-agents for task execution
Friday uses this to actually delegate work to the AI squad
"""
import json
import sys
import os
from datetime import datetime

WORKSPACE = "/home/assistant4himanshu/.openclaw/workspace"
AGENTS_DIR = f"{WORKSPACE}/agents"
TASKS_DIR = f"{WORKSPACE}/mnt/data/tasks"
DELIVERABLES_DIR = f"{WORKSPACE}/mnt/data/deliverables"

def load_agent_config(agent_id):
    """Load agent configuration"""
    config_file = f"{AGENTS_DIR}/{agent_id}.config"
    if not os.path.exists(config_file):
        return None
    
    with open(config_file, 'r') as f:
        return f.read()

def create_task_prompt(agent_id, task_description, deadline):
    """Create the prompt for the sub-agent"""
    config = load_agent_config(agent_id)
    if not config:
        return None
    
    prompt = f"""{config}

═══════════════════════════════════════════════════
🎯 NEW TASK ASSIGNED BY FRIDAY
═══════════════════════════════════════════════════

Task: {task_description}
Deadline: {deadline}
Assigned: {datetime.now().strftime('%Y-%m-%d %H:%M')}

YOUR MISSION:
1. Acknowledge receipt of this task
2. Ask clarifying questions if needed
3. Execute the task to the best of your ability
4. Save deliverables to: {DELIVERABLES_DIR}/
5. Report back to Friday when complete

Remember your personality and catchphrase!

Let's do this! 💪
"""
    return prompt

def spawn_agent(agent_id, task_description, deadline="24h"):
    """Spawn a sub-agent session for task execution"""
    
    # Create task record
    task_id = datetime.now().strftime('%Y%m%d_%H%M%S')
    task_file = f"{TASKS_DIR}/task_{agent_id}_{task_id}.json"
    
    os.makedirs(TASKS_DIR, exist_ok=True)
    
    task_record = {
        "task_id": task_id,
        "agent_id": agent_id,
        "task": task_description,
        "deadline": deadline,
        "status": "spawning",
        "created_at": datetime.now().isoformat(),
        "deliverables": []
    }
    
    with open(task_file, 'w') as f:
        json.dump(task_record, f, indent=2)
    
    # Generate agent prompt
    prompt = create_task_prompt(agent_id, task_description, deadline)
    
    if not prompt:
        print(f"❌ Agent config not found: {agent_id}")
        return None
    
    # Save prompt for spawning
    prompt_file = f"{TASKS_DIR}/prompt_{agent_id}_{task_id}.txt"
    with open(prompt_file, 'w') as f:
        f.write(prompt)
    
    print(f"🚀 Ready to spawn {agent_id}")
    print(f"📝 Task: {task_description}")
    print(f"⏰ Deadline: {deadline}")
    print(f"📁 Files: {task_file}")
    
    # In real implementation, this would call sessions_spawn
    # For now, we save the prompt for manual spawning or cron execution
    
    return {
        "task_id": task_id,
        "agent_id": agent_id,
        "prompt_file": prompt_file,
        "status": "ready_to_spawn"
    }

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 agent_spawner.py <agent_id> 'task description' [deadline]")
        print("")
        print("Examples:")
        print("  python3 agent_spawner.py content_writinator 'Create Instagram reel about protein' '6 PM today'")
        print("  python3 agent_spawner.py data_detective 'Find Reddit engagement opportunities' '24h'")
        sys.exit(1)
    
    agent_id = sys.argv[1]
    task = sys.argv[2]
    deadline = sys.argv[3] if len(sys.argv) > 3 else "24h"
    
    result = spawn_agent(agent_id, task, deadline)
    
    if result:
        print(f"\n✅ Task {result['task_id']} ready for {agent_id}")
        print(f"💡 To actually spawn: Use OpenClaw sessions_spawn with the prompt file")
    else:
        print("\n❌ Failed to prepare task")
        sys.exit(1)

if __name__ == "__main__":
    main()