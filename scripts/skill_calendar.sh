#!/bin/bash
# skill_calendar.sh - Production Google Calendar wrapper
# Manages Himanshu's schedule: virtual training, client calls, content blocks

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$WORKSPACE_DIR/mnt/data/artifacts"
LOG_DIR="$WORKSPACE_DIR/memory"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${YELLOW}[skill_calendar]${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_DIR/calendar-$(date +%Y-%m-%d).log"
}

error() {
    echo -e "${RED}[skill_calendar] ERROR${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR: $1" >> "$LOG_DIR/calendar-$(date +%Y-%m-%d).log"
    exit 1
}

success() {
    echo -e "${GREEN}[skill_calendar] SUCCESS${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') SUCCESS: $1" >> "$LOG_DIR/calendar-$(date +%Y-%m-%d).log"
}

check_dependencies() {
    log "Checking dependencies..."
    
    # Check gcalcli
    if ! command -v gcalcli &> /dev/null; then
        error "gcalcli not found. Install via: pip install gcalcli"
    fi
    
    # Check OAuth configuration
    if [ ! -f ~/.gcalcli_oauth ]; then
        error "gcalcli OAuth not configured. Run: gcalcli agenda"
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    log "Dependencies check passed"
}

get_todays_agenda() {
    log "Getting today's agenda..."
    
    local output_file="$OUTPUT_DIR/calendar-today-${TIMESTAMP}.txt"
    
    # Get today's agenda
    gcalcli --nocolor agenda today tomorrow > "$output_file" 2>&1
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        # Count events
        local event_count=$(grep -c "^[0-9][0-9]:[0-9][0-9]\|^[0-9]:[0-9][0-9]" "$output_file" 2>/dev/null || echo "0")
        log "Today: $event_count events"
        echo "$event_count"
        return 0
    else
        log "Failed to get agenda"
        echo "0"
        return 1
    fi
}

