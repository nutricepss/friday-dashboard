# NutriCepss Skill System Guide

## Overview

The new skill system follows OpenAI's best practices for long-running agents:
- **Skills** as "living SOPs" (Standard Operating Procedures)
- **guradskills** validation for security
- **/mnt/data/** artifact handoff pattern
- **Audit logging** for all operations

## Production Wrappers

### 1. `skill_hubfit.sh`
**Purpose:** Daily client status monitoring
**Schedule:** 4 AM & 4 PM daily
**Outputs:**
- `hubfit-quick-*.md` - Full client report
- `hubfit-summary-*.md` - Executive summary
- `hubfit-notification-*.txt` - Telegram message
**Usage:** `./scripts/skill_hubfit.sh --cron`

### 2. `skill_reddit.sh`
**Purpose:** Social engagement monitoring
**Schedule:** 10 AM, 12 PM, 2 PM, 4 PM, 6 PM, 8 PM, 10 PM
**Subreddits:** r/Fitness_India, r/Indianfitness
**Outputs:**
- `reddit-*-*.json` - Raw post data
- `reddit-analysis-*.md` - Engagement analysis
- `reddit-notification-*.txt` - Notification
**Usage:** `./scripts/skill_reddit.sh --cron`

### 3. `skill_gmail.sh`
**Purpose:** Daily email maintenance
**Schedule:** 8 AM daily
**Accounts:** 5 Gmail accounts (work, personal, swansh, assistant, nutricepss0)
**Outputs:**
- `gmail-*-unread-*.txt` - Account status
- `gmail-summary-*.md` - Daily summary
- `gmail-notification-*.txt` - Notification
**Safety:** Email sending disabled by default
**Usage:** `./scripts/skill_gmail.sh --cron`

### 4. `skill_calendar.sh`
**Purpose:** Schedule management
**Schedule:** 9 AM daily
**Focus:** Virtual training, client calls, content blocks
**Outputs:**
- `calendar-today-*.txt` - Today's agenda
- `calendar-analysis-*.md` - Schedule analysis
- `calendar-notification-*.txt` - Notification
**Usage:** `./scripts/skill_calendar.sh --cron`

## Directory Structure

```
/home/assistant4himanshu/.openclaw/workspace/
├── scripts/
│   ├── skill_hubfit.sh      # HubFit wrapper
│   ├── skill_reddit.sh      # Reddit wrapper
│   ├── skill_gmail.sh       # Gmail wrapper
│   ├── skill_calendar.sh    # Calendar wrapper
│   ├── guradskills.sh       # Skill validator
│   └── hubfit_quick.py      # Fast HubFit script
├── mnt/data/                # Artifact handoff
│   ├── reports/             # HubFit reports
│   ├── artifacts/           # Reddit/Gmail outputs
│   ├── scripts/             # Generated scripts
│   └── temp/                # Temporary files
├── skills/                  # Skill manifests
│   ├── gmail-client/
│   ├── reddit-readonly/
│   ├── instagram/
│   ├── gcalcli-calendar/
│   ├── seo/
│   ├── shopify-admin-api/
│   ├── chirp/
│   └── bird/
├── memory/                  # Audit logs
│   ├── 2026-02-12.md       # Daily memory
│   ├── hubfit-*.log        # HubFit logs
│   ├── reddit-*.log        # Reddit logs
│   └── gmail-*.log         # Gmail logs
└── docs/                    # Documentation
    └── skill-system-guide.md
```

## Cron Job Schedule

| Time | Task | Wrapper | Frequency |
|------|------|---------|-----------|
| 4:00 AM | HubFit Report | `skill_hubfit.sh` | Daily |
| 8:00 AM | Email Maintenance | `skill_gmail.sh` | Daily |
| 9:00 AM | Calendar Check | `skill_calendar.sh` | Daily |
| 10:00 AM | Reddit Monitoring | `skill_reddit.sh` | 2-hourly |
| 12:00 PM | Reddit Monitoring | `skill_reddit.sh` | 2-hourly |
| 2:00 PM | Reddit Monitoring | `skill_reddit.sh` | 2-hourly |
| 4:00 PM | HubFit Report | `skill_hubfit.sh` | Daily |
| 4:00 PM | Reddit Monitoring | `skill_reddit.sh` | 2-hourly |
| 6:00 PM | Reddit Monitoring | `skill_reddit.sh` | 2-hourly |
| 8:00 PM | Reddit Monitoring | `skill_reddit.sh` | 2-hourly |
| 10:00 PM | Reddit Monitoring | `skill_reddit.sh` | 2-hourly |

## Security & Validation

### guradskills Validator
```bash
# Validate a skill
./scripts/guradskills.sh reddit-readonly --check-only

# List all skills
./scripts/guradskills.sh --list

# Validate and execute
./scripts/guradskills.sh gmail-client
```

**Validation Checks:**
1. Skill exists in allowed list
2. Required credentials available
3. Network access warnings
4. Skill manifest format

### Safety Features
1. **No direct client communication** - Only suggested replies
2. **Assistant email for reports** - Never use personal email
3. **Audit logging** - All actions logged
4. **Rate limiting** - Respect API limits
5. **Error handling** - Fallback procedures

## Skill Manifests

All skills have updated `SKILL.md` files with:

### Standard Sections
1. **When to Use/Don't Use** - Clear boundaries
2. **Security & Boundaries** - Critical constraints
3. **Primary Use Cases** - NutriCepss-specific workflows
4. **Workflow Templates** - Step-by-step procedures
5. **Error Handling** - Fallback actions
6. **Success Criteria** - Clear outcomes
7. **Negative Examples** - What NOT to do

### NutriCepss Customization
- Client management workflows
- Indian fitness market focus
- Sivola.in Shopify integration
- Local SEO strategies
- Content creation pipelines

## Monitoring & Maintenance

### Log Files
- `memory/hubfit-YYYY-MM-DD.log` - HubFit operations
- `memory/reddit-YYYY-MM-DD.log` - Reddit monitoring
- `memory/gmail-YYYY-MM-DD.log` - Email operations
- `memory/calendar-YYYY-MM-DD.log` - Schedule checks

### Artifact Retention
- Reports: 30 days in `/mnt/data/reports/`
- Artifacts: 7 days in `/mnt/data/artifacts/`
- Logs: 90 days in `memory/`

### Health Checks
```bash
# Test all wrappers
./scripts/skill_hubfit.sh --test
./scripts/skill_reddit.sh --test
./scripts/skill_gmail.sh --test
./scripts/skill_calendar.sh --test
```

## Troubleshooting

### Common Issues

#### 1. Skill Validation Fails
```bash
# Check skill exists
./scripts/guradskills.sh --list

# Check credentials
ls -la ~/.openclaw/credentials/
```

#### 2. API Rate Limits
- HubFit: 100ms delay between requests
- Reddit: Respect rate limits in script
- Gmail: IMAP connection limits

#### 3. Permission Errors
```bash
# Make scripts executable
chmod +x ./scripts/*.sh
chmod +x ./scripts/*.py
```

#### 4. Missing Dependencies
```bash
# Check Python
python3 --version

# Check Node.js
node --version

# Check gcalcli
gcalcli --version
```

### Recovery Procedures

#### HubFit Script Hanging
1. Kill process: `pkill -f hubfit`
2. Use fast script: `python3 scripts/hubfit_quick.py`
3. Check logs: `tail -f memory/hubfit-*.log`

#### Reddit API Issues
1. Check network: `curl https://www.reddit.com/.json`
2. Reduce limits: Use `--quick` mode
3. Wait and retry: Exponential backoff

#### Email Authentication
1. Check app passwords: `credentials/gmail-app-passwords.json`
2. Test connection: `python3 skills/gmail-client/scripts/gmail_tool.py list`
3. Regenerate app password if needed

## Future Enhancements

### Phase 4 (Planned)
1. **skill_instagram.sh** - After token refresh
2. **skill_shopify.sh** - After access token setup
3. **Dashboard integration** - Visual reports
4. **Alert system** - Telegram notifications
5. **Performance metrics** - Execution tracking

### Integration Points
1. **Reddit → Instagram** - Trend-based content
2. **HubFit → Calendar** - Client follow-ups
3. **Email → Reddit** - Newsletter content
4. **Calendar → Gmail** - Meeting reminders

## Support

### Immediate Issues
1. Check relevant log file
2. Test wrapper with `--test` flag
3. Validate skill with `guradskills.sh`
4. Check cron job status: `cron action=list`

### System Updates
1. Update skill manifests as business evolves
2. Add new wrappers for new workflows
3. Adjust cron schedules as needed
4. Review security policies quarterly

---

*Last Updated: 12 Feb 2026*
*System Version: Phase 3 - Production Wrappers*
*Next Phase: Instagram & Shopify integration*