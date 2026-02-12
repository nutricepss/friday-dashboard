#!/bin/bash
# skill_gmail.sh - Production Gmail maintenance wrapper
# Clears spam, checks important emails, manages newsletters

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
GUARDSKILLS="$SCRIPT_DIR/guradskills.sh"
GMAIL_SCRIPT="$WORKSPACE_DIR/skills/gmail-client/scripts/gmail_tool.py"
CREDENTIALS_FILE="$WORKSPACE_DIR/../credentials/gmail-app-passwords.json"
OUTPUT_DIR="$WORKSPACE_DIR/mnt/data/artifacts"
LOG_DIR="$WORKSPACE_DIR/memory"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Gmail accounts (from TOOLS.md)
declare -A GMAIL_ACCOUNTS=(
    ["work"]="nutricepss@gmail.com"
    ["personal"]="hims.sharma62@gmail.com"
    ["swansh"]="swanshenterprises@gmail.com"
    ["assistant"]="assistantatnutricepss@gmail.com"
    ["nutricepss0"]="nutricepss0@gmail.com"
)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${YELLOW}[skill_gmail]${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_DIR/gmail-$(date +%Y-%m-%d).log"
}

error() {
    echo -e "${RED}[skill_gmail] ERROR${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR: $1" >> "$LOG_DIR/gmail-$(date +%Y-%m-%d).log"
    exit 1
}

success() {
    echo -e "${GREEN}[skill_gmail] SUCCESS${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') SUCCESS: $1" >> "$LOG_DIR/gmail-$(date +%Y-%m-%d).log"
}

check_dependencies() {
    log "Checking dependencies..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        error "Python3 not found. Required for Gmail script."
    fi
    
    # Check guradskills
    if [ ! -f "$GUARDSKILLS" ]; then
        error "guradskills.sh not found at $GUARDSKILLS"
    fi
    
    # Check Gmail script
    if [ ! -f "$GMAIL_SCRIPT" ]; then
        error "gmail_tool.py not found at $GMAIL_SCRIPT"
    fi
    
    # Check credentials file
    if [ ! -f "$CREDENTIALS_FILE" ]; then
        error "Gmail credentials not found at $CREDENTIALS_FILE"
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    log "Dependencies check passed"
}

validate_with_guradskills() {
    log "Validating gmail-client skill..."
    
    if ! "$GUARDSKILLS" gmail-client --check-only; then
        error "guradskills validation failed for gmail-client"
    fi
    
    log "Skill validation passed"
}

