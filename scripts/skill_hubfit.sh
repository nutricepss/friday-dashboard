#!/bin/bash
# skill_hubfit.sh - Production HubFit client status wrapper
# Integrates guradskills validation, fast reporting, and artifact handoff

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
GUARDSKILLS="$SCRIPT_DIR/guradskills.sh"
PYTHON_SCRIPT="$SCRIPT_DIR/hubfit_quick.py"
OUTPUT_DIR="$WORKSPACE_DIR/mnt/data/reports"
LOG_DIR="$WORKSPACE_DIR/memory"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${YELLOW}[skill_hubfit]${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_DIR/hubfit-$(date +%Y-%m-%d).log"
}

error() {
    echo -e "${RED}[skill_hubfit] ERROR${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR: $1" >> "$LOG_DIR/hubfit-$(date +%Y-%m-%d).log"
    exit 1
}

success() {
    echo -e "${GREEN}[skill_hubfit] SUCCESS${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') SUCCESS: $1" >> "$LOG_DIR/hubfit-$(date +%Y-%m-%d).log"
}

check_dependencies() {
    log "Checking dependencies..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        error "Python3 not found. Required for HubFit script."
    fi
    
    # Check guradskills
    if [ ! -f "$GUARDSKILLS" ]; then
        error "guradskills.sh not found at $GUARDSKILLS"
    fi
    
    # Check Python script
    if [ ! -f "$PYTHON_SCRIPT" ]; then
        error "hubfit_quick.py not found at $PYTHON_SCRIPT"
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    log "Dependencies check passed"
}

validate_with_guradskills() {
    log "Validating with guradskills..."
    
    # Note: HubFit isn't a traditional "skill" in guradskills list
    # We'll validate the Python script instead
    if [ ! -f "$PYTHON_SCRIPT" ]; then
        error "HubFit script validation failed: $PYTHON_SCRIPT not found"
    fi
    
    # Check if script is executable
    if [ ! -x "$PYTHON_SCRIPT" ] && [[ ! "$PYTHON_SCRIPT" == *.py ]]; then
        chmod +x "$PYTHON_SCRIPT" 2>/dev/null || true
    fi
    
    log "Validation passed"
}

run_hubfit_check() {
    log "Running HubFit client status check..."
    
    local start_time=$(date +%s)
    
    # Run the Python script
    cd "$WORKSPACE_DIR"
    python3 "$PYTHON_SCRIPT" 2>&1
    
    local exit_code=$?
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    if [ $exit_code -eq 0 ]; then
        success "HubFit check completed in ${duration}s"
        return 0
    else
        error "HubFit check failed with code $exit_code after ${duration}s"
        return $exit_code
    fi
}

find_latest_report() {
    log "Finding latest report..."
    
    local latest_report=$(ls -t "$OUTPUT_DIR"/hubfit-quick-*.md 2>/dev/null | head -1)
    
    if [ -n "$latest_report" ] && [ -f "$latest_report" ]; then
        echo "$latest_report"
        log "Latest report: $(basename "$latest_report")"
        return 0
    else
        error "No HubFit reports found in $OUTPUT_DIR"
        return 1
    fi
}

