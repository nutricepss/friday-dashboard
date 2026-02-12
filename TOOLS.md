# TOOLS.md - Local Notes

## Gmail Accounts
All use App Passwords via IMAP. Creds in `/home/assistant4himanshu/.openclaw/credentials/gmail-app-passwords.json`
- `nutricepss@gmail.com` (work/primary) — key: "work"
- `hims.sharma62@gmail.com` (personal) — key: "personal"
- `swanshenterprises@gmail.com` (swansh biz) — key: "swansh"
- `assistantatnutricepss@gmail.com` (assistant) — key: "assistant"
- `nutricepss0@gmail.com` (secondary) — key: "nutricepss0"

Usage: `GMAIL_USER="x@gmail.com" GMAIL_PASS="xxxx xxxx xxxx xxxx" python3 skills/gmail-client/scripts/gmail_tool.py list|read|send`

## Outlook
- `himanshu007bond@live.com` — OAuth tokens in `/home/assistant4himanshu/.openclaw/credentials/outlook-tokens.json`

## Google Calendar
- gcalcli configured at `~/.gcalcli_oauth` using hims.sharma62@gmail.com OAuth
- Usage: `gcalcli --nocolor agenda today tomorrow`

## Instagram
- Account: @nutricepssbyhimanshu (Business, 93 posts)
- Token in `/home/assistant4himanshu/.openclaw/credentials/instagram-token.json`
- API: `curl "https://graph.instagram.com/v21.0/me?fields=...&access_token=TOKEN"`

## X/Twitter
- Chirp skill (browser-based) — Himanshu logged in via OpenClaw browser
- Usage: `browser action=open profile=openclaw targetUrl="https://x.com/home"`

## Reddit
- reddit-readonly skill — no auth needed
- Subreddits: r/Fitness_India (moderator), plus general fitness/health subs
- Usage: `node skills/reddit-readonly/scripts/reddit-readonly.mjs posts Fitness_India --sort hot --limit 10`

## HubFit (Coach Portal)
- Base URL: `https://app.hubfit.com/api`
- Auth: `X-Access-Token` header (JWT, NOT Bearer) — token valid till Feb 2027
- Login: nutricepss@gmail.com — creds in `hubfit-credentials.json`
- Full API map: `memory/hubfit-api-map.md`
- Key endpoints: `/coach/clients`, `/training/programs/client?clientId=`, `/nutrition/plan?clientId=`, `/client/measurements/:id`, `/exercise`, etc.
- 54 clients, 93 exercises, 30 meal plans, 25 training programs

## Shopify
- Store: sivola.in — access token PENDING
- Skill: shopify-admin-api installed

## SEO
- seo skill installed — guidelines only, no auth needed

## Google OAuth
- Client: `/home/assistant4himanshu/.openclaw/credentials/google-oauth-client.json`
- Project: "Friday" (big-guild-486914-g8)
- All 5 Gmail tokens in `/home/assistant4himanshu/.openclaw/credentials/google-tokens-*.json`
