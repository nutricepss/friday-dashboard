# Friday Dashboard - Deployment Guide

## Overview
Real-time dashboard for NutriCepss operations monitoring: HubFit client status, Reddit engagement, system health, and Instagram insights.

## 🚀 Quick Deploy

### Prerequisites
- Cloudflare account (free tier works)
- Wrangler CLI installed
- GitHub repo: `nutricepss/friday-dashboard`

### Step 1: Connect to GitHub
```bash
# Add remote
git remote add origin https://github.com/nutricepss/friday-dashboard.git

# Push code
git push -u origin master
```

### Step 2: Configure Cloudflare
```bash
# Login to Cloudflare
wrangler login

# Create KV namespace
wrangler kv:namespace create "DASHBOARD_CACHE"

# Update wrangler.toml with KV namespace ID
```

### Step 3: Deploy
```bash
# Deploy to Cloudflare Workers
wrangler deploy

# Your dashboard will be at:
# https://friday-dashboard.nutricepss.workers.dev
```

## 📊 Dashboard Features

### HubFit Tab
- Client status pie chart (Active/At Risk/Ghosting/Archived)
- Urgent follow-ups list (>14 days inactive)
- Engagement rate percentage
- Top ghosting clients

### Reddit Tab
- Posts per subreddit
- Engagement opportunities
- Post categories analysis

### System Tab
- Cron job status
- System health metrics
- Recent executions

### Instagram Tab
- Account overview
- Content ideas based on trends
- Hashtag strategy

## 🔧 Configuration

### Update wrangler.toml
Replace `your_kv_namespace_id_here` with your actual KV namespace ID from Cloudflare dashboard.

### Environment Variables
Set in Cloudflare dashboard:
- `ENVIRONMENT`: production
- Any API keys needed

### Custom Domain (Optional)
To use custom domain:
1. Add domain to Cloudflare
2. Update wrangler.toml routes
3. Deploy again

## 📁 File Structure
```
dashboard/
├── index.html          # Main dashboard UI
├── css/
│   └── style.css       # Dashboard styles
├── js/
│   └── dashboard.js    # Data management & charts
├── api/
│   └── worker.js       # Cloudflare Worker API
└── wrangler.toml       # Deployment config
```

## 🔄 Data Flow
```
Our Scripts → /mnt/data/ → Cloudflare Worker → Dashboard
     ↓
Cron Jobs populate data every 2 hours
Dashboard fetches fresh data on load
```

## 🛠️ Development

### Local Testing
```bash
# Navigate to dashboard
cd dashboard

# Start local dev server
wrangler dev

# Dashboard available at http://localhost:8787
```

### Making Changes
1. Edit files in `dashboard/`
2. Test locally with `wrangler dev`
3. Commit changes: `git commit -am "Update"`
4. Push: `git push`
5. Deploy: `wrangler deploy`

## 🔐 Security
- CORS enabled for API endpoints
- No sensitive data in client-side code
- API keys stored in Cloudflare environment variables

## 📱 Mobile Responsive
Dashboard is fully responsive and works on mobile devices.

## 🎯 Next Steps
1. ✅ Connect GitHub repo
2. ✅ Configure Cloudflare KV
3. ✅ Deploy worker
4. 🔄 Set up data sync from local to Cloudflare
5. 🔄 Add authentication (if needed)
6. 🔄 Real-time updates with WebSockets

## 🆘 Troubleshooting

### Deployment Failed
```bash
# Check wrangler login
wrangler whoami

# Verify config
wrangler config
```

### KV Not Working
```bash
# List namespaces
wrangler kv:namespace list

# Update wrangler.toml with correct ID
```

### Dashboard Not Loading
- Check browser console for errors
- Verify API endpoints are responding
- Check Cloudflare Workers logs

## 📞 Support
For issues:
1. Check Cloudflare Workers documentation
2. Review Wrangler CLI docs
3. Check dashboard logs in Cloudflare dashboard

---

**Status**: Ready for deployment
**Version**: 1.0
**Last Updated**: 2026-02-12