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
}

export const rows: AgentRow[] = [
  // Screenshot items
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
    authentication: 'Entra ID'
  },
  {
    name: 'ADO Agent POC',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'ADO.POC.992-11...',
    riskLevel: 'None',
    riskType: 'No data available',
    sensitiveActivityTrend: null,
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Entra ID'
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
    authentication: 'Entra ID'
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
    authentication: 'Shared Key'
  },
  // 15 High Risk - Enterprise Critical Functions
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
    authentication: 'Entra ID'
  },
  {
    name: 'Executive Payroll Auditor',
    type: 'app',
    icon: 'excel',
    status: 'Active',
    agentId: 'HR.Exec.T_45a2ccdc-ec13-a4...',
    riskLevel: 'High',
    riskType: 'Exfiltration',
    sensitiveActivityTrend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 30, 0, 0, 0, 0, 0],
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Shared Key'
  },
  {
    name: 'Patent Application Generator',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Legal.IP.T_9d6e2bfd-3cfd-28...',
    riskLevel: 'High',
    riskType: 'Oversharing, Exfiltration',
    sensitiveActivityTrend: [0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 30, 0, 20, 15, 0],
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Entra ID'
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
    dataCompliance: '0 Policies'
  },
  {
    name: 'Customer PII Retriever',
    type: 'user',
    initials: 'S',
    status: 'Active',
    agentId: 'Sup.PII.78942ebe-0325-471e...',
    riskLevel: 'High',
    riskType: 'Oversharing',
    sensitiveActivityTrend: [0, 0, 0, 0, 2, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dataProtection: '0 Policies',
    authentication: 'Entra ID',
    dataCompliance: '0 Policies'
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
    dataCompliance: '0 Policies'
  },
  {
    name: 'Litigation Hold Search',
    type: 'user',
    initials: 'L',
    status: 'Active',
    agentId: 'Leg.Hold.157745c9-87c3-42e5...',
    riskLevel: 'High',
    riskType: 'Oversharing',
    sensitiveActivityTrend: [5, 5, 5, 10, 20, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dataProtection: '0 Policies',
    dataCompliance: '0 Policies',
    authentication: 'Entra ID'
  }
]
