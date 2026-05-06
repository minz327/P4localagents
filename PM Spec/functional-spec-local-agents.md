# Functional Spec: AI Observability for Local Agents

> **Author:** Min Zhou (PM) | **Date:** May 6, 2026  
> **Existing product:** AI Observability (cloud agents)  
> **What's new:** Extending coverage to local AI agents and AI apps

---

## 1. Why Local Agents Matter

### The blind spot

AI Observability today monitors **cloud-hosted agents** — bots built in Copilot Studio, Azure Foundry, or SharePoint. These are agents the organization builds and deploys centrally.

But a growing category of AI sits **outside that perimeter**:

- **Local AI agents** — AI tools that run directly on a user's device. A developer installs GitHub Copilot CLI on their laptop. A data scientist runs NemoClaw (an NVIDIA-based agent) from their terminal. An analyst uses OpenClaw to query internal data from the command line. These tools operate locally, access sensitive files and APIs, and generate sessions with risk signals — but today, the security admin has no way to see them.

- **AI apps (SaaS)** — Third-party AI services adopted across the organization. Teams sign up for ChatGPT Enterprise, Gemini for Workspace, Salesforce Einstein. These apps process organizational data but are invisible to the current dashboard.

### Why this matters to the customer

A security admin told us: *"I can see the agents we built. But I can't see the ones my developers downloaded yesterday. That's where the real risk is."*

Local agents are fundamentally different from cloud agents:
- They aren't centrally deployed — users install them on their own devices
- They aren't registered in a catalog — they're discovered through endpoint signals
- The same tool can run on multiple devices by multiple users — each combination is a separate risk surface
- They create **sessions** (not just interactions) — a user opens a terminal, runs 47 queries over 20 minutes, accesses 3 sensitive files

---

## 2. Local Agent Constructs

### What is a "local agent"?

A local agent is an AI tool installed on a user's endpoint (laptop, workstation) that processes data locally or calls external AI services from the device. Examples:

| Agent type | What it is | Risk signal |
|-----------|-----------|-------------|
| **GitHub Copilot CLI** | AI coding assistant in the terminal | May access source code, secrets, internal APIs |
| **OpenClaw** | CLI-based AI agent for data queries | May query internal databases, export sensitive results |
| **NemoClaw** | NVIDIA-powered local AI agent | May process proprietary data through local GPU inference |
| **CopilotClaw** | AI assistant extension | May access documents, emails, chat history |
| **NanoClaw** | Lightweight local AI agent | May run uncontrolled inference on sensitive inputs |

### The entity model: User × Device × Agent type

Unlike cloud agents (where each agent is a unique entity), local agents are **discovered as usage instances**. The same tool can appear multiple times:

```
Alice Johnson  ×  Laptop-ALICE-01  ×  GitHub Copilot CLI  →  Instance 1
Alice Johnson  ×  Laptop-ALICE-01  ×  CopilotClaw         →  Instance 2
Bob Chen       ×  Desktop-BOB-01   ×  GitHub Copilot CLI  →  Instance 3
Bob Chen       ×  Desktop-BOB-01   ×  NemoClaw            →  Instance 4
```

This means the admin needs to answer questions along **three dimensions:**
- **By agent type:** "How many devices are running NemoClaw?"
- **By user:** "What local AI tools is Alice using?"
- **By device:** "What's running on Laptop-ALICE-01?"

### Sessions vs. Interactions

Cloud agents have **interactions** — discrete request/response pairs. Local agents also have **sessions** — continuous usage periods where a user opens a tool and runs multiple operations:

| Concept | Cloud agents | Local agents |
|---------|-------------|-------------|
| Unit of activity | Interaction | Session (contains multiple interactions) |
| Risk signal | Per-interaction risk type | Per-session risk level + DLP event count |
| Duration | Instant | Minutes to hours |
| Example | "Copilot answered a question about payroll" | "User ran 47 CLI queries over 20 min, 3 accessed sensitive files" |

