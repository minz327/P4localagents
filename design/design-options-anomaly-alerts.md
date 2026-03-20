# Design Options: Anomaly Spike Alerts

## Customer Signal
> "We saw 20 incidents spike to 30 in one agent overnight. There's no way to get notified."
> — BWC Healthcare Customer

**RICE Score: 8,000** | Priority: #1 Quick Win

---

## Problem Statement
Admins monitoring AI agents have no proactive notification mechanism when sensitive activity spikes occur. They discover anomalies only through manual dashboard review, which means critical oversharing or exfiltration events can go unaddressed for hours or days.

### Jobs To Be Done
- **When** a spike in sensitive agent activity occurs, **I want to** be immediately notified with context, **so I can** triage and remediate before data exposure escalates.

### Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Mean time to detect anomaly | Manual (hours/days) | < 5 minutes |
| % of spikes investigated within 1hr | ~10% (manual) | > 80% |
| False positive rate | N/A | < 15% |

---

## Design Option A: **Inline Alert Banner on Dashboard**

### Concept
A persistent, dismissable alert banner appears at the top of the AI Observability page when an anomaly is detected. It shows directly in the user's workflow without requiring external notification infrastructure.

### Visual Specification

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠ ANOMALY DETECTED                                        ✕   │
│                                                                 │
│ "M&A Deal Room Assistant" sensitive activity spiked 150%        │
│ (20 → 30 incidents) in the last 24 hours.                      │
│                                                                 │
│ Risk type: Oversharing    Detected: 2 hours ago                │
│                                                                 │
│ [Investigate agent]  [Dismiss]  [Configure alert rules →]      │
└─────────────────────────────────────────────────────────────────┘
```

### Placement
- **Location:** Below the page header ("AI observability" / "Get a centralized view…"), above "Key metrics" section
- **Z-index:** Standard content flow (not overlay)
- **Persistence:** Stays until dismissed or resolved; reappears on page reload if unresolved

### Design Tokens (Fluent UI v9)
| Element | Token | Value |
|---------|-------|-------|
| Banner background | `colorPaletteRedBackground1` | `#FDE7E9` |
| Banner border-left | `colorPaletteRedBorder2` | `#C50F1F` (4px solid left) |
| Icon (warning) | `Alert20Regular` | `#C50F1F` |
| Title text | `fontWeightSemibold` / `fontSize14` | `#242424` |
| Body text | `fontWeightRegular` / `fontSize13` | `#616161` |
| CTA button | `colorBrandBackground` | `#0078D4` (primary) |
| Dismiss | Ghost button | `#616161` |
| Border radius | `borderRadiusMedium` | `4px` |
| Padding | `spacingHorizontalL` / `spacingVerticalM` | `16px` / `12px` |

### States
1. **Active (unresolved)** — Red-tinted banner with full details
2. **Multiple anomalies** — Stacked or count badge: "3 anomalies detected" with expandable list
3. **Dismissed** — Hidden for current session; icon badge persists in header bell icon
4. **Resolved** — Auto-removes after investigation action taken

### Behavior
- Clicking "Investigate agent" navigates to `/agents/{agentId}` Activities tab
- Clicking "Configure alert rules" opens Settings → Alert configuration
- Banner animates in with `slide-down` (200ms ease-out)
- Max 3 banners stacked; 4+ collapses to summary

### Accessibility
- `role="alert"` with `aria-live="assertive"` for screen readers
- Focus trap on first CTA when banner appears
- Keyboard dismissible (Escape or Tab to Dismiss → Enter)
- Color contrast: 7.4:1 (exceeds AAA)

### Pros
- Zero infrastructure cost — pure frontend
- Visible in existing workflow
- Progressive disclosure (summary → investigate)

### Cons
- Only visible when user is on the page
- No push notification — requires active session

---

## Design Option B: **Metrics Card Anomaly Indicators**

### Concept
Enhance the existing 3 metric cards ("254 total AI apps", "15 high risk agents", "13 agents with sensitive interactions") with inline anomaly badges and visual emphasis when thresholds are breached.

### Visual Specification

```
┌─────────────────────────────────────────────────┐
│  13 agents with sensitive interactions    ⚠ NEW │
│  ─────────────────────────────────────────      │
│                                                  │
│  Oversharing        Exfiltration    Unethical   │
│  11                 2               0           │
│  ↗ 120%  ⚡SPIKE    → No change     → No change │
│                                                  │
│  [View anomaly details →]                       │
└─────────────────────────────────────────────────┘
```

