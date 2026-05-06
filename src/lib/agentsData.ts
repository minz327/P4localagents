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
  hosting?: 'cloud' | 'local' | 'aiapp'
  platform?: string
  userName?: string   // For local agents: who is using it
  device?: string     // For local agents: which device
  sessions?: { total: number; highRisk: number }  // For local agents: session summary
}

export const rows: AgentRow[] = [
  // ── Local Agent Instances (user+device) ──────────────────────
  // GitHub Copilot CLI — 4 users
  { name: 'Alice Johnson (Laptop-01)', type: 'user', initials: 'AJ', status: 'Active', agentId: 'Local.GHCopilot.CLI-a8f2e1...', riskLevel: 'High', riskType: 'Exfiltration', sensitiveActivityTrend: [0, 0, 5, 10, 15, 8, 20, 12, 0, 5, 18, 25, 10, 0, 8, 15], dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'GitHub Copilot CLI', userName: 'Alice Johnson', device: 'Laptop-01', sessions: { total: 7, highRisk: 3 } },
  { name: 'Bob Smith (Desktop-22)', type: 'user', initials: 'BS', status: 'Active', agentId: 'Local.GHCopilot.CLI-7d4e82...', riskLevel: 'Medium', riskType: 'Oversharing', sensitiveActivityTrend: [0, 2, 0, 5, 3, 0, 0, 8, 0, 4, 0, 6, 0, 3, 0, 0], dataProtection: '1 Policy', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'GitHub Copilot CLI', userName: 'Bob Smith', device: 'Desktop-22', sessions: { total: 4, highRisk: 1 } },
  { name: 'Carol Davis (Laptop-15)', type: 'user', initials: 'CD', status: 'Active', agentId: 'Local.GHCopilot.CLI-3c9a56...', riskLevel: 'Low', riskType: 'Oversharing', sensitiveActivityTrend: [0, 0, 1, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 2, 0, 0], dataProtection: '1 Policy', dataCompliance: '1 Policy', authentication: 'Access Key', hosting: 'local', platform: 'GitHub Copilot CLI', userName: 'Carol Davis', device: 'Laptop-15', sessions: { total: 3, highRisk: 0 } },
  { name: 'David Lee (VM-Build-03)', type: 'user', initials: 'DL', status: 'Inactive', agentId: 'Local.GHCopilot.CLI-9b2f41...', riskLevel: 'None', riskType: 'No data available', sensitiveActivityTrend: null, dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'GitHub Copilot CLI', userName: 'David Lee', device: 'VM-Build-03', sessions: { total: 0, highRisk: 0 } },
  // OpenClaw — 3 users
  { name: 'Alice Johnson (Laptop-01)', type: 'user', initials: 'AJ', status: 'Active', agentId: 'Local.OpenClaw.v2-3b91cf...', riskLevel: 'High', riskType: 'Oversharing, Exfiltration', sensitiveActivityTrend: [0, 0, 0, 0, 10, 0, 0, 25, 30, 0, 15, 20, 0, 10, 5, 0], dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'OpenClaw', userName: 'Alice Johnson', device: 'Laptop-01', sessions: { total: 5, highRisk: 4 } },
  { name: 'Eve Martinez (Laptop-08)', type: 'user', initials: 'EM', status: 'Active', agentId: 'Local.OpenClaw.v2-6e8d23...', riskLevel: 'High', riskType: 'Exfiltration', sensitiveActivityTrend: [0, 5, 0, 12, 0, 0, 18, 0, 8, 0, 0, 15, 0, 0, 10, 0], dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'OpenClaw', userName: 'Eve Martinez', device: 'Laptop-08', sessions: { total: 6, highRisk: 3 } },
  { name: 'Frank Wilson (Desktop-44)', type: 'user', initials: 'FW', status: 'Active', agentId: 'Local.OpenClaw.v2-1a5b77...', riskLevel: 'Medium', riskType: 'Oversharing', sensitiveActivityTrend: [0, 0, 3, 0, 5, 0, 0, 7, 0, 4, 0, 0, 6, 0, 2, 0], dataProtection: '1 Policy', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'OpenClaw', userName: 'Frank Wilson', device: 'Desktop-44', sessions: { total: 3, highRisk: 1 } },
  // NanoClaw — 2 users
  { name: 'Grace Kim (Laptop-03)', type: 'user', initials: 'GK', status: 'Active', agentId: 'Local.NanoClaw.v1-7d4e82...', riskLevel: 'Medium', riskType: 'Oversharing', sensitiveActivityTrend: [0, 3, 5, 2, 0, 0, 8, 4, 0, 0, 6, 3, 0, 5, 2, 0], dataProtection: '1 Policy', dataCompliance: '0 Policies', authentication: 'Shared Key', hosting: 'local', platform: 'NanoClaw', userName: 'Grace Kim', device: 'Laptop-03', sessions: { total: 4, highRisk: 0 } },
  { name: 'Henry Chen (Desktop-11)', type: 'user', initials: 'HC', status: 'Active', agentId: 'Local.NanoClaw.v1-4f2c91...', riskLevel: 'Low', riskType: 'Oversharing', sensitiveActivityTrend: [0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0], dataProtection: '1 Policy', dataCompliance: '1 Policy', authentication: 'Shared Key', hosting: 'local', platform: 'NanoClaw', userName: 'Henry Chen', device: 'Desktop-11', sessions: { total: 2, highRisk: 0 } },
  // NemoClaw — 2 users
  { name: 'Bob Smith (Desktop-22)', type: 'user', initials: 'BS', status: 'Active', agentId: 'Local.NemoClaw.v3-9a1f56...', riskLevel: 'High', riskType: 'Exfiltration', sensitiveActivityTrend: [5, 0, 0, 15, 0, 0, 20, 0, 10, 0, 0, 25, 0, 0, 12, 0], dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'NemoClaw', userName: 'Bob Smith', device: 'Desktop-22', sessions: { total: 8, highRisk: 5 } },
  { name: 'Irene Park (Laptop-19)', type: 'user', initials: 'IP', status: 'Active', agentId: 'Local.NemoClaw.v3-8c3e65...', riskLevel: 'Medium', riskType: 'Exfiltration', sensitiveActivityTrend: [0, 0, 8, 0, 0, 5, 0, 0, 10, 0, 0, 7, 0, 0, 4, 0], dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'local', platform: 'NemoClaw', userName: 'Irene Park', device: 'Laptop-19', sessions: { total: 3, highRisk: 1 } },
  // CopilotClaw — 3 users
  { name: 'Carol Davis (Laptop-15)', type: 'user', initials: 'CD', status: 'Active', agentId: 'Local.CopilotClaw.v1-2c8d...', riskLevel: 'Medium', riskType: 'Oversharing', sensitiveActivityTrend: [0, 0, 2, 4, 0, 6, 3, 0, 0, 5, 8, 0, 4, 0, 2, 0], dataProtection: '1 Policy', dataCompliance: '1 Policy', authentication: 'Entra ID', hosting: 'local', platform: 'CopilotClaw', userName: 'Carol Davis', device: 'Laptop-15', sessions: { total: 5, highRisk: 2 } },
  { name: 'Alice Johnson (Laptop-01)', type: 'user', initials: 'AJ', status: 'Active', agentId: 'Local.CopilotClaw.v1-5a7f...', riskLevel: 'Low', riskType: 'Oversharing', sensitiveActivityTrend: [0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 3, 0, 0, 1, 0], dataProtection: '1 Policy', dataCompliance: '1 Policy', authentication: 'Entra ID', hosting: 'local', platform: 'CopilotClaw', userName: 'Alice Johnson', device: 'Laptop-01', sessions: { total: 2, highRisk: 0 } },
  { name: 'Jake Turner (VM-Dev-07)', type: 'user', initials: 'JT', status: 'Inactive', agentId: 'Local.CopilotClaw.v1-0d6b...', riskLevel: 'None', riskType: 'No data available', sensitiveActivityTrend: null, dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Entra ID', hosting: 'local', platform: 'CopilotClaw', userName: 'Jake Turner', device: 'VM-Dev-07', sessions: { total: 0, highRisk: 0 } },
  // ── AI Apps ──────────────────────────────────────────────────
  { name: 'Microsoft 365 Copilot', type: 'app', icon: 'copilot', status: 'Active', agentId: 'App.M365Copilot-a1b2c3...', riskLevel: 'High', riskType: 'Oversharing', sensitiveActivityTrend: [12, 8, 15, 20, 18, 25, 30, 22, 28, 35, 20, 15, 25, 30, 28, 32], dataProtection: '3 Policies', dataCompliance: '2 Policies', authentication: 'Entra ID', hosting: 'aiapp', platform: 'Microsoft 365' },
  { name: 'Security Copilot', type: 'app', icon: 'copilot', status: 'Active', agentId: 'App.SecurityCopilot-d4e5f6...', riskLevel: 'Low', riskType: 'Oversharing', sensitiveActivityTrend: [0, 0, 2, 0, 1, 0, 0, 3, 0, 0, 1, 0, 0, 2, 0, 0], dataProtection: '2 Policies', dataCompliance: '2 Policies', authentication: 'Entra ID', hosting: 'aiapp', platform: 'Microsoft Security' },
  { name: 'Fabric Copilot', type: 'app', icon: 'custom', status: 'Active', agentId: 'App.FabricCopilot-g7h8i9...', riskLevel: 'Medium', riskType: 'Oversharing, Exfiltration', sensitiveActivityTrend: [0, 5, 3, 8, 0, 6, 10, 4, 0, 7, 5, 0, 8, 3, 6, 0], dataProtection: '1 Policy', dataCompliance: '1 Policy', authentication: 'Entra ID', hosting: 'aiapp', platform: 'Microsoft Fabric' },
  { name: 'ChatGPT Enterprise', type: 'app', icon: 'custom', status: 'Active', agentId: 'App.ChatGPTEnt-j1k2l3...', riskLevel: 'High', riskType: 'Exfiltration', sensitiveActivityTrend: [5, 10, 8, 15, 20, 12, 18, 25, 15, 20, 30, 18, 22, 28, 20, 25], dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'aiapp', platform: 'OpenAI' },
  { name: 'Gemini for Workspace', type: 'app', icon: 'custom', status: 'Active', agentId: 'App.GeminiWS-m4n5o6...', riskLevel: 'Medium', riskType: 'Oversharing', sensitiveActivityTrend: [0, 3, 0, 5, 2, 0, 4, 0, 6, 0, 3, 0, 5, 0, 2, 0], dataProtection: '1 Policy', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'aiapp', platform: 'Google' },
  { name: 'GitHub Copilot', type: 'app', icon: 'copilot', status: 'Active', agentId: 'App.GHCopilot-p7q8r9...', riskLevel: 'Low', riskType: 'Oversharing', sensitiveActivityTrend: [0, 1, 0, 2, 0, 0, 3, 0, 1, 0, 0, 2, 0, 1, 0, 0], dataProtection: '2 Policies', dataCompliance: '1 Policy', authentication: 'Entra ID', hosting: 'aiapp', platform: 'GitHub' },
  { name: 'Salesforce Einstein', type: 'app', icon: 'salesforce', status: 'Active', agentId: 'App.SFEinstein-s1t2u3...', riskLevel: 'None', riskType: 'No data available', sensitiveActivityTrend: null, dataProtection: '1 Policy', dataCompliance: '1 Policy', authentication: 'Entra ID', hosting: 'aiapp', platform: 'Salesforce' },
  { name: 'ServiceNow Now Assist', type: 'app', icon: 'custom', status: 'Active', agentId: 'App.NowAssist-v4w5x6...', riskLevel: 'Low', riskType: 'Oversharing', sensitiveActivityTrend: [0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], dataProtection: '1 Policy', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'aiapp', platform: 'ServiceNow' },
  { name: 'Amazon Q Business', type: 'app', icon: 'custom', status: 'Active', agentId: 'App.AmazonQ-y7z8a9...', riskLevel: 'Medium', riskType: 'Exfiltration', sensitiveActivityTrend: [0, 4, 0, 6, 3, 0, 5, 0, 8, 0, 4, 0, 7, 0, 3, 0], dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'aiapp', platform: 'AWS' },
  { name: 'Slack AI', type: 'app', icon: 'slack', status: 'Inactive', agentId: 'App.SlackAI-b1c2d3...', riskLevel: 'None', riskType: 'No data available', sensitiveActivityTrend: null, dataProtection: '0 Policies', dataCompliance: '0 Policies', authentication: 'Access Key', hosting: 'aiapp', platform: 'Slack' },
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
    hosting: 'cloud',
    platform: 'Copilot Studio'
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
    hosting: 'cloud',
    platform: 'Microsoft Foundry'
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
    hosting: 'cloud',
    platform: 'Copilot Studio'
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
    hosting: 'cloud',
    platform: 'Agent Builder in Microsoft 365 Copilot'
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
    hosting: 'cloud',
    platform: 'Microsoft Foundry'
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
    hosting: 'cloud',
    platform: 'Microsoft 365 Agents Toolkit'
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
  const platforms = ['Copilot Studio', 'Microsoft Foundry', 'Agent Builder in Microsoft 365 Copilot', 'Copilot Studio', 'Microsoft Foundry', 'Microsoft 365 Agents Toolkit', 'Copilot Studio', 'SharePoint', 'Copilot Studio']
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
      hosting: 'cloud' as const,
      platform: platforms[seed % platforms.length]
    }
  })
}
