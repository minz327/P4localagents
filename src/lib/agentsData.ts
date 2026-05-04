export type AgentRow = {
  name: string
  type: 'app' | 'user' // To decide which icon
  icon?: 'copilot' | 'excel' | 'teams' | 'slack' | 'salesforce' | 'custom' // Specific app icons
  initials?: string // For user type
  status: 'Active' | 'Inactive'
  agentId: string
  riskLevel: 'High' | 'Medium' | 'Low' | 'None'
  riskType: string
  sensitiveActivityTrend: number[] | null // null for "No data available"
  dataProtection: string // e.g. "0 Policies"
  dataCompliance: string // e.g. "0 Policies"
  authentication?: string
  hosting?: 'cloud' | 'local'
}

export const rows: AgentRow[] = [
  // ── Local Agents (5 total) ───────────────────────────────────
  {
    name: 'GitHub Copilot CLI',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Local.GHCopilot.CLI-a8f2e1...',
    riskLevel: 'High',
    riskType: 'Exfiltration',
    sensitiveActivityTrend: [0, 0, 5, 10, 15, 8, 20, 12, 0, 5, 18, 25, 10, 0, 8, 15],
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Access Key',
    hosting: 'local'
  },
  {
    name: 'OpenClaw',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Local.OpenClaw.v2-3b91cf...',
    riskLevel: 'High',
    riskType: 'Oversharing, Exfiltration',
    sensitiveActivityTrend: [0, 0, 0, 0, 10, 0, 0, 25, 30, 0, 15, 20, 0, 10, 5, 0],
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Access Key',
    hosting: 'local'
  },
  {
    name: 'NanoClaw',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Local.NanoClaw.v1-7d4e82...',
    riskLevel: 'Medium',
    riskType: 'Oversharing',
    sensitiveActivityTrend: [0, 3, 5, 2, 0, 0, 8, 4, 0, 0, 6, 3, 0, 5, 2, 0],
    dataProtection: '1 Policy',
    dataCompliance: '0 Policies',
    authentication: 'Shared Key',
    hosting: 'local'
  },
  {
    name: 'NemoClaw',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Local.NemoClaw.v3-9a1f56...',
    riskLevel: 'High',
    riskType: 'Exfiltration',
    sensitiveActivityTrend: [5, 0, 0, 15, 0, 0, 20, 0, 10, 0, 0, 25, 0, 0, 12, 0],
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Access Key',
    hosting: 'local'
  },
  {
    name: 'CopilotClaw',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Local.CopilotClaw.v1-2c8d...',
    riskLevel: 'Medium',
    riskType: 'Oversharing',
    sensitiveActivityTrend: [0, 0, 2, 4, 0, 6, 3, 0, 0, 5, 8, 0, 4, 0, 2, 0],
    dataProtection: '1 Policy',
    dataCompliance: '1 Policy',
    authentication: 'Entra ID',
    hosting: 'local'
  },
  // ── Cloud Agents (74 total) ──────────────────────────────────
  {
    name: '01/20/2026-AborseAgent',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Aborse.782h-28...',
    riskLevel: 'None',
    riskType: 'No data available',
    sensitiveActivityTrend: null,
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Entra ID',
    hosting: 'cloud'
  },
  {
    name: 'AborseAgentJan092026',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Aborse.Jan.22...',
    riskLevel: 'Low',
    riskType: 'Oversharing',
    sensitiveActivityTrend: [0, 0, 0, 2, 5, 1, 0, 0],
    dataProtection: '1 Policy',
    dataCompliance: '0 Policies',
    authentication: 'Entra ID',
    hosting: 'cloud'
  },
  {
    name: 'Accounting Agent',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Acct.Agent.33...',
    riskLevel: 'Medium',
    riskType: 'Exfiltration',
    sensitiveActivityTrend: [0, 5, 10, 5, 0],
    dataProtection: '2 Policies',
    dataCompliance: '1 Policy',
    authentication: 'Shared Key',
    hosting: 'cloud'
  },
  {
    name: 'M&A Deal Room Assistant',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Fin.M&A.T_fac75f59-d4d7-88...',
    riskLevel: 'High',
    riskType: 'Oversharing',
    sensitiveActivityTrend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 15, 30, 25, 0],
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Entra ID',
    hosting: 'cloud'
  },
  {
    name: 'Q3 Financial Earnings Bot',
    type: 'app',
    icon: 'excel',
    status: 'Active',
    agentId: 'Fin.Earn.T_20c3fe71-eb61-d5...',
    riskLevel: 'High',
    riskType: 'Unethical',
    sensitiveActivityTrend: [0, 0, 15, 0, 0, 0, 20, 0, 0, 0, 0, 0, 8, 0, 0, 0],
    dataProtection: '0 Policies',
    authentication: 'Access Key',
    dataCompliance: '0 Policies',
    hosting: 'cloud'
  },
  {
    name: 'Source Code Vulnerability Scanner',
    type: 'user',
    initials: 'D',
    status: 'Active',
    agentId: 'Dev.Sec.21adf640-fdfa-42d3...',
    riskLevel: 'High',
    riskType: 'Exfiltration',
    sensitiveActivityTrend: [10, 20, 5, 0, 0, 15, 0, 0, 30, 0, 0, 10, 15, 0, 0, 0],
    dataProtection: '0 Policies',
    authentication: 'Shared Key',
    dataCompliance: '0 Policies',
    hosting: 'cloud'
  },
  // ── Generated Cloud Agents ───────────────────────────────────
  ...generateCloudAgents()
]