### Changes to Existing Metrics.tsx

1. **Anomaly Badge**: Orange/red pill badge on card header when anomaly detected
   - Token: `colorPaletteRedBackground1` bg + `colorPaletteRedForeground1` text
   - Text: "⚡SPIKE" or "⚠ ANOMALY"
   - Size: `fontSize10`, `fontWeightSemibold`, `borderRadiusFull`

2. **Sparkline Overlay**: Add threshold line on existing trend indicators
   - Dashed line at baseline/mean level
   - Spike bars highlighted in `#C50F1F` when exceeding threshold

3. **Pulsing Ring**: Card border transitions to `2px solid #C50F1F` with subtle pulse animation
   - `@keyframes pulse-border { 0%, 100% { border-color: #C50F1F } 50% { border-color: #FDE7E9 } }`
   - Duration: 2s, repeats 3x then stays solid

4. **Tooltip on hover**: "Oversharing spiked 150% in the last 24h. 1 agent responsible."

5. **Click action**: Card click navigates to filtered agent list (risk type preset)

### Design Tokens
| Element | Token | Value |
|---------|-------|-------|
| Anomaly badge bg | `colorPaletteRedBackground1` | `#FDE7E9` |
| Anomaly badge text | `colorPaletteRedForeground1` | `#C50F1F` |
| Card border (anomaly) | `colorPaletteRedBorder2` | `#C50F1F` |
| Spike indicator | `colorPaletteRedForeground1` | `#C50F1F` |
| Threshold line | Dashed, `colorNeutralStroke2` | `#E0E0E0` |

### States
1. **Normal** — No change (existing design)
2. **Warning** — Yellow badge for moderate spikes (20-50% increase)
3. **Critical** — Red badge + pulsing border for severe spikes (>50% increase)
4. **Stale** — Badge fades after 24h without action

### Pros
- Leverages existing UI real estate — no new components
- Immediate visual salience on the dashboard user already looks at
- Low development effort (badge + border animation)

### Cons
- Subtle — could be missed if user scans quickly
- Limited detail space within card
- No notification outside the page

---

## Design Option C: **Header Notification Bell + Notification Panel**

### Concept
Enhance the existing `Alert20Regular` icon in the header with a count badge and a slide-out notification panel. This approach provides cross-page visibility and a centralized history.

### Visual Specification

```
Header:  [...] 🔔³ [⚙] [👤]
                 │
                 ▼
┌────────────────────────────────────────┐
│  Notifications                    ✕    │
│  ──────────────────────────────────    │
│                                        │
│  🔴 2 min ago                          │
│  M&A Deal Room Assistant               │
│  Oversharing spike: 20 → 30 (+150%)   │
│  [Investigate →]                       │
│  ──────────────────────────────────    │
│                                        │
│  🟡 1 hour ago                         │
│  Executive Payroll Auditor             │
│  Exfiltration activity detected (15)   │
│  [Investigate →]                       │
│  ──────────────────────────────────    │
│                                        │
│  🔵 3 hours ago                        │
│  Source Code Vulnerability Scanner     │
│  Risk level elevated: Low → High       │
│  [Investigate →]                       │
│  ──────────────────────────────────    │
│                                        │
│  [View all notifications]              │
│  [Configure alert rules →]             │
└────────────────────────────────────────┘
```

### Component Breakdown

**1. Header Badge (Header.tsx)**
- Badge on existing `Alert20Regular` icon
- Red circle with count: `min-w-[18px] h-[18px]` at top-right offset
- Token: `colorPaletteRedBackground3` (`#C50F1F`) bg, white text `fontSize10`
- Animates in with scale transform on new notification
- Shows "9+" for >9 notifications

**2. Notification Panel**
- Slides from right edge, 380px wide, full viewport height
- Overlay with `rgba(0,0,0,0.3)` backdrop
- Header: "Notifications" + close button + "Mark all read"
- Each notification card:
  - Severity dot (🔴 critical / 🟡 warning / 🔵 info)
  - Timestamp (relative: "2 min ago")
  - Agent name (bold, clickable)
  - Description (1-2 lines)
  - "Investigate →" link
  - Unread state: left border accent `3px solid #0078D4`