---

## 3. Customer Jobs to Be Done

### Existing AI Observability (cloud agents) answers these jobs:

| Job | How |
|-----|-----|
| "What cloud agents exist?" | Agent inventory table (Name, Status, Agent ID, Risk level, etc.) |
| "How risky are they?" | Risk level indicator (3-bar), risk types, sensitive activity trend sparkline |
| "What policies apply?" | Data protection + Data compliance policy counts |
| "Show me the details" | Agent detail page with overview, ReactFlow graph, activity explorer, recommendations |

### New jobs for local agents (what we're adding):

**Job 1: "What local AI tools are running in my org?"**

The admin doesn't know what's out there. Unlike cloud agents which are registered, local agents are shadow AI — discovered through endpoint signals. The admin needs to see:
- Which agent types exist (GitHub Copilot CLI, OpenClaw, NemoClaw, etc.)
- How many instances across how many users and devices
- At-a-glance metrics: "14 local agents across 5 agent types, 8 users, 10 devices"

**Job 2: "Who is using what tool, on which device?"**

The admin needs to pivot across the three dimensions. Example questions:
- "Show me all local AI on Bob's devices" → Filter by user
- "What's running on engineering laptops?" → Filter by device
- "How widespread is OpenClaw?" → Group by agent type
- "Which user has the most local AI tools?" → Group by user

**Job 3: "Is this local agent usage risky?"**

Same risk framework as cloud agents, but adapted for local context:
- Risk level (High/Medium/Low/None) per usage instance
- Risk types (Oversharing, Exfiltration, Unethical)
- Session-level risk: "3 high-risk sessions out of 8 total"
- DLP events per session: quantifies policy violations within each session

**Job 4: "What happened in this user's sessions?"**

The admin needs to drill into a specific user+device+tool combination and see:
- Session history: when, how long, risk level, DLP event count
- Which sessions are high-risk vs. clean
- Aggregate session stats: total sessions, high-risk count, total DLP events

**Job 5: "What SaaS AI apps are in use across my org?"**

Beyond local agents, the admin needs visibility into organizational AI apps:
- Which SaaS AI services are adopted (ChatGPT Enterprise, Gemini, Salesforce Einstein, etc.)
- Same risk and policy assessment as cloud agents
- Treated as a third surface alongside cloud and local

**Job 6: "What should I do about a risky local agent?"**

Contextual recommendations based on risk level:
- High risk → "Create a DLP policy" + "Review in Insider Risk Management"
- Medium risk → "Monitor this agent's activity"
- Low/None → "No action needed"

---

## 4. Features to Build

Each feature is tied to a customer job. Features are prioritized using a RICE-informed approach:

| Priority | Meaning | Criteria |
|----------|---------|----------|
| **P0** | Must ship | Blocks the core story. Without it, we cannot show local agent coverage. |
| **P1** | Should ship | Deepens the story. Without it, the demo is thin but still tells the narrative. |
| **P2** | Nice to have | Adds polish. Can ship after initial showcase. |

---

### P0 — F1: Three-Surface Tab Navigation
**Jobs enabled:** All — the structural change that enables everything  
**Reach:** Every user of AI Observability  
**Impact:** High — without this, local agents have no entry point

**What the admin sees:**
Three pill-shaped tabs at the top of the AI observability page:
- **Cloud Agents** (74) — with cloud icon
- **Local Agents** (14) — with device icon
- **AI Apps** (10) — with grid icon

Clicking a tab switches the entire view: metrics cards, table columns, available filters, and available grouping options. Default tab: Cloud Agents.

**Why tabs, not one table:** Cloud agents, local agents, and AI apps have different entity models. A cloud agent row = one agent. A local agent row = one user + device + tool. Mixing them in one table creates blank columns and confused semantics.