get_weekly_overview() {
    log "Getting weekly overview..."
    
    local output_file="$OUTPUT_DIR/calendar-week-${TIMESTAMP}.txt"
    
    # Get next 7 days
    gcalcli --nocolor agenda today +7d > "$output_file" 2>&1
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        # Count events by day
        local weekly_summary=$(python3 -c "
import re
with open('$output_file') as f:
    content = f.read()

# Extract events by day
days = {}
current_date = ''
for line in content.split('\\n'):
    date_match = re.match(r'^([A-Za-z]+ [A-Za-z]+ \\d+)', line)
    if date_match:
        current_date = date_match.group(1)
        days[current_date] = 0
    elif re.match(r'^[0-9]:[0-9][0-9]|^[0-9][0-9]:[0-9][0-9]', line):
        if current_date:
            days[current_date] += 1

# Print summary
for date, count in days.items():
    print(f'{date}: {count} events')
")
        log "Weekly overview generated"
        echo "$weekly_summary"
        return 0
    else
        log "Failed to get weekly overview"
        echo ""
        return 1
    fi
}

analyze_schedule() {
    local today_count="$1"
    local weekly_summary="$2"
    local analysis_file="$OUTPUT_DIR/calendar-analysis-${TIMESTAMP}.md"
    
    log "Analyzing schedule..."
    
    # Get virtual training sessions
    local virtual_training=$(gcalcli --nocolor search "Virtual Training" today +7d 2>/dev/null | grep -c "Virtual Training" || echo "0")
    
    # Get client calls
    local client_calls=$(gcalcli --nocolor search "Client" today +7d 2>/dev/null | grep -c "Client" || echo "0")
    
    # Get content blocks
    local content_blocks=$(gcalcli --nocolor search "Content" today +7d 2>/dev/null | grep -c "Content" || echo "0")
    
    cat > "$analysis_file" << EOF
# Calendar Schedule Analysis
**Generated:** $(date '+%d %b %Y, %H:%M')

## 📅 Today's Schedule
- **Total events:** $today_count
- **Virtual training sessions:** $(gcalcli --nocolor search "Virtual Training" today tomorrow 2>/dev/null | grep -c "Virtual Training" || echo "0")
- **Client calls:** $(gcalcli --nocolor search "Client" today tomorrow 2>/dev/null | grep -c "Client" || echo "0")

## 📊 Weekly Overview
\`\`\`
$weekly_summary
\`\`\`

## 🎯 Activity Breakdown (Next 7 Days)
- **Virtual Training Sessions:** $virtual_training
- **Client Calls/Consultations:** $client_calls  
- **Content Creation Blocks:** $content_blocks
- **Total Scheduled Hours:** $((virtual_training + client_calls + content_blocks))

## ⏰ Time Management Insights

### 1. Virtual Training Pattern
- Target: 4 sessions/week (Monday-Thursday, 8:30 AM)
- Current: $virtual_training scheduled this week
- Status: $(if [ $virtual_training -ge 4 ]; then echo "✅ On track"; else echo "⚠️  Needs scheduling"; fi)

### 2. Client Engagement
- Ideal: 2-3 new consultations/week
- Current: $client_calls scheduled this week
- Status: $(if [ $client_calls -ge 2 ]; then echo "✅ Good"; else echo "⚠️  Could increase"; fi)

### 3. Content Creation
- Goal: 5 hours/week (Instagram, Reddit, Email)
- Current: $content_blocks blocks scheduled
- Status: $(if [ $content_blocks -ge 3 ]; then echo "✅ Good"; else echo "⚠️  Needs more time"; fi)

## 🚀 Recommended Actions

### Immediate (Today)
1. **Prepare for today's $today_count events**
2. **Review virtual training materials**
3. **Block gym time (3-4 PM, 2-3 hours)**

### This Week
1. **Schedule missing virtual training sessions** ($((4 - virtual_training)) needed)
2. **Add client consultation slots** ($((3 - client_calls)) recommended)
3. **Block content creation time** ($((5 - content_blocks)) hours needed)

### System Improvements
1. **Template events** for recurring sessions
2. **Buffer time** between client calls
3. **Weekly review** every Sunday evening

## 📁 Artifacts
1. **Today's Agenda:** \`calendar-today-${TIMESTAMP}.txt\`
2. **Weekly Overview:** \`calendar-week-${TIMESTAMP}.txt\`
3. **This Analysis:** \`$(basename "$analysis_file")\`
4. **Log File:** \`calendar-$(date +%Y-%m-%d).log\`

## ⚠️ Schedule Guidelines
- **Working hours:** 8 AM - 2 AM (flexible)
- **Virtual training:** 4 days/week, 8:30 AM
- **Gym time:** 3-4 PM, 2-3 hours
- **Family dinner:** ~9-10 PM
- **Content creation:** Morning/afternoon blocks

---
*Generated by skill_calendar.sh - Part of NutriCepss skill system*
EOF
    
    success "Schedule analysis generated: $(basename "$analysis_file")"
    echo "$analysis_file"
}

generate_notification() {
    local today_count="$1"
    local analysis_file="$2"
    local notification_file="$OUTPUT_DIR/calendar-notification-${TIMESTAMP}.txt"
    
    log "Generating notification..."
    
    # Extract key metrics
    local virtual_training=$(grep -o "Virtual Training Sessions: [0-9]*" "$analysis_file" | head -1 | awk '{print $4}')
    local client_calls=$(grep -o "Client Calls/Consultations: [0-9]*" "$analysis_file" | head -1 | awk '{print $3}')
    
    cat > "$notification_file" << EOF
📅 Daily Schedule Update

Today: $today_count events
Virtual training: $virtual_training this week  
Client calls: $client_calls this week

Full analysis: $(basename "$analysis_file")

Action: Review today's schedule and prepare.
EOF
    
    log "Notification generated: $(basename "$notification_file")"
    echo "$notification_file"
}

main() {
    echo "========================================"
    echo "   Calendar Management - Production"
    echo "========================================"
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    
    # Step 2: Get today's agenda
    log "Starting calendar analysis..."
    
    local today_count
    today_count=$(get_todays_agenda) || today_count=0
    
    # Step 3: Get weekly overview
    local weekly_summary
    weekly_summary=$(get_weekly_overview) || weekly_summary="Error getting weekly data"
    
    # Step 4: Analyze schedule
    local analysis_file
    analysis_file=$(analyze_schedule "$today_count" "$weekly_summary") || error "Failed to analyze schedule"
    
    # Step 5: Generate notification
    local notification_file
    notification_file=$(generate_notification "$today_count" "$analysis_file") || error "Failed to generate notification"
    
    # Step 6: Final output
    echo ""
    echo "========================================"
    echo "           EXECUTION COMPLETE"
    echo "========================================"
    echo ""
    echo "📁 Output Directory: $OUTPUT_DIR"
    echo "📅 Today's Events:   $today_count"
    echo "📊 Analysis:         $(basename "$analysis_file")"
    echo "🔔 Notification:     $(basename "$notification_file")"
    echo "📋 Log File:         calendar-$(date +%Y-%m-%d).log"
    echo ""
    echo "Next: Review today's schedule and prepare for events."
    echo ""
    
    success "Calendar production workflow completed successfully"
    return 0
}

# Handle command line arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: skill_calendar.sh [OPTION]"
        echo ""
        echo "Production Google Calendar wrapper."
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --test         Test mode (validate only)"
        echo "  --cron         Cron mode (quiet output)"
        echo "  --today        Today's agenda only"
        echo "  --week         Weekly overview only"
        echo ""
        echo "Outputs:"
        echo "  • calendar-today-*.txt   - Today's agenda"
        echo "  • calendar-week-*.txt    - Weekly overview"
        echo "  • calendar-analysis-*.md - Schedule analysis"
        echo "  • calendar-notification-*.txt - Notification"
        echo "  • calendar-YYYY-MM-DD.log - Execution log"
        echo ""
        exit 0
        ;;
    "--test")
        echo "🧪 Test mode: Testing calendar dependencies..."
        check_dependencies
        echo "✅ Test passed - Calendar skill is ready for production"
        exit 0
        ;;
    "--cron")
        # Cron mode - minimal output
        exec >> "$LOG_DIR/calendar-cron-$(date +%Y-%m-%d).log" 2>&1
        main
        exit $?
        ;;
    "--today")
        echo "Today's agenda:"
        check_dependencies
        get_todays_agenda
        cat "$OUTPUT_DIR/calendar-today-${TIMESTAMP}.txt"
        exit 0
        ;;
    "--week")
        echo "Weekly overview:"
        check_dependencies
        get_weekly_overview
        cat "$OUTPUT_DIR/calendar-week-${TIMESTAMP}.txt"
        exit 0
        ;;
    *)
        # Normal execution
        main
        exit $?
        ;;
esac