- Grouped by time: "Today", "Yesterday", "Earlier"
- Max 50 items, paginated

**3. Notification Types**
| Type | Icon | Trigger |
|------|------|---------|
| Spike alert | `ArrowTrendingUp` | >50% increase in 24h window |
| Risk elevation | `ShieldError` | Risk level change (Low→High) |
| New high-risk agent | `Warning` | Agent first flagged as High |
| Policy violation | `DocumentDismiss` | Compliance policy breach |
| Threshold breach | `AlertUrgent` | Custom threshold exceeded |

### Design Tokens
| Element | Token | Value |
|---------|-------|-------|
| Panel bg | `colorNeutralBackground1` | `#FFFFFF` |
| Panel shadow | `shadow64` | Fluent elevation |
| Unread accent | `colorBrandStroke1` | `#0078D4` |
| Critical dot | `colorPaletteRedBackground3` | `#C50F1F` |
| Warning dot | `colorPaletteYellowBackground3` | `#F7630C` |
| Info dot | `colorBrandBackground` | `#0078D4` |
| Timestamp | `colorNeutralForeground3` | `#616161` |
| Card hover | `colorNeutralBackground1Hover` | `#F5F5F5` |

### States
1. **No notifications** — Bell icon normal, no badge
2. **New unread** — Badge with count, bell has subtle bounce animation
3. **Panel open** — Slide from right, 200ms ease
4. **All read** — Badge disappears, items show as read (no left accent)
5. **Item clicked** — Marks as read, navigates to agent

### Accessibility
- Panel is a dialog: `role="dialog"`, `aria-label="Notifications"`
- Badge: `aria-label="3 unread notifications"`
- Focus trapped within panel when open
- Each notification: `role="listitem"` within `role="list"`
- Escape to close

### Pros
- Cross-page visibility — always accessible from header
- Notification history — audit trail
- Familiar pattern (matches Microsoft 365 notification tray)
- Extensible to future alert types

### Cons
- Higher implementation effort (new component)
- Still requires user to be in the app (no push/email)
- Panel could get noisy with many agents

---

## Recommendation Matrix

| Criteria | Option A: Banner | Option B: Card Indicators | Option C: Bell Panel |
|----------|------------------|--------------------------|---------------------|
| **Visibility** | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| **Implementation effort** | Low (2-3 days) | Low (1-2 days) | Medium (5-7 days) |
| **Scalability** | Moderate | Low | High |
| **Cross-page access** | ✗ | ✗ | ✓ |
| **Notification history** | ✗ | ✗ | ✓ |
| **Customer need fit** | High | Medium | Very High |
| **M365 pattern alignment** | Moderate | High (in-card) | Very High (notification tray) |
| **Accessibility** | Strong | Moderate | Strong |

### Recommended Approach: **Option C (Bell Panel) + Option B (Card Indicators)**

Combine the header notification panel (C) for cross-page awareness and history, with inline card anomaly indicators (B) for at-a-glance dashboard context. This delivers:
- Proactive alerts visible from any page
- Dashboard visual reinforcement
- Notification audit trail
- Extensible architecture for email/Teams notifications later

### Implementation Phases
1. **Phase 1 (Sprint 1):** Option B — Card anomaly badges + threshold logic
2. **Phase 2 (Sprint 2):** Option C — Bell badge + notification panel
3. **Phase 3 (Future):** Push notifications (email/Teams webhook integration)

---

## Interaction Flow

```
User lands on AI Observability page
    │
    ├── Sees red badge on bell icon (3)
    │   └── Clicks bell → Notification panel slides in
    │       └── Reads "M&A Deal Room: Oversharing spike 150%"
    │           └── Clicks "Investigate" → /agents/{id} Activities tab
    │
    └── Sees "⚡SPIKE" badge on Sensitive Interactions card
        └── Hovers → Tooltip: "Oversharing spiked 150% in 24h"
            └── Clicks card → Opens filtered agent list
```

---

## Open Questions
1. What spike % threshold should trigger alerts? (Proposed: >50% in 24h window)
2. Should notifications persist across sessions (backend storage) or be session-only?
3. Should we support email/Teams notifications in v1 or defer to v2?
4. Alert fatigue: should we batch multiple spikes on same agent into one notification?
