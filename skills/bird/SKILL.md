---
name: bird
description: "X/Twitter CLI tool for reading, posting, and searching. Alternative to browser-based chirp skill, uses cookies or API."
homepage: https://bird.fast
metadata: {"clawdbot":{"emoji":"🐦","requires":{"bins":["bird"]},"install":[{"id":"brew","kind":"brew","formula":"steipete/tap/bird","bins":["bird"],"label":"Install bird (brew)"}]}}
---

# X/Twitter CLI Skill 🐦

## When to Use This Skill ✅

**USE WHEN:**
- Quick Twitter/X operations without browser
- Reading timelines and searches
- Posting text-based tweets
- CLI-based automation workflows
- When chirp (browser) skill has issues

**DO NOT USE WHEN:**
- `bird` CLI not installed on system
- Need media uploads (images/videos)
- Browser interaction required for complex UI
- Rate limited or authentication issues

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. **Cookie-Based Auth**: Uses browser cookies (Firefox/Chrome)
2. **Installation Required**: `bird` CLI must be installed via Homebrew
3. **Text-Only**: Limited media support compared to browser
4. **Rate Limits**: Same Twitter/X API limits apply

## Installation Status

❓ **CHECK INSTALLATION:**
```bash
which bird || echo "bird not installed"
```

**To Install:**
```bash
# Requires Homebrew
brew install steipete/tap/bird
```

**Auth Sources:**
1. **Browser Cookies** (default): Firefox/Chrome cookies
2. **Sweetistics API**: Set `SWEETISTICS_API_KEY` environment variable
3. **Check Sources**: `bird check`

## Primary Use Cases

### 1. **Quick Posts**
- Text-only tweets
- Thread replies
- Simple content sharing

### 2. **Monitoring**
- Search for keywords
- Read specific threads
- Monitor mentions

### 3. **Automation**
- Scheduled tweets (via cron)
- Automated replies
- Content syndication

### 4. **Research**
- Trend analysis
- Competitor monitoring
- Content discovery

## Basic Commands

### Authentication Check
```bash
# Check available auth sources
bird check

# Verify login
bird whoami
```

### Reading Content
```bash
# Read tweet by URL/ID
bird read https://x.com/username/status/1234567890

# Read thread
bird thread https://x.com/username/status/1234567890

# Search tweets
bird search "fitness india" -n 10

# Read home timeline
bird home -n 20
```

### Posting Content
```bash
# Post tweet (ALWAYS confirm with user first)
bird tweet "Fitness tip: Consistency beats intensity. Small daily habits create lasting change. #fitness #motivation"

# Reply to tweet
bird reply 1234567890 "Great point! I'd add that nutrition is 80% of the equation."

# Quote tweet
bird quote 1234567890 "Adding to this thread with more insights..."
```

## Workflow Templates

### Daily Content Post
```bash
# 1. Check authentication
bird whoami

# 2. Post daily fitness tip
bird tweet "$(cat /path/to/daily-tip.txt)"

# 3. Search for engagement opportunities
bird search "looking for fitness coach" -n 5
```

### Thread Monitoring
```bash
# Monitor specific thread for new replies
bird thread https://x.com/fitnessexpert/status/1234567890 | grep -A2 -B2 "nutrition"
```

### Hashtag Tracking
```bash
# Track fitness hashtags
bird search "#fitnessindia OR #indianfitness" -n 15 --sort latest
```

## Error Handling

**Common Issues:**
- `bird: command not found`: Not installed
- `Authentication failed`: Cookies expired or missing
- `Rate limited`: Wait and retry
- `Not found`: Tweet deleted or URL invalid

**Troubleshooting:**
```bash
# Reinstall if needed
brew reinstall steipete/tap/bird

# Check auth sources
bird check

# Try different browser cookies
bird --browser firefox whoami
```

## Success Criteria

✅ **Skill executed successfully when:**
- `bird` CLI is installed and accessible
- Authentication works (`bird whoami` returns username)
- Commands execute without errors
- Content posted as intended
- Actions logged for audit trail

## Comparison: bird vs chirp

| Aspect | bird (CLI) | chirp (browser) |
|--------|------------|-----------------|
| **Installation** | Homebrew required | Browser extension |
| **Auth** | Browser cookies | Browser session |
| **Media Support** | Limited | Full (images/video) |
| **Stability** | API-based, stable | UI-dependent, fragile |
| **Speed** | Fast | Slower (browser) |
| **Use Case** | Automation, text posts | Media posts, complex UI |

## Integration

### Use bird for:
- Automated daily tips
- Search monitoring
- Text-only content
- Cron-based scheduling

### Use chirp for:
- Media posts (images/video)
- Complex interactions
- When bird auth fails
- Browser-specific features

## Next Steps

1. **Check Installation**: Verify `bird` is installed
2. **Test Auth**: Run `bird whoami` to confirm login
3. **Start Simple**: Begin with read-only operations
4. **Plan Content**: Create tweet schedule

**Note**: Always get confirmation before posting tweets. Use for automation only with approved content templates.