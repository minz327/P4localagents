# Design Options: Investigation Drill-Down & Owner Enrichment

## Customer Signal
> "It's great here… but it is hard to go backwards from this information."
> "We see a spike, but then what? Who owns this agent? What subscription is it under? We end up in five different portals."
> — BWC Healthcare Customer

**RICE Score: 5,000** | Priority: #2 Strategic Investment

---

## Problem Statement
When admins detect an anomaly or risky behavior in an AI agent, the current investigation flow breaks down at two critical points:

1. **Identity gap**: The agent detail page shows the agent ID and a hardcoded owner, but lacks subscription context, resource group, Azure tenant mapping, or organizational hierarchy.
2. **Action gap**: After seeing a spike on the dashboard, there's no clear drill-down path from "something is wrong" → "here's exactly what happened" → "here's what I should do about it."

The customer described being stuck in a "dead end" — they can see the risk but can't trace it back to actionable context without pivoting to 5+ different portals.

### Jobs To Be Done
- **When** I see a risky agent on the dashboard, **I want to** drill down to its full context (owner, subscription, resources, timeline), **so I can** take remediation action without leaving this portal.
- **When** I'm investigating a sensitive activity, **I want to** see who is responsible and what resources are involved, **so I can** escalate or remediate with the right stakeholder.

### Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Portals visited per investigation | 5+ | 1 |
| Time from detection to owner contact | 30-60 min | < 5 min |
| Investigation completion rate | ~40% | > 85% |
| Context switches per investigation | 8+ | 2 |

---

## Design Option A: **Enhanced Agent Detail Page — Enriched Identity Panel**

### Concept
Extend the existing Agent Detail "Overview" tab with a rich identity section that surfaces owner, subscription, resource group, and organizational context directly inline. No new pages — just deeper data in the existing layout.

### Visual Specification

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back / Agents / M&A Deal Room Assistant                     │
│                                                                 │
│  🔷 M&A Deal Room Assistant                                    │
│  [This agent helps the North America Sales team...]             │
│                                                                 │
│  Overview | Activities | Recommendations | Policies             │
│  ═══════                                                        │
│                                                                 │
│  ┌─── Agent Details (expanded) ────────────────────────────┐   │
│  │                                                          │   │
│  │  Status        Collection      Platform        Tools     │   │
│  │  ✅ Active     Global, Sales   Agent 365       SP, CRM…  │   │
│  │                                                          │   │
│  │  Policy        Created         Owner           Agent ID  │   │
│  │  0 pol (10)    Nov 3, 2025     John Brown      Fin.M&A…  │   │
│  │                                                          │   │
│  │  ┌─── NEW: Resource Context ──────────────────────────┐ │   │
│  │  │                                                     │ │   │
│  │  │  Subscription         Resource Group    Tenant      │ │   │
│  │  │  🔑 Contoso-Prod      rg-ai-agents    contoso.com  │ │   │
│  │  │  ID: a1b2c3d4…        East US 2        AAD linked   │ │   │
│  │  │                                                     │ │   │
│  │  │  Department           Cost Center       Manager     │ │   │
│  │  │  Sales Operations     CC-4420          Sarah Kim    │ │   │
│  │  │                                        Dir. of Sales│ │   │
│  │  │                                        ✉ Escalate   │ │   │
│  │  │                                                     │ │   │
│  │  │  Registered Users (3)                               │ │   │
│  │  │  👤 Riley Chen (Marketing) — 36 activities          │ │   │
│  │  │  👤 Morgan Lee (Editor)    — 24 activities          │ │   │
│  │  │  👤 Jordan Patel (Admin)   — 18 activities          │ │   │
│  │  │                                                     │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Activity                                                       │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
```

### New Fields (Resource Context Section)

| Field | Source | Type |
|-------|--------|------|
| Subscription | Azure Resource Manager | Link to subscription |
| Subscription ID | ARM | Monospace, truncated |
| Resource Group | ARM | Text + region badge |
| Tenant | Entra ID | Domain name |
| Department | Entra ID / HR system | Text |
| Cost Center | SAP / Finance API | Text |
| Manager | Entra ID org chart | Name + title + email action |
| Registered Users | Agent registration | List with activity counts |

### Design Tokens
| Element | Token | Value |
|---------|-------|-------|
| Section bg | `colorNeutralBackground2` | `#FAFAFA` |
| Section border | `colorNeutralStroke2` | `#E0E0E0` |
| Section header | `fontSizeBase300` / `fontWeightSemibold` | 14px / 600 |
| Field label | `colorNeutralForeground3` | `#616161` |
| Field value | `colorNeutralForeground1` | `#242424` |
| Escalate button | `colorBrandForeground1` | `#0078D4` |
| User list avatar | 24x24 circle, `colorNeutralBackground3` | `#F0F0F0` |
| Subscription badge | `colorBrandBackground2` | `#EBF3FC` + `#0078D4` text |

