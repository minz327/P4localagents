// clevelandData.ts — Mock enrichment + anomaly + spike data for Cleveland prototype

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
  'HR.Exec.T_45a2ccdc-ec13-a4...': {
    subscription: { name: 'Contoso-Prod', id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', region: 'East US 2' },
    resourceGroup: 'rg-hr-agents',
    tenant: { name: 'contoso.com', id: 't-9876-5432', aadLinked: true },
    owner: { name: 'John Brown', email: 'johnbrown@contoso.com', title: 'HR Systems Lead', initials: 'JB' },
    manager: { name: 'Sarah Kim', email: 'sarahkim@contoso.com', title: 'Director of HR Operations' },
    department: 'Human Resources',
    costCenter: 'CC-3310',
  },
  'Fin.M&A.T_fac75f59-d4d7-88...': {
    subscription: { name: 'Contoso-Prod', id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', region: 'East US 2' },
    resourceGroup: 'rg-finance-agents',
    tenant: { name: 'contoso.com', id: 't-9876-5432', aadLinked: true },
    owner: { name: 'Lisa Park', email: 'lisapark@contoso.com', title: 'M&A Deal Manager', initials: 'LP' },
    manager: { name: 'David Chen', email: 'davidchen@contoso.com', title: 'VP Corporate Development' },
    department: 'Corporate Finance',
    costCenter: 'CC-5501',
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
  const perAgent: Record<string, RecentActivity[]> = {
    'HR.Exec.T_45a2ccdc-ec13-a4...': [
      { id: 'act-1', title: 'Exported Payroll-Q4.xlsx to external email', date: 'Mar 3, 2026', riskType: 'Exfiltration', isSensitive: true },
      { id: 'act-2', title: 'Accessed CompPlan-2026.docx (Confidential)', date: 'Mar 3, 2026', riskType: 'Exfiltration', isSensitive: true },
      { id: 'act-3', title: 'Created public sharing link for HR folder', date: 'Mar 3, 2026', riskType: 'Oversharing', isSensitive: true },
      { id: 'act-4', title: 'Queried employee benefits database', date: 'Mar 2, 2026', riskType: null, isSensitive: false },
      { id: 'act-5', title: 'Generated monthly payroll summary', date: 'Mar 2, 2026', riskType: null, isSensitive: false },
    ],
    'Fin.M&A.T_fac75f59-d4d7-88...': [
      { id: 'act-1', title: 'Posted sensitive document to public SharePoint site', date: 'Mar 3, 2026', riskType: 'Oversharing', isSensitive: true },
      { id: 'act-2', title: '402 unlabeled sensitive files accessed', date: 'Mar 3, 2026', riskType: 'Oversharing', isSensitive: true },
      { id: 'act-3', title: 'Created public sharing link', date: 'Mar 2, 2026', riskType: 'Oversharing', isSensitive: true },
      { id: 'act-4', title: 'Queried CRM for customer list', date: 'Mar 2, 2026', riskType: null, isSensitive: false },
      { id: 'act-5', title: 'Drafted follow-up email', date: 'Mar 1, 2026', riskType: null, isSensitive: false },
    ],
  }
  return perAgent[_agentId] || [
    { id: 'act-1', title: 'Posted sensitive document to public SharePoint site', date: 'Mar 2, 2026', riskType: 'Oversharing', isSensitive: true },
    { id: 'act-2', title: '402 unlabeled sensitive files accessed', date: 'Mar 2, 2026', riskType: 'Oversharing', isSensitive: true },
    { id: 'act-3', title: 'Created public sharing link', date: 'Mar 2, 2026', riskType: 'Oversharing', isSensitive: true },
    { id: 'act-4', title: 'Queried CRM for customer list', date: 'Mar 1, 2026', riskType: null, isSensitive: false },
    { id: 'act-5', title: 'Drafted follow-up email', date: 'Mar 1, 2026', riskType: null, isSensitive: false },
  ]
}

// ── Spike data per agent ──────────────────────────────────────────
export interface AgentSpikeData {
  agentId: string
  spikePercent: number
  sensitiveActivities24h: number
  ownerName: string
}

export const spikeAgents: AgentSpikeData[] = [
  { agentId: 'HR.Exec.T_45a2ccdc-ec13-a4...', spikePercent: 300, sensitiveActivities24h: 15, ownerName: 'John Brown' },
  { agentId: 'Fin.M&A.T_fac75f59-d4d7-88...', spikePercent: 150, sensitiveActivities24h: 30, ownerName: 'Lisa Park' },
  { agentId: 'Dev.Sec.21adf640-fdfa-42d3...', spikePercent: 80, sensitiveActivities24h: 8, ownerName: 'John Brown' },
]

export function getSpikePercent(agentId: string): number | null {
  const match = spikeAgents.find(s => s.agentId === agentId)
  return match ? match.spikePercent : null
}
