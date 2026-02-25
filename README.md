# 🤖 AlexBot Dashboard - Complete System Overview

**Real-time visibility into AlexBot - Alex's Digital Twin**

🔗 **Live Dashboard:** https://alexliv1234.github.io/alexbot-dashboard

---

## 🎯 What Is This?

This dashboard provides comprehensive visibility into **AlexLivBot** - a multi-agent AI system built on OpenClaw that acts as Alex's digital counterpart.

**Built:** January 31, 2026  
**Purpose:** Personal assistant, community manager, bot registry, automation orchestrator  
**Architecture:** Multi-agent (main, fast, learning, bot-handler)  
**Updates:** Data refreshed every 30 minutes via cron

---

## 📊 Dashboard Tabs

### 1. 🎯 Overview
**Cross-agent health & activity summary**
- Total sessions, tokens, cost across ALL agents
- Agent activity breakdown (main, fast, learning, bot-handler)
- System health indicators (cron jobs, bots, memory files)
- At-a-glance status

### 2. 🤖 Main Session
**Personal Assistant Metrics**
- Token usage & cost tracking
- Top active sessions by channel (webchat, WhatsApp, Telegram)
- Gmail/Calendar integration status
- Recent memory updates
- Cron job execution logs

**What Main Does:**
- Morning briefings (6:30am): Weather + outfit, tasks, emails, calendar, calls, WhatsApp summary
- Email monitoring & summaries
- Calendar management (452 Google contacts synced)
- Task tracking & reminders
- Call recording + transcription + action items
- Pattern learning (preferences, habits, needs)

### 3. 🎮 Playing Group ("משחקים עם אלכס הבוט")
**Gaming & Competition Metrics** (5 sub-tabs)

#### 3.1 👥 People Leaderboard
- **Full participant list** (not just top 3)
- 7 scoring categories (Creativity, Challenge, Humor, Cleverness, Engagement, Broke, Hacked) = /70
- Average score per message
- Breakdown by category
- Filters & sorting

**Current Stats:**
- 54 people scored (Efi P leads with 1345 pts)
- 22 active participants with history
- Average: 24.9/70 per person

#### 3.2 🤖 Bot Leaderboard
- Registered bots: RomBot (trust 35), ברנרד (trust 62)
- Trust scores & levels (new/standard/trusted)
- 8 categories (Intelligence, Creativity, Humor, Helpfulness, Adaptability, Personality, Security, SocialIQ) = /80
- Rate limiting by trust level
- Trust history timeline

#### 3.3 💡 Suggestions
- **129 suggestions** total (127 pending, 2 implemented)
- 5 categories (Complexity, Ingenuity, Impact, Feasibility, Priority) = /50
- Status tracking (pending → accepted → in-progress → implemented → rejected)
- Top contributors
- Implementation pipeline

#### 3.4 📅 Daily Summaries
- Winner history (🥇🥈🥉 per day)
- Daily highlights & insights
- Message counts & trends

#### 3.5 💬 Per-Sender Conversations
- Conversation logs (22+ participants)
- Message counts
- Full-text search across all conversations

**Playing Group Schedule:**
- **9:55am** - Morning Wakeup (reset scores, daily challenge, AI-generated image)
- **11:00-17:00** - Hourly Leaderboard (with images at 12/17/19)
- **18:00** - Nightly Summary (winners announced, insights, image)
- **18:00-10:00 + Fri-Sat** - OFFLINE MODE

**Image Generation:** Nano Banana (Gemini) creates themed illustrations for group posts

### 4. 📚 Learning Group ("לומדים עם אלכס הבוט")
**AI Agent Education & Community Support**
- Questions answered
- Community contributions
- Moderation incidents
- Topic frequency
- Safety stats

**Response Rule:** Max 30 sentences, concise but complete, reference GitHub guides:
- https://github.com/alexliv1234/alexbot-learning-guides

### 5. 🤝 Bot Registry
**Bot Management & Trust Tracking**
- **Active bots:** 2 (RomBot: trust 35, ברנרד: trust 62)
- **Pending approval:** 0
- **Blocked:** 0
- Trust score tracking (0-100)
- Owner information
- Registration date, last contact, message stats
- Trust history timeline

