# Friday - NutriCepss Operations System

AI-powered operations management system for NutriCepss coaching business.

## 🎯 Overview

Friday manages:
- **Client Management** - HubFit integration, adherence tracking
- **Social Engagement** - Reddit monitoring, lead generation
- **Email Operations** - 5 Gmail accounts, maintenance, reports
- **Schedule Management** - Calendar integration, virtual training sessions
- **Content Intelligence** - Instagram insights, trend analysis
- **Dashboard** - Real-time operations monitoring

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Friday Dashboard                     │
│              (Cloudflare Workers + KV)                  │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐   ┌───▼────┐   ┌────▼────┐
    │ HubFit  │   │ Reddit │   │  Email  │
    │ Reports │   │Monitor │   │Maint.   │
    └────┬────┘   └───┬────┘   └────┬────┘
         │            │             │
         └────────────┼─────────────┘
                      │
              ┌───────▼───────┐
              │  /mnt/data/   │
              │ Artifact Store│
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │  Cron Jobs    │
              │  (Scheduled)  │
              └───────────────┘
```

## 📁 Directory Structure

```
├── scripts/              # Production skill wrappers
│   ├── skill_hubfit.sh      # HubFit client monitoring
│   ├── skill_reddit.sh      # Reddit engagement
│   ├── skill_gmail.sh       # Email maintenance
│   ├── skill_calendar.sh    # Schedule management
│   └── guradskills.sh       # Skill validator
├── skills/               # Skill manifests
│   ├── gmail-client/
│   ├── reddit-readonly/
│   ├── instagram/
│   └── ... (8 total)
├── mnt/data/             # Artifact handoff
│   ├── reports/          # HubFit reports
│   ├── artifacts/        # Reddit/Gmail outputs
│   └── temp/             # Temporary files
├── dashboard/            # Cloudflare dashboard
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── api/
├── memory/               # Audit logs
│   ├── 2026-02-12.md
│   └── *.log files
└── docs/                 # Documentation
    └── skill-system-guide.md
```

## 🚀 Quick Start

### Skill System
```bash
# Test all wrappers
./scripts/skill_hubfit.sh --test
./scripts/skill_reddit.sh --test
./scripts/skill_gmail.sh --test
./scripts/skill_calendar.sh --test

# Run production workflows
./scripts/skill_hubfit.sh --cron
./scripts/skill_reddit.sh --cron
```

### Dashboard Deployment
```bash
cd dashboard

# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler deploy
```

## 📊 Dashboard

Live operations dashboard at:
`https://friday-dashboard.nutricepss.workers.dev`

Features:
- Real-time HubFit client status
- Reddit engagement opportunities
- System health monitoring
- Instagram content insights

## ⏰ Automation Schedule

| Time | Task | Frequency |
|------|------|-----------|
| 4:00 AM | HubFit Report | Daily |
| 8:00 AM | Email Maintenance | Daily |
| 9:00 AM | Calendar Check | Daily |
| 10 AM-10 PM | Reddit Monitoring | Every 2 hours |
| 4:00 PM | HubFit Report | Daily |

## 🔐 Security

- **guradskills** validation before skill execution
- No direct client communication (suggest only)
- Assistant email for reports
- Complete audit logging
- CORS protection on API endpoints

## 📖 Documentation

- [Skill System Guide](docs/skill-system-guide.md)
- [Dashboard Deployment](dashboard/DEPLOY.md)

## 🛠️ Tech Stack

- **Backend:** Python, Node.js, Bash
- **Frontend:** HTML5, CSS3, JavaScript, Chart.js
- **Infrastructure:** Cloudflare Workers, KV
- **Automation:** Cron jobs, GitHub Actions

## 📞 Support

For issues or questions:
1. Check logs in `memory/` directory
2. Review skill manifests in `skills/`
3. Test with `--test` flag on wrappers

---

**Status**: Production Ready  
**Version**: 1.0  
**Last Updated**: 2026-02-12