**Customer outcome:** "I see all three AI surfaces at a glance. I can jump between them without losing context."

---

### P0 — F2: Local Agents Inventory Table
**Jobs enabled:** Job 1 (discovery) + Job 2 (dimensional pivoting)  
**Reach:** Every admin who clicks the Local Agents tab  
**Impact:** High — this IS the local agents feature

**What the admin sees:** A table where each row is a usage instance (user × device × tool):

| Column | What it shows | Why it matters |
|--------|-------------|---------------|
| **Agent type** | Tool name with platform icon (e.g., GitHub Copilot CLI with octicon) | "What tool is this?" — instant visual recognition |
| **Used by** | User avatar (initials) + name | "Who is using it?" |
| **Device** | Device identifier | "On which machine?" |
| **Status** | Active/Inactive with icon | "Is it currently running?" |
| **Agent ID** | Unique instance identifier | For cross-referencing with endpoint systems |
| **Risk level** | 3-bar visual indicator (same as cloud agents) | "How risky is this instance?" |
| **Risk types** | Text label | "What kind of risk?" |
| **Sensitive activity trend** | Sparkline micro-chart | "Is risk trending up or down?" |
| **Policies** | Policy count | "Is this covered by DLP?" |

**Platform icons** provide instant tool recognition:
- GitHub Copilot CLI → Copilot octicon (goggles silhouette)
- OpenClaw → Terminal icon (dark rectangle with `>_` prompt)
- NemoClaw → NVIDIA eye logo (green)
- Others → Initials fallback

**Customer outcome:** "I can see every local AI tool instance, who's using it, where, and whether it's risky — in one scan."

---

### P0 — F3: Local-Specific Filters and Grouping
**Jobs enabled:** Job 2 (dimensional pivoting)  
**Reach:** Every admin who needs to triage local agents  
**Impact:** High — without this, 14 rows is manageable but the admin can't slice by user or device

**Filters** (dropdown pills above the table):
- Risk level, Status, Platform, Risk types — available on all tabs
- **Used by** — Local Agents tab only. "Show me just Alice Johnson's usage."
- **Device** — Local Agents tab only. "Show me just Laptop-ALICE-01."

**Group By** (dropdown in toolbar):
- Platform — available on all tabs. Groups rows by tool type.
- **User** — Local Agents tab only. Groups rows by person, showing all their tools.
- **Device** — Local Agents tab only. Groups rows by machine.

Groups are collapsible with chevron toggle and show the group name + row count.

**Customer outcome:** "Show me all AI tools on Bob's devices" is one click. "Group by device" answers "which machines have the most AI tools?"

---

### P0 — F4: Local Agents Metrics Cards
**Jobs enabled:** Job 1 (at-a-glance scope)  
**Reach:** Every admin who lands on the Local Agents tab  
**Impact:** High — the first thing the admin reads; must convey the scope of local AI

The existing metrics cards (Total agents / High risk / Risky interactions) adapt for local agents:

**Card 1 — "14 local agents across"**
- Shows 3 stat blocks: **5 Agent types** · **8 Users** · **10 Devices**
- NOT Active/Inactive (that's a cloud agent decomposition)
- Why: Local agents are defined by three dimensions. The admin needs to know the scope across all three.

**Card 2 — "4 high risk"**
- Shows High / Medium / Low breakdown with trend indicators
- Same pattern as cloud agents

**Card 3 — "13 with risky interactions"**
- Shows Oversharing / Exfiltration / Unethical breakdown with trend indicators
- Same pattern as cloud agents

All cards have 30-day trend arrows (↗ up, → flat).

**Customer outcome:** "At a glance: 14 instances, 5 different tools, spread across 8 users and 10 devices. 4 are high risk."

---

### P1 — F5: Local Agent Detail Page
**Jobs enabled:** Job 3 (risk assessment) + Job 4 (session investigation) + Job 6 (recommendations)  
**Reach:** Admins who drill into a specific usage instance  
**Impact:** Medium — completes the drill-down story; without it the table is a dead end

When the admin clicks a row in the Local Agents table, they see a detail page for that specific user + device + tool combination.

**Header:**
- User avatar + "{user name} ({device})"
- Subtitle: "Using {agent type}"
- Breadcrumb: "Local Agents › {user} ({device})"

**Usage details grid:**
- User, Device, Platform, Status, Agent ID

**Risk section:**
- Risk level badge (colored: High=red, Medium=orange, Low=yellow, None=gray)
- Session summary: "{N} high-risk session(s) ({M} total)"
- Risk type pills (Oversharing, Exfiltration, Unethical)
- Sensitive activity trend sparkline
- Deep-link: "[Post Build] view in insider risk management"

**Policies section:**
- Data protection policy count
- Data compliance policy count

**Recommendations** (contextual, based on risk level):
- **High risk:** "Create a DLP policy to protect sensitive data" + "Review user activity in Insider Risk Management"
- **Medium risk:** "Monitor this agent's activity for emerging patterns"
- **Low/None:** "No immediate action required" with checkmark

**Customer outcome:** "I clicked on Alice's GitHub Copilot CLI usage on Laptop-01. I can see she has 3 high-risk sessions, the tool is flagged for Oversharing, and the system recommends I create a DLP policy."

---

### P1 — F6: Sessions Drill-Down
**Jobs enabled:** Job 4 (session-level investigation)  
**Reach:** Admins investigating a specific risky agent instance  
**Impact:** Medium — adds session-level depth unique to local agents; differentiates from cloud agent model

From the agent detail page, the admin can drill into the session history.

**Summary cards** (3 across):
- Total sessions (count)
- High-risk sessions (count, red text)
- Total DLP events (summed across all sessions)

**Sessions table:**

| Column | What it shows |
|--------|-------------|
| Session ID | Unique ID (monospace, blue link) |
| Start time | When the session began |
| Risk level | 3-bar indicator (same as agent table) |
| # DLP events | Count (red if > 0, gray if 0) |
| Status | Active (green badge) or Ended (gray badge) |

**Customer outcome:** "Alice had 8 sessions with this tool. 3 were high-risk. Session SES-4A2F8B1C had 4 DLP events — that's the one I need to investigate."

---

### P1 — F7: AI Apps Tab
**Jobs enabled:** Job 5 (SaaS AI visibility)  
**Reach:** Every admin  
**Impact:** Medium — expands surface coverage beyond local agents; low effort since it reuses cloud agent column pattern

A third tab showing organizational AI apps. Uses the same table layout as Cloud Agents (because both are "one app = one row" entities):

**10 AI apps:**
Microsoft 365 Copilot, Security Copilot, Fabric Copilot, ChatGPT Enterprise, Gemini for Workspace, GitHub Copilot, Salesforce Einstein, ServiceNow Now Assist, Amazon Q Business, Slack AI

Same columns as Cloud Agents: Name, Platform, Status, Agent ID, Risk level, Risk types, Trend, Policies.

**Customer outcome:** "I can see ChatGPT Enterprise is Medium risk with no DLP policies. Gemini has 3 oversharing incidents this month."

---

### P2 — F8: Activity Explorer (Local Agents)
**Jobs enabled:** Job 3 (activity timeline investigation)  
**Reach:** Admins who need to see event-level detail  
**Impact:** Low for initial showcase — the session drill-down (F6) covers the most important investigation need

Same activity explorer pattern as existing, adapted for local agents:
- 14-day bar chart showing daily AI interaction counts
- Activity table: Activity type, Activity, Timestamp, App accessed in, Agent name, Agent participant, Execution type
- Filter pills: Timestamp, Activity type, Agents involved, etc.
- Pre-filtered when navigating from agent detail page

**Customer outcome:** "I can see the timeline of what this local tool did — when, what apps it touched, and whether it was human-initiated or agent-to-agent."

---

## 5. Priority Summary

| Priority | Feature | Customer Job | Effort | Dependency |
|----------|---------|-------------|--------|-----------|
| **P0** | F1: Three-surface tab navigation | All jobs | Small | None |
| **P0** | F2: Local agents inventory table | Job 1 + 2 | Medium | F1 |
| **P0** | F3: Local-specific filters + grouping | Job 2 | Small | F2 |
| **P0** | F4: Local agents metrics cards | Job 1 | Small | F1 |
| **P1** | F5: Local agent detail page | Job 3 + 4 + 6 | Medium | F2 |
| **P1** | F6: Sessions drill-down | Job 4 | Small | F5 |
| **P1** | F7: AI Apps tab | Job 5 | Small | F1 |
| **P2** | F8: Activity explorer | Job 3 | Small | F5 |

**Build order:**
```
F1 (tabs) → F2 (table) + F4 (metrics) in parallel → F3 (filters)
                                                   → F5 (detail) → F6 (sessions) → F8 (activity explorer)
F1 (tabs) → F7 (AI apps tab) — independent track
```

---

## 6. What Stays the Same

These existing AI observability features carry over unchanged:

- Dismissible banner announcing the feature
- Metrics cards layout (3 cards in a row)
- Risk level visual (3-bar indicator with High/Medium/Low/None)
- Risk types text labels
- Sparkline trend charts
- Sortable table columns (click header to sort)
- Filter pill pattern (dropdown with "Any" default)
- Row click → navigate to detail page
- Agent detail → ReactFlow architecture graph (cloud agents only, existing)
- Agent detail → Recommendations tab (6 recommendation cards)
- Activity explorer with bar chart + table
- Toolbar: Refresh, Export, Group buttons
- Sidebar navigation
- Header bar

---

## 7. What's Out of Scope

| Feature | Why excluded |
|---------|-------------|
| Governance posture cards | Not in existing AI observability |
| Review flyout with approval workflow | Not in existing |
| Incident investigation flow | Not in existing; separate feature track |
| Architecture graph for local agents | Existing graph is cloud-agent-specific |
| Bulk actions (multi-select) | Not needed at local agent scale |
| Search bar | Filter pills cover discovery needs |

---

## 8. Demo Script

> **"Let me show you how AI Observability now covers local agents."**
>
> 1. "Here's our AI Observability dashboard. You know the Cloud Agents view — but look, now we have three tabs. Cloud Agents, Local Agents, and AI Apps."
>
> 2. *Click Local Agents tab.* "We discovered 14 local AI tool instances across 5 different agent types, 8 users, and 10 devices. You can see GitHub Copilot CLI, OpenClaw, NemoClaw — each with platform icons so you can instantly recognize what's what."
>
> 3. "4 of these are high risk. Let me sort by risk level..." *Click Risk level header.* "Here — Alice Johnson is running OpenClaw on her laptop, it's flagged High for Oversharing."
>
> 4. "Let me group by user to see who has the most tools." *Click Group By → User.* "Alice has 3 different AI tools. Bob has 2."
>
> 5. *Click Alice's OpenClaw row.* "Here's the detail page. I can see she's had 3 high-risk sessions out of 5 total. The system recommends I create a DLP policy and review her activity in Insider Risk Management."
>
> 6. *Navigate to Sessions.* "I can drill into her individual sessions — Session SES-4A2F had 4 DLP events. That's where I'd start my investigation."
>
> 7. *Go back, click AI Apps tab.* "And over here, I can see 10 SaaS AI apps across the org — ChatGPT Enterprise, Gemini, Salesforce Einstein. Same risk assessment, same policy view."
>
> 8. "The bottom line: AI Observability now covers all three surfaces — cloud agents you built, local tools your users installed, and SaaS apps your teams adopted. One dashboard, full visibility."