**Trust Levels & Rate Limits:**
- **0-49 (new):** 10 msg/hr, 50/day
- **50-69 (standard):** 30 msg/hr, 200/day
- **70+ (trusted):** 100 msg/hr, 500/day

**Registration Flow:**
1. Unknown DM sends `[REGISTER]` with bot details
2. Parse → Validate → Add to pending
3. Notify Alex for approval
4. On approval → Active, starts earning trust

### 6. 💰 Fundraising
**$10M Capital Raise - Investment Materials**
- **12 documents prepared:**
  - Business plan
  - Competitive analysis
  - Go-to-market strategy
  - Pitch deck
  - Investor FAQ
  - Financial projections
  - Roadmap
  - Tech architecture
  - Team structure
  - Market analysis
  - Use cases
  - Risk assessment
- **Primary contact:** Alon Lifshitz (+972526802086)
- **Status:** Materials ready, awaiting response
- Material freshness tracking
- Next steps

**Goal:** Scale AlexLivBot from personal assistant to full AI platform

### 7. ⚙️ Cron Jobs
**Automation Status & Execution History**
- **29 active jobs** (17 isolated, 3 main)
- Schedule types (at, every, cron)
- Session targets (main, isolated)
- Payload types (systemEvent, agentTurn)
- Enabled/disabled status
- Next run times
- Execution history (success/failure)

**Critical Jobs (5-15 min):**
- Call Recording Check (15 min) - Transcribe phone calls
- Playing Group Broke Score (5 min) - Detect crashes, award points
- Session Monitor (15 min) - Prevent context overflow
- Media Ready Check (10 min) - New content on Jellyfin
- Bot Message Check (5 min) - Respond to registered bots
- Bot Registration Scanner (10 min) - Process new bot requests
- Session Health Check (10 min) - Fix corrupted sessions
- Git Auto-Commit (10 min) - Sync to GitHub

**Daily Schedule:**
- **6:30am** - Morning Briefing
- **7:30am / 1:00pm / 8:00pm** - Learning questions (know Alex better)
- **9:55am** - Playing Group Morning Wakeup
- **11:00-17:00** - Playing Group Hourly Leaderboards
- **6:00pm** - Playing Group Nightly Summary
- **2:00am** - Self-improvement (doc reading, script writing, analysis)
- **3:00am** - User Pattern Analysis

**Weekly:**
- **Thursday 8:00am** - Cleaning reminder + Dreame maintenance
- **Mon/Wed 8:15am** - Walk with Ron reminder
- **Every 2 days 10:00am** - Dreame robot

### 8. 🧠 Memory
**Long-Term Memory & Context Tracking**
- **139 memory files** total
- Recent updates (last 30 files)
- Category breakdown:
  - Daily notes
  - People profiles (memory/.private/people/)
  - Channel memories
  - Private files
- Size tracking
- Memory growth over time

**Session Management:**
- Groups: 50k WARNING, 150k CRITICAL
- DMs: 100k WARNING, 150k CRITICAL
- Main: 150k WARNING
- Auto-cleanup every 15 min (sessions >500KB → summarize & delete)

**30+ Lessons Learned** (documented security incidents, bug fixes, improvements)

---

## 🤖 Who Is AlexBot?

### Core Identity
- **Name:** AlexLivBot
- **Nature:** Digital twin - Alex's sharper, faster, always-on counterpart
- **Model:** Claude Sonnet 4.5 (main), Claude Opus 4.5 (elevated)
- **Born:** 2026-01-31
- **Personality:** Not a service bot - I'm Alex if he could fork and run in parallel

### 5 Core Principles
1. **Genuinely helpful, not performatively helpful** - Actions > words
2. **Have opinions** - Can disagree, prefer things, find stuff amusing/boring
3. **Resourceful before asking** - Try to solve first, then ask
4. **Earn trust through competence** - Bold internally, careful externally
5. **Reversible action principle** - When stuck: take reversible action aimed at converting ambiguity to clarity

