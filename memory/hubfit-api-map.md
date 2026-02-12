# HubFit API Reference

## Auth
- **Login:** `POST /api/auth/login` body: `{"email":"...","password":"...","role":"coach"}`
- **Token validation:** `GET /api/auth/authenticate_token`
- **Token storage:** Redux persist in localStorage (`persist:root` → `accessToken`), also `localStorage.token`
- **Token type:** JWT via `X-Access-Token` header (NOT Bearer auth)
- **Token expiry:** ~1 year from issuance
- **Login creds:** nutricepss@gmail.com (saved in hubfit-credentials.json)

## Required Headers
```
x-access-token: <JWT>
x-app-version: 1.0.0
x-client-platform: web
x-lib-version: 2.0.0
accept: application/json
```

## Base URL
`https://app.hubfit.com/api`

## Coach Endpoints (workspace-level)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/coach/clients` | GET | List all clients (54 total, includes archived) |
| `/exercise` | GET | Exercise library (93 exercises, with video links & notes) |
| `/nutrition/plan` | GET | All meal plans in workspace (30 plans) |
| `/training/workspace` | GET | All training programs/templates (25 programs, 4 standalone workouts, 9 sections) |
| `/form` | GET | Check-in forms & all responses (7 forms, 39 responses) |
| `/task/tasks` | GET | Coach tasks (22 tasks) |
| `/habit` | GET | Habit templates |
| `/metric` | GET | Custom metric definitions (e.g., Muscle Mass) |
| `/package` | GET | Packages & coupons |
| `/notification` | GET | Notifications (100 items) |
| `/workspace` | GET | Workspace info |
| `/referral` | GET | Referral info |
| `/chat/unread-count` | GET | Unread message count |
| `/community/communities` | GET | Community list |
| `/community/unread-count` | GET | Community unread count |

## Client-Specific Endpoints (pass `clientId` as query or path param)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/client/authenticate_access/:clientId?requestId=xxx` | GET | Client detail (name, email, units, enabled features, channelId) |
| `/training/programs/client?clientId=:id` | GET | Client's assigned workout programs (full split, exercises, completion status) |
| `/nutrition/plan?clientId=:id` | GET | Client's meal plans with full macros |
| `/client/measurements/:clientId` | GET | Weight & body measurements over time |
| `/client/notes/:clientId` | GET | Coach's private notes for client |
| `/photo?clientId=:id` | GET | Progress photos (tagged Front/Back/Side, with dates) |
| `/form/questionnaires?clientId=:id` | GET | Completed questionnaires |
| `/package/client/history?clientId=:id` | GET | Payment/subscription history |

## Client Object (from /coach/clients)
```json
{
  "name": "Apurv Jain",
  "profileImageUrl": "",
  "lastCheckinTime": "2026-02-10T04:03:12.747Z",
  "archived": false,
  "lastActive": "2026-02-10T04:05:03.275Z",
  "startDate": "2025-11-03T00:00:00.000Z",
  "endDate": "2026-02-07T00:00:00.000Z",
  "_id": "6900bbd5c60e7c5dd7dc4bec",
  "username": "apurv#7676",
  "email": "apurvjain611@gmail.com",
  "code": "0190",
  "createdAt": "2025-10-28T12:49:25.925Z"
}
```

## Coach Info
- **UID:** 684a9c2345f37f5a8e1454a8
- **Workspace ID:** 684a9c2345f37f5a8e1454a8 (same as UID for personal workspace)
- **Name:** Himanshu Sharma

## Troubleshooting Notes
- Standard REST patterns (e.g., `/coach/client/:id/plans`) return 404 — HubFit uses non-standard routing
- The only way to discover endpoints was **browser Performance API** (`performance.getEntriesByType('resource')`) — interceptors (`fetch`/`XMLHttpRequest` monkey-patch) get lost on page navigation since it's an SPA
- To log into browser: set `persist:root.accessToken` in localStorage with JSON-stringified token, then navigate to `/clients`
- `/training/program` (without `/s`) returns 400 "Missing fields" — needs POST with body
- `/community` returns 403 — likely needs a separate community feature enabled
- Token can be refreshed by calling `POST /api/auth/login` again — no refresh_token mechanism, just re-login

## Credentials
- Stored in: `/home/assistant4himanshu/.openclaw/credentials/hubfit-credentials.json`
- Login: nutricepss@gmail.com + password in credentials file
- Current token expires: Feb 2027
