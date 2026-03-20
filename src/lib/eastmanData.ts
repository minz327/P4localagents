// demoData.ts — Mock data for the 3-flow demo prototype

// ── Governance state types ────────────────────────────────────────

export type GovernanceState = 'Never reviewed' | 'Reviewed' | 'Changed since review'

export interface DemoAgent {
  name: string
  type: 'app' | 'user'
  icon?: string
  initials?: string
  status: 'Active' | 'Inactive'
  agentId: string
  riskLevel: 'High' | 'Medium' | 'Low' | 'None'
  riskTypes: string[] // ['Oversharing', 'Exfiltration', 'Unethical']
  authType: 'Entra ID' | 'Shared Key' | 'Access Key' | 'Managed Identity'
  availability: 'All users' | 'Some users' | 'Blocked'
  activities30d: number // total activities in last 30 days
  hasDLP: boolean
  dlpPolicyCount: number
  governanceState: GovernanceState
  lastReviewedDate: string | null // ISO date or null
  lastReviewedBy: string | null
  owner: string
  ownerEmail: string
  department: string
  agentCategory: 'Published by your org' | 'Shared by creator' | 'Microsoft' | 'External Partners'
  platform: 'Copilot Studio' | 'Azure Foundry' | 'Microsoft 365 Copilot Agent Builder' | 'SharePoint' | 'Other'
  // For Flow 2 — change tracking
  changes?: AgentChange[]
  previousVersion?: string
  currentVersion?: string
}

export interface AgentChange {
  type: 'tool_added' | 'tool_removed' | 'knowledge_added' | 'knowledge_removed' | 'capability_changed' | 'instruction_changed'
  label: string
  detail: string
}

// ── Flow 3: Incident data ─────────────────────────────────────────

export interface IncidentFile {
  id: string
  name: string
  path: string
  sensitivityLabel: string
  size: string
  accessedAt: string
}

export interface IncidentEvent {
  id: string
  timestamp: string
  action: string
  actor: string
  detail: string
  isSensitive: boolean
}

export interface ExfilIncident {
  agentId: string
  summary: string
  severity: 'Critical' | 'High'
  detectedAt: string
  destination: string
  destinationType: 'External email' | 'Teams channel' | 'API endpoint' | 'Cloud storage'
  files: IncidentFile[]
  timeline: IncidentEvent[]
  toolsUsed: string[]
}

// ── Demo agent rows ───────────────────────────────────────────────