### States
1. **Loading** — Skeleton placeholders for enrichment fields (shimmer animation)
2. **Populated** — Full data displayed
3. **Partial** — Missing fields show "Not available" with info tooltip
4. **Error** — "Could not load resource context" with retry link

### Interactions
- **Manager name** → Click to open Entra ID profile in new tab
- **"✉ Escalate"** → Opens pre-filled email/Teams message: "Agent [name] has [risk type] activity requiring review"
- **Subscription link** → Opens Azure portal subscription blade (new tab)
- **User names** → Click navigates to user detail in right panel (existing pattern)

### Pros
- Natural extension of existing page layout
- No new navigation paradigm to learn
- All context in one place
- "Escalate" action directly from context

### Cons
- Page can get long with all details expanded
- Requires backend API enrichment (ARM, Entra ID)
- May overwhelm for simple investigations

---

## Design Option B: **Breadcrumb Drill-Down Path with Context Sidebar**

### Concept
Create a progressive drill-down flow from Dashboard → Agent → Activity → Resource, with a persistent context sidebar that maintains the investigation trail. The sidebar acts as an "investigation notebook" that accumulates context as the user drills deeper.

### Visual Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│  AI observability > M&A Deal Room Assistant > Oversharing #1           │
│  ═══════════════════════════════════════════════════════════            │
│                                                                         │
│  ┌──────────────────────────────┐  ┌────────────────────────────────┐  │
│  │  Activity Detail             │  │  Investigation Context    📌   │  │
│  │                              │  │  ─────────────────────────     │  │
│  │  Posted sensitive document   │  │                                │  │
│  │  to public SharePoint site   │  │  🔷 Agent                     │  │
│  │                              │  │  M&A Deal Room Assistant      │  │
│  │  ┌─ Timeline ──────────┐    │  │  Risk: High | Oversharing     │  │
│  │  │ 08:12 Agent started │    │  │  Owner: John Brown             │  │
│  │  │ 08:13 Queried SP    │    │  │  Dept: Sales Operations       │  │
│  │  │ 08:14 ⚠ Accessed    │    │  │                                │  │
│  │  │       Payroll-Q4.xlsx│    │  │  🔑 Subscription              │  │
│  │  │ 08:15 Posted to     │    │  │  Contoso-Prod (East US 2)     │  │
│  │  │       public site   │    │  │  RG: rg-ai-agents             │  │
│  │  │ 08:16 Agent ended   │    │  │                                │  │
│  │  └─────────────────────┘    │  │  👤 User                       │  │
│  │                              │  │  Riley Chen (Marketing)       │  │
│  │  Resources accessed (4)      │  │  36 activities | 7 sensitive  │  │
│  │  📄 Payroll-Q4.xlsx ⚠       │  │                                │  │
│  │  📄 CompPlan-2026.docx ⚠    │  │  📄 File                      │  │
│  │  📄 M&A-Notes.pdf           │  │  Payroll-Q4.xlsx              │  │
│  │  📄 Board-Draft.pptx        │  │  Sensitivity: Confidential    │  │
│  │                              │  │  Labels: Financial, PII       │  │
│  │  [Take action ▾]            │  │                                │  │
│  │                              │  │  ─────────────────────────     │  │
│  └──────────────────────────────┘  │  [✉ Escalate to owner]        │  │
│                                     │  [🛡 Apply DLP policy]         │  │
│                                     │  [📋 Create investigation]     │  │
│                                     │  [📤 Export context]           │  │
│                                     └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Layout Architecture

