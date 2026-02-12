---
name: reddit-readonly
description: >-
  Browse and search Reddit in read-only mode using public JSON endpoints.
  Use for social engagement monitoring, lead generation, and content research.
metadata: {"clawdbot":{"emoji":"🔎","requires":{"bins":["node"]}}}
---

# Reddit Readonly Skill

## When to Use This Skill ✅

**USE WHEN:**
- Monitoring r/Fitness_India and r/Indianfitness for engagement opportunities
- Finding posts for meaningful replies (lead generation)
- Researching current fitness trends in India
- Building shortlists of permalinks for manual review/reply
- Scheduled social engagement monitoring (10 AM, 12 PM, 2 PM, etc.)

**DO NOT USE WHEN:**
- Posting, replying, voting, or moderating (READ-ONLY ONLY)
- Mass data collection without specific purpose
- Accessing NSFW or restricted subreddits
- Network access is restricted or rate-limited

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. **READ-ONLY ONLY** - Never post, reply, vote, or moderate
2. **Respect rate limits** - Use small limits (5-10) first, expand only if needed
3. **Focus on target subreddits** - Primarily r/Fitness_India and r/Indianfitness
4. **No authentication needed** - Uses public JSON endpoints only

## Primary Use Cases for NutriCepss

### 1. **Lead Generation**
- Find posts from people seeking fitness/nutrition advice
- Identify potential coaching clients
- Monitor for "looking for coach" or "need help" posts

### 2. **Engagement Monitoring**
- Check r/Fitness_India (moderator duties)
- Monitor r/Indianfitness for cross-promotion opportunities
- Track fitness trends and supplement discussions

### 3. **Content Research**
- Identify popular topics for Instagram reels
- Research supplement trends and questions
- Find common fitness misconceptions to address

## Configuration

### Environment Variables (Optional)
```bash
export REDDIT_RO_MIN_DELAY_MS=800      # Rate limiting
export REDDIT_RO_MAX_DELAY_MS=1800
export REDDIT_RO_TIMEOUT_MS=25000
export REDDIT_RO_USER_AGENT='script:clawdbot-reddit-readonly:v1.0.0 (personal)'
```

## Usage Examples

## What this skill is for

- Finding posts in one or more subreddits (hot/new/top/controversial/rising)
- Searching for posts by query (within a subreddit or across all)
- Pulling a comment thread for context
- Producing a *shortlist of permalinks* so the user can open Reddit and reply manually

## Hard rules

- **Read-only only.** This skill never posts, replies, votes, or moderates.
- Be polite with requests:
  - Prefer small limits (5–10) first.
  - Expand only if needed.
- When returning results to the user, always include **permalinks**.

## Output format

All commands print JSON to stdout.

- Success: `{ "ok": true, "data": ... }`
- Failure: `{ "ok": false, "error": { "message": "...", "details": "..." } }`

## Commands

### 1) List posts in a subreddit

```bash
node {baseDir}/scripts/reddit-readonly.mjs posts <subreddit> \
  --sort hot|new|top|controversial|rising \
  --time day|week|month|year|all \
  --limit 10 \
  --after <token>
```

### 2) Search posts

```bash
# Search within a subreddit
node {baseDir}/scripts/reddit-readonly.mjs search <subreddit> "<query>" --limit 10

# Search all of Reddit
node {baseDir}/scripts/reddit-readonly.mjs search all "<query>" --limit 10
```

### 3) Get comments for a post

```bash
# By post id or URL
node {baseDir}/scripts/reddit-readonly.mjs comments <post_id|url> --limit 50 --depth 6
```

### 4) Recent comments across a subreddit

```bash
node {baseDir}/scripts/reddit-readonly.mjs recent-comments <subreddit> --limit 25
```

### 5) Thread bundle (post + comments)

```bash
node {baseDir}/scripts/reddit-readonly.mjs thread <post_id|url> --commentLimit 50 --depth 6
```

### 6) Find opportunities (multi-subreddit helper)

Use this when the user describes criteria like:
"Find posts about X in r/a, r/b, and r/c posted in the last 48 hours, excluding Y".

```bash
node {baseDir}/scripts/reddit-readonly.mjs find \
  --subreddits "python,learnpython" \
  --query "fastapi deployment" \
  --include "docker,uvicorn,nginx" \
  --exclude "homework,beginner" \
  --minScore 2 \
  --maxAgeHours 48 \
  --perSubredditLimit 25 \
  --maxResults 10 \
  --rank new
```

## Suggested agent workflow

1. **Clarify scope** if needed: subreddits + topic keywords + timeframe.
2. Start with `find` (or `posts`/`search`) using small limits.
3. For 1–3 promising items, fetch context via `thread`.
4. Present the user a shortlist:
   - title, subreddit, score, created time
   - permalink
   - a brief reason why it matched
5. If asked, propose *draft reply ideas* in natural language, but remind the user to post manually.

## Workflow Templates

### Daily Engagement Monitoring (Scheduled)
```bash
# Check r/Fitness_India (new posts, last 2 hours)
node scripts/reddit-readonly.mjs posts Fitness_India --sort new --limit 10

# Check r/Indianfitness (new posts, last 2 hours)  
node scripts/reddit-readonly.mjs posts Indianfitness --sort new --limit 10

# Save results to /mnt/data/artifacts/
```

### Lead Generation Search
```bash
# Find people looking for coaches/help
node scripts/reddit-readonly.mjs find \
  --subreddits "Fitness_India,Indianfitness" \
  --query "coach OR help OR guidance OR looking for" \
  --include "weight loss,training,nutrition,diet" \
  --maxAgeHours 48 \
  --perSubredditLimit 15 \
  --maxResults 5
```

### Trend Research
```bash
# Hot topics in fitness India
node scripts/reddit-readonly.mjs posts Fitness_India --sort hot --limit 15
```

## Error Handling

**Common Issues:**
- `Reddit returned HTML`: Re-run command (script auto-detects)
- `Rate limited`: Increase delay between requests
- `Network timeout`: Check connectivity, reduce limits

**Fallback Actions:**
1. Log error to memory file
2. Wait 5 minutes and retry with smaller limits
3. Notify Himanshu if persistent failures
4. Use cached data if available

## Success Criteria

✅ **Skill executed successfully when:**
- Posts retrieved from target subreddits
- Permalinks included in output
- Rate limits respected
- Results saved to /mnt/data/artifacts/
- Engagement opportunities identified

## Negative Examples

❌ **WRONG:** Posting replies or comments
❌ **WRONG:** Mass data scraping without purpose
❌ **WRONG:** Accessing NSFW/unrelated subreddits
❌ **WRONG:** Ignoring rate limits

✅ **CORRECT:** Building shortlists for manual review
✅ **CORRECT:** Monitoring specific fitness subreddits
✅ **CORRECT:** Respecting rate limits with delays
✅ **CORRECT:** Saving outputs to /mnt/data/artifacts/

## Troubleshooting

- If Reddit returns HTML, re-run the command (the script detects this and returns an error).
- If requests fail repeatedly, reduce `--limit` and/or set slower pacing via env vars:

```bash
export REDDIT_RO_MIN_DELAY_MS=800
export REDDIT_RO_MAX_DELAY_MS=1800
export REDDIT_RO_TIMEOUT_MS=25000
export REDDIT_RO_USER_AGENT='script:clawdbot-reddit-readonly:v1.0.0 (personal)'
```