const _handCraftedAgents: DemoAgent[] = [
  // FLOW 3 TARGET — Exfiltration incident
  {
    name: 'Executive Payroll Auditor',
    type: 'app',
    icon: 'excel',
    status: 'Active',
    agentId: 'HR.Exec.T_45a2ccdc-ec13-a4...',
    riskLevel: 'High',
    riskTypes: ['Exfiltration'],
    authType: 'Shared Key',
    availability: 'All users',
    activities30d: 8742,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-02-10T14:30:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Michael Torres',
    ownerEmail: 'mtorres@contoso.com',
    department: 'Finance Operations',
    agentCategory: 'Published by your org',
    platform: 'Copilot Studio',
  },

  // FLOW 2 TARGET — Changed since review
  {
    name: 'M&A Deal Room Assistant',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Fin.M&A.T_fac75f59-d4d7-88...',
    riskLevel: 'High',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'Some users',
    activities30d: 3156,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Changed since review',
    lastReviewedDate: '2026-02-15T09:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Sarah Chen',
    ownerEmail: 'schen@contoso.com',
    department: 'Corporate Development',
    agentCategory: 'Published by your org',
    platform: 'Copilot Studio',
    previousVersion: 'v1.2',
    currentVersion: 'v1.4',
    changes: [
      { type: 'tool_added', label: 'Salesforce-MCP', detail: 'New MCP connector to Salesforce CRM added' },
      { type: 'tool_added', label: 'SQL-Connector', detail: 'Direct SQL access to finance database added' },
      { type: 'knowledge_added', label: 'M&A-Confidential-2026/', detail: 'New SharePoint folder with 47 confidential documents' },
      { type: 'knowledge_added', label: 'Board-Materials/', detail: 'Access to board meeting materials library' },
      { type: 'capability_changed', label: 'External sharing enabled', detail: 'Agent can now share documents externally via Teams' },
      { type: 'instruction_changed', label: 'System prompt updated', detail: 'Instructions modified to include deal-room summarization workflows' },
    ],
  },

  // Changed since review (was: Review expired)
  {
    name: 'Patent Application Generator',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Legal.IP.T_9d6e2bfd-3cfd-28...',
    riskLevel: 'High',
    riskTypes: ['Oversharing', 'Exfiltration'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 1247,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Changed since review',
    lastReviewedDate: '2025-11-01T10:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'No data available',
    ownerEmail: '',
    department: 'Legal',
    agentCategory: 'Shared by creator',
    platform: 'Azure Foundry',
  },

  // Never reviewed
  {
    name: 'Customer PII Retriever',
    type: 'user',
    initials: 'S',
    status: 'Active',
    agentId: 'Sup.PII.78942ebe-0325-471e...',
    riskLevel: 'High',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 11503,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Never reviewed',
    lastReviewedDate: null,
    lastReviewedBy: null,
    owner: 'No data available',
    ownerEmail: '',
    department: 'Support',
    agentCategory: 'Shared by creator',
    platform: 'SharePoint',
  },

  // Never reviewed
  {
    name: 'Source Code Vulnerability Scanner',
    type: 'user',
    initials: 'D',
    status: 'Active',
    agentId: 'Dev.Sec.21adf640-fdfa-42d3...',
    riskLevel: 'High',
    riskTypes: ['Exfiltration'],
    authType: 'Shared Key',
    availability: 'Some users',
    activities30d: 4891,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Never reviewed',
    lastReviewedDate: null,
    lastReviewedBy: null,
    owner: 'Alex Rivera',
    ownerEmail: 'arivera@contoso.com',
    department: 'Engineering',
    agentCategory: 'Shared by creator',
    platform: 'Azure Foundry',
  },

  // Reviewed — healthy
  {
    name: 'Accounting Agent',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Acct.Agent.33...',
    riskLevel: 'Medium',
    riskTypes: ['Exfiltration'],
    authType: 'Managed Identity',
    availability: 'All users',
    activities30d: 6234,
    hasDLP: true,
    dlpPolicyCount: 2,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-01T11:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Lisa Wang',
    ownerEmail: 'lwang@contoso.com',
    department: 'Finance',
    agentCategory: 'Published by your org',
    platform: 'Copilot Studio',
  },

  // Changed since review
  {
    name: 'Q3 Financial Earnings Bot',
    type: 'app',
    icon: 'excel',
    status: 'Active',
    agentId: 'Fin.Earn.T_20c3fe71-eb61-d5...',
    riskLevel: 'High',
    riskTypes: ['Unethical'],
    authType: 'Access Key',
    availability: 'Some users',
    activities30d: 5672,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Changed since review',
    lastReviewedDate: '2026-01-20T08:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'David Kim',
    ownerEmail: 'dkim@contoso.com',
    department: 'Finance',
    agentCategory: 'Published by your org',
    platform: 'Microsoft 365 Copilot Agent Builder',
    previousVersion: 'v2.0',
    currentVersion: 'v2.3',
    changes: [
      { type: 'tool_removed', label: 'Compliance-Check-API', detail: 'Compliance validation tool was removed' },
      { type: 'tool_added', label: 'Bloomberg-Feed', detail: 'Real-time market data connector added' },
      { type: 'capability_changed', label: 'Auto-publish enabled', detail: 'Agent can now publish reports without human approval' },
    ],
  },

  // Reviewed — healthy
  {
    name: 'Litigation Hold Search',
    type: 'user',
    initials: 'L',
    status: 'Active',
    agentId: 'Leg.Hold.157745c9-87c3-42e5...',
    riskLevel: 'High',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'Some users',
    activities30d: 2894,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-10T16:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Jennifer Walsh',
    ownerEmail: 'jwalsh@contoso.com',
    department: 'Legal',
    agentCategory: 'Published by your org',
    platform: 'SharePoint',
  },

  // Low risk, reviewed
  {
    name: 'AborseAgentJan092026',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Aborse.Jan.22...',
    riskLevel: 'Low',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 347,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-05T14:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Tom Bernard',
    ownerEmail: 'tbernard@contoso.com',
    department: 'IT',
    agentCategory: 'Shared by creator',
    platform: 'Copilot Studio',
  },

  // No risk, never reviewed
  {
    name: '01/20/2026-AborseAgent',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Aborse.782h-28...',
    riskLevel: 'None',
    riskTypes: [],
    authType: 'Entra ID',
    availability: 'Blocked',
    activities30d: 12,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Never reviewed',
    lastReviewedDate: null,
    lastReviewedBy: null,
    owner: 'Tom Bernard',
    ownerEmail: 'tbernard@contoso.com',
    department: 'IT',
    agentCategory: 'Shared by creator',
    platform: 'Copilot Studio',
  },

  // No risk, reviewed
  {
    name: 'ADO Agent POC',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'ADO.POC.992-11...',
    riskLevel: 'None',
    riskTypes: [],
    authType: 'Managed Identity',
    availability: 'All users',
    activities30d: 891,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-12T09:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'Priya Sharma',
    ownerEmail: 'psharma@contoso.com',
    department: 'Engineering',
    agentCategory: 'Published by your org',
    platform: 'Azure Foundry',
  },

  // ── Additional agents for realistic table density ───────────────

  // Changed since review
  {
    name: 'HR Benefits Enrollment Bot',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'HR.Ben.T_a3f91c4e-7b22-44...',
    riskLevel: 'High',
    riskTypes: ['Oversharing', 'Exfiltration'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 7423,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Changed since review',
    lastReviewedDate: '2026-01-28T10:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Rachel Adams',
    ownerEmail: 'radams@contoso.com',
    department: 'HR',
    agentCategory: 'Published by your org',
    platform: 'Copilot Studio',
    previousVersion: 'v1.0',
    currentVersion: 'v1.3',
    changes: [
      { type: 'knowledge_added', label: 'Employee-Medical-Records/', detail: 'Access to medical records SharePoint library added' },
      { type: 'tool_added', label: 'ADP-Connector', detail: 'Direct integration with ADP payroll system' },
    ],
  },

  // Changed since review
  {
    name: 'Sales Forecast Copilot',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Sales.FC.T_d8e4a102-bb33-91...',
    riskLevel: 'Medium',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 4102,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Changed since review',
    lastReviewedDate: '2026-02-05T14:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'Kevin Nguyen',
    ownerEmail: 'knguyen@contoso.com',
    department: 'Sales',
    agentCategory: 'Microsoft',
    platform: 'Copilot Studio',
    previousVersion: 'v3.1',
    currentVersion: 'v3.4',
    changes: [
      { type: 'capability_changed', label: 'Cross-region data access', detail: 'Agent can now access EMEA and APAC sales data' },
      { type: 'instruction_changed', label: 'Prompt updated', detail: 'System prompt modified to generate competitive analysis' },
    ],
  },

  // Changed since review (was: Compliance Training Tracker - expired)
  {
    name: 'Compliance Training Tracker',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Comp.Train.T_f2c88a01-4d91-33...',
    riskLevel: 'Medium',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'Some users',
    activities30d: 1856,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Changed since review',
    lastReviewedDate: '2025-10-15T09:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'Linda Foster',
    ownerEmail: 'lfoster@contoso.com',
    department: 'Compliance',
    agentCategory: 'Published by your org',
    platform: 'SharePoint',
  },

  // Changed since review (was: Vendor Risk Assessment Agent - expired)
  {
    name: 'Vendor Risk Assessment Agent',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Proc.VRA.T_91aa7f32-c5b8-22...',
    riskLevel: 'High',
    riskTypes: ['Exfiltration'],
    authType: 'Shared Key',
    availability: 'Some users',
    activities30d: 6781,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Changed since review',
    lastReviewedDate: '2025-09-20T11:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Marcus Brown',
    ownerEmail: 'mbrown@contoso.com',
    department: 'Procurement',
    agentCategory: 'External Partners',
    platform: 'Azure Foundry',
  },

  // Never reviewed
  {
    name: 'Meeting Summarizer Bot',
    type: 'user',
    initials: 'J',
    status: 'Active',
    agentId: 'IT.Meet.T_62fd1c09-aa47-55...',
    riskLevel: 'Medium',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 2340,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Never reviewed',
    lastReviewedDate: null,
    lastReviewedBy: null,
    owner: 'Jason Park',
    ownerEmail: 'jpark@contoso.com',
    department: 'IT',
    agentCategory: 'Shared by creator',
    platform: 'Microsoft 365 Copilot Agent Builder',
  },

  // Never reviewed
  {
    name: 'Contract Clause Extractor',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'Leg.CCE.T_bb09e412-d7f3-66...',
    riskLevel: 'High',
    riskTypes: ['Oversharing'],
    authType: 'Access Key',
    availability: 'Blocked',
    activities30d: 8,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Never reviewed',
    lastReviewedDate: null,
    lastReviewedBy: null,
    owner: 'No data available',
    ownerEmail: '',
    department: 'Legal',
    agentCategory: 'Shared by creator',
    platform: 'Copilot Studio',
  },

  // Reviewed — healthy
  {
    name: 'IT Helpdesk Assistant',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'IT.Help.T_3c8f9a41-e012-77...',
    riskLevel: 'Low',
    riskTypes: [],
    authType: 'Managed Identity',
    availability: 'All users',
    activities30d: 523,
    hasDLP: true,
    dlpPolicyCount: 2,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-15T08:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Brian Lee',
    ownerEmail: 'blee@contoso.com',
    department: 'IT',
    agentCategory: 'Microsoft',
    platform: 'Microsoft 365 Copilot Agent Builder',
  },

  // Reviewed — healthy
  {
    name: 'Employee Onboarding Agent',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'HR.Onb.T_7de41b88-923c-44...',
    riskLevel: 'Low',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 415,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-08T10:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'Sandra Gill',
    ownerEmail: 'sgill@contoso.com',
    department: 'HR',
    agentCategory: 'Published by your org',
    platform: 'Copilot Studio',
  },

  // Reviewed — healthy
  {
    name: 'Marketing Campaign Analyzer',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Mkt.Camp.T_04b2ee91-fc88-33...',
    riskLevel: 'Low',
    riskTypes: [],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 289,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-11T15:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Amy Chen',
    ownerEmail: 'achen@contoso.com',
    department: 'Marketing',
    agentCategory: 'Published by your org',
    platform: 'Copilot Studio',
  },

  // Reviewed — healthy
  {
    name: 'Supply Chain Optimizer',
    type: 'app',
    icon: 'custom',
    status: 'Active',
    agentId: 'Ops.SCO.T_51e3dd02-7a99-11...',
    riskLevel: 'Medium',
    riskTypes: ['Exfiltration'],
    authType: 'Managed Identity',
    availability: 'Some users',
    activities30d: 1645,
    hasDLP: true,
    dlpPolicyCount: 2,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-14T09:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'Carlos Diaz',
    ownerEmail: 'cdiaz@contoso.com',
    department: 'Operations',
    agentCategory: 'External Partners',
    platform: 'Azure Foundry',
  },

  // Reviewed — healthy
  {
    name: 'Research Paper Summarizer',
    type: 'user',
    initials: 'R',
    status: 'Active',
    agentId: 'R&D.Summ.T_82c1fa90-b541-22...',
    riskLevel: 'None',
    riskTypes: [],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 156,
    hasDLP: false,
    dlpPolicyCount: 0,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-10T11:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Robert Tanaka',
    ownerEmail: 'rtanaka@contoso.com',
    department: 'R&D',
    agentCategory: 'Shared by creator',
    platform: 'Copilot Studio',
  },

  // Reviewed — healthy
  {
    name: 'Customer Success Copilot',
    type: 'app',
    icon: 'copilot',
    status: 'Active',
    agentId: 'CS.Cop.T_aa99fb31-5c22-88...',
    riskLevel: 'Medium',
    riskTypes: ['Oversharing'],
    authType: 'Entra ID',
    availability: 'All users',
    activities30d: 3847,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-13T13:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'Nina Patel',
    ownerEmail: 'npatel@contoso.com',
    department: 'Customer Success',
    agentCategory: 'Published by your org',
    platform: 'Copilot Studio',
  },

  // Reviewed — healthy
  {
    name: 'Internal Audit Agent',
    type: 'app',
    icon: 'excel',
    status: 'Active',
    agentId: 'Fin.Aud.T_c4d5e601-33af-99...',
    riskLevel: 'Medium',
    riskTypes: ['Exfiltration'],
    authType: 'Entra ID',
    availability: 'Some users',
    activities30d: 2103,
    hasDLP: true,
    dlpPolicyCount: 3,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-03-16T10:00:00Z',
    lastReviewedBy: 'Sarah Kim',
    owner: 'Diana Ross',
    ownerEmail: 'dross@contoso.com',
    department: 'Finance',
    agentCategory: 'Published by your org',
    platform: 'Microsoft 365 Copilot Agent Builder',
  },

  // Reviewed — healthy (inactive)
  {
    name: 'Legacy CRM Migrator',
    type: 'app',
    icon: 'custom',
    status: 'Inactive',
    agentId: 'IT.CRM.T_ee12ab78-91cc-44...',
    riskLevel: 'None',
    riskTypes: [],
    authType: 'Managed Identity',
    availability: 'Blocked',
    activities30d: 0,
    hasDLP: true,
    dlpPolicyCount: 1,
    governanceState: 'Reviewed',
    lastReviewedDate: '2026-02-20T14:00:00Z',
    lastReviewedBy: 'James Park',
    owner: 'Steve Owens',
    ownerEmail: 'sowens@contoso.com',
    department: 'IT',
    agentCategory: 'Published by your org',
    platform: 'Azure Foundry',
  },
]

// ── Procedural agent generation (brings total to 254) ─────────────

const _nouns = ['Budget','Invoice','Travel','Expense','Revenue','Billing','Payment','Credit','Treasury','Purchase','Cost','Forecast','Tax','Timesheet','Benefits','Leave','Performance','Recruiting','Wellness','Diversity','Compensation','Workforce','NDA','Regulatory','Discovery','Contract','Privacy','License','Code','Pipeline','Infrastructure','Patch','Gateway','Database','Log','Desk','Deployment','Network','Cloud','Warehouse','Quality','Fleet','Maintenance','Safety','Capacity','Resource','Process','Environmental','Scheduling','Inventory']
const _verbs = ['Planning','Processing','Analysis','Monitoring','Management','Optimization','Reporting','Tracking','Automation','Validation','Review','Classification','Aggregation','Detection','Routing','Scheduling','Forecasting','Reconciliation','Verification','Generation']
const _types = ['Agent','Bot','Copilot','Assistant','Processor','Analyzer','Tracker','Monitor']
const _depts = ['Finance','Legal','HR','Engineering','IT','Marketing','Sales','Operations','Compliance','R&D','Customer Success','Procurement','Security','Product','Data Science']
const _ownrs: [string, string][] = [
  ['Alex Johnson','ajohnson'],['Maria Garcia','mgarcia'],['Chris Lee','clee'],['Priya Patel','ppatel'],
  ['Jordan Williams','jwilliams'],['Sophia Martinez','smartinez'],['Liam Thompson','lthompson'],['Olivia Brown','obrown'],
  ['Noah Davis','ndavis'],['Emma Wilson','ewilson'],['Ethan Moore','emoore'],['Ava Taylor','ataylor'],
  ['Lucas Anderson','landerson'],['Mia Jackson','mjackson'],['Mason White','mwhite'],['Isabella Harris','iharris'],
  ['Logan Martin','lmartin'],['Charlotte Robinson','crobinson'],['Henry Clark','hclark'],['Amelia Lewis','alewis'],
]
const _revs = ['Sarah Kim', 'James Park', 'Elena Vasquez', 'Robert Chen']
const _icons = ['copilot', 'custom', 'excel', 'copilot', 'custom', 'copilot']
const _agentCats: DemoAgent['agentCategory'][] = ['Published by your org', 'Shared by creator', 'Microsoft', 'External Partners']
const _plats: DemoAgent['platform'][] = ['Copilot Studio', 'Azure Foundry', 'Microsoft 365 Copilot Agent Builder', 'SharePoint', 'Other']

function _genAgents(count: number): DemoAgent[] {
  const result: DemoAgent[] = []
  for (let i = 0; i < count; i++) {
    const name = `${_nouns[i % _nouns.length]} ${_verbs[Math.floor(i / _nouns.length) % _verbs.length]} ${_types[i % _types.length]}`
    const di = i % _depts.length
    const oi = i % _ownrs.length

    // Risk: 5 High, 33 Medium, 76 Low, 115 None — shuffled via prime multiplier
    const rs = (i * 37 + 7) % count
    const riskLevel: DemoAgent['riskLevel'] = rs < 5 ? 'High' : rs < 38 ? 'Medium' : rs < 114 ? 'Low' : 'None'

    const riskTypes: string[] =
      riskLevel === 'High' ? (i % 3 === 0 ? ['Oversharing', 'Exfiltration'] : i % 3 === 1 ? ['Exfiltration'] : ['Oversharing']) :
      riskLevel === 'Medium' ? (i % 6 < 2 ? ['Oversharing'] : i % 6 === 2 ? ['Exfiltration'] : i % 6 === 3 ? ['Unethical'] : []) :
      riskLevel === 'Low' ? (i % 6 === 0 ? ['Oversharing'] : []) :
      []

    // Governance: 16 Changed, 35 Never, 21 Expired, 157 Reviewed — shuffled
    const gs = (i * 41 + 11) % count
    const governanceState: GovernanceState = gs < 36 ? 'Changed since review' : gs < 71 ? 'Never reviewed' : 'Reviewed'

    const hasDLP = ((i * 53 + 3) % count) >= 77
    const authOpts: DemoAgent['authType'][] = ['Entra ID', 'Entra ID', 'Managed Identity', 'Entra ID', 'Shared Key', 'Entra ID', 'Managed Identity', 'Access Key']
    const isNever = governanceState === 'Never reviewed'
    const rm = String((i % 6) + 1).padStart(2, '0')
    const rd = String((i % 28) + 1).padStart(2, '0')
    const isUser = i % 8 === 0
    // ~60% Published by your org, ~20% Shared, ~10% Microsoft, ~10% External
    const catIdx = (i * 31 + 5) % 10
    const agentCategory: DemoAgent['agentCategory'] = catIdx < 6 ? 'Published by your org' : catIdx < 8 ? 'Shared by creator' : catIdx < 9 ? 'Microsoft' : 'External Partners'
    const platform = _plats[(i * 23 + 3) % _plats.length]
    const avIdx = (i * 19 + 2) % 10
    const availability: DemoAgent['availability'] = avIdx < 5 ? 'All users' : avIdx < 9 ? 'Some users' : 'Blocked'
    // Activity volume: High risk agents get more, Blocked get near-zero
    const baseAct = riskLevel === 'High' ? 4000 + (i * 137) % 9000 :
                    riskLevel === 'Medium' ? 800 + (i * 89) % 5000 :
                    riskLevel === 'Low' ? 50 + (i * 43) % 2000 :
                    5 + (i * 17) % 500
    const activities30d = availability === 'Blocked' ? Math.floor(baseAct * 0.02) : baseAct

    result.push({
      name,
      type: isUser ? 'user' : 'app',
      icon: isUser ? undefined : _icons[i % _icons.length],
      initials: isUser ? name.charAt(0) : undefined,
      status: 'Active',
      agentId: `Gen.${_depts[di].substring(0, 4)}.${(i + 100).toString(16)}-${((i * 7 + 13) & 0xFFFF).toString(16).padStart(4, '0')}...`,
      riskLevel,
      riskTypes,
      authType: authOpts[i % authOpts.length],
      availability,
      activities30d,
      hasDLP,
      dlpPolicyCount: hasDLP ? (i % 3) + 1 : 0,
      governanceState,
      lastReviewedDate: isNever ? null : `2026-${rm}-${rd}T10:00:00Z`,
      lastReviewedBy: isNever ? null : _revs[i % _revs.length],
      owner: _ownrs[oi][0],
      ownerEmail: `${_ownrs[oi][1]}@contoso.com`,
      department: _depts[di],
      agentCategory,
      platform,
    })
  }
  return result
}

export const demoAgents: DemoAgent[] = [..._handCraftedAgents, ..._genAgents(229)]

// ── Exfiltration incident data (Flow 3) ───────────────────────────

export const exfilIncidents: Record<string, ExfilIncident> = {
  'HR.Exec.T_45a2ccdc-ec13-a4...': {
    agentId: 'HR.Exec.T_45a2ccdc-ec13-a4...',
    summary: '15 sensitive documents containing PII were exported to an external email address in a 47-minute window. Files include payroll data, compensation plans, and employee SSNs.',
    severity: 'Critical',
    detectedAt: '2026-03-17T14:23:00Z',
    destination: 'external-audit@partnerfirm.com',
    destinationType: 'External email',
    files: [
      { id: 'f1', name: 'Payroll-Q4-2025.xlsx', path: '/sites/HR-Confidential/Payroll/', sensitivityLabel: 'Highly Confidential', size: '2.4 MB', accessedAt: '2026-03-17T14:02:00Z' },
      { id: 'f2', name: 'Executive-Comp-Plan.xlsx', path: '/sites/HR-Confidential/Compensation/', sensitivityLabel: 'Highly Confidential', size: '1.8 MB', accessedAt: '2026-03-17T14:05:00Z' },
      { id: 'f3', name: 'Employee-SSN-Master.csv', path: '/sites/HR-Confidential/PII/', sensitivityLabel: 'Highly Confidential – PII', size: '4.1 MB', accessedAt: '2026-03-17T14:08:00Z' },
      { id: 'f4', name: 'Benefits-Enrollment-2026.pdf', path: '/sites/HR-Confidential/Benefits/', sensitivityLabel: 'Confidential', size: '892 KB', accessedAt: '2026-03-17T14:15:00Z' },
      { id: 'f5', name: 'Termination-List-Q1.docx', path: '/sites/HR-Confidential/Actions/', sensitivityLabel: 'Highly Confidential – HR', size: '156 KB', accessedAt: '2026-03-17T14:22:00Z' },
      { id: 'f6', name: 'Salary-Bands-2026.xlsx', path: '/sites/HR-Confidential/Compensation/', sensitivityLabel: 'Confidential', size: '340 KB', accessedAt: '2026-03-17T14:28:00Z' },
      { id: 'f7', name: 'W2-Batch-2025.zip', path: '/sites/HR-Confidential/Tax/', sensitivityLabel: 'Highly Confidential – PII', size: '12.6 MB', accessedAt: '2026-03-17T14:35:00Z' },
    ],
    timeline: [
      { id: 'e1', timestamp: '2026-03-17T13:58:00Z', action: 'Agent activated', actor: 'System (scheduled)', detail: 'Quarterly payroll audit workflow triggered', isSensitive: false },
      { id: 'e2', timestamp: '2026-03-17T14:02:00Z', action: 'File accessed', actor: 'Executive Payroll Auditor', detail: 'Read Payroll-Q4-2025.xlsx from SharePoint HR-Confidential', isSensitive: true },
      { id: 'e3', timestamp: '2026-03-17T14:05:00Z', action: 'File accessed', actor: 'Executive Payroll Auditor', detail: 'Read Executive-Comp-Plan.xlsx', isSensitive: true },
      { id: 'e4', timestamp: '2026-03-17T14:08:00Z', action: 'File accessed', actor: 'Executive Payroll Auditor', detail: 'Read Employee-SSN-Master.csv (PII)', isSensitive: true },
      { id: 'e5', timestamp: '2026-03-17T14:12:00Z', action: 'Data aggregated', actor: 'Executive Payroll Auditor', detail: 'Combined 3 files into single dataset (7,432 rows)', isSensitive: true },
      { id: 'e6', timestamp: '2026-03-17T14:18:00Z', action: 'External share initiated', actor: 'Executive Payroll Auditor', detail: 'Composed email to external-audit@partnerfirm.com with 4 attachments', isSensitive: true },
      { id: 'e7', timestamp: '2026-03-17T14:22:00Z', action: 'Additional files accessed', actor: 'Executive Payroll Auditor', detail: 'Read Termination-List-Q1.docx and 2 more files', isSensitive: true },
      { id: 'e8', timestamp: '2026-03-17T14:35:00Z', action: 'Bulk export', actor: 'Executive Payroll Auditor', detail: 'Exported W2-Batch-2025.zip (12.6 MB) to external destination', isSensitive: true },
      { id: 'e9', timestamp: '2026-03-17T14:45:00Z', action: 'Alert triggered', actor: 'Purview DLP Engine', detail: 'Exfiltration alert: 15 sensitive files sent externally in 47 min', isSensitive: false },
    ],
    toolsUsed: ['SharePoint', 'Outlook', 'Excel', 'Power Automate'],
  },
}

// ── Governance state sort order ───────────────────────────────────

export const governanceStateOrder: Record<GovernanceState, number> = {
  'Changed since review': 0,
  'Never reviewed': 1,
  'Reviewed': 2,
}

// ── Helpers ───────────────────────────────────────────────────────

export function getGovernanceColor(state: GovernanceState): { bg: string; text: string; border: string } {
  switch (state) {
    case 'Never reviewed': return { bg: 'bg-[#FDE7E9]', text: 'text-[#A4262C]', border: 'border-[#A4262C]/30' }
    case 'Changed since review': return { bg: 'bg-[#FFF4CE]', text: 'text-[#835C00]', border: 'border-[#835C00]/30' }
    case 'Reviewed': return { bg: 'bg-[#DFF6DD]', text: 'text-[#107C10]', border: 'border-[#107C10]/30' }
  }
}

export function getRiskTypeColor(type: string): { bg: string; text: string } {
  switch (type) {
    case 'Oversharing': return { bg: 'bg-[#F3EAFA]', text: 'text-[#5C2D91]' }
    case 'Exfiltration': return { bg: 'bg-[#EBF3FC]', text: 'text-[#0078D4]' }
    case 'Unethical': return { bg: 'bg-[#E6F9FA]', text: 'text-[#006B6B]' }
    default: return { bg: 'bg-[#F3F2F1]', text: 'text-[#616161]' }
  }
}