**Left Panel (60% width): Activity Detail**
- Timeline view of agent execution steps
- Resource list with sensitivity indicators
- Expandable step details on click
- "Take action" dropdown at bottom

**Right Panel (40% width): Investigation Context Sidebar**
- Sticky/pinned panel that accumulates context as user navigates
- Sections auto-populate based on what the user has clicked:
  - Agent context (always shown)
  - Subscription/resource context (loaded on drill-in)
  - User context (when user node clicked)
  - File context (when file node clicked)
- Action buttons at bottom tied to accumulated context

### Component Breakdown

**1. Investigation Breadcrumb**
```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">AI observability</BreadcrumbItem>
  <BreadcrumbItem href="/agents/{id}">M&A Deal Room Assistant</BreadcrumbItem>
  <BreadcrumbItem current>Oversharing Activity #1</BreadcrumbItem>
</Breadcrumb>
```

**2. Activity Timeline**
- Vertical stepper using Fluent `Timeline` pattern
- Each step: timestamp + action + resource affected
- Risk steps highlighted: red left border + `⚠` icon + `colorPaletteRedBackground1` bg
- Clickable steps expand to show raw event data

**3. Investigation Context Sidebar**
- Sections: Agent → Subscription → User → File (progressive)
- Each section has a header, 3-4 key/value pairs, and a "View full details →" link
- Pinnable: user can pin/unpin sections
- Exportable: "Export context" generates JSON or PDF

**4. Action Bar**
| Action | Description | Navigation |
|--------|-------------|------------|
| ✉ Escalate to owner | Pre-filled email to agent owner + manager | mailto: or Teams deeplink |
| 🛡 Apply DLP policy | Quick apply DLP policy to agent resources | Opens policy wizard |
| 📋 Create investigation | Creates Data Security Investigation case | Opens DSI flow |
| 📤 Export context | Downloads investigation context as JSON/PDF | Browser download |

### Design Tokens
| Element | Token | Value |
|---------|-------|-------|
| Timeline line | `colorNeutralStroke2` | `#E0E0E0` |
| Timeline dot (normal) | `colorNeutralBackground5` | `#D1D1D1` |
| Timeline dot (risk) | `colorPaletteRedBackground3` | `#C50F1F` |
| Timeline step bg (risk) | `colorPaletteRedBackground1` | `#FDE7E9` |
| Sidebar bg | `colorNeutralBackground2` | `#FAFAFA` |
| Sidebar section header | `fontWeightSemibold` / `fontSize13` | 600 |
| Action buttons | `compound button` variant | Fluent compound |
| Breadcrumb | Fluent `Breadcrumb` component | Default tokens |

### States
1. **Initial** — Only agent context section populated in sidebar
2. **Enriching** — Shimmer loading for subscription/resource data
3. **Fully populated** — All 4 context sections filled
4. **Action taken** — Green checkmark badge on completed actions
5. **Collapsed** — Sidebar can collapse to icon-only rail (arrow toggle)

### Accessibility
- Sidebar: `role="complementary"`, `aria-label="Investigation context"`
- Timeline: `role="list"` with `role="listitem"` steps
- Actions: `role="toolbar"` with labeled buttons
- Keyboard: Tab through timeline steps, Enter to expand, Tab to sidebar

### Pros
- Progressive disclosure — starts simple, accumulates depth
- Side-by-side layout reduces context switching
- Investigation trail is exportable for compliance
- Action buttons directly connected to context

### Cons
- Significant new UI surface area
- Requires backend enrichment APIs
- Complex state management (accumulated context)

---

## Design Option C: **Dashboard-to-Agent Quick Investigation Flow**

