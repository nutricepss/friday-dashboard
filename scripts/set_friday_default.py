#!/usr/bin/env python3
"""
Set Friday Manager as the default agent in OpenClaw config
"""
import json
import os
import sys

CONFIG_PATH = "/home/assistant4himanshu/.openclaw/openclaw.json"

def set_default_agent():
    try:
        with open(CONFIG_PATH, 'r') as f:
            config = json.load(f)
        
        # Add defaultAgent field to agents section
        if 'agents' not in config:
            config['agents'] = {}
        
        # Set friday_manager as default
        config['agents']['defaultAgent'] = 'friday_manager'
        
        # Also update the defaults section to use friday_manager's model
        config['agents']['defaults']['model']['primary'] = 'moonshot/kimi-k2.5'
        config['agents']['defaults']['model']['fallbacks'] = [
            'anthropic/claude-sonnet-4',
            'deepseek/deepseek-chat',
            'google/gemini-2.0-flash'
        ]
        
        # Write updated config
        with open(CONFIG_PATH, 'w') as f:
            json.dump(config, f, indent=2)
        
        print("✅ Friday Manager set as DEFAULT agent!")
        print("   defaultAgent: friday_manager")
        print("   model: moonshot/kimi-k2.5")
        print("\n🔄 Restart OpenClaw gateway to apply:")
        print("   openclaw gateway restart")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    print("🤌 Setting Friday Manager as default agent...\n")
    success = set_default_agent()
    sys.exit(0 if success else 1)