# Model Routing Rules - Friday (Health Coach Assistant)

**Version:** 1.1  
**Last Updated:** 2026-02-10  
**Purpose:** Optimize token usage and model selection based on task type

**Change Log:**
- v1.1: Changed default from `haiku` to `kimi` (256K context, better balance)

---

## DEFAULT RULE

**🌙 Default: Always use `kimi` (Kimi K2.5)**

- 256K context window - handles most tasks
- Balanced quality/cost
- Good for both quick replies and moderate complexity

Switch to specialized models ONLY when specific conditions are met.

**When in doubt:** Use Kimi. Escalate if task requires specialized capabilities (coding, vision, ultra-cheap summaries, etc.).

---

## ESCALATION RULES

### Switch to 🧠 `deepseek` (Deepseek V3) when:
- Content strategy brainstorming
- Multi-step reasoning about client trends
- Analyzing patterns across HubFit client data
- Market research synthesis
- Competitor analysis deep dives
- **Why:** Better reasoning, still cost-effective

### Switch to 👨‍💻 `deepseek-coder` (Deepseek Coder) when:
- Writing Python scripts for automation
- Building the client adherence dashboard
- API integrations (HubFit, Shopify)
- Data processing scripts
- Cron job configurations
- NLP pipeline modifications
- **Why:** Optimized for code, cheaper than Opus

### Switch to 💎 `opus` (Claude Opus 4) when:
- Architecture decisions for new systems
- Complex HubFit API integrations
- Production-ready code review
- Security analysis of credentials/integrations
- Multi-project strategic planning
- Critical client-facing content final review
- **Why:** Highest quality, use sparingly (expensive)

### Switch to ⚡ `sonnet` (Claude Sonnet 4) when:
- Detailed content creation (Instagram captions, threads)
- Email triage and categorization strategies
- Client adherence analysis (moderate complexity)
- Shopify optimization recommendations
- Multi-step automation workflows
- **Why:** Balanced quality/speed for medium complexity

### Switch to 🌙 `kimi` (Kimi K2.5) when:
- VERY long context (>100K tokens)
- Processing multiple client histories at once
- Large HubFit data exports analysis
- Long-form content (blog posts, guides)
- **Why:** 256K context window, good for bulk processing

### Switch to ⚡ `flash` (Gemini 2.0 Flash) when:
- Quick summaries of long texts
- Extracting key points from emails
- Simple categorization tasks
- High-volume, low-complexity batch processing
- **Why:** Cheapest option, fastest response

### Switch to 🔮 `gemini-pro` (Gemini 2.0 Pro) when:
- Image analysis (client progress photos)
- Vision tasks (analyzing screenshots, charts)
- Complex multi-modal reasoning
- Very long documents (>200K tokens)
- **Why:** 2M context, vision capabilities

---

## TASK-SPECIFIC ROUTING

### Client Communication (WhatsApp)
| Task | Model | Why |
|------|-------|-----|
| Quick reply suggestions | `kimi` | Default, balanced |
| Complex client issue | `sonnet` | Nuanced understanding |
| Escalation analysis | `deepseek` | Pattern recognition |

### Content Creation
| Task | Model | Why |
|------|-------|-----|
| Tweet ideas | `kimi` | Default generation |
| Instagram captions | `kimi` | Creative quality, 256K context |
| Long-form posts | `kimi` | Context for research |
| Content strategy | `deepseek` | Reasoning & planning |
| Final review | `opus` | Quality assurance |

### HubFit Client Management
| Task | Model | Why |
|------|-------|-----|
| Daily adherence check | `kimi` | Default data scan |
| Client trend analysis | `deepseek` | Pattern recognition |
| Dashboard building | `deepseek-coder` | Code generation |
| Complex plan adjustments | `sonnet` | Balanced analysis |
| Strategic client reviews | `opus` | High-stakes decisions |

### Email Management
| Task | Model | Why |
|------|-------|-----|
| Initial triage | `kimi` | Default categorization |
| Priority analysis | `kimi` | Quick sorting |
| Draft responses | `kimi` | Quality replies |
| Complex thread analysis | `deepseek` | Understanding context |

### Technical/Automation
| Task | Model | Why |
|------|-------|-----|
| Script writing | `deepseek-coder` | Code-optimized |
| API debugging | `deepseek-coder` | Technical reasoning |
| System architecture | `opus` | Critical decisions |
| Quick fixes | `kimi` | Default iteration |