### Concept
The fastest path from "I see a problem" to "I understand the problem": add a right-click / kebab menu "Quick investigate" on agent rows in the dashboard table, which opens a focused investigation overlay without full page navigation.

### Visual Specification

```
Agent Table Row (existing):
┌──────────────────────────────────────────────────────────────────┐
│  🔷 M&A Deal Room   Active   Fin.M&A...   ███ High   ···  ⋮   │
│                                                              │   │
│                                                    ┌─────────┤   │
│                                                    │ View    │   │
│                                                    │ Quick   │   │
│                                                    │ invest… │   │
│                                                    │ Copy ID │   │
│                                                    └─────────┘   │
└──────────────────────────────────────────────────────────────────┘

Quick Investigation Overlay (modal):
┌─────────────────────────────────────────────────────────────────┐
│  Quick Investigation: M&A Deal Room Assistant              ✕    │
│  ═══════════════════════════════════════════════                 │
│                                                                  │
│  ┌─── Summary ──────────────────────────────────────────────┐   │
│  │  Risk: ███ High (Oversharing)    Status: ✅ Active       │   │
│  │  Owner: John Brown (Sales Ops)   Subscription: Contoso   │   │
│  │  Last activity: 2 hours ago      Trend: ↗ 150%          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── Recent Sensitive Activities (Top 5) ──────────────────┐   │
│  │  ⚠ Posted sensitive doc to public SP    June 24  Over…   │   │
│  │  ⚠ 402 unlabeled sensitive files        June 24  Over…   │   │
│  │  ⚠ Created public sharing link          June 24  Over…   │   │
│  │    Queried CRM for customer list        June 23          │   │
│  │    Drafted follow-up email              June 23          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─── Connected Resources ──────────────────────────────────┐   │
│  │  👤 3 Users   📁 5 Files (2 sensitive)   🔧 13 Tools    │   │
│  │  🤖 3 Agents (1 risky)                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Open full details]  [✉ Escalate]  [🛡 Apply policy]          │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

**1. Kebab Menu on Agent Rows**
- Add `⋮` (more options) button on each row
- Menu items: "View details", "Quick investigate", "Copy agent ID"
- Also accessible via right-click context menu on row

**2. Quick Investigation Modal**
- Width: 720px, centered overlay
- Max height: 80vh, scrollable
- Sections:
  - **Summary bar**: Risk, status, owner, subscription, trend — all at-a-glance
  - **Recent activities**: Top 5 sensitive activities with risk badges
  - **Connected resources**: Compact count summary with icons
  - **Actions**: Full-width button bar at bottom

**3. Summary Bar Layout**
- 2-row grid: 3 columns each
- Row 1: Risk level (with blocks), Status (with icon), Owner (with avatar)
- Row 2: Subscription (with key icon), Last activity (relative time), Trend (with arrow)

### Design Tokens
| Element | Token | Value |
|---------|-------|-------|
| Modal bg | `colorNeutralBackground1` | `#FFFFFF` |
| Modal shadow | `shadow64` | Fluent elevation |
| Summary bar bg | `colorNeutralBackground2` | `#FAFAFA` |
| Activity risk row | `colorPaletteRedBackground1` | `#FDE7E9` |
| Activity risk icon | `Warning16Regular` | `#C50F1F` |
| Resource count icons | Various Fluent icons | `#616161` |
| Action primary | `Button appearance="primary"` | `#0078D4` |
| Kebab menu | `Menu` + `MenuItem` | Default Fluent |

### States
1. **Loading** — Modal opens with shimmer skeleton
2. **Populated** — Full data shown
3. **No sensitive activity** — Green summary: "No sensitive activities in the last 30 days"
4. **Error** — Retry banner within modal

### Interactions
- Double-click on agent row → Quick investigate (power user shortcut)
- "Open full details" → navigates to `/agents/{id}`
- Activity rows clickable → expands detail inline or navigates
- "Escalate" → Same email/Teams flow as Option A

