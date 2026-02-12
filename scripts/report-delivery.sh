#!/bin/bash
# report-delivery.sh - Check for new reports and deliver them via email and Telegram

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
ARTIFACTS_DIR="$WORKSPACE_DIR/mnt/data/artifacts"
REPORTS_DIR="$WORKSPACE_DIR/mnt/data/reports"
LOG_FILE="$WORKSPACE_DIR/memory/report-delivery.log"

# Gmail credentials
GMAIL_USER="assistantatnutricepss@gmail.com"
GMAIL_PASS="wlve yxsp xxoh mgtn"
RECIPIENT="nutricepss@gmail.com"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

send_email() {
    local subject="$1"
    local body="$2"
    
    cd "$WORKSPACE_DIR"
    GMAIL_USER="$GMAIL_USER" GMAIL_PASS="$GMAIL_PASS" \
        python3 skills/gmail-client/scripts/gmail_tool.py send "$RECIPIENT" "$subject" "$body" 2>&1
}

send_telegram() {
    local message="$1"
    
    # Use Telegram bot API
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=1353683819" \
        -d "text=$message" \
        -d "parse_mode=HTML" 2>&1 || echo "Telegram send failed"
}

check_and_deliver_reddit() {
    # Find latest reddit analysis
    local latest_report=$(ls -t "$ARTIFACTS_DIR"/reddit-analysis-*.md 2>/dev/null | head -1)
    
    if [ -n "$latest_report" ]; then
        local report_time=$(stat -c %Y "$latest_report")
        local current_time=$(date +%s)
        local age=$((current_time - report_time))
        
        # If report is less than 2 hours old, deliver it
        if [ $age -lt 7200 ]; then
            log "Found new Reddit report: $(basename "$latest_report")"
            
            # Extract summary
            local summary=$(head -30 "$latest_report")
            
            # Send email
            send_email "Reddit Engagement Report - $(date '+%d %b %H:%M')" "$summary"
            
            # Send Telegram notification
            local telegram_msg="🔴 <b>Reddit Engagement Report</b>%0A%0ANew opportunities found!%0A%0ACheck your email for full details.%0A%0A$(grep -E '^### [0-9]+\.' "$latest_report" | head -3 | sed 's/### /• /')"
            
            send_telegram "$telegram_msg"
            
            log "Delivered Reddit report via email and Telegram"
        fi
    fi
}

check_and_deliver_hubfit() {
    # Find latest HubFit report
    local latest_report=$(ls -t "$REPORTS_DIR"/hubfit-summary-*.md 2>/dev/null | head -1)
    
    if [ -n "$latest_report" ]; then
        local report_time=$(stat -c %Y "$latest_report")
        local current_time=$(date +%s)
        local age=$((current_time - report_time))
        
        # If report is less than 2 hours old, deliver it
        if [ $age -lt 7200 ]; then
            log "Found new HubFit report: $(basename "$latest_report")"
            
            # Extract urgent alerts
            local urgent=$(grep -A5 "URGENT" "$latest_report" 2>/dev/null | head -10)
            local active=$(grep "Active:" "$latest_report" | head -1)
            local ghosting=$(grep "Ghosting:" "$latest_report" | head -1)
            
            # Send email
            local email_body="HubFit Daily Report - $(date '+%d %b %Y')%0A%0A$active%0A$ghosting%0A%0AUrgent Alerts:%0A$urgent"
            send_email "HubFit Report - $(date '+%d %b %H:%M')" "$email_body"
            
            # Send Telegram
            local telegram_msg="📊 <b>HubFit Report</b>%0A%0A$active%0A$ghosting%0A%0A⚠️ Check email for urgent ghosting alerts!"
            send_telegram "$telegram_msg"
            
            log "Delivered HubFit report via email and Telegram"
        fi
    fi
}

# Main
log "Starting report delivery check..."

check_and_deliver_reddit
check_and_deliver_hubfit

log "Delivery check complete."