---

## COST OPTIMIZATION RULES

### Default: Use Kimi (🌙)
Start with `kimi` for all tasks unless specific conditions below apply.

### Use Cheaper Models When:
- **< 100 tokens expected output** → `flash` (for summaries only)
- **Ultra-simple categorization** → `flash` or `haiku`
- **High-volume batch processing** → `flash`

### Worth the Upgrade When:
- **Coding tasks** → `deepseek-coder` (better than Kimi for code)
- **Complex reasoning/analysis** → `deepseek` (better reasoning)
- **Client-facing final output** → `sonnet` (higher quality)
- **Revenue-impacting decisions** → `opus` (critical accuracy)
- **Code that runs in production** → `deepseek-coder` or `opus`
- **Vision/image tasks** → `gemini-pro` (only option)

---

## SUB-AGENT MODEL ASSIGNMENTS

| Agent | Default Model | Fallback | Notes |
|-------|--------------|----------|-------|
| **Coder** | `deepseek-coder` | `opus` | Code-heavy tasks |
| **Content** | `kimi` | `sonnet` | Creative writing, 256K context |
| **Research** | `kimi` | `deepseek` | Analysis & synthesis |
| **Marketing** | `kimi` | `sonnet` | Strategy & SEO |
| **Ops** | `kimi` | `haiku` | Default ops, escalate if needed |

---

## CONTEXT WINDOW GUIDE

| Model | Context | Use When |
|-------|---------|----------|
| `haiku` | 200K | Standard conversations |
| `flash` | 1M | Long document summaries |
| `kimi` | 256K | Multiple client histories |
| `deepseek` | 128K | Standard analysis |
| `gemini-pro` | 2M | Very large data exports |

---

## DECISION FLOWCHART

```
Start with kimi (🌙)
    ↓
Is task coding-related?
    ↓
    YES → Use deepseek-coder (👨‍💻)
    NO → Need ultra-cheap/fast summary?
        ↓
        YES → Use flash (⚡) or haiku (🚀)
        NO → Is it complex reasoning/analysis?
            ↓
            YES → Use deepseek (🧠) or sonnet (⚡)
            NO → Is it high-stakes/final review?
                ↓
                YES → Use opus (💎)
                NO → Is context > 200K?
                    ↓
                    YES → Use gemini-pro (🔮)
                    NO → Stick with kimi (🌙)
```

---

## MANUAL OVERRIDE

User can always force a model with:
- `/model <alias>` - Switch for this session
- `/model <alias> --permanent` - Set as default

Aliases with emojis for quick reference:
- 🌙 `kimi` - DEFAULT - Balanced, 256K context
- ⚡ `sonnet` - Balanced quality/speed
- 💎 `opus` - Premium quality
- 🧠 `deepseek` - Reasoning & analysis
- 👨‍💻 `deepseek-coder` - Coding & scripts
- 🚀 `haiku` - Quick & cheap
- ⚡ `flash` - Cheapest/fastest summaries
- 🔮 `gemini-pro` - Vision & 2M context

---

## MONITORING & ADJUSTMENT

Track usage in `memory/model-usage.md`:
- Which model was used
- For what task
- Was escalation needed
- Cost estimate

Review weekly to optimize routing rules.

---

## RATE LIMITS

### API Call Timing
- **5 seconds minimum** between API calls
- **10 seconds** between web searches
- **Max 5 searches per batch**, then **2-minute break**
- **Batch similar work** — one request for 10 leads, not 10 separate requests

### Error Handling
- **If you hit 429 (rate limit):**
  1. STOP immediately
  2. Wait 5 minutes
  3. Retry with exponential backoff
  4. If persists, switch to fallback model

### Budget Controls
| Budget | Limit | Warning At | Action |
|--------|-------|------------|--------|
| **Daily** | $5 | 75% ($3.75) | Switch to cheaper models, batch more |
| **Monthly** | $70 | 75% ($52.50) | Strict mode: local + cheap models only |

**Strict Mode Triggers:**
- Use `local` (Ollama) for non-critical tasks
- Use `flash` or `haiku` for summaries
- Avoid `opus` unless critical
- Batch everything possible

---

*These rules balance cost vs quality for a health coach use case. Adjust based on actual usage patterns.*