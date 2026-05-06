# Purview AI Observability Prototype — Project Context

> **Last updated:** May 6, 2026
> **Primary author:** Min Zhou (minz@microsoft.com)
> **Repo:** https://github.com/minz_microsoft/P4A365BwCPrototype
> **Live site:** https://purview-ai-observability-h3cwduabdycvd8ec.westus3-01.azurewebsites.net

---

## 1. What This Project Is

A **clickable prototype** for Purview AI Observability (internally called "Agent 365" / "P4A365") — a governance dashboard that helps security admins discover, assess risk, and govern AI agents deployed across their organization.

The prototype is built to support **PM customer demos, design reviews, and stakeholder alignment**. It is NOT production code — it uses mock data with no backend APIs.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5.0.9 |
| Styling | TailwindCSS |
| Routing | react-router-dom v6 |
| Graph viz | react-flow-renderer (agent details activity graph) |
| Hosting | Azure App Service (Linux, Node 20) |
| Deployment | Kudu zipdeploy API (async) |

### Deployment Details

The app deploys via Kudu zipdeploy to Azure App Service:
- **Kudu URL:** `https://purview-ai-observability-h3cwduabdycvd8ec.scm.westus3-01.azurewebsites.net`
- **Credentials:** User `$purview-ai-observability`, Pass `imX2Gj01aFDi2FjtHdAYdRe5penHs5NFX8SqdwD3yXhzClwmdvTEMj4onPj4`
- **CRITICAL:** Zip must use **forward-slash** paths (Linux host). Using `ZipFile::CreateFromDirectory` creates backslash paths that cause deployment failures (status=3). Use manual entry creation with `-replace '\\','/'`.
- **Async flag required:** `?isAsync=true` on the zipdeploy URL.
- **Success = status 4** from `/api/deployments/latest`.

### Build & Deploy Commands (PowerShell)

```powershell
# Build
npx vite build

# Package (forward-slash zip)
Copy-Item -Path dist\* -Destination deploy\dist -Recurse -Force
$deployDir = (Resolve-Path deploy).Path
$zipPath = "$env:TEMP\deploy.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
Get-ChildItem -Path $deployDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($deployDir.Length + 1) -replace '\\','/'
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel) | Out-Null
}
$zip.Dispose()

# Deploy
curl.exe -X POST --data-binary "@$zipPath" -H "Content-Type: application/zip" `
    -u '$purview-ai-observability:imX2Gj01aFDi2FjtHdAYdRe5penHs5NFX8SqdwD3yXhzClwmdvTEMj4onPj4' `
    "https://purview-ai-observability-h3cwduabdycvd8ec.scm.westus3-01.azurewebsites.net/api/zipdeploy?isAsync=true"

# Check status (wait ~15-20s)
curl.exe -s -u '$purview-ai-observability:...' ".../api/deployments/latest"
# status=4 means success
```

---

## 3. Route Architecture

The app has multiple versioned routes to support different customers/experiments:

| Route prefix | Version | Data source | Purpose |
|---|---|---|---|
| `/` | Root | `agentsData.ts` | Original base prototype |
| `/proposal` | Proposal | `proposalData.ts` | Early design proposal |
| `/proposal-b` | Proposal B | proposalData.ts | Decisioning-first variant |
| `/experiment` | Experiment | proposalData.ts | Experimental iteration |
| `/eastman` | Eastman | `eastmanData.ts` | Customized Eastman customer demo |
| `/demo` | **Demo** | `agentsData.ts` | Primary active demo version (clean copy from root) |
| `/cleveland` | Cleveland | `clevelandData.ts` | Cleveland customer demo — spike-to-action investigation prototype |
| `/local-agents` | **Local Agents** | `agentsData.ts` | Multi-surface AI observability — Cloud Agents, Local Agents, AI Apps tabs |

### Key files per version

Each version has 4 page files + 1 data file:

