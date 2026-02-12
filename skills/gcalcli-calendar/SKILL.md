---
name: gcalcli-calendar
description: "Google Calendar management for Himanshu's schedule: virtual training sessions, client calls, personal appointments, and content creation time."
metadata: {"openclaw":{"emoji":"📅","requires":{"bins":["gcalcli"]}}}
---

# Google Calendar Skill 📅

## When to Use This Skill ✅

**USE WHEN:**
- Checking Himanshu's daily schedule (virtual training, client calls)
- Scheduling new client consultations
- Managing 1-on-1 virtual training sessions (4 days/week, 8:30 AM)
- Setting reminders for content creation (Instagram reels)
- Planning weekly review sessions
- Coordinating personal appointments

**DO NOT USE WHEN:**
- Accessing other people's calendars without permission
- Scheduling outside of working hours (8 AM - 2 AM)
- Double-booking time slots
- Without checking for overlaps first

## Security & Boundaries

⚠️ **CRITICAL CONSTRAINTS:**
1. **Primary Calendar**: hims.sharma62@gmail.com (OAuth configured)
2. **Credentials**: OAuth tokens in `~/.gcalcli_oauth`
3. **Client Confidentiality**: Calendar entries may contain client names - handle discreetly
4. **No Mass Operations**: Avoid bulk deletions or modifications

## Primary Use Cases for NutriCepss

### 1. **Virtual Training Sessions**
- 4 days/week at 8:30 AM
- 1-hour sessions with individual clients
- Recurring weekly appointments

### 2. **Client Consultations**
- Initial consultation calls
- Weekly check-ins
- Progress review sessions

### 3. **Content Creation Blocks**
- Instagram reel planning/filming
- Reddit engagement time
- Email/newsletter work

### 4. **Personal Schedule**
- Gym time (3-4 PM, 2-3 hours)
- Family dinner (~9-10 PM)
- Personal development

## Configuration

### OAuth Setup
- Already configured at `~/.gcalcli_oauth`
- Using hims.sharma62@gmail.com account
- Token automatically refreshes

### Default Calendar
- Primary: hims.sharma62@gmail.com
- All calendars visible in gcalcli config

## Workflow Templates

### Daily Morning Check
```bash
# Check today's schedule
gcalcli --nocolor agenda today tomorrow

# Check tomorrow's schedule  
gcalcli --nocolor agenda tomorrow +1d
```

### Schedule Client Session
```bash
# Check for overlaps first
gcalcli --nocolor agenda "2026-02-15 08:30" "2026-02-15 09:30"

# Schedule 1-hour virtual training
gcalcli --nocolor --calendar "hims.sharma62@gmail.com" add --noprompt \
  --title "Virtual Training - Client Name" \
  --when "2026-02-15 08:30" \
  --duration 60 \
  --reminder "10 popup"
```

### Weekly Content Block
```bash
# Schedule 2-hour content creation block
gcalcli --nocolor --calendar "hims.sharma62@gmail.com" add --noprompt \
  --title "Content Creation - Instagram Reels" \
  --when "2026-02-16 14:00" \
  --duration 120 \
  --reminder "0 popup"
```

## Error Handling

**Common Issues:**
- `OAuth token expired`: gcalcli should auto-refresh
- `Calendar not found`: Check calendar name in config
- `Permission denied`: Verify OAuth scope
- `Overlap detected`: Reschedule or confirm override

**Fallback Actions:**
1. Log error to memory file
2. Notify Himanshu if critical scheduling issue
3. Use manual calendar entry as fallback
4. Retry with refreshed token

## Success Criteria

✅ **Skill executed successfully when:**
- Schedule retrieved without errors
- Events created with correct details
- Overlaps checked and handled
- Reminders set appropriately
- Actions logged in memory file

## Negative Examples

❌ **WRONG:** Scheduling outside 8 AM - 2 AM window
❌ **WRONG:** Double-booking client sessions
❌ **WRONG:** Missing overlap checks
❌ **WRONG:** Sharing calendar details publicly