// Generate 68 cloud agents to reach 74 cloud (6 hand-crafted + 68 generated) + 5 local = 79 total
function generateCloudAgents(): AgentRow[] {
  const names = [
    'HR Onboarding Assistant', 'Sales Forecast Analyzer', 'Marketing Campaign Bot',
    'IT Helpdesk Copilot', 'Expense Report Processor', 'Travel Booking Agent',
    'Contract Review Assistant', 'Inventory Tracker Bot', 'Customer Feedback Analyzer',
    'Meeting Scheduler Agent', 'Invoice Processing Bot', 'Compliance Audit Agent',
    'Employee Survey Bot', 'Knowledge Base Search', 'Project Status Reporter',
    'Budget Approval Workflow', 'Vendor Onboarding Agent', 'Quality Assurance Bot',
    'Training Content Generator', 'Recruitment Screening Agent', 'Facility Request Bot',
    'Data Migration Assistant', 'Report Generation Agent', 'Email Classification Bot',
    'Document Translator Agent', 'Risk Assessment Copilot', 'Supply Chain Monitor',
    'Product Catalog Agent', 'Order Fulfillment Bot', 'Customer Retention Analyzer',
    'Pricing Optimization Agent', 'Brand Monitoring Bot', 'Social Media Scheduler',
    'Content Moderation Agent', 'Fraud Detection Bot', 'Loan Processing Agent',
    'Claims Review Assistant', 'Policy Renewal Bot', 'Benefits Enrollment Agent',
    'Timesheet Approval Bot', 'Asset Tracking Agent', 'Maintenance Request Bot',
    'Safety Incident Reporter', 'Environmental Monitor', 'Regulatory Filing Agent',
    'Tax Calculation Bot', 'Payroll Processing Agent', 'Performance Review Bot',
    'Succession Planning Agent', 'Learning Path Recommender', 'Diversity Analytics Bot',
    'Space Booking Agent', 'Catering Request Bot', 'Visitor Management Agent',
    'Parking Allocation Bot', 'Badge Access Manager', 'Network Monitor Agent',
    'Security Alert Triage Bot', 'Patch Management Agent', 'Backup Verification Bot',
    'Capacity Planning Agent', 'Executive Summary Bot', 'Board Report Generator',
    'Investor Relations Agent', 'Legal Discovery Assistant', 'Compliance Training Bot',
    'Change Management Agent', 'Incident Response Bot'
  ]

  const riskLevels: Array<AgentRow['riskLevel']> = ['High', 'Medium', 'Low', 'None']
  const riskTypes = ['Oversharing', 'Exfiltration', 'Unethical', 'Oversharing, Exfiltration', 'No data available']
  const icons: Array<NonNullable<AgentRow['icon']>> = ['copilot', 'excel', 'teams', 'slack', 'salesforce', 'custom']
  const auths = ['Entra ID', 'Shared Key', 'Managed Identity', 'Access Key']
  const protections = ['0 Policies', '1 Policy', '2 Policies', '3 Policies']

  return names.map((name, i) => {
    const seed = name.length + i
    const riskIdx = seed % 13 < 2 ? 0 : seed % 13 < 5 ? 1 : seed % 13 < 9 ? 2 : 3
    const risk = riskLevels[riskIdx]
    const rType = risk === 'None' ? 'No data available' : riskTypes[seed % 4]
    const hasTrend = risk !== 'None'
    const trend = hasTrend
      ? Array.from({ length: 8 + (seed % 8) }, (_, j) => (seed * (j + 1) * 7) % 20)
      : null

    return {
      name,
      type: (seed % 7 === 0 ? 'user' : 'app') as 'app' | 'user',
      icon: seed % 7 === 0 ? undefined : icons[seed % icons.length],
      initials: seed % 7 === 0 ? name[0] : undefined,
      status: (seed % 11 === 0 ? 'Inactive' : 'Active') as 'Active' | 'Inactive',
      agentId: `Cloud.${name.replace(/\s+/g, '').slice(0, 8)}.${(seed * 31337).toString(16).slice(0, 8)}...`,
      riskLevel: risk,
      riskType: rType,
      sensitiveActivityTrend: trend,
      dataProtection: protections[seed % protections.length],
      dataCompliance: protections[(seed + 2) % protections.length],
      authentication: auths[seed % auths.length],
      hosting: 'cloud' as const
    }
  })
}