```
src/pages/{version}/
  {Version}Overview.tsx    — Landing page with metrics + agent table
  {Version}Agents.tsx      — Agent inventory table component
  {Version}AgentDetails.tsx — Agent detail with graph, activity, incidents
  {Version}ActivityExplorer.tsx — Activity log explorer
src/lib/
  {version}Data.ts         — Mock data (agents, incidents, types)
```

---

## 4. Eastman Version — Feature Summary

The Eastman version (`/eastman`) is the most feature-rich. The `/demo` route is the primary active demo target. All features below are in the Eastman version.

### 4.1 Three Clickable Demo Flows

**Flow 1 — Governance Inventory Table**
- 254 AI agents (25 hand-crafted + 229 procedurally generated)
- Columns organized into 3-pillar information architecture:
  - **Metadata & Config:** Name (with Agent Type · Platform subtitle), Availability (with iconography), Activities (30d)
  - **Risk:** Risk level (3-bar indicator), Risk types (colored pills)
  - **Protection & Governance:** Policy coverage, Governance state (pill), Review action
- Sortable columns, governance card-driven filtering with banner + scroll
- Row click → agent details page

**Flow 2 — Agent Review Flyout**
- Slide-in panel opened via "Review" button or "Changed since review" pill
- Overview tab: risk level, availability (with icons), policy coverage, owner, risk types, review history
- Changes tab (conditional): version diff, added/removed/changed items with color-coded badges
- Footer: "Re-review & approve" or "Mark as reviewed" action → updates governance state in-place

**Flow 3 — Incident Investigation**
- Renders on Executive Payroll Auditor agent detail page
- Red incident banner with severity, summary, destination
- File evidence table with checkboxes + "Export to eDiscovery" action
- Expandable activity timeline with sensitive event highlighting
- Evidence collection modal

### 4.2 Agent Data Model (`DemoAgent` interface in `eastmanData.ts`)

```typescript
interface DemoAgent {
  name: string
  type: 'app' | 'user'
  icon?: string                    // 'copilot' | 'excel' | 'custom'
  initials?: string                // For user-type agents
  status: 'Active' | 'Inactive'
  agentId: string
  riskLevel: 'High' | 'Medium' | 'Low' | 'None'
  riskTypes: string[]              // ['Oversharing', 'Exfiltration', 'Unethical']
  authType: 'Entra ID' | 'Shared Key' | 'Access Key' | 'Managed Identity'
  availability: 'All users' | 'Some users' | 'Blocked'
  activities30d: number            // Total activities in last 30 days
  hasDLP: boolean
  dlpPolicyCount: number
  governanceState: GovernanceState // 'Never reviewed' | 'Reviewed' | 'Changed since review'
  lastReviewedDate: string | null
  lastReviewedBy: string | null
  owner: string
  ownerEmail: string
  department: string
  agentCategory: 'Published by your org' | 'Shared by creator' | 'Microsoft' | 'External Partners'
  platform: 'Copilot Studio' | 'Azure Foundry' | 'Microsoft 365 Copilot Agent Builder' | 'SharePoint' | 'Other'
  changes?: AgentChange[]          // For Flow 2 change tracking
  previousVersion?: string
  currentVersion?: string
}
```

### 4.3 Agent Details Page (DemoAgentDetails)

- **Header:** Agent icon, name, description, breadcrumb back to inventory
- **Tabs:** Overview | Recommendations
- **Overview tab contents:**
  - Agent details grid (status, collection, platform, tools, policy, owner, etc.)
  - Activity section with risk level card (3 risk type counters with trend indicators)
  - 30-day sensitive activity trend chart (stacked bar chart)
  - Recommendations preview (Data Security Investigations, Communication Compliance)
  - Incident section (Flow 3) for specific agents
- **Activities graph:** ReactFlow-based node graph showing agent → users, knowledge sources, tools, agents with expandable groups and risk highlighting
- **Recommendations tab:** Full recommendation cards with action buttons

### 4.4 Overview Page (DemoOverview / EastmanOverview)

