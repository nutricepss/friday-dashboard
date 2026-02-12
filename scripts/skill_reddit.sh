#!/bin/bash
# skill_reddit.sh - Production Reddit engagement monitoring wrapper
# Monitors r/Fitness_India and r/Indianfitness for engagement opportunities

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
GUARDSKILLS="$SCRIPT_DIR/guradskills.sh"
REDDIT_SCRIPT="$WORKSPACE_DIR/skills/reddit-readonly/scripts/reddit-readonly.mjs"
OUTPUT_DIR="$WORKSPACE_DIR/mnt/data/artifacts"
LOG_DIR="$WORKSPACE_DIR/memory"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${YELLOW}[skill_reddit]${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_DIR/reddit-$(date +%Y-%m-%d).log"
}

error() {
    echo -e "${RED}[skill_reddit] ERROR${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR: $1" >> "$LOG_DIR/reddit-$(date +%Y-%m-%d).log"
    exit 1
}

success() {
    echo -e "${GREEN}[skill_reddit] SUCCESS${NC} $(date '+%H:%M:%S') $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') SUCCESS: $1" >> "$LOG_DIR/reddit-$(date +%Y-%m-%d).log"
}

check_dependencies() {
    log "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js not found. Required for Reddit script."
    fi
    
    # Check guradskills
    if [ ! -f "$GUARDSKILLS" ]; then
        error "guradskills.sh not found at $GUARDSKILLS"
    fi
    
    # Check Reddit script
    if [ ! -f "$REDDIT_SCRIPT" ]; then
        error "reddit-readonly.mjs not found at $REDDIT_SCRIPT"
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    log "Dependencies check passed"
}

validate_with_guradskills() {
    log "Validating reddit-readonly skill..."
    
    if ! "$GUARDSKILLS" reddit-readonly --check-only; then
        error "guradskills validation failed for reddit-readonly"
    fi
    
    log "Skill validation passed"
}

