# Design Review Summary: AI Observability Improvements

## Source
BWC Healthcare Customer Interview — Pain Points #1 and #2

---

## Feature 1: Anomaly Spike Alerts (RICE: 8,000)

### Three Design Options

| Option | Description | Effort | Best For |
|--------|-------------|--------|----------|
| **A. Inline Alert Banner** | Red dismissable banner at top of AI Observability page when anomaly detected | 2-3 days | On-page awareness |
| **B. Metrics Card Indicators** | Anomaly badges + pulsing borders on existing metric cards | 1-2 days | Subtle visual cues |
| **C. Header Notification Bell** | Badge on header bell icon + slide-out notification panel | 5-7 days | Cross-page visibility |

### Recommendation
**Option C + B combined.** Bell panel for cross-page awareness and notification history; card indicators for dashboard-level reinforcement.

### Phasing
1. Sprint 1: Card anomaly badges (Option B)
2. Sprint 2: Bell badge + notification panel (Option C)
3. Future: Push notifications (email/Teams)

---

## Feature 2: Investigation Drill-Down & Owner Enrichment (RICE: 5,000)

### Three Design Options

| Option | Description | Effort | Best For |
|--------|-------------|--------|----------|
| **A. Enriched Agent Detail** | Add subscription, resource group, owner, org chart to existing agent detail page | 3-5 days | Deep investigation |
| **B. Drill-Down + Context Sidebar** | Progressive timeline view with persistent investigation context panel | 8-12 days | Forensic analysis |
| **C. Quick Investigate Modal** | Kebab menu on agent table rows opens 10-second triage overlay | 4-6 days | Fast triage |

### Recommendation
**Option C + A combined.** Quick Investigate modal for rapid triage from dashboard; enriched detail page for deep dives.

### Phasing
1. Sprint 1: Enriched Agent Detail (Option A)
2. Sprint 2: Quick Investigate modal (Option C)
3. Sprint 3: Activity timeline from Option B

---

## Combined Investigation Funnel

```
Dashboard (spot anomaly via card badges + bell notifications)
    │
    ├── Quick path: Right-click → Quick Investigate modal (10s)
    │   └── See owner, subscription, top 5 activities
    │       └── [Escalate] or [Open full details]
    │
    └── Deep path: Click agent → Enriched Detail page
        └── Full resource context + activity timeline
            └── [Apply policy] [Create investigation] [Export]
```

---

## Design Specs
- [Anomaly Alerts Options](design-options-anomaly-alerts.md) — Full wireframes, tokens, states, accessibility
- [Investigation Flow Options](design-options-investigation-flow.md) — Full wireframes, data model, API requirements

---

## Next Steps
1. Review options and select preferred combinations
2. Build mock data models for enrichment fields
3. Prototype Option B (card indicators) as quickest win
4. Prototype Option C (quick investigate modal) in parallel