✅ **CORRECT:** Checking schedule before booking
✅ **CORRECT:** Respecting working hours
✅ **CORRECT:** Setting appropriate reminders
✅ **CORRECT:** Using --nocolor for clean output

## Integration with Other Skills

### Email → Calendar
- Schedule follow-ups from important emails
- Block time for email processing

### Reddit → Calendar
- Schedule time for engagement monitoring
- Block content creation based on trends

### HubFit → Calendar
- Schedule client follow-up calls
- Plan weekly review sessions for ghosting clients

---

*The original gcalcli documentation continues below with technical details...*

## Rules

### CLI flag placement (critical)
- Global flags (`--nocolor`, `--calendar`) go BEFORE the subcommand.
- Subcommand-specific flags go AFTER the subcommand name.
- Example: `gcalcli --nocolor delete --iamaexpert "query" start end` — NOT `gcalcli --nocolor --iamaexpert delete ...`.
- This applies to ALL subcommand flags: `--iamaexpert` (delete), `--noprompt`/`--allday` (add), `--use-legacy-import` (import), etc.

### Output & language
- Don't print CLI commands/flags/tool details unless the user explicitly asks (e.g. "show commands used", "/debug", "/commands").
- If asked for commands: print ALL executed commands in order (including retries) and nothing else.
- Don't mix languages within one reply.
- Be concise. No scope unless nothing found.

### Dates & formatting
- Human-friendly dates by default. ISO only if explicitly requested.
- Don't quote event titles unless needed to disambiguate.

### Calendar scope
- Trust gcalcli config (default/ignore calendars). Don't broaden scope unless user asks "across all calendars" or results are clearly wrong.

### Agenda (today-only by default)
- If user asks "agenda" without a period, return today only.
- Expand only if explicitly asked (tomorrow / next N days / date range).

### Weekday requests (no mental math)
If user says "on Monday/Tuesday/..." without a date:
1) fetch next 14 days agenda once,
2) pick matching day/event from tool output,
3) proceed (or disambiguate if multiple).

### Finding events: prefer deterministic agenda scan (meaning-first)
When locating events to cancel/delete/edit:
- Prefer `agenda` over `search`.
- Use a bounded window and match events by meaning (semantic match) rather than exact text.
- Default locate windows:
  - If user gives an exact date: scan that day only.
  - If user gives a weekday: scan next 14 days.
  - If user gives only meaning words ("train", "lecture", etc.) with no date: scan next 30 days first.
  - If still not found: expand to 180 days and say so only if still empty.

Use gcalcli `search` only as a fallback when:
- the time window would be too large to scan via agenda (token-heavy), or
- the user explicitly asked to "search".

### Search (bounded)
- Default search window: next ~180 days (unless user specified otherwise).
- If no matches: say "No matches in next ~6 months (<from>-><to>)" and offer to expand.
- Show scope only when nothing is found.

### Tool efficiency
- Default: use `--nocolor` to reduce formatting noise and tokens.
- Use `--tsv` only if you must parse/dedupe/sort.

## Actions policy (optimized)

### Unambiguous actions run immediately
For cancel/delete/edit actions:
- Do NOT ask for confirmation by default.
- Run immediately ONLY if the target event is unambiguous:
  - single clear match in a tight window, OR
  - user specified exact date+time and a matching event exists.

If ambiguous (multiple candidates):
- Ask a short disambiguation question listing the smallest set of candidates (1-3 lines) and wait.

### Create events: overlap check MUST be cross-calendar (non-ignored scope)
When creating an event:
- Always run a best-effort overlap check across ALL non-ignored calendars by scanning agenda WITHOUT `--calendar`.
  - This ensures overlaps are detected even if the new event is created into a specific calendar.
- If overlap exists with busy events:
  - Ask for confirmation before creating.
- If no overlap:
  - Create immediately.

### Choose the right create method
- **`add`** — default for one-off events. Supports `--allday`, `--reminder`, `--noprompt`. Does NOT support recurrence or free/busy (transparency).
- **`import` via stdin** — use ONLY when you need recurrence (RRULE) or free/busy (TRANSP:TRANSPARENT). Pipe ICS content via stdin; NEVER write temp .ics files (working directory is unreliable in exec sandbox).
- **`quick`** — avoid unless user explicitly asks for natural-language add. Less deterministic.