- **Banner:** Promotional "Agent 365 is now available" banner (dismissible)
- **Metrics cards:** Total apps (active/inactive), High risk agents (by level), Sensitive interactions (by type) — computed from actual agent array via `useMemo`
- **Governance posture cards:** 4 clickable cards (Needs review, No policy, Changed since review, Never reviewed) with active ring highlight
- **Card click → table filter:** Clicking a governance card filters the table below, shows a filter banner, auto-scrolls to table, and highlights the active card
- **Toolbar:** Search, filter chips (Risk level, Department, Risk types), Add filter button

---

## 4b. Local Agents Version — Feature Summary

The Local Agents version (`/local-agents`) implements multi-surface AI observability with three distinct tabs, each optimized for a different AI surface type.

### Navigation: Three-Tab Architecture

| Tab | Entity (row) | Metric unit | Columns |
|---|---|---|---|
| **Cloud Agents** (74) | Agent | Interactions | Name, Platform, Status, Agent ID, Risk level, Risk types, Risk activity trend, Policies |
| **Local Agents** (14) | User + Device + Platform instance | Interactions + Sessions | Agent type, Used by, Device, Status, Agent ID, Risk level, Risk types, Risk activity trend, Policies |
| **AI Apps** (10) | App | Interactions | Name, Platform, Status, Agent ID, Risk level, Risk types, Risk activity trend, Policies |

### Design Principles

1. **One entity model per view** — Cloud Agents = agent rows, Local Agents = user/device/platform instances, AI Apps = app rows
2. **Reuse components only when semantics match** — Cloud Agents and AI Apps share identical table columns (both interaction-based)
3. **No conditional columns** — Each tab has 100% column fill rate; no columns that are blank for some row types
4. **Strict surface separation** — Never combine Cloud Agents, Local Agents, and AI Apps into one table

### Local Agents Tab — Unique Design

- **Row = usage instance** — Each row represents one user + device + agent tool combination (e.g., "Alice Johnson using GitHub Copilot CLI on Laptop-01")
- **Agent type column** — Shows the local AI tool name (GitHub Copilot CLI, OpenClaw, NemoClaw, NanoClaw, CopilotClaw) with platform-specific icons
- **Used by column** — Shows user avatar (initials circle) + user name
- **Device column** — Shows device identifier
- **Metrics Card 1** — "14 local agents" headline with Agents/Users/Devices stat blocks (not Active/Inactive)
- **Filters** — Used by and Device filters only appear on Local Agents tab
- **Group By** — User and Device grouping only available on Local Agents tab

### AI Apps Tab — Reuses Cloud Agents Pattern

10 AI app entries: Microsoft 365 Copilot, Security Copilot, Fabric Copilot, ChatGPT Enterprise, Gemini for Workspace, GitHub Copilot, Salesforce Einstein, ServiceNow Now Assist, Amazon Q Business, Slack AI.

### Platform Icons (Local Agents)

- **GitHub Copilot CLI** — Official Copilot octicon (goggles silhouette)
- **OpenClaw** — Terminal icon (dark rectangle with `>_` prompt in red)
- **NemoClaw** — NVIDIA eye logo (white on green)
- **NanoClaw / CopilotClaw** — User initials fallback

### Data Model

All three tabs share `agentsData.ts` with `hosting` field distinguishing surfaces:
- `hosting: 'cloud'` → Cloud Agents tab
- `hosting: 'local'` → Local Agents tab (includes `userName`, `device`, `sessions` fields)
- `hosting: 'aiapp'` → AI Apps tab

### Key Files

```
src/pages/local-agents/
  LocalAgentsOverview.tsx      — Tab pills, metrics, toolbar, table container
  LocalAgentsAgents.tsx        — Data-driven table with tab-specific columns, filters, sorting, grouping
  LocalAgentsAgentDetails.tsx  — Agent detail page adapted for local agents (user/device header, risky interactions/sessions)
  LocalAgentsActivityExplorer.tsx
  LocalAgentsSessions.tsx      — Session drill-down page
```

---

## 5. Design Decisions & Rationale

### 5.1 Column Framework (3-Pillar IA)

