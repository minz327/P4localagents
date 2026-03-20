// proposalData.ts — Mock enrichment + anomaly data for proposal prototype

// ── Enrichment mock data ──────────────────────────────────────────
export interface AgentEnrichment {
  subscription: { name: string; id: string; region: string }
  resourceGroup: string
  tenant: { name: string; id: string; aadLinked: boolean }
  owner: { name: string; email: string; title: string; initials: string }
  manager: { name: string; email: string; title: string }
  department: string
  costCenter: string
}

const enrichmentMap: Record<string, AgentEnrichment> = {
  default: {
    subscription: { name: 'Contoso-Prod', id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', region: 'East US 2' },
    resourceGroup: 'rg-ai-agents',
    tenant: { name: 'contoso.com', id: 't-9876-5432', aadLinked: true },
    owner: { name: 'John Brown', email: 'johnbrown@contoso.com', title: 'Sales Lead', initials: 'JB' },
    manager: { name: 'Sarah Kim', email: 'sarahkim@contoso.com', title: 'Director of Sales' },
    department: 'Sales Operations',
    costCenter: 'CC-4420',
  },
}

export function getEnrichment(_agentId: string): AgentEnrichment {
  return enrichmentMap[_agentId] || enrichmentMap.default
}

// ── Anomaly detection mock ────────────────────────────────────────
export interface AnomalyAlert {
  id: string
  agentName: string
  agentId: string
  riskType: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  delta: string
  detectedAgo: string
  timestamp: string
}

export const mockAnomalies: AnomalyAlert[] = [
  {
    id: 'anom-1',
    agentName: 'M&A Deal Room Assistant',
    agentId: 'Fin.M&A.T_fac75f59-d4d7-88...',
    riskType: 'Oversharing',
    severity: 'critical',
    message: 'Sensitive activity spiked 150% (20 → 30 incidents) in the last 24 hours.',
    delta: '+150%',
    detectedAgo: '2 hours ago',
    timestamp: '2026-03-03T06:12:00Z',
  },
  {
    id: 'anom-2',
    agentName: 'Executive Payroll Auditor',
    agentId: 'HR.Exec.T_45a2ccdc-ec13-a4...',
    riskType: 'Exfiltration',
    severity: 'critical',
    message: 'Exfiltration activity detected — 15 sensitive documents exported in 1 hour.',
    delta: '+300%',
    detectedAgo: '45 min ago',
    timestamp: '2026-03-03T07:27:00Z',
  },
  {
    id: 'anom-3',
    agentName: 'Source Code Vulnerability Scanner',
    agentId: 'Dev.Sec.21adf640-fdfa-42d3...',
    riskType: 'Risk elevation',
    severity: 'warning',
    message: 'Risk level elevated from Low → High based on activity pattern.',
    delta: 'Low → High',
    detectedAgo: '3 hours ago',
    timestamp: '2026-03-03T05:00:00Z',
  },
]

// ── Recent activities for quick investigate ───────────────────────
export interface RecentActivity {
  id: string
  title: string
  date: string
  riskType: string | null
  isSensitive: boolean
}

export function getRecentActivities(_agentId: string): RecentActivity[] {
  return [
    { id: 'act-1', title: 'Posted sensitive document to public SharePoint site', date: 'Mar 2, 2026', riskType: 'Oversharing', isSensitive: true },
    { id: 'act-2', title: '402 unlabeled sensitive files accessed', date: 'Mar 2, 2026', riskType: 'Oversharing', isSensitive: true },
    { id: 'act-3', title: 'Created public sharing link', date: 'Mar 2, 2026', riskType: 'Oversharing', isSensitive: true },
    { id: 'act-4', title: 'Queried CRM for customer list', date: 'Mar 1, 2026', riskType: null, isSensitive: false },
    { id: 'act-5', title: 'Drafted follow-up email', date: 'Mar 1, 2026', riskType: null, isSensitive: false },
  ]
}