### Deletes must be reliable
- Use non-interactive delete with `--iamaexpert` (a `delete` subcommand flag — goes AFTER `delete`).
- Verify once via agenda in the same tight window.
- If verification still shows the event, do one retry with `--refresh`.
- Never claim success unless verification confirms.

## Canonical commands

### Agenda (deterministic listing)
- Today: `gcalcli --nocolor agenda today tomorrow`
- Next 14d (weekday resolution): `gcalcli --nocolor agenda today +14d`
- Next 30d (meaning-first locate): `gcalcli --nocolor agenda today +30d`
- Custom: `gcalcli --nocolor agenda <start> <end>`

### Search (fallback / explicit request)
- Default (~6 months): `gcalcli --nocolor search "<query>" today +180d`
- Custom: `gcalcli --nocolor search "<query>" <start> <end>`

### Create — `add` (one-off events)
- Overlap preflight (tight, cross-calendar):
  - `gcalcli --nocolor agenda <start> <end>`
  - IMPORTANT: do NOT add `--calendar` here; overlaps must be checked across all non-ignored calendars.
- Timed event:
  - `gcalcli --nocolor --calendar "<Cal>" add --noprompt --title "<Title>" --when "<Start>" --duration <minutes>`
- All-day event:
  - `gcalcli --nocolor --calendar "<Cal>" add --noprompt --allday --title "<Title>" --when "<Date>"`
- With reminders (repeatable flag):
  - `--reminder "20160 popup"` → 14 days before (20160 = 14×24×60)
  - `--reminder "10080 popup"` → 7 days before
  - `--reminder "0 popup"` → at event start
  - Time unit suffixes: `w` (weeks), `d` (days), `h` (hours), `m` (minutes). No suffix = minutes.
  - Method: `popup` (default), `email`, `sms`.

### Create — `import` via stdin (recurrence / free/busy)
Use ONLY when `add` can't cover the need (recurring events, TRANSP, etc.).
Pipe ICS directly via stdin — never write temp files.
```
echo 'BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:20260308
SUMMARY:Event Title
RRULE:FREQ=YEARLY
TRANSP:TRANSPARENT
END:VEVENT
END:VCALENDAR' | gcalcli import --calendar "<Cal>"
```
- `DTSTART;VALUE=DATE:YYYYMMDD` for all-day; `DTSTART:YYYYMMDDTHHmmSS` for timed.
- `RRULE:FREQ=YEARLY` — yearly recurrence. Also: `DAILY`, `WEEKLY`, `MONTHLY`.
- `TRANSP:TRANSPARENT` — free; `TRANSP:OPAQUE` — busy (default).
- One import call = one event (one VEVENT block). For multiple events, run separate piped imports.
- Add `--reminder "TIME"` flag(s) to set reminders (overrides any VALARM in ICS).
- All import-specific flags (`--use-legacy-import`, `--verbose`, etc.) go AFTER `import`.

### Delete (no confirmation if unambiguous)
- Locate via agenda (preferred):
  - `gcalcli --nocolor agenda <dayStart> <dayEnd>` (exact date)
  - `gcalcli --nocolor agenda today +14d` (weekday)
  - `gcalcli --nocolor agenda today +30d` (meaning only)
- Delete (non-interactive, bounded):
  - `gcalcli --nocolor delete --iamaexpert "<query>" <start> <end>`
- Verify (same window):
  - `gcalcli --nocolor agenda <dayStart> <dayEnd>`
- Optional one retry if still present:
  - `gcalcli --nocolor --refresh agenda <dayStart> <dayEnd>`

### Edit / Modify existing events
- `gcalcli edit` is interactive — cannot be used in non-interactive exec.
- To change properties not editable in-place: **delete + recreate** the event.
  - Locate → delete (with `--iamaexpert`) → create with updated properties → verify.
- For bulk property changes (e.g. setting all events to free): iterate delete+recreate per event.
