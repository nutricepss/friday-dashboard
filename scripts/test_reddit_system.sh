#!/bin/bash
# Test the new skill system with reddit-readonly

set -e

echo "🧪 TESTING NEW SKILL SYSTEM"
echo "============================"

# Configuration
WORKSPACE_DIR="/home/assistant4himanshu/.openclaw/workspace"
GUARDSKILLS="$WORKSPACE_DIR/scripts/guradskills.sh"
OUTPUT_DIR="$WORKSPACE_DIR/mnt/data/artifacts"
LOG_FILE="$WORKSPACE_DIR/memory/skill-test-$(date +%Y-%m-%d-%H%M).log"

# Create output directory
mkdir -p "$OUTPUT_DIR"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting reddit-readonly system test..."

# Step 1: Validate skill with guradskills
log "Step 1: Validating reddit-readonly skill..."
if ! "$GUARDSKILLS" reddit-readonly; then
    log "❌ Skill validation failed"
    exit 1
fi
log "✅ Skill validation passed"

# Step 2: Execute reddit check (following skill workflow)
log "Step 2: Executing reddit check..."
cd "$WORKSPACE_DIR"

# Check r/Fitness_India (new posts, last 2 hours)
log "Checking r/Fitness_India..."
FITNESS_OUTPUT="$OUTPUT_DIR/reddit-fitness-india-$(date +%Y%m%d-%H%M%S).json"
node skills/reddit-readonly/scripts/reddit-readonly.mjs posts Fitness_India --sort new --limit 5 > "$FITNESS_OUTPUT"

if [ $? -eq 0 ]; then
    # Use Python to parse JSON instead of jq
    FITNESS_COUNT=$(python3 -c "
import json, sys
try:
    with open('$FITNESS_OUTPUT') as f:
        data = json.load(f)
        if data.get('ok'):
            posts = data.get('data', {}).get('posts', [])
            print(len(posts))
        else:
            print('0')
except:
    print('0')
")
    log "✅ r/Fitness_India: Found $FITNESS_COUNT posts"
else
    log "❌ r/Fitness_India check failed"
    exit 1
fi

# Check r/Indianfitness (new posts, last 2 hours)
log "Checking r/Indianfitness..."
INDIAN_OUTPUT="$OUTPUT_DIR/reddit-indianfitness-$(date +%Y%m%d-%H%M%S).json"
node skills/reddit-readonly/scripts/reddit-readonly.mjs posts Indianfitness --sort new --limit 5 > "$INDIAN_OUTPUT"

if [ $? -eq 0 ]; then
    # Use Python to parse JSON instead of jq
    INDIAN_COUNT=$(python3 -c "
import json, sys
try:
    with open('$INDIAN_OUTPUT') as f:
        data = json.load(f)
        if data.get('ok'):
            posts = data.get('data', {}).get('posts', [])
            print(len(posts))
        else:
            print('0')
except:
    print('0')
")
    log "✅ r/Indianfitness: Found $INDIAN_COUNT posts"
else
    log "❌ r/Indianfitness check failed"
    exit 1
fi

# Step 3: Create summary report
log "Step 3: Creating summary report..."
SUMMARY_FILE="$OUTPUT_DIR/reddit-summary-$(date +%Y%m%d-%H%M%S).md"

cat > "$SUMMARY_FILE" << EOF
# Reddit Engagement Test Report
**Generated:** $(date '+%d %b %Y, %H:%M')
**System:** New skill system test

## Summary
- r/Fitness_India: $FITNESS_COUNT new posts
- r/Indianfitness: $INDIAN_COUNT new posts
- Total posts scanned: $((FITNESS_COUNT + INDIAN_COUNT))

## Artifacts Generated
1. \`$(basename "$FITNESS_OUTPUT")\` - r/Fitness_India posts
2. \`$(basename "$INDIAN_OUTPUT")\` - r/Indianfitness posts  
3. \`$(basename "$SUMMARY_FILE")\` - This summary

## Skill System Validation
✅ guradskills validation passed
✅ Skill execution successful
✅ Output saved to /mnt/data/artifacts/
✅ Audit log created: \`$(basename "$LOG_FILE")\`

## Next Steps
1. Review posts for engagement opportunities
2. Draft replies for promising posts
3. Schedule regular monitoring
EOF

log "✅ Summary report created: $SUMMARY_FILE"

# Step 4: Log completion
log "Step 4: System test completed successfully!"
log "=========================================="
log "Total posts found: $((FITNESS_COUNT + INDIAN_COUNT))"
log "Output directory: $OUTPUT_DIR"
log "Log file: $LOG_FILE"
log "=========================================="

echo ""
echo "🎉 TEST COMPLETED SUCCESSFULLY!"
echo "📊 Found $((FITNESS_COUNT + INDIAN_COUNT)) total posts"
echo "📁 Outputs saved to: $OUTPUT_DIR"
echo "📝 Summary: $SUMMARY_FILE"