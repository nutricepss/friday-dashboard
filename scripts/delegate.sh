#!/bin/bash
# delegate.sh - Friday's Task Delegation System
# Usage: ./delegate.sh @agent_name "task description" [priority] [deadline]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
AGENTS_DIR="$WORKSPACE_DIR/agents"
TASKS_DIR="$WORKSPACE_DIR/mnt/data/tasks"
DELIVERABLES_DIR="$WORKSPACE_DIR/mnt/data/deliverables"
CHAT_LOG="$WORKSPACE_DIR/mnt/data/chat_logs/squad_chat.log"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_chat() {
    local agent="$1"
    local message="$2"
    local timestamp=$(date '+%H:%M')
    echo "[$timestamp] $agent: $message" >> "$CHAT_LOG"
}

delegate_task() {
    local agent_mention="$1"
    local task="$2"
    local priority="${3:-normal}"
    local deadline="${4:-24h}"
    
    # Remove @ symbol
    local agent_id="${agent_mention//@/}"
    
    # Get agent config
    local agent_config="$AGENTS_DIR/${agent_id}.config"
    
    if [ ! -f "$agent_config" ]; then
        echo -e "${YELLOW}❌ Agent @$agent_id not found!${NC}"
        echo "Available agents:"
        ls -1 "$AGENTS_DIR"/*.config 2>/dev/null | xargs -n1 basename | sed 's/.config//' | sed 's/^/@/'
        return 1
    fi
    
    # Create task file
    local task_id=$(date +%s)
    local task_file="$TASKS_DIR/task_${agent_id}_${task_id}.json"
    
    mkdir -p "$TASKS_DIR"
    
    cat > "$task_file" << EOF
{
  "task_id": "$task_id",
  "agent": "$agent_id",
  "assigned_by": "friday",
  "assigned_to": "$agent_id",
  "task": "$task",
  "priority": "$priority",
  "deadline": "$deadline",
  "status": "assigned",
  "created_at": "$(date -Iseconds)",
  "deliverables": []
}
EOF
    
    echo -e "${GREEN}✅ Task delegated to @$agent_id${NC}"
    echo -e "${BLUE}📋 Task:${NC} $task"
    echo -e "${BLUE}⚡ Priority:${NC} $priority"
    echo -e "${BLUE}⏰ Deadline:${NC} $deadline"
    echo -e "${BLUE}📝 Task ID:${NC} $task_id"
    
    # Log to group chat
    log_chat "Friday 🤌" "@$agent_id - New task assigned: $task (Due: $deadline)"
    
    # In real implementation, this would spawn the agent session
    echo -e "${YELLOW}🚀 Spawning $agent_id session...${NC}"
    
    return 0
}

show_status() {
    echo -e "${BLUE}📊 NUTRICEPSS AI SQUAD STATUS${NC}"
    echo "================================"
    
    # Count tasks by status
    local todo=$(ls -1 "$TASKS_DIR"/*todo* 2>/dev/null | wc -l)
    local in_progress=$(ls -1 "$TASKS_DIR"/*in_progress* 2>/dev/null | wc -l)
    local review=$(ls -1 "$TASKS_DIR"/*review* 2>/dev/null | wc -l)
    local done=$(ls -1 "$TASKS_DIR"/*done* 2>/dev/null | wc -l)
    
    echo -e "${YELLOW}📝 To Do:${NC} $todo"
    echo -e "${YELLOW}🔄 In Progress:${NC} $in_progress"
    echo -e "${YELLOW}👀 Review:${NC} $review"
    echo -e "${GREEN}✅ Done:${NC} $done"
    
    echo ""
    echo -e "${BLUE}👥 AGENT ROSTER:${NC}"
    echo "• @content_writinator 📝 - Instagram content"
    echo "• @data_detective 🔍 - Research & leads"
    echo "• @coach_cory 📊 - Client analysis"
    echo "• @seo_steve 📈 - Growth & SEO"
    echo "• @code_ninja 🥷 - Development"
    echo "• @pr_princess 👑 - Marketing & PR"
}

show_recent_chat() {
    echo -e "${BLUE}💬 RECENT SQUAD CHAT:${NC}"
    echo "================================"
    
    if [ -f "$CHAT_LOG" ]; then
        tail -20 "$CHAT_LOG"
    else
        echo "No chat history yet. Start delegating tasks!"
    fi
}

# Main
case "${1:-}" in
    "@content_writinator"|"@data_detective"|"@coach_cory"|"@seo_steve"|"@code_ninja"|"@pr_princess")
        if [ -z "$2" ]; then
            echo "Usage: ./delegate.sh @agent_name 'task description' [priority] [deadline]"
            exit 1
        fi
        delegate_task "$1" "$2" "${3:-normal}" "${4:-24h}"
        ;;
    "status"|"-s")
        show_status
        ;;
    "chat"|"-c")
        show_recent_chat
        ;;
    "help"|"-h")
        echo "Friday's Task Delegation System"
        echo ""
        echo "Usage:"
        echo "  ./delegate.sh @agent_name 'task' [priority] [deadline]"
        echo "  ./delegate.sh status          # Show squad status"
        echo "  ./delegate.sh chat            # Show recent chat"
        echo ""
        echo "Examples:"
        echo "  ./delegate.sh @content_writinator 'Create reel about protein myths' high '6 PM today'"
        echo "  ./delegate.sh @data_detective 'Find 5 Reddit posts for engagement' normal '24h'"
        ;;
    *)
        echo "❌ Unknown agent or command: $1"
        echo ""
        echo "Available agents:"
        echo "  @content_writinator 📝"
        echo "  @data_detective 🔍"
        echo "  @coach_cory 📊"
        echo "  @seo_steve 📈"
        echo "  @code_ninja 🥷"
        echo "  @pr_princess 👑"
        echo ""
        echo "Commands:"
        echo "  status    - Show squad status"
        echo "  chat      - Show recent chat"
        echo "  help      - Show this help"
        ;;
esac