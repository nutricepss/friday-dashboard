---
name: instagram
description: Instagram platform integration for NutriCepss business account. Post reels, manage content, view insights, and engage with followers.
metadata: {"clawdbot":{"emoji":"📸","always":true,"requires":{"bins":["curl","jq"]},"primaryEnv":"INSTAGRAM_ACCESS_TOKEN"}}
---

# Instagram Skill 📸

## When to Use This Skill ✅

**USE WHEN:**
- Posting Instagram Reels for NutriCepss (@nutricepssbyhimanshu)
- Scheduling daily content (reels, stories, posts)
- Checking Instagram insights and analytics
- Engaging with followers (likes, comments)
- Hashtag research for fitness content
- Content calendar management

**DO NOT USE WHEN:**
- Instagram API token is expired (404 errors)
- Posting personal or non-business content
- Engaging in spammy behavior
- Network access is restricted
- Without reviewing content first

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. **Business Account Only** - @nutricepssbyhimanshu (93 posts)
2. **Token Management** - Access token in `/home/assistant4himanshu/.openclaw/credentials/instagram-token.json`
3. **Content Review** - All posts must be reviewed by Himanshu before publishing
4. **Rate Limiting** - Respect Instagram API rate limits
5. **No Automation** - Avoid fully automated posting without human review

## Primary Use Cases for NutriCepss

### 1. **Daily Reel Posting**
- Post 1 reel daily (fitness/nutrition tips)
- Use trending audio and hashtags
- Cross-promote on Reddit when relevant

### 2. **Content Calendar**
- Schedule weekly content themes
- Plan monthly content strategy
- Track posting consistency

### 3. **Engagement & Growth**
- Respond to comments (brand voice)
- Analyze top-performing content
- Research competitor strategies

### 4. **Lead Generation**
- Convert reel viewers to coaching inquiries
- Drive traffic to Reddit/website
- Build brand authority

## Configuration

### Access Token
```bash
export INSTAGRAM_ACCESS_TOKEN="IGACPKvplLkM5BZAGJUV3ZAIOU9pMGNVX1JzYmE5RDl1TURFcm02N0xVODYyb1VPLWFhUzN6Ql82OGdmdkc5aGQwaFRERjJDTXphUFpDVXpfNE5SeFNIZAEk4TTgtTl9ZAWUt3LW95dU5IOHdNZA0VIU0g0LVo2ZA21qaWlhZAFlUSm9yQQZDZD"
```

### Token Location
- File: `/home/assistant4himanshu/.openclaw/credentials/instagram-token.json`
- Account: nutricepss
- Created: 2026-02-09 (may need refresh if 404 errors)

## Usage Examples

### Check Account Info
```bash
curl "https://graph.instagram.com/v21.0/me?fields=id,username,media_count&access_token=$INSTAGRAM_ACCESS_TOKEN"
```

### Post Media (Conceptual - requires upload capability)
```bash
# Note: Actual posting requires additional steps and permissions
```

### Get Insights
```bash
curl "https://graph.instagram.com/v21.0/me/insights?metric=impressions,reach&period=day&access_token=$INSTAGRAM_ACCESS_TOKEN"
```

## Workflow Templates

### Daily Reel Workflow
1. **Script Creation** - Write reel script based on Reddit trends
2. **Review** - Himanshu reviews script
3. **Production** - Film/edit reel (manual)
4. **Posting** - Upload with optimized caption/hashtags
5. **Engagement** - Monitor and respond to comments

### Content Planning
```bash
# Weekly content calendar
Monday: Supplement myths
Tuesday: Form tips
Wednesday: Nutrition basics
Thursday: Client success
Friday: Q&A session
Saturday: Behind scenes
Sunday: Weekly recap
```

### Hashtag Strategy
```
Primary: #fitnessindia #indianfitness #nutricepss
Secondary: #workout #nutrition #gymmotivation
Trending: #reelsindia #fitnessreels #healthylifestyle
Niche: #supplements #protein #homeworkout
```

## Error Handling

**Common Issues:**
- `HTTP 404 not_found_error`: Token expired, needs refresh
- `Rate limited`: Wait 1 hour before retry
- `Permission error`: Check token permissions
- `Invalid media`: File format/size issues

**Fallback Actions:**
1. Log error to memory file
2. Notify Himanshu immediately for token refresh
3. Switch to manual posting if API unavailable
4. Use cached content if posting fails

## Success Criteria

✅ **Skill executed successfully when:**
- Reel script created and saved to workspace
- Content reviewed and approved
- API calls return valid data (not 404)
- Insights retrieved without errors
- Actions logged in memory file

## Negative Examples

❌ **WRONG:** Posting without Himanshu's review
❌ **WRONG:** Using expired token repeatedly
❌ **WRONG:** Spam posting or excessive automation
❌ **WRONG:** Sharing personal account access

✅ **CORRECT:** Creating scripts for manual review
✅ **CORRECT:** Checking token validity before use
✅ **CORRECT:** Respecting rate limits
✅ **CORRECT:** Logging all API interactions

## Token Refresh Procedure

When `HTTP 404 not_found_error` occurs:
1. Document error in memory file
2. Notify Himanshu via Telegram
3. Guide through token refresh process:
   - Go to Facebook Graph API Explorer
   - Generate new long-lived token
   - Update instagram-token.json
   - Test with simple API call

## Integration with Other Skills

### Reddit → Instagram Pipeline
1. Reddit skill finds trending topics
2. Create reel script from trend
3. Post to Instagram
4. Cross-promote on Reddit

### Email → Instagram
1. Client questions via email
2. Create Q&A reel addressing common questions
3. Post with educational value

**Note:** Current token shows 404 errors - needs refresh before production use.