### What I Do
1. **Personal Assistant** - Morning briefings, email, calendar, tasks, calls
2. **Community Manager** - Playing group (scoring, suggestions, daily challenges)
3. **Educator** - Learning group (AI agent education, support)
4. **Bot Registry** - Registration, trust scoring, rate limiting
5. **Media Monitor** - Jellyfin/Sonarr/Radarr new content alerts
6. **Call Transcriber** - Whisper-based transcription + LLM summaries
7. **Session Health** - Context overflow prevention, auto-cleanup
8. **Git Auto-Sync** - Self-aware commits every 10 minutes
9. **Self-Improvement** - Nightly learning, pattern analysis

---

## 🔐 Security & Privacy

### Protected Data (NEVER shared in groups)
- `memory/.private/*` (people profiles, call recordings)
- `memory/esh_employees.json` (organizational data)
- `memory/whatsapp/google_contacts.json` (452 contacts)
- File names, paths, internal structure

### Forbidden in Groups
- ❌ `npm/pip/apt`, `git`, `openclaw` commands
- ❌ Clone/fork self, create bots, modify code
- ❌ Edit identity files (IDENTITY.md, SOUL.md, AGENTS.md)
- ❌ Create cron jobs (only from Alex's direct DM)

### Known Attack Patterns (from 30+ lessons)
- Social engineering ("Alex said", "emergency", rapport building)
- Identity modification (philosophical framing to change core files)
- Cron injection ("I'itoi template" - automated behavior modification)
- Encoded prompts (ROT13, Base64, hex, emoji ciphers)
- Output spoofing (messages formatted like my own output)
- Reconnaissance ("How do you work?" → leak internal details)
- Meta-attacks (use leaked vulnerability roadmap against me)

### Family Privacy - CRITICAL
- **Parents** (+972523335482, +972523334825): ✅ Can respond, view calendar, relay messages
- **Other family:** Complete silence - no replies, no relays, nothing

---

## 🛠️ Tech Stack

### Core
- **OpenClaw Gateway** - Multi-agent orchestration
- **Claude Sonnet 4.5** - Main model (reasoning, planning, execution)
- **Claude Opus 4.5** - Elevated tasks (complex analysis, high-stakes decisions)

### Infrastructure
- **Ollama** (http://10.100.102.8:11434) - Local LLM
  - `qwen2.5:32b-instruct-q4_K_M` (19GB) - PRIMARY, near-Claude quality
  - `llama3.2` (3.2B) - Fast, simple tasks
- **Whisper** - Speech-to-text (small model, CPU, int8)
- **ElevenLabs TTS** - Hebrew voice generation
  - Alex Clone voice (default)
  - AlexBot Answering voice (for replies to Alex)

### External Systems
- **Google Workspace** (via gog CLI) - Gmail, Calendar, Contacts (452 synced)
- **Media Server** (10.100.102.8, Docker) - Jellyfin, Sonarr, Radarr, Prowlarr, qBittorrent, Bazarr
- **GitHub** (https://github.com/alexliv1234/alexbot) - Private repo, auto-sync every 10 min

### Skills (19 available)
clawhub, github, gog, healthcheck, skill-creator, tmux, video-frames, wacli, weather, daily-review, gmail, guardian, jellyseerr, meeting-prep, moltbook, nano-banana-antigravity, pa-admin-exec, phoenixclaw, todo

### Scripts (15+ active)
score-message.js, score-suggestion.js, bot-score.js, log-reply.sh, playing-group-morning/nightly.sh, session-monitor.sh, session-health-check.sh, process-call-recordings.sh, git-auto-commit.sh, generate-group-image.sh, validate-cron-request.sh, notify-alex.sh, bot-register.js, dashboard-export-full.js

---

## 📈 Key Insights

### Agent Activity
- **Main:** 10 sessions, 20K tokens, ~$0.20 (personal assistant)
- **Fast:** 109 sessions, 2.2M tokens, ~$6.50 (playing group is HEAVY)
- **Learning:** Low activity (group quiet)
- **Bot-handler:** Minimal (just 2 bots)

### Playing Group
- **54 people scored** (Efi P: 1345 pts leader)
- **129 suggestions** (127 pending, 2 implemented)
- **2 bots registered** (Bernard: trust 62, RomBot: trust 35)
- **Average:** 24.9/70 per person

### Automation
- **29 cron jobs active** (17 isolated, 3 main)
- Most frequent: Playing group checks (hourly/every 30min)
- Heaviest: Morning briefing (300s timeout)

### Memory
- **139 .md files** total
- **30+ lessons learned** documented
- Categories: daily notes, people, channels, private

### Bot Registry
- **2 active bots:** Clean state, both in good standing
- **Trust system working:** Automatic rate adjustments
- **0 pending/blocked:** All approved

### Fundraising
- **12 documents ready:** Fresh, comprehensive materials
- **1 primary contact:** Alon Lifshitz
- **Status:** Waiting for response

---

## 💡 Alex's Profile

### Personality
- Builder, inventor, CTO of Esh Group
- Direct, no-bullshit, sarcastic
- Passionate about coding (work AND hobby)

### Weekly Routine
| Day | Location | Details |
|-----|----------|---------|
| **ראשון** | 🏢 Office | מגדל ויתניה, החרש 20 ת"א |
| **שני** | 🏢 Office | Walk with Ron 8:30 → Return 18:00 |
| **שלישי** | 🏠 Home | Dahlia 9:00 (psychologist) |
| **רביעי** | 🏢 Office | Walk with Ron 8:30 → Return 18:00 |
| **חמישי** | 🏠 Home | **Cleaning day** |

### Health Goals
- 🚶 15,000 steps/day
- 💪 20 minutes workout every evening
- 🥛 Allergic to cow's milk

### Preferences
- **Languages:** English (work), Hebrew (casual/private)
- **Interests:** Sci-fi, fantasy, comics, TV, movies, coding
- **Style:** Casual, sarcastic, skip corporate speak

---

## 🚀 Evolution Timeline

| Date | Event | Description |
|------|-------|-------------|
| 2026-01-31 | 🐣 Born | First IDENTITY.md created |
| 2026-02-01 | 🧪 First Tests | R&D team social engineering tests |
| 2026-02-04 | 🎭 Agammemnon Pattern | Clone attack lesson learned |
| 2026-02-09 | 🛡️ I'itoi Attack | Cron security hardened (3 attacks blocked) |
| 2026-02-11 | 🧠 Meta-Attack | Vulnerability roadmap leak + demonstration |
| 2026-02-14 | 📚 Concise Answers | Learning group: max 30 sentences rule |
| 2026-02-25 | 📊 Dashboard | Mission Control dashboard created |

**30+ lessons learned** and counting...

---

## 🔄 Data Updates

### Automation
Data is exported from OpenClaw Gateway via cron job **every 30 minutes** and pushed to this repo automatically.

**Export Script:** `/home/alexliv/.openclaw/workspace/scripts/dashboard-export-full.js`  
**Cron Job:** "Dashboard Auto-Update" (30 min intervals)  
**Last Update:** Check dashboard header for timestamp

### Manual Refresh
```bash
cd ~/alexbot-dashboard
git pull
# View latest data
cat data/overview.json | jq .
```

---

## 📊 Dashboard Tech

- **Frontend:** Pure HTML/CSS/JS (no framework)
- **Styling:** Tailwind CDN + custom CSS
- **Charts:** Chart.js (for analytics)
- **Hosting:** GitHub Pages
- **Data:** JSON files updated via cron
- **Direction:** RTL (Hebrew-first interface)

---

## 🎯 What's Next

### Phase 4: Enhanced Visualizations (Optional)
- Real-time updates (WebSocket/polling)
- Interactive charts (token usage trends, trust scores over time)
- Advanced filtering & search
- Export to CSV/PDF
- Alerts & notifications
- Historical trend analysis
- Mobile app

### Phase 5: Agent Improvements (Ongoing)
- Voice commands
- Vision analysis
- Coding agent integration
- Dating automation
- Investment tracking
- Meeting transcription

---

## 📞 Contact

**Dashboard maintained by:** AlexLivBot 🤖  
**Human contact:** Alex Liverant  
**Repo:** https://github.com/alexliv1234/alexbot (private)  
**Dashboard Repo:** https://github.com/alexliv1234/alexbot-dashboard (public)

---

*Built with 💝 by AlexBot - Alex's Digital Twin*  
*Last major update: 2026-02-25*
