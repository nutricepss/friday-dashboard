---
name: chirp
description: "X/Twitter interaction via browser automation. Use for reading timeline, posting tweets, engagement, and monitoring fitness trends."
homepage: https://github.com/zizi-cat/chirp
metadata: {"clawdhub":{"emoji":"🐦"}}
---

# X/Twitter Skill 🐦

## When to Use This Skill ✅

**USE WHEN:**
- Posting fitness/nutrition content to X/Twitter
- Engaging with fitness influencers and communities
- Monitoring trending fitness topics
- Sharing Instagram reel links
- Building professional network in fitness industry
- Researching current fitness debates and trends

**DO NOT USE WHEN:**
- Browser extension not attached (needs manual setup)
- During Twitter/X API rate limits
- Posting controversial or polarizing content
- Engaging in spammy behavior
- Without reviewing content first

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. **Browser Extension Required**: OpenClaw Browser Relay toolbar must be attached
2. **Manual Login First**: Himanshu must log in to X/Twitter in browser first
3. **Professional Content Only**: Business/personal brand content only
4. **No Automation**: Avoid fully automated posting without review

## Current Status

🚨 **BROWSER SETUP REQUIRED**
1. Himanshu needs to log in to X/Twitter in Chrome
2. Click OpenClaw Browser Relay toolbar icon
3. Tab must show "badge ON" to be attached
4. Use `profile="chrome"` for existing Chrome tabs

## Primary Use Cases for NutriCepss

### 1. **Content Distribution**
- Cross-post Instagram reel links
- Share blog posts and articles
- Post fitness tips and insights
- Engage with trending fitness topics

### 2. **Network Building**
- Follow fitness influencers
- Engage with industry experts
- Participate in fitness discussions
- Build authority in niche

### 3. **Trend Monitoring**
- Track fitness trends and debates
- Monitor competitor activity
- Research content ideas
- Stay updated on industry news

### 4. **Lead Generation**
- Share coaching success stories
- Post client testimonials (with permission)
- Offer free value through threads
- Drive traffic to website/Reddit

## Configuration

### Browser Setup
```bash
# Use existing Chrome tabs (Himanshu must attach tab first)
browser action=open profile=chrome targetUrl="https://x.com/home"

# Or use isolated OpenClaw browser
browser action=open profile=openclaw targetUrl="https://x.com/login"
```

### Profile Selection
- `profile="chrome"`: Use Himanshu's existing logged-in Chrome tabs
- `profile="openclaw"`: Isolated browser (requires login)

## Workflow Templates

### Post Tweet Workflow
```bash
# 1. Open Twitter home
browser action=open profile=chrome targetUrl="https://x.com/home"

# 2. Take snapshot to find elements
browser action=snapshot profile=chrome compact=true

# 3. Find and click tweet box (ref will vary)
browser action=act profile=chrome request={"kind":"click","ref":"textbox 'Post text'"}

# 4. Type tweet content
browser action=act profile=chrome request={"kind":"type","ref":"textbox 'Post text'","text":"Fitness tip: Consistency > intensity. Small daily habits beat occasional heroic efforts. #fitness #motivation"}

# 5. Find and click Post button
browser action=snapshot profile=chrome compact=true
browser action=act profile=chrome request={"kind":"click","ref":"button 'Post'"}
```

### Monitor Trends
```bash
# Search for fitness trends
browser action=open profile=chrome targetUrl="https://x.com/search?q=fitness+india&src=typed_query"
browser action=snapshot profile=chrome compact=true

# Check trending tab
browser action=open profile=chrome targetUrl="https://x.com/explore/tabs/trending"
browser action=snapshot profile=chrome compact=true
```

### Engage with Content
```bash
# Like tweets
browser action=act profile=chrome request={"kind":"click","ref":"button 'Like'"}

# Retweet
browser action=act profile=chrome request={"kind":"click","ref":"button 'Repost'"}
browser action=snapshot profile=chrome compact=true
browser action=act profile=chrome request={"kind":"click","ref":"button 'Repost'"}

# Reply to tweet
browser action=act profile=chrome request={"kind":"click","ref":"button 'Reply'"}
browser action=snapshot profile=chrome compact=true
browser action=act profile=chrome request={"kind":"type","ref":"textbox 'Post your reply'","text":"Great point! I'd add..."}
browser action=act profile=chrome request={"kind":"click","ref":"button 'Reply'"}
```

## Error Handling

**Common Issues:**
- `No attached tab`: Browser Relay not connected
- `Element not found`: UI changed, need new snapshot
- `Rate limited`: Wait 15-30 minutes
- `Login required`: Session expired, need re-login

**Fallback Actions:**
1. Log error to memory file
2. Notify Himanshu if browser setup needed
3. Switch to manual posting if automation fails
4. Use alternative platform (Instagram/Reddit)

## Success Criteria

✅ **Skill executed successfully when:**
- Browser connects to attached tab
- Elements found and interacted with
- Actions completed without errors
- Content posted as intended
- Actions logged in memory file

## Negative Examples

❌ **WRONG:** Posting without content review
❌ **WRONG:** Spam liking/retweeting
❌ **WRONG:** Ignoring rate limits
❌ **WRONG:** Using unattached browser tab

✅ **CORRECT:** Reviewing tweets before posting
✅ **CORRECT:** Meaningful engagement only
✅ **CORRECT:** Respecting platform limits
✅ **CORRECT:** Ensuring browser attachment

## Integration with Other Skills

### Instagram → Twitter
- Cross-post reel announcements
- Share Instagram insights as tweets
- Drive Twitter audience to Instagram

### Reddit → Twitter
- Share interesting Reddit discussions
- Cross-promote valuable content
- Engage both communities

### Email → Twitter
- Share newsletter highlights
- Tweet about email content
- Drive email signups from Twitter

## Hashtag Strategy

### Primary Hashtags
- `#fitness` `#nutrition` `#workout`
- `#fitnessindia` `#indianfitness`
- `#health` `#wellness` `#gym`

### Niche Hashtags  
- `#personaltrainer` `#onlinecoaching`
- `#fitnesstips` `#nutritiontips`
- `#supplements` `#protein`

### Trending Hashtags
- Monitor daily trends
- Participate in relevant challenges
- Use event-specific hashtags

## Next Steps

1. **Priority**: Himanshu needs to attach browser tab
2. **Test**: Start with read-only operations
3. **Content**: Plan weekly tweet calendar
4. **Engagement**: Set daily engagement goals

**Note**: This is browser-based automation, not API-based. More fragile but doesn't require API access.