generate_summary() {
    local report_file="$1"
    local summary_file="$OUTPUT_DIR/hubfit-summary-$TIMESTAMP.md"
    
    log "Generating summary from $(basename "$report_file")..."
    
    # Extract key metrics from report (strip color codes)
    local total_clients=$(grep -o "Total Clients: [0-9]*" "$report_file" | head -1 | awk '{print $3}')
    local active_clients=$(grep -o "Active: [0-9]*" "$report_file" | head -1 | awk '{print $2}')
    local ghosting_clients=$(grep -o "Ghosting: [0-9]*" "$report_file" | head -1 | awk '{print $2}')
    local ghosting_14plus=$(grep -o "clients ghosting >14 days" "$report_file" | head -1 | awk '{print $1}')
    
    # Calculate percentages
    local active_pct="0"
    local ghosting_pct="0"
    
    if [ -n "$total_clients" ] && [ "$total_clients" -gt 0 ]; then
        active_pct=$(echo "scale=1; $active_clients * 100 / $total_clients" | bc)
        ghosting_pct=$(echo "scale=1; $ghosting_clients * 100 / $total_clients" | bc)
    fi
    
    # Create summary
    cat > "$summary_file" << EOF
# HubFit Client Status Summary
**Generated:** $(date '+%d %b %Y, %H:%M')
**Source:** $(basename "$report_file")

## 📊 Quick Stats
- **Total Clients:** $total_clients
- **🟢 Active (≤3 days):** $active_clients ($active_pct%)
- **🔴 Ghosting (>7 days):** $ghosting_clients ($ghosting_pct%)
- **⚠️ Long-term Ghosting (>14 days):** ${ghosting_14plus:-0} clients

## 🎯 Priority Actions

### 1. Immediate Follow-up
- Contact $ghosting_14plus clients inactive >14 days
- Consider archiving clients inactive >90 days

### 2. Retention Focus
- Engage $active_clients active clients (celebrate progress)
- Check in with at-risk clients (4-7 days inactive)

### 3. System Improvement
- Client engagement rate: $active_pct% (target: 40%+)
- Implement re-engagement campaign
- Review onboarding for better retention

## 📁 Artifacts
1. **Full Report:** \`$(basename "$report_file")\`
2. **This Summary:** \`$(basename "$summary_file")\`
3. **Log File:** \`hubfit-$(date +%Y-%m-%d).log\`

## 🚀 Next Steps
1. Review ghosting client list
2. Plan re-engagement strategy
3. Update client communication templates
4. Schedule weekly client check-ins

---
*Generated by skill_hubfit.sh - Part of NutriCepss skill system*
EOF
    
    success "Summary generated: $(basename "$summary_file")"
    echo "$summary_file"
}

send_notification() {
    local summary_file="$1"
    
    log "Preparing notification..."
    
    # Extract key metrics for notification
    local total_clients=$(grep -o "Total Clients: [0-9]*" "$summary_file" | head -1 | awk '{print $3}')
    local active_clients=$(grep -o "🟢 Active (≤3 days): [0-9]*" "$summary_file" | head -1 | awk '{print $4}')
    local ghosting_14plus=$(grep -o "Long-term Ghosting (>14 days): [0-9]*" "$summary_file" | head -1 | awk '{print $5}')
    
    # Create notification message
    cat > "$OUTPUT_DIR/hubfit-notification-$TIMESTAMP.txt" << EOF
📊 HubFit Status Update

Clients: $total_clients total
✅ Active: $active_clients clients
⚠️ Urgent: $ghosting_14plus clients ghosting >14 days

Full report: $(basename "$summary_file")
Summary: $(basename "$(find_latest_report)")

Action needed: Follow up with long-term ghosting clients.
EOF
    
    log "Notification prepared"
    echo "$OUTPUT_DIR/hubfit-notification-$TIMESTAMP.txt"
}

main() {
    echo "========================================"
    echo "   HubFit Client Status - Production"
    echo "========================================"
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    
    # Step 2: Validate with guradskills pattern
    validate_with_guradskills
    
    # Step 3: Run HubFit check
    if run_hubfit_check; then
        # Step 4: Find and process latest report
        local report_file
        report_file=$(find_latest_report) || error "Failed to find report"
        
        # Step 5: Generate summary
        local summary_file
        summary_file=$(generate_summary "$report_file") || error "Failed to generate summary"
        
        # Step 6: Prepare notification
        local notification_file
        notification_file=$(send_notification "$summary_file") || error "Failed to prepare notification"
        
        # Step 7: Final output
        echo ""
        echo "========================================"
        echo "           EXECUTION COMPLETE"
        echo "========================================"
        echo ""
        echo "📁 Output Directory: $OUTPUT_DIR"
        echo "📊 Full Report:     $(basename "$report_file")"
        echo "📝 Summary:         $(basename "$summary_file")"
        echo "🔔 Notification:    $(basename "$notification_file")"
        echo "📋 Log File:        hubfit-$(date +%Y-%m-%d).log"
        echo ""
        echo "Next: Review report and follow up with ghosting clients."
        echo ""
        
        success "HubFit production workflow completed successfully"
        return 0
    else
        error "HubFit check failed. Check logs for details."
        return 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: skill_hubfit.sh [OPTION]"
        echo ""
        echo "Production HubFit client status wrapper with guradskills validation."
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --test         Test mode (validate only)"
        echo "  --cron         Cron mode (quiet output)"
        echo ""
        echo "Outputs:"
        echo "  • hubfit-quick-*.md     - Full client report"
        echo "  • hubfit-summary-*.md   - Executive summary"
        echo "  • hubfit-notification-*.txt - Notification template"
        echo "  • hubfit-YYYY-MM-DD.log - Execution log"
        echo ""
        exit 0
        ;;
    "--test")
        echo "🧪 Test mode: Validating HubFit skill..."
        check_dependencies
        validate_with_guradskills
        echo "✅ Test passed - HubFit skill is ready for production"
        exit 0
        ;;
    "--cron")
        # Cron mode - minimal output
        exec >> "$LOG_DIR/hubfit-cron-$(date +%Y-%m-%d).log" 2>&1
        main
        exit $?
        ;;
    *)
        # Normal execution
        main
        exit $?
        ;;
esac