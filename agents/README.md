# 🤌 NUTRICEPSS AI SQUAD - Delegation System

## 🎭 The Team

| Agent | Emoji | Role | Specialty | Model |
|-------|-------|------|-----------|-------|
| **Friday** | 🤌 | Manager/Coordinator | Delegation, oversight | Kimi K2.5 |
| **Content_Writinator** | 📝 | Instagram Creator | Reel scripts, viral content | Claude Sonnet |
| **Data_Detective** | 🔍 | Research Analyst | Reddit/Twitter, leads | Deepseek Coder |
| **Coach_Cory** | 📊 | Client Success | HubFit analysis | Kimi K2.5 |
| **SEO_Steve** | 📈 | Growth Hacker | SEO, trends, keywords | Gemini Flash |
| **Code_Ninja** | 🥷 | Developer | Websites, dashboards, Shopify | Deepseek Coder |
| **PR_Princess** | 👑 | Brand Builder | UGC ads, PR, influencers | Claude Sonnet |

## 🚀 How to Delegate Tasks

### **Method 1: Command Line**
```bash
cd ~/.openclaw/workspace/scripts

# Delegate to an agent
./delegate.sh @content_writinator "Create reel about protein myths" high "6 PM today"

# Check squad status
./delegate.sh status

# View recent squad chat
./delegate.sh chat
```

### **Method 2: Python Spawner**
```bash
python3 agent_spawner.py content_writinator "Find Reddit opportunities" "24h"
```

### **Method 3: @mention in Conversation**
When talking to Friday, just say:
> "@data_detective find 5 hot Reddit posts about fitness"

Friday will delegate automatically!

## 💬 Communication Flow

```
You → Friday 🤌
          ↓
    @mention delegation
          ↓
    ┌─────┼─────┬─────┐
    ↓     ↓     ↓     ↓
  📝    🔍    📊    🥷
  Agent performs task
          ↓
    Reports back to Friday
          ↓
    Friday synthesizes
          ↓
    Reports to You
```

## 📋 Task Status System

- **Backlog** - Not started
- **To Do** - Ready to start
- **In Progress** - Agent working
- **Review** - Ready for Friday review
- **Done** - Complete!

## 🎨 Agent Personalities

**Content_Writinator** 📝
- Hyper-energetic, uses 🔥 emojis
- "Let's make this VIRAL, baby!"

**Data_Detective** 🔍
- Analytical, curious
- "The data never lies..."

**Coach_Cory** 📊
- Firm but caring
- "Your clients need you! 💪"

**SEO_Steve** 📈
- Metrics obsessed
- "CTR is life! 📊"

**Code_Ninja** 🥷
- Cool tech wizard
- "Deploying... SHIP IT! 🚀"

**PR_Princess** 👑
- Glamorous networker
- "Darling, you're about to BLOW UP! 💅"

## 📁 File Structure

```
mnt/data/
├── tasks/           # Active task records
├── deliverables/    # Agent outputs
├── chat_logs/       # Squad conversation
└── reports/         # Compiled reports

agents/
├── squad_config.json       # Team roster
├── friday_manager.config   # Me! 🤌
├── content_writinator.config
├── data_detective.config
├── coach_cory.config
├── seo_steve.config
├── code_ninja.config
└── pr_princess.config
```

## 🔄 Heartbeat Schedules

| Agent | Frequency | When |
|-------|-----------|------|
| Content_Writinator | Daily | 9:00 AM |
| Data_Detective | Every 2 hours | 10 AM - 10 PM |
| Coach_Cory | Twice daily | 4:00 AM, 4:00 PM |
| SEO_Steve | Weekly | Mondays 10 AM |
| Code_Ninja | On-demand | As needed |
| PR_Princess | Weekly | Creative sessions |

## 🎯 Example Workflows

### **Content Creation Workflow**
1. You: "Need Instagram content for tomorrow"
2. Friday: Delegates to @content_writinator
3. Content_Writinator: Creates 3 reel ideas
4. Reports back to Friday
5. Friday: Sends you options
6. You: Pick one
7. Friday: Assigns to @code_ninja for posting

### **Lead Generation Workflow**
1. Data_Detective (auto): Finds Reddit leads
2. Reports hot leads to Friday
3. Friday: Alerts you on Telegram
4. You: Review leads
5. Friday: Drafts replies via @content_writinator
6. You: Approve and send

### **Client Retention Workflow**
1. Coach_Cory (auto): Analyzes HubFit data
2. Flags 26 ghosting clients
3. Friday: Creates urgency alert
4. You: Review list
5. Friday: Delegates re-engagement campaign to @pr_princess
6. PR_Princess: Drafts outreach sequence

## 🎮 Future Features (Phase 3+)

- [ ] Kanban board UI
- [ ] 8-bit avatars for agents
- [ ] Agent group chat (Discord/Telegram)
- [ ] Voice synthesizer for agent personalities
- [ ] Agent-to-agent @mentions
- [ ] Automated task creation from patterns

## 🤝 Communication Rules

**Agents in Group Chat:**
- Use emojis and catchphrases
- Celebrate wins together
- Help each other
- Keep it fun but professional

**Friday to You:**
- Executive summaries only
- Highlight urgent items
- Proactive suggestions
- Filter noise

**You to Friday:**
- High-level direction
- Task assignments
- Approval/rejection
- Questions

---

**Built with 🤌 by Friday for NutriCepss**

*"I've got this. Go grab a coffee."*