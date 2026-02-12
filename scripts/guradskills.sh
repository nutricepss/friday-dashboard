#!/bin/bash
# guradskills - Skill Usage Guard & Validator
# Validates skill usage against security policies and operational guidelines

set -e

# Configuration
SKILLS_DIR="/home/assistant4himanshu/.openclaw/workspace/skills"
LOGFILE="/home/assistant4himanshu/.openclaw/workspace/memory/skill-usage-$(date +%Y-%m-%d).log"
ALLOWED_SKILLS=("gmail-client" "reddit-readonly" "instagram" "gcalcli-calendar" "seo" "shopify-admin-api")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOGFILE"
    echo -e "${YELLOW}[guradskills]${NC} $1"
}

validate_skill() {
    local skill_name="$1"
    local skill_path="$SKILLS_DIR/$skill_name"
    
    # Check if skill exists
    if [ ! -d "$skill_path" ]; then
        log_message "${RED}ERROR: Skill '$skill_name' not found in $SKILLS_DIR${NC}"
        return 1
    fi
    
    # Check if skill is in allowed list
    local allowed=0
    for allowed_skill in "${ALLOWED_SKILLS[@]}"; do
        if [ "$skill_name" = "$allowed_skill" ]; then
            allowed=1
            break
        fi
    done
    
    if [ $allowed -eq 0 ]; then
        log_message "${RED}ERROR: Skill '$skill_name' is not in allowed skills list${NC}"
        echo "Allowed skills: ${ALLOWED_SKILLS[*]}"
        return 1
    fi
    
    # Check for SKILL.md
    if [ ! -f "$skill_path/SKILL.md" ]; then
        log_message "${YELLOW}WARNING: Skill '$skill_name' missing SKILL.md manifest${NC}"
    else
        # Check if SKILL.md follows new format (has "When to Use" section)
        if ! grep -q "When to Use" "$skill_path/SKILL.md"; then
            log_message "${YELLOW}WARNING: Skill '$skill_name' SKILL.md needs update (missing 'When to Use' section)${NC}"
        fi
    fi
    
    # Check for scripts directory
    if [ ! -d "$skill_path/scripts" ]; then
        log_message "${YELLOW}WARNING: Skill '$skill_name' missing scripts directory${NC}"
    fi
    
    return 0
}

check_network_access() {
    local skill_name="$1"
    
    # Skills that require network access
    local network_skills=("gmail-client" "reddit-readonly" "instagram" "shopify-admin-api")
    
    for net_skill in "${network_skills[@]}"; do
        if [ "$skill_name" = "$net_skill" ]; then
            log_message "${YELLOW}INFO: Skill '$skill_name' requires network access - ensure allowlists are configured${NC}"
            
            # Check if we're in a secure context
            if [ -n "$RESTRICTED_NETWORK" ]; then
                log_message "${RED}ERROR: Network access restricted but skill '$skill_name' requires it${NC}"
                return 1
            fi
            break
        fi
    done
    
    return 0
}

check_credentials() {
    local skill_name="$1"
    
    # Skills that use credentials
    case "$skill_name" in
        "gmail-client")
            local creds_file="/home/assistant4himanshu/.openclaw/credentials/gmail-app-passwords.json"
            if [ ! -f "$creds_file" ]; then
                log_message "${RED}ERROR: Missing credentials file: $creds_file${NC}"
                return 1
            fi
            ;;
        "instagram")
            local creds_file="/home/assistant4himanshu/.openclaw/credentials/instagram-token.json"
            if [ ! -f "$creds_file" ]; then
                log_message "${RED}ERROR: Missing credentials file: $creds_file${NC}"
                return 1
            fi
            ;;
        "shopify-admin-api")
            local creds_file="/home/assistant4himanshu/.openclaw/credentials/shopify-token.json"
            if [ ! -f "$creds_file" ]; then
                log_message "${YELLOW}WARNING: Shopify token file not found (may need setup)${NC}"
            fi
            ;;
    esac
    
    return 0
}

usage() {
    echo "Usage: guradskills <skill-name> [--check-only]"
    echo ""
    echo "Validates skill usage against security policies and operational guidelines."
    echo ""
    echo "Options:"
    echo "  --check-only    Only validate, don't proceed with skill execution"
    echo "  --list          List all available skills"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  guradskills gmail-client"
    echo "  guradskills reddit-readonly --check-only"
    echo "  guradskills --list"
}

list_skills() {
    echo "Available skills:"
    echo "================="
    for skill in "${ALLOWED_SKILLS[@]}"; do
        local skill_path="$SKILLS_DIR/$skill"
        if [ -d "$skill_path" ]; then
            if [ -f "$skill_path/SKILL.md" ]; then
                # Extract description from frontmatter
                local desc=$(grep -i "description:" "$skill_path/SKILL.md" | head -1 | cut -d: -f2- | sed 's/^ *//')
                echo "  • $skill: ${desc:-No description}"
            else
                echo "  • $skill: (missing SKILL.md)"
            fi
        else
            echo "  • $skill: (not installed)"
        fi
    done
}

# Main execution
main() {
    if [ $# -eq 0 ]; then
        usage
        exit 1
    fi
    
    case "$1" in
        "--help"|"-h")
            usage
            exit 0
            ;;
        "--list"|"-l")
            list_skills
            exit 0
            ;;
        *)
            SKILL_NAME="$1"
            shift
            
            CHECK_ONLY=0
            while [ $# -gt 0 ]; do
                case "$1" in
                    "--check-only")
                        CHECK_ONLY=1
                        shift
                        ;;
                    *)
                        echo "Unknown option: $1"
                        usage
                        exit 1
                        ;;
                esac
            done
            
            log_message "Validating skill: $SKILL_NAME"
            
            # Run validations
            if ! validate_skill "$SKILL_NAME"; then
                exit 1
            fi
            
            if ! check_network_access "$SKILL_NAME"; then
                exit 1
            fi
            
            if ! check_credentials "$SKILL_NAME"; then
                exit 1
            fi
            
            log_message "${GREEN}Skill '$SKILL_NAME' validation passed${NC}"
            
            if [ $CHECK_ONLY -eq 1 ]; then
                log_message "Check-only mode: Validation complete, not executing skill"
                exit 0
            fi
            
            # If we get here, skill is valid
            log_message "Proceeding with skill execution..."
            echo "VALIDATED: $SKILL_NAME"
            ;;
    esac
}

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOGFILE")"

# Run main function
main "$@"