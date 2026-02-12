---
name: gmail-client
description: Read and send emails via Gmail IMAP/SMTP. Use for email maintenance, newsletter management, and client communication.
---

# Gmail Client Skill

## When to Use This Skill ✅

**USE WHEN:**
- Checking unread emails across multiple accounts
- Sending reports or summaries to Himanshu
- Managing newsletter subscriptions
- Performing email maintenance (spam cleanup)
- Client communication (suggested replies only - never send directly)

**DO NOT USE WHEN:**
- Replying to clients directly (suggest replies only)
- Sending sensitive information
- Mass email campaigns
- Accessing emails without explicit task
- Network access is restricted

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. NEVER reply to clients directly - suggest replies for Himanshu to send
2. NEVER share passwords, API keys, or credentials
3. Use assistantatnutricepss@gmail.com for sending reports
4. Credentials stored in `/home/assistant4himanshu/.openclaw/credentials/gmail-app-passwords.json`

## Configuration

### Environment Variables
```bash
GMAIL_USER="email@gmail.com"
GMAIL_PASS="app-password"
```

### Available Accounts
- `nutricepss@gmail.com` (work/primary)
- `hims.sharma62@gmail.com` (personal) 
- `swanshenterprises@gmail.com` (swansh biz)
- `assistantatnutricepss@gmail.com` (assistant)
- `nutricepss0@gmail.com` (secondary)

## Usage Examples

### List Unread Emails (Last 5)
```bash
GMAIL_USER="nutricepss@gmail.com" GMAIL_PASS="xxxx" python3 skills/gmail-client/scripts/gmail_tool.py list
```

### Send Email Report
```bash
GMAIL_USER="assistantatnutricepss@gmail.com" GMAIL_PASS="xxxx" python3 skills/gmail-client/scripts/gmail_tool.py send "nutricepss@gmail.com" "Daily Report" "Report content..."
```

### Read Specific Email
```bash
GMAIL_USER="nutricepss@gmail.com" GMAIL_PASS="xxxx" python3 skills/gmail-client/scripts/gmail_tool.py read <EMAIL_ID>
```

## Workflow Templates

### Daily Email Maintenance
1. Check all 5 accounts for unread important emails
2. Clear spam folders
3. Review newsletter subscriptions
4. Send summary to nutricepss@gmail.com

### Client Report Delivery
1. Generate report in workspace
2. Send from assistantatnutricepss@gmail.com
3. CC relevant accounts if needed
4. Log sent emails in memory file

## Error Handling

**Common Issues:**
- `Authentication failed`: Check app password validity
- `Connection refused`: Network issues or IMAP disabled
- `Rate limited`: Wait 60 seconds before retry

**Fallback Actions:**
1. Log error to memory file
2. Notify Himanshu via Telegram
3. Retry after 5 minutes if appropriate

## Success Criteria

✅ **Skill executed successfully when:**
- Email sent with correct recipient/subject/body
- Unread emails listed without errors
- Specific email retrieved successfully
- All operations logged in memory file

## Negative Examples

❌ **WRONG:** Sending email directly to client
❌ **WRONG:** Using Himanshu's personal email for reports  
❌ **WRONG:** Sharing credentials in tool output
❌ **WRONG:** Mass deleting emails without review

✅ **CORRECT:** Suggesting reply for Himanshu to send
✅ **CORRECT:** Using assistant email for reports
✅ **CORRECT:** Logging actions without exposing credentials
✅ **CORRECT:** Reviewing before bulk operations