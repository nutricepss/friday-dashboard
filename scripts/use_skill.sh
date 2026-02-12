#!/bin/bash
# use_skill - Execute a skill with guradskills validation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
GUARDSKILLS="$SCRIPT_DIR/guradskills.sh"

# Check if guradskills exists
if [ ! -f "$GUARDSKILLS" ]; then
    echo "ERROR: guradskills.sh not found at $GUARDSKILLS"
    exit 1
fi

if [ $# -lt 1 ]; then
    echo "Usage: use_skill <skill-name> [skill-args...]"
    echo ""
    echo "Examples:"
    echo "  use_skill gmail-client"
    echo "  use_skill reddit-readonly --check-only"
    exit 1
fi

SKILL_NAME="$1"
shift

# First validate the skill
echo "🔒 Validating skill: $SKILL_NAME"
if ! "$GUARDSKILLS" "$SKILL_NAME"; then
    echo "❌ Skill validation failed. Aborting."
    exit 1
fi

echo "✅ Skill validated successfully"
echo "🚀 Proceeding with skill execution..."

# Based on skill name, execute appropriate command
case "$SKILL_NAME" in
    "gmail-client")
        # This would be replaced with actual gmail-client execution
        echo "Executing gmail-client skill..."
        echo "Note: Actual skill execution would happen here"
        ;;
    "reddit-readonly")
        echo "Executing reddit-readonly skill..."
        echo "Note: Actual skill execution would happen here"
        ;;
    "instagram")
        echo "Executing instagram skill..."
        echo "Note: Actual skill execution would happen here"
        ;;
    *)
        echo "⚠️  No execution pattern defined for skill: $SKILL_NAME"
        echo "Skill validated but execution not implemented."
        ;;
esac

echo "🎉 Skill execution completed"