### Pros
- Fastest triage path — no page navigation needed
- Reduces time from alert to context to < 10 seconds
- Non-destructive — doesn't lose dashboard context
- Works well for batch investigation (check multiple agents)

### Cons
- Modal has limited real estate for complex investigations
- Still requires "Open full details" for deep dives
- Doesn't solve the full investigation trail need

---

## Recommendation Matrix

| Criteria | Option A: Enriched Detail | Option B: Drill-Down + Sidebar | Option C: Quick Investigate |
|----------|--------------------------|-------------------------------|---------------------------|
| **Speed to triage** | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| **Investigation depth** | ★★★★☆ | ★★★★★ | ★★★☆☆ |
| **Context switching** | ★★★★☆ | ★★★★★ | ★★★★★ |
| **Implementation effort** | Medium (3-5 days) | High (8-12 days) | Medium (4-6 days) |
| **Dashboard integration** | Low | Low | High |
| **Owner enrichment** | ★★★★★ | ★★★★★ | ★★★★☆ |
| **Scalability** | High | Very High | Moderate |
| **M365 pattern fit** | Detail pane | Security investigation | Quick actions |

### Recommended Approach: **Option C (Quick Investigate) + Option A (Enriched Detail)**

This combination addresses both customer pain points optimally:

1. **Option C** gives the "fast path" — admin sees spike on dashboard, right-clicks, gets instant context summary with owner + subscription without leaving the page.
2. **Option A** provides the "deep path" — when they need full investigation, the agent detail page has all enrichment data inline.

Together they create a **progressive investigation funnel**:
```
Dashboard (spot anomaly)
    → Quick Investigate modal (10-second triage)
        → Full Agent Detail with enrichment (deep investigation)
            → Activity timeline with context sidebar (forensic analysis)
```

### Implementation Phases
1. **Phase 1 (Sprint 1):** Option A — Add resource context section to Agent Detail Overview
2. **Phase 2 (Sprint 2):** Option C — Kebab menu + Quick Investigate modal on agent table
3. **Phase 3 (Sprint 3):** Select elements of Option B — Activity timeline enhancement

---

## Data Requirements

### API Enrichment Endpoints Needed

| Data | Source API | Latency | Cacheability |
|------|-----------|---------|-------------|
| Subscription name/ID | Azure Resource Manager | 200ms | 1 hour |
| Resource group + region | ARM | 200ms | 1 hour |
| Tenant info | Entra ID | 100ms | 24 hours |
| Owner name + email | Entra ID | 100ms | 1 hour |
| Manager (org chart) | Microsoft Graph | 300ms | 1 hour |
| Department + cost center | Entra ID / HR connector | 500ms | 24 hours |
| Sensitivity labels | Microsoft Purview | 200ms | 30 min |
| Recent activities (top 5) | Purview activity store | 500ms | 5 min |

### Mock Data Model (for prototyping)

```typescript
interface AgentEnrichment {
  subscription: {
    name: string         // "Contoso-Prod"
    id: string           // "a1b2c3d4-..."
    region: string       // "East US 2"
  }
  resourceGroup: string  // "rg-ai-agents"
  tenant: {
    name: string         // "contoso.com"
    id: string
    aadLinked: boolean
  }
  owner: {
    name: string         // "John Brown"
    email: string        // "johnbrown@contoso.com"
    title: string        // "Sales Lead"
    avatarInitials: string
  }
  manager: {
    name: string         // "Sarah Kim"
    email: string        // "sarahkim@contoso.com"
    title: string        // "Director of Sales"
  }
  department: string     // "Sales Operations"
  costCenter: string     // "CC-4420"
}
```

---

## Open Questions
1. Should "Quick Investigate" be available for Low/None risk agents, or only High/Medium?
2. What level of Graph API permissions are required for org chart data?
3. Should the investigation context sidebar (Option B) be deferred to a v2 "Investigation Workbench" feature?
4. Is there an existing API contract for agent-to-subscription mapping, or does this need to be built?
5. Should the escalation email include a deep link back to the agent investigation page?