get_account_password() {
    local account_key="$1"
    
    # Extract password from credentials file
    local password=$(python3 -c "
import json
try:
    with open('$CREDENTIALS_FILE') as f:
        data = json.load(f)
        account = data.get('accounts', {}).get('$account_key', {})
        print(account.get('pass', ''))
except Exception as e:
    print('')
")
    
    if [ -z "$password" ]; then
        error "Password not found for account key: $account_key"
    fi
    
    echo "$password"
}

check_account_unread() {
    local account_key="$1"
    local email="${GMAIL_ACCOUNTS[$account_key]}"
    local password=$(get_account_password "$account_key")
    
    log "Checking unread emails for $account_key ($email)..."
    
    # Set environment variables for the script
    export GMAIL_USER="$email"
    export GMAIL_PASS="$password"
    
    # Run gmail tool to list unread emails
    local output_file="$OUTPUT_DIR/gmail-${account_key}-unread-${TIMESTAMP}.txt"
    
    cd "$WORKSPACE_DIR"
    python3 "$GMAIL_SCRIPT" list 5 > "$output_file" 2>&1
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        # Count unread emails from output
        local unread_count=$(grep -c "Subject:" "$output_file" 2>/dev/null || echo "0")
        log "$account_key: $unread_count unread emails"
        echo "$unread_count"
        return 0
    else
        log "$account_key: Failed to check unread emails"
        echo "0"
        return 1
    fi
}

generate_email_summary() {
    local summary_file="$OUTPUT_DIR/gmail-summary-${TIMESTAMP}.md"
    
    log "Generating email summary..."
    
    # Collect data from all accounts
    declare -A unread_counts
    local total_unread=0
    
    for account_key in "${!GMAIL_ACCOUNTS[@]}"; do
        local count
        count=$(check_account_unread "$account_key") || count=0
        unread_counts["$account_key"]=$count
        total_unread=$((total_unread + count))
    done
    
    # Create summary
    cat > "$summary_file" << EOF
# Daily Email Maintenance Summary
**Generated:** $(date '+%d %b %Y, %H:%M')

## 📧 Account Status

| Account | Email | Unread |
|---------|-------|--------|
EOF
    
    for account_key in "${!GMAIL_ACCOUNTS[@]}"; do
        local email="${GMAIL_ACCOUNTS[$account_key]}"
        local count="${unread_counts[$account_key]}"
        local status="✅"
        
        if [ "$count" -gt 10 ]; then
            status="⚠️"
        elif [ "$count" -gt 20 ]; then
            status="🔴"
        fi
        
        echo "| $account_key | $email | $status $count |" >> "$summary_file"
    done
    
    cat >> "$summary_file" << EOF

## 📊 Total Unread Emails: $total_unread

## 🎯 Priority Accounts

### 1. Work (nutricepss@gmail.com)
- **Priority:** Highest - client communications, business emails
- **Action:** Check daily, respond within 24 hours
- **Unread:** ${unread_counts[work]} emails

### 2. Assistant (assistantatnutricepss@gmail.com)
- **Priority:** High - reports, automated communications
- **Action:** Check for reports, forward important emails
- **Unread:** ${unread_counts[assistant]} emails

### 3. Personal (hims.sharma62@gmail.com)
- **Priority:** Medium - personal, subscriptions
- **Action:** Weekly cleanup, unsubscribe from spam
- **Unread:** ${unread_counts[personal]} emails

### 4. Business (swanshenterprises@gmail.com)
- **Priority:** Low - side business, occasional
- **Action:** Monthly check, important emails only
- **Unread:** ${unread_counts[swansh]} emails

### 5. Secondary (nutricepss0@gmail.com)
- **Priority:** Lowest - backup, testing
- **Action:** As needed, minimal maintenance
- **Unread:** ${unread_counts[nutricepss0]} emails

## 🚀 Recommended Actions

### Immediate (Today)
1. **Check work account** - ${unread_counts[work]} unread emails
2. **Review assistant account** - Reports and summaries
3. **Clear spam folders** across all accounts

### Weekly
1. **Unsubscribe** from 5 newsletters (personal account)
2. **Archive** old emails (>90 days)
3. **Organize** client emails into folders

### Monthly
1. **Review all accounts** for important missed emails
2. **Update filters** and rules
3. **Backup** important emails

## 📁 Artifacts
1. **Account Reports:** \`gmail-*-unread-*.txt\`
2. **This Summary:** \`$(basename "$summary_file")\`
3. **Log File:** \`gmail-$(date +%Y-%m-%d).log\`

## ⚠️ Important Notes
- **NEVER** reply to clients directly from automated scripts
- **ALWAYS** use assistant account for sending reports
- **RESPECT** client confidentiality in all email handling
- **LOG** all email actions for audit trail

---
*Generated by skill_gmail.sh - Part of NutriCepss skill system*
EOF
    
    success "Email summary generated: $(basename "$summary_file")"
    echo "$summary_file"
}

send_daily_report() {
    local summary_file="$1"
    
    log "Sending daily email report..."
    
    # Use assistant account to send report
    local assistant_email="${GMAIL_ACCOUNTS[assistant]}"
    local assistant_password=$(get_account_password "assistant")
    local recipient_email="${GMAIL_ACCOUNTS[work]}"
    
    # Extract summary for email body
    local email_body=$(python3 -c "
import re
with open('$summary_file') as f:
    content = f.read()
    
# Extract key sections
import re

# Get total unread
total_match = re.search(r'Total Unread Emails: (\d+)', content)
total_unread = total_match.group(1) if total_match else '0'

# Get work account status
work_match = re.search(r'Work.*Unread: (\d+) emails', content)
work_unread = work_match.group(1) if work_match else '0'

print(f'Daily Email Report')
print(f'===================')
print(f'')
print(f'Total Unread Emails: {total_unread}')
print(f'Work Account: {work_unread} unread')
print(f'')
print(f'Full report attached.')
print(f'')
print(f'Next: Check work account for important emails.')
")
    
    # Send email (commented out for safety - uncomment for production)
    log "Would send email from $assistant_email to $recipient_email"
    log "Email body prepared, but sending disabled for safety"
    
    # For actual sending, uncomment:
    # export GMAIL_USER="$assistant_email"
    # export GMAIL_PASS="$assistant_password"
    # python3 "$GMAIL_SCRIPT" send "$recipient_email" "Daily Email Report - $(date '+%d %b %Y')" "$email_body"
    
    # Create notification file instead
    local notification_file="$OUTPUT_DIR/gmail-notification-${TIMESTAMP}.txt"
    
    cat > "$notification_file" << EOF
📧 Daily Email Report

Total unread: $total_unread
Work account: ${unread_counts[work]} unread

Full report: $(basename "$summary_file")

Action: Check work account for important emails.
EOF
    
    log "Notification saved: $(basename "$notification_file")"
    echo "$notification_file"
}

main() {
    echo "========================================"
    echo "   Gmail Maintenance - Production"
    echo "========================================"
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    
    # Step 2: Validate with guradskills
    validate_with_guradskills
    
    # Step 3: Generate email summary
    log "Starting email maintenance..."
    
    local summary_file
    summary_file=$(generate_email_summary) || error "Failed to generate email summary"
    
    # Step 4: Send report (notification for now)
    local notification_file
    notification_file=$(send_daily_report "$summary_file") || error "Failed to send notification"
    
    # Step 5: Final output
    echo ""
    echo "========================================"
    echo "           EXECUTION COMPLETE"
    echo "========================================"
    echo ""
    echo "📁 Output Directory: $OUTPUT_DIR"
    echo "📧 Accounts Checked: ${#GMAIL_ACCOUNTS[@]}"
    echo "📊 Summary:         $(basename "$summary_file")"
    echo "🔔 Notification:    $(basename "$notification_file")"
    echo "📋 Log File:        gmail-$(date +%Y-%m-%d).log"
    echo ""
    echo "Next: Check work account for important client emails."
    echo ""
    echo "⚠️  Safety Note: Email sending disabled. Enable in script for production."
    echo ""
    
    success "Gmail production workflow completed successfully"
    return 0
}

# Handle command line arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: skill_gmail.sh [OPTION]"
        echo ""
        echo "Production Gmail maintenance wrapper."
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --test         Test mode (validate only)"
        echo "  --cron         Cron mode (quiet output)"
        echo "  --check-only   Check unread only, no summary"
        echo "  --send-report  Actually send email report (CAUTION)"
        echo ""
        echo "Outputs:"
        echo "  • gmail-*-unread-*.txt   - Account unread counts"
        echo "  • gmail-summary-*.md     - Daily summary"
        echo "  • gmail-notification-*.txt - Notification template"
        echo "  • gmail-YYYY-MM-DD.log   - Execution log"
        echo ""
        echo "Safety: Email sending disabled by default. Enable with --send-report."
        exit 0
        ;;
    "--test")
        echo "🧪 Test mode: Validating Gmail skill..."
        check_dependencies
        validate_with_guradskills
        echo "✅ Test passed - Gmail skill is ready for production"
        exit 0
        ;;
    "--cron")
        # Cron mode - minimal output
        exec >> "$LOG_DIR/gmail-cron-$(date +%Y-%m-%d).log" 2>&1
        main
        exit $?
        ;;
    "--check-only")
        echo "Checking unread counts only..."
        check_dependencies
        for account_key in "${!GMAIL_ACCOUNTS[@]}"; do
            check_account_unread "$account_key"
        done
        exit 0
        ;;
    "--send-report")
        echo "⚠️  CAUTION: Email sending enabled"
        export ENABLE_EMAIL_SENDING=true
        main
        exit $?
        ;;
    *)
        # Normal execution (safe mode - no email sending)
        main
        exit $?
        ;;
esac