Columns follow analyst mental model: **Identify → Assess → Act**

| Pillar | Columns | Job |
|---|---|---|
| Metadata & Config | Name, Availability, Activities (30d) | "What is this agent?" |
| Risk | Risk level, Risk types | "What's the concern?" |
| Protection & Governance | Policy coverage, Governance state, Actions | "Is it controlled?" |

### 5.2 Removed Columns — Rationale

| Removed | Why |
|---|---|
| Authentication | Config detail better suited for detail page, broke the risk/governance scan flow |
| Deployment (All users / Some users) | Redundant with Availability — both answer "who can access this?" |
| Last run (datetime) | Point-in-time with no severity signal. Replaced with Activities (30d) as blast-radius proxy |

### 5.3 Added Columns — Rationale

| Added | Why |
|---|---|
| Availability | Answers "who can use this?" with semantic iconography (globe=all, people=some, slash=blocked) |
| Activities (30d) | Volume proxy for blast radius. High-risk agent with 11K activities is more urgent than one with 12. Progressive font weight for visual scanning. |
| Agent Type · Platform (subtitle) | Shows provenance and origin without extra column — critical for "is this ours?" triage |

### 5.4 Governance States

Originally 4 states; "Review expired" was merged into "Changed since review" to reduce cognitive load:

| State | Color | Meaning |
|---|---|---|
| Never reviewed | Gray | No governance review has ever occurred |
| Reviewed | Green | Reviewed and approved |
| Changed since review | Amber | Agent was modified after last review — needs re-review |

### 5.5 Interaction Model (Planned — Not Yet Implemented)

Three distinct click zones per table row (Option A from design review):

| Zone | Action | Destination |
|---|---|---|
| Agent name (blue link) | Click | Agent Details → Overview tab |
| Activities count (blue link) | Click | Agent Details → Activities tab |
| Review button | Click | Review flyout (stays on inventory) |

This removes the full-row click to eliminate competition with the Review button. Maps to three user jobs: Investigate, Triage activities, Govern.

---

## 6. Naming History

| Original | Renamed to | Why |
|---|---|---|
| "DLP coverage" | "Policy coverage" | More inclusive of all policy types, not just DLP |
| "Review expired" | (merged into "Changed since review") | Reduced from 4 to 3 governance states for clarity |
| "Demo" version | "Eastman" version | Customer-specific. Demo route reset to clean root copy. |

---

## 7. Data Generation

The Eastman version has 254 agents total:
- **25 hand-crafted** agents with specific names, risk profiles, and governance states designed for demo scenarios
- **229 procedurally generated** agents via `_genAgents()` function using word banks and deterministic seeding
- Key demo agents:
  - **Executive Payroll Auditor** — Flow 3 target (exfiltration incident)
  - **M&A Deal Room Assistant** — Flow 2 target (6 changes since review)
  - **Patent Application Generator** — Changed since review (high risk)
  - **Customer PII Retriever** — Never reviewed (high risk)

### Distribution (designed to be realistic)
- Status: 253 active, 1 inactive
- Risk: ~15 high, ~40 medium, ~80 low, ~119 none
- Governance: ~43 changed, ~40 never reviewed, ~171 reviewed
- Availability: ~50% all users, ~40% some users, ~10% blocked

---

## 8. Open Items / Next Steps

### P0 — Ready to Implement
1. **Three-zone interaction model** — Remove row click, make name and activities count clickable links, keep Review button as flyout trigger
2. **Activities tab on agent details** — Wire up existing `ActivitiesContent` (ReactFlow graph) as a 3rd tab
3. **Activities count link** — Make the number in the table a blue link that opens details pre-set to Activities tab (`?tab=Activities`)

### P1 — Design Review Needed
4. **Inline sparkline** option for Activity column — mini 30-day chart in the table cell (adds visual pattern recognition but may add noise at 254 rows)
5. **Agent detail page enrichment** — Use actual `DemoAgent` data (availability, activities30d, agentCategory, platform) in the detail page instead of hardcoded "Sales Agent" content