check_subreddit() {
    local subreddit="$1"
    local limit="${2:-10}"
    local output_file="$OUTPUT_DIR/reddit-${subreddit}-${TIMESTAMP}.json"
    
    log "Checking r/${subreddit} (limit: $limit)..."
    
    cd "$WORKSPACE_DIR"
    node "$REDDIT_SCRIPT" posts "$subreddit" --sort new --limit "$limit" > "$output_file" 2>&1
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        # Check if we got valid JSON
        if python3 -c "import json, sys; json.load(open('$output_file'))" 2>/dev/null; then
            local post_count=$(python3 -c "
import json, sys
try:
    with open('$output_file') as f:
        data = json.load(f)
        if data.get('ok'):
            posts = data.get('data', {}).get('posts', [])
            print(len(posts))
        else:
            print('0')
except:
    print('0')
")
            log "r/${subreddit}: Found $post_count posts"
            echo "$post_count"
            return 0
        else
            log "r/${subreddit}: Invalid JSON response"
            echo "0"
            return 1
        fi
    else
        log "r/${subreddit}: Script failed with code $exit_code"
        echo "0"
        return 1
    fi
}

analyze_posts() {
    local fitness_file="$1"
    local indian_file="$2"
    local analysis_file="$OUTPUT_DIR/reddit-analysis-${TIMESTAMP}.md"
    
    log "Analyzing posts for engagement opportunities..."
    
    # Use Python for analysis
    python3 -c "
import json, sys
from datetime import datetime, timezone

def analyze_file(filename, subreddit):
    try:
        with open(filename) as f:
            data = json.load(f)
            if not data.get('ok'):
                return []
            
            posts = data.get('data', {}).get('posts', [])
            opportunities = []
            
            for post in posts:
                title = post.get('title', '')
                author = post.get('author', 'Unknown')
                score = post.get('score', 0)
                num_comments = post.get('num_comments', 0)
                created_utc = post.get('created_utc', 0)
                permalink = post.get('permalink', '')
                flair = post.get('flair', '')
                
                # Calculate hours since post
                if created_utc:
                    hours_ago = (datetime.now(timezone.utc).timestamp() - created_utc) / 3600
                else:
                    hours_ago = 999
                
                # Engagement score (simple heuristic)
                engagement_score = score + (num_comments * 2)
                
                # Identify opportunity type
                opportunity_type = 'general'
                if 'coach' in title.lower() or 'help' in title.lower() or 'guidance' in title.lower():
                    opportunity_type = 'coaching_lead'
                elif 'supplement' in title.lower() or 'protein' in title.lower():
                    opportunity_type = 'supplement_question'
                elif 'form' in title.lower() or 'check' in title.lower():
                    opportunity_type = 'form_check'
                elif 'diet' in title.lower() or 'nutrition' in title.lower():
                    opportunity_type = 'nutrition_advice'
                elif 'beginner' in title.lower() or 'start' in title.lower():
                    opportunity_type = 'beginner_guidance'
                
                opportunities.append({
                    'subreddit': subreddit,
                    'title': title[:100],
                    'author': author,
                    'score': score,
                    'comments': num_comments,
                    'hours_ago': round(hours_ago, 1),
                    'permalink': permalink,
                    'flair': flair,
                    'engagement_score': engagement_score,
                    'type': opportunity_type
                })
            
            return opportunities
    except Exception as e:
        print(f'Error analyzing {filename}: {e}', file=sys.stderr)
        return []

# Analyze both files
fitness_opps = analyze_file('$fitness_file', 'Fitness_India')
indian_opps = analyze_file('$indian_file', 'Indianfitness')
all_opps = fitness_opps + indian_opps

# Sort by engagement score (descending)
all_opps.sort(key=lambda x: x['engagement_score'], reverse=True)

# Write analysis
with open('$analysis_file', 'w') as f:
    f.write('# Reddit Engagement Analysis\\n')
    f.write(f'**Generated:** {datetime.now().strftime(\"%d %b %Y, %H:%M\")}\\n\\n')
    
    f.write('## 📊 Summary\\n')
    f.write(f'- r/Fitness_India: {len(fitness_opps)} posts analyzed\\n')
    f.write(f'- r/Indianfitness: {len(indian_opps)} posts analyzed\\n')
    f.write(f'- Total opportunities: {len(all_opps)}\\n\\n')
    
    if all_opps:
        f.write('## 🎯 Top Engagement Opportunities\\n\\n')
        for i, opp in enumerate(all_opps[:5]):
            f.write(f'### {i+1}. {opp[\"title\"]}...\\n')
            f.write(f'- **Subreddit:** r/{opp[\"subreddit\"]}\\n')
            f.write(f'- **Author:** u/{opp[\"author\"]}\\n')
            f.write(f'- **Score:** {opp[\"score\"]} ⬆️ | **Comments:** {opp[\"comments\"]} 💬\\n')
            f.write(f'- **Posted:** {opp[\"hours_ago\"]} hours ago\\n')
            f.write(f'- **Type:** {opp[\"type\"].replace(\"_\", \" \").title()}\\n')
            f.write(f'- **Link:** {opp[\"permalink\"]}\\n\\n')
        
        f.write('## 🚀 Recommended Actions\\n\\n')
        
        # Count by type
        type_counts = {}
        for opp in all_opps:
            type_counts[opp['type']] = type_counts.get(opp['type'], 0) + 1
        
        for opp_type, count in type_counts.items():
            human_type = opp_type.replace('_', ' ').title()
            f.write(f'1. **{human_type}** ({count} posts)\\n')
        
        f.write('\\n### Priority Order:\\n')
        f.write('1. Coaching leads (direct business opportunity)\\n')
        f.write('2. Beginner guidance (building authority)\\n')
        f.write('3. Supplement questions (expert positioning)\\n')
        f.write('4. Nutrition advice (value sharing)\\n')
        f.write('5. Form checks (community help)\\n')
    else:
        f.write('## ❌ No Engagement Opportunities Found\\n')
        f.write('No suitable posts found in the last check.\\n')
    
    f.write('\\n---\\n')
    f.write('*Generated by skill_reddit.sh - Part of NutriCepss skill system*')
" || error "Failed to analyze posts"
    
    success "Analysis generated: $(basename "$analysis_file")"
    echo "$analysis_file"
}

generate_notification() {
    local analysis_file="$1"
    local fitness_count="$2"
    local indian_count="$3"
    local notification_file="$OUTPUT_DIR/reddit-notification-${TIMESTAMP}.txt"
    
    log "Generating notification..."
    
    # Extract top opportunities from analysis
    local top_opportunities=$(python3 -c "
import json, re
try:
    with open('$analysis_file') as f:
        content = f.read()
        
    # Extract top opportunities section
    import re
    opportunities_section = re.search(r'## 🎯 Top Engagement Opportunities(.*?)(?=## 🚀|## ❌|$)', content, re.DOTALL)
    
    if opportunities_section:
        opp_text = opportunities_section.group(1)
        # Count lines that start with ### (headings)
        opp_count = len(re.findall(r'### \d+\.', opp_text))
        print(f'{opp_count} opportunities found')
    else:
        print('No opportunities section found')
except Exception as e:
    print(f'Error: {e}')
")
    
    cat > "$notification_file" << EOF
🔴 Reddit Engagement Update

r/Fitness_India: $fitness_count new posts
r/Indianfitness: $indian_count new posts
🎯 $top_opportunities

Check analysis: $(basename "$analysis_file")

Action: Review opportunities and engage where valuable.
EOF
    
    log "Notification generated: $(basename "$notification_file")"
    echo "$notification_file"
}

main() {
    echo "========================================"
    echo "   Reddit Engagement - Production"
    echo "========================================"
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    
    # Step 2: Validate with guradskills
    validate_with_guradskills
    
    # Step 3: Check both subreddits
    log "Starting Reddit monitoring..."
    
    local fitness_output="$OUTPUT_DIR/reddit-Fitness_India-${TIMESTAMP}.json"
    local indian_output="$OUTPUT_DIR/reddit-Indianfitness-${TIMESTAMP}.json"
    
    local fitness_count
    local indian_count
    
    fitness_count=$(check_subreddit "Fitness_India" 10) || fitness_count=0
    indian_count=$(check_subreddit "Indianfitness" 10) || indian_count=0
    
    # Step 4: Analyze posts
    local analysis_file
    analysis_file=$(analyze_posts "$OUTPUT_DIR/reddit-Fitness_India-${TIMESTAMP}.json" \
                                  "$OUTPUT_DIR/reddit-Indianfitness-${TIMESTAMP}.json") || \
                    error "Failed to analyze posts"
    
    # Step 5: Generate notification
    local notification_file
    notification_file=$(generate_notification "$analysis_file" "$fitness_count" "$indian_count") || \
                       error "Failed to generate notification"
    
    # Step 6: Final output
    echo ""
    echo "========================================"
    echo "           EXECUTION COMPLETE"
    echo "========================================"
    echo ""
    echo "📁 Output Directory: $OUTPUT_DIR"
    echo "🇮🇳 r/Fitness_India: $fitness_count posts"
    echo "🇮🇳 r/Indianfitness: $indian_count posts"
    echo "📊 Analysis:        $(basename "$analysis_file")"
    echo "🔔 Notification:    $(basename "$notification_file")"
    echo "📋 Log File:        reddit-$(date +%Y-%m-%d).log"
    echo ""
    echo "Next: Review analysis and engage with top opportunities."
    echo ""
    
    success "Reddit production workflow completed successfully"
    return 0
}

# Handle command line arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: skill_reddit.sh [OPTION]"
        echo ""
        echo "Production Reddit engagement monitoring wrapper."
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --test         Test mode (validate only)"
        echo "  --cron         Cron mode (quiet output)"
        echo "  --quick        Quick check (5 posts each)"
        echo "  --full         Full analysis (10 posts each)"
        echo ""
        echo "Outputs:"
        echo "  • reddit-*-TIMESTAMP.json   - Raw post data"
        echo "  • reddit-analysis-*.md      - Engagement analysis"
        echo "  • reddit-notification-*.txt - Notification template"
        echo "  • reddit-YYYY-MM-DD.log     - Execution log"
        echo ""
        exit 0
        ;;
    "--test")
        echo "🧪 Test mode: Validating Reddit skill..."
        check_dependencies
        validate_with_guradskills
        echo "✅ Test passed - Reddit skill is ready for production"
        exit 0
        ;;
    "--cron")
        # Cron mode - minimal output
        exec >> "$LOG_DIR/reddit-cron-$(date +%Y-%m-%d).log" 2>&1
        main
        exit $?
        ;;
    "--quick")
        # Quick mode with fewer posts
        export QUICK_MODE=true
        main
        exit $?
        ;;
    "--full")
        # Full mode (default)
        main
        exit $?
        ;;
    *)
        # Normal execution (full mode)
        main
        exit $?
        ;;
esac