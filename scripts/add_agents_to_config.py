#!/usr/bin/env python3
"""
Add NutriCepss AI Squad agents to OpenClaw config
"""
import json
import os
import sys

CONFIG_PATH = "/home/assistant4himanshu/.openclaw/openclaw.json"

# New AI Squad agents
NEW_AGENTS = [
    {
        "id": "content_writinator",
        "model": {
            "primary": "anthropic/claude-sonnet-4",
            "fallbacks": ["deepseek/deepseek-chat", "google/gemini-2.0-flash"]
        },
        "skills": ["read", "write", "browser", "image", "web_search"]
    },
    {
        "id": "data_detective",
        "model": {
            "primary": "deepseek/deepseek-coder",
            "fallbacks": ["moonshot/kimi-k2.5", "google/gemini-2.0-pro-exp-02-05"]
        },
        "skills": ["web_search", "web_fetch", "browser", "read", "write"]
    },
    {
        "id": "coach_cory",
        "model": {
            "primary": "moonshot/kimi-k2.5",
            "fallbacks": ["anthropic/claude-sonnet-4", "deepseek/deepseek-chat"]
        },
        "skills": ["read", "write", "exec", "message"]
    },
    {
        "id": "seo_steve",
        "model": {
            "primary": "google/gemini-2.0-flash",
            "fallbacks": ["anthropic/claude-sonnet-4", "deepseek/deepseek-chat"]
        },
        "skills": ["read", "write", "browser", "web_search", "web_fetch"]
    },
    {
        "id": "code_ninja",
        "model": {
            "primary": "deepseek/deepseek-coder",
            "fallbacks": ["anthropic/claude-opus-4", "anthropic/claude-sonnet-4", "moonshot/kimi-k2.5"]
        },
        "skills": ["exec", "read", "write", "edit", "browser", "web_search"]
    },
    {
        "id": "pr_princess",
        "model": {
            "primary": "anthropic/claude-sonnet-4",
            "fallbacks": ["deepseek/deepseek-chat", "moonshot/kimi-k2.5"]
        },
        "skills": ["read", "write", "browser", "image", "web_search"]
    },
    {
        "id": "friday_manager",
        "model": {
            "primary": "moonshot/kimi-k2.5",
            "fallbacks": ["anthropic/claude-sonnet-4", "deepseek/deepseek-chat", "google/gemini-2.0-flash"]
        },
        "skills": ["read", "write", "message", "cron", "sessions_list", "sessions_history", "sessions_send", "sessions_spawn"]
    }
]

def update_config():
    try:
        with open(CONFIG_PATH, 'r') as f:
            config = json.load(f)
        
        # Get existing agent IDs
        existing_ids = {agent['id'] for agent in config['agents']['list']}
        
        # Add new agents that don't exist
        added = []
        for agent in NEW_AGENTS:
            if agent['id'] not in existing_ids:
                config['agents']['list'].append(agent)
                added.append(agent['id'])
                print(f"✅ Added agent: {agent['id']}")
            else:
                print(f"⚠️  Agent already exists: {agent['id']}")
        
        # Write updated config
        with open(CONFIG_PATH, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"\n🎉 Successfully added {len(added)} new agents!")
        print("\n📋 All spawnable agents:")
        for agent in config['agents']['list']:
            model = agent.get('model', {}).get('primary', 'default')
            print(f"  • {agent['id']} → {model}")
        
        return len(added)
        
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        return 0

if __name__ == "__main__":
    print("🚀 Adding NutriCepss AI Squad agents to OpenClaw config...\n")
    count = update_config()
    
    if count > 0:
        print(f"\n✨ Config updated! Restart OpenClaw gateway to apply changes.")
        print("   Run: openclaw gateway restart")
    sys.exit(0 if count > 0 else 1)