### P2 — Backlog
6. **Bulk review actions** — Multi-select agents for batch review
7. **Activity explorer linking** — Deep-link from activities count to the activity explorer filtered for that agent
8. **Search** — Wire up the search bar in the toolbar to filter agents by name
9. **Column visibility toggle** — Let users show/hide columns

---

## 9. File Index

```
src/
├── App.tsx                          # Router with all version routes
├── main.tsx                         # Entry point
├── styles.css                       # Global styles + slide-in animation
├── ErrorBoundary.tsx
├── components/
│   ├── Header.tsx                   # Top nav bar
│   ├── MainLayout.tsx               # Sidebar + content layout
│   ├── Metrics.tsx                  # Org-wide metrics cards (accepts optional data prop)
│   ├── Sidebar.tsx                  # Left navigation
│   ├── SidebarIcons.tsx
│   └── SensitiveActivityTrend.tsx
│   └── cleveland/                   # Cleveland-specific components
│       ├── ClevelandMetrics.tsx
│       ├── CopilotPanel.tsx
│       ├── CopilotPromptBar.tsx
│       ├── NotificationPanel.tsx
│       └── QuickInvestigateModal.tsx
├── lib/
│   ├── agentsData.ts                # Root mock data (original 25 agents)
│   ├── eastmanData.ts               # Eastman: 254 agents, incidents, governance types
│   ├── clevelandData.ts             # Cleveland: anomaly/spike data, enrichment helpers
│   ├── demoData.ts                  # (Legacy — was used by old demo, now eastmanData)
│   ├── proposalData.ts              # Proposal variant data
│   └── mockApi.ts                   # Simulated API helpers
├── pages/
│   ├── Overview.tsx                 # Root landing
│   ├── Agents.tsx                   # Root agent table
│   ├── AgentDetails.tsx             # Root agent detail
│   ├── ActivityExplorer.tsx         # Root activity explorer
│   ├── demo/                        # Fresh copy from root (clean slate)
│   │   ├── DemoOverview.tsx
│   │   ├── DemoAgents.tsx
│   │   ├── DemoAgentDetails.tsx
│   │   └── DemoActivityExplorer.tsx
│   ├── eastman/                     # Eastman customer demo
│   │   ├── EastmanOverview.tsx      # Banner + Metrics + Governance cards + Table
│   │   ├── EastmanAgents.tsx        # 3-pillar table + Review flyout
│   │   ├── EastmanAgentDetails.tsx  # Detail page + ReactFlow graph + Incidents
│   │   └── EastmanActivityExplorer.tsx
│   ├── cleveland/                   # Cleveland customer demo (spike-to-action)
│   │   ├── ClevelandOverview.tsx
│   │   └── ClevelandAgentDetails.tsx
│   ├── proposal/                    # Earlier design proposals
│   └── experiment/                  # Earlier experiments
├── deploy/
│   ├── server.js                    # Express static server for Azure
│   └── package.json
└── design/
    ├── design-options-anomaly-alerts.md
    ├── design-options-investigation-flow.md
    └── design-review-summary.md
```

---

## 10. Key Learnings

1. **Deployment zip paths matter** — Linux Azure App Service requires forward-slash paths in zip entries. `.NET ZipFile::CreateFromDirectory` uses backslashes which causes silent deployment failures.
2. **Metrics should derive from data** — Hardcoded metrics (e.g., "254 agents") got out of sync when we expanded the dataset. Now `Metrics` component accepts an optional `MetricsData` prop computed via `useMemo` from the actual agent array.
3. **Fewer governance states = clearer UX** — 4 states (including "Review expired") confused testers. Merging to 3 states reduced cognitive load without losing information.
4. **Column count vs. information density** — 9 columns was too wide. Removing redundant columns (Authentication, Deployment, Last run) and replacing with higher-signal ones (Availability with icons, Activities 30d) improved scannability.
5. **Click zone competition** — Full-row click conflicts with in-row buttons (Review). Separate click zones per JTBD is the better pattern for admin tables.
