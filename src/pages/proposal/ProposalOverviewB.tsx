import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { rows, AgentRow } from '../../lib/agentsData'
import ProposalMetrics from '../../components/proposal/ProposalMetrics'
import QuickInvestigateModal from '../../components/proposal/QuickInvestigateModal'
import CopilotPromptBar from '../../components/proposal/CopilotPromptBar'
import CopilotPanel from '../../components/proposal/CopilotPanel'

/*
 * Option B — Decisioning-first AI Observability dashboard
 *
 * Differences from Option A:
 *  P0-1: Top Risks Workbench — triage hero section with reason chips + CTAs
 *  P0-2: Activity Explorer — Trend/Sequence dual mode, Compare toggle, click-to-filter
 *  P0-3: Coverage & Data Freshness strip — provenance + gaps
 */

// ── Banner ────────────────────────────────────────────────────────

function Banner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="bg-gradient-to-r from-[#25487B] to-[#5C2D91] text-white px-6 py-3 text-sm relative">
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4996 2C24.1484 2.0001 25.2718 3.34435 26.0631 4.85059C26.8917 6.42818 27.5867 8.61463 28.2281 11.1152C28.4316 11.9088 28.6154 12.614 28.6744 13.1914C28.7368 13.8029 28.6813 14.4556 28.234 15.0322C27.7832 15.613 27.1549 15.8267 26.5435 15.917C25.962 16.0028 25.2205 16 24.3824 16H20.6041C19.4559 16.0001 18.5746 16.2322 17.9498 16.708C17.3764 17.1448 16.8908 17.8854 16.6841 19.1924C16.4646 20.7683 16.2912 22.405 16.1744 24.0732C16.0909 25.2655 16.0231 26.2501 15.8765 27.0156C15.7272 27.7953 15.4685 28.513 14.8824 29.0596C14.3035 29.5992 13.5932 29.8119 12.8248 29.9082C12.0781 30.0017 11.1332 30 9.99958 30H7.9195C6.75091 30 5.76221 30.0029 4.97809 29.8857C4.15346 29.7624 3.4129 29.488 2.82966 28.8389C2.25784 28.2022 2.05337 27.4702 2.01227 26.6631C1.97376 25.9065 2.07631 24.9807 2.19196 23.9023C2.82758 17.9756 4.53785 12.5771 6.89997 8.62988C9.23024 4.73609 12.4438 2.00023 15.9996 2H22.4996ZM24.3082 18.0078C27.4785 18.1684 29.9996 20.7898 29.9996 24L29.9918 24.3086C29.8311 27.4789 27.2098 30 23.9996 30L23.691 29.9922C20.6231 29.8365 18.1628 27.3765 18.0074 24.3086L17.9996 24C17.9996 20.6864 20.6861 18.0002 23.9996 18L24.3082 18.0078Z" fill="white" />
          </svg>
          <span className="font-medium">Agent 365 is now available in Microsoft Purview. Get started with deeper insights and policy capabilities.</span>
          <button className="bg-white text-[#3c3c3c] px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 ml-2">Learn more about Agent 365</button>
        </div>
        <div className="absolute right-0 top-0">
          <button className="hover:bg-white/10 p-1 rounded" onClick={() => setVisible(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.4 4.55L4.47 4.47003C4.68 4.26003 5.09999 4.29003 5.38 4.48003L5.45999 4.55003L12 10.94L18.47 4.47003C18.74 4.20003 19.17 4.17003 19.47 4.39003L19.53 4.47003C19.8 4.74003 19.83 5.17003 19.61 5.47003L19.53 5.53003L13.06 12L19.53 18.47C19.8 18.74 19.83 19.15 19.61 19.45L19.53 19.53C19.26 19.8 18.84 19.83 18.54 19.61L18.47 19.53L12 13.06L5.53 19.53C5.26 19.8 4.84001 19.83 4.54001 19.61L4.47 19.53C4.2 19.26 4.17001 18.84 4.39001 18.54L4.47 18.47L10.94 12L4.47 5.53C4.2 5.26 4.17001 4.84003 4.39001 4.54003L4.4 4.55Z" fill="white" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── P0-3: Coverage & Data Freshness Strip ─────────────────────────

function CoverageStrip() {
  const [expanded, setExpanded] = useState(false)

  const sources = [
    { name: 'M365 Copilot', status: 'connected', color: '#107C10' },
    { name: 'Copilot Studio', status: 'connected', color: '#107C10' },
    { name: 'Azure AI Foundry', status: 'connected', color: '#107C10' },
    { name: 'SharePoint', status: 'connected', color: '#107C10' },
    { name: 'Salesforce MCP', status: 'partial', color: '#F7630C' },
    { name: 'ServiceNow', status: 'not connected', color: '#A4262C' },
  ]

  return (
    <div className="bg-gradient-to-r from-[#FAF9F8] to-[#F3F2F1] border border-[#E1DFDD] rounded-lg px-5 py-3.5 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Data sources */}
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="#616161"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-.5 3h1v5h-1V6Zm0 6h1v1h-1v-1Z" /></svg>
            <span className="text-[12px] font-semibold text-[#242424]">Data sources:</span>
            <div className="flex items-center gap-1.5">
              {sources.filter(s => s.status === 'connected').length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-[#107C10]">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="#107C10"><circle cx="6" cy="6" r="6" /><path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" fill="none" /></svg>
                  {sources.filter(s => s.status === 'connected').length} connected
                </span>
              )}
              {sources.filter(s => s.status === 'partial').length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-[#F7630C]">
                  <svg width="10" height="10" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" stroke="#F7630C" strokeWidth="2" fill="none" /><path d="M6 3.5v3M6 8h.01" stroke="#F7630C" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  {sources.filter(s => s.status === 'partial').length} partial
                </span>
              )}
              {sources.filter(s => s.status === 'not connected').length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-[#A4262C]">
                  <svg width="10" height="10" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" stroke="#A4262C" strokeWidth="2" fill="none" /><path d="M4 4l4 4M8 4l-4 4" stroke="#A4262C" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  {sources.filter(s => s.status === 'not connected').length} not connected
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-[#D1D1D1]" />

          {/* Last ingested */}
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#616161" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" /></svg>
            <span className="text-[12px] text-[#616161]">Last ingested: <span className="font-semibold text-[#242424]">Mar 9, 2026, 10:42 AM UTC</span></span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-[#D1D1D1]" />

          {/* Known gaps */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-[12px] text-[#0078D4] hover:underline"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#0078D4" strokeWidth="1.5"><path d="M8 2v12M2 8h12" /></svg>
            Known gaps & out of scope
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}><path d="M1 2.5l3 3 3-3" stroke="#0078D4" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Freshness indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#107C10] animate-pulse" />
          <span className="text-[11px] text-[#616161]">Live</span>
        </div>
      </div>

      {/* Expandable detail panel */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#E1DFDD]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-semibold text-[#242424] mb-2">Connected data sources</div>
              <div className="space-y-1.5">
                {sources.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-[12px]">
                    <span className="text-[#242424]">{s.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      s.status === 'connected' ? 'bg-[#DFF6DD] text-[#107C10]' :
                      s.status === 'partial' ? 'bg-[#FFF4CE] text-[#835C00]' :
                      'bg-[#FDE7E9] text-[#A4262C]'
                    }`}>
                      {s.status === 'connected' ? 'Active' : s.status === 'partial' ? 'Partial' : 'Not connected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#242424] mb-2">Known limitations</div>
              <ul className="space-y-1 text-[12px] text-[#616161]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#D83B01] mt-0.5">•</span>
                  ServiceNow activities not yet ingested — connector pending IT approval
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#D83B01] mt-0.5">•</span>
                  Salesforce MCP: only read operations captured; writes arriving Q2
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#616161] mt-0.5">•</span>
                  3P agent telemetry limited to registered agents in Entra ID
                </li>
              </ul>
              <button className="mt-2 text-[11px] text-[#0078D4] hover:underline flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 4A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5V11h-1v3.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5H9V4H5.5Zm5.5 0v1h2.79l-4.15 4.15.71.7L14.5 5.71V8.5h1V4h-4.5Z" /></svg>
                View full data source configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── P0-1: Top Risks Workbench ─────────────────────────────────────

interface RiskReason {
  label: string
  severity: 'critical' | 'high' | 'medium'
}

const topRiskyAgents: {
  agentId: string
  name: string
  type: 'app' | 'user'
  icon?: string
  initials?: string
  riskLevel: 'High' | 'Medium'
  reasons: RiskReason[]
  lastSeen: string
  hasApplicableControl: boolean
  controlLabel?: string
}[] = [
  {
    agentId: 'Fin.M&A.T_fac75f59-d4d7-88...',
    name: 'M&A Deal Room Assistant',
    type: 'app',
    icon: 'copilot',
    riskLevel: 'High',
    reasons: [
      { label: 'Sensitive file access', severity: 'critical' },
      { label: '+150% volume spike', severity: 'critical' },
      { label: 'No DLP policy', severity: 'high' },
    ],
    lastSeen: '12 min ago',
    hasApplicableControl: true,
    controlLabel: 'Apply DLP policy',
  },
  {
    agentId: 'HR.Exec.T_45a2ccdc-ec13-a4...',
    name: 'Executive Payroll Auditor',
    type: 'app',
    icon: 'excel',
    riskLevel: 'High',
    reasons: [
      { label: 'External exfil attempt', severity: 'critical' },
      { label: 'PII data accessed', severity: 'high' },
      { label: '+300% spike vs baseline', severity: 'critical' },
    ],
    lastSeen: '28 min ago',
    hasApplicableControl: true,
    controlLabel: 'Block external sharing',
  },
  {
    agentId: 'Legal.IP.T_9d6e2bfd-3cfd-28...',
    name: 'Patent Application Generator',
    type: 'app',
    icon: 'copilot',
    riskLevel: 'High',
    reasons: [
      { label: 'Oversharing + Exfiltration', severity: 'high' },
      { label: 'Shared Key auth', severity: 'medium' },
    ],
    lastSeen: '1 hr ago',
    hasApplicableControl: true,
    controlLabel: 'Enforce Entra ID',
  },
  {
    agentId: 'Dev.Sec.21adf640-fdfa-42d3...',
    name: 'Source Code Vulnerability Scanner',
    type: 'user',
    initials: 'D',
    riskLevel: 'High',
    reasons: [
      { label: 'High-risk policy match', severity: 'high' },
      { label: 'Shared Key auth', severity: 'medium' },
      { label: 'Bulk data download', severity: 'high' },
    ],
    lastSeen: '2 hr ago',
    hasApplicableControl: false,
  },
  {
    agentId: 'Fin.Earn.T_20c3fe71-eb61-d5...',
    name: 'Q3 Financial Earnings Bot',
    type: 'app',
    icon: 'excel',
    riskLevel: 'High',
    reasons: [
      { label: 'Unethical content', severity: 'high' },
      { label: 'Access Key auth', severity: 'medium' },
    ],
    lastSeen: '3 hr ago',
    hasApplicableControl: true,
    controlLabel: 'Apply content filter',
  },
  {
    agentId: 'Sup.PII.78942ebe-0325-471e...',
    name: 'Customer PII Retriever',
    type: 'user',
    initials: 'S',
    riskLevel: 'High',
    reasons: [
      { label: 'PII data accessed', severity: 'critical' },
      { label: 'No DLP policy', severity: 'high' },
    ],
    lastSeen: '4 hr ago',
    hasApplicableControl: true,
    controlLabel: 'Apply DLP policy',
  },
]

function ReasonChip({ reason }: { reason: RiskReason }) {
  const styles = {
    critical: 'bg-[#FDE7E9] text-[#A4262C] border-[#A4262C]/30',
    high: 'bg-[#FFF4CE] text-[#835C00] border-[#835C00]/30',
    medium: 'bg-[#F3F2F1] text-[#616161] border-[#616161]/20',
  }
  const icons = {
    critical: <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0.5L11.5 10.5H0.5L6 0.5Z" /></svg>,
    high: <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0.5L11.5 10.5H0.5L6 0.5Z" /></svg>,
    medium: <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="5" /></svg>,
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${styles[reason.severity]}`}>
      {icons[reason.severity]}
      {reason.label}
    </span>
  )
}

function TopRisksWorkbench() {
  const navigate = useNavigate()
  const [showExplainer, setShowExplainer] = useState(false)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#242424] flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="#A4262C"><path d="M8.68 2.79a1.5 1.5 0 0 1 2.64 0l5.5 10.24A1.5 1.5 0 0 1 15.5 15h-11a1.5 1.5 0 0 1-1.32-2.2l5.5-10Zm1.32.6L4.5 13.62a.5.5 0 0 0 .44.73h11a.5.5 0 0 0 .44-.73L10.88 3.4a.5.5 0 0 0-.88 0ZM10 6a.5.5 0 0 1 .5.5v4a.5.5 0 1 1-1 0v-4A.5.5 0 0 1 10 6Zm0 6.5a.65.65 0 1 1 0 1.3.65.65 0 0 1 0-1.3Z" /></svg>
            Top risks requiring action
            <span className="px-2 py-0.5 bg-[#A4262C] text-white text-[12px] font-bold rounded-full">{topRiskyAgents.length}</span>
          </h2>
          <p className="text-[13px] text-[#616161] mt-1.5">Agents ranked by risk severity, anomaly signals, and policy gaps. Triage and respond inline.</p>
        </div>
        <button
          onClick={() => setShowExplainer(!showExplainer)}
          className="text-[12px] text-[#0078D4] hover:underline flex items-center gap-1 shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.25" stroke="#0078D4" strokeWidth="1.5" />
            <path d="M6.5 6.5c0-1.1.9-1.5 1.5-1.5s1.5.4 1.5 1.5c0 .8-.6 1.1-1 1.3-.3.1-.5.3-.5.7M8 10.5h.01" stroke="#0078D4" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Why am I seeing this?
        </button>
      </div>

      {/* Explainer collapse */}
      {showExplainer && (
        <div className="mb-4 p-4 bg-[#EBF3FC] border border-[#0078D4]/20 rounded-lg">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#0078D4" className="shrink-0 mt-0.5"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-.5 3h1v5h-1V6Zm0 6h1v1h-1v-1Z" /></svg>
            <div className="text-[12px] text-[#242424] leading-relaxed">
              <p className="font-semibold mb-1">How this list is generated</p>
              <p>Agents are scored using a composite signal that combines:</p>
              <ul className="list-disc ml-4 mt-1 space-y-0.5 text-[#424242]">
                <li><strong>Anomaly detection:</strong> Sensitive activity volume compared to a 30-day rolling baseline</li>
                <li><strong>Risk type severity:</strong> Oversharing &amp; exfiltration weighted higher than unethical</li>
                <li><strong>Policy gap analysis:</strong> Agents with 0 DLP/compliance policies are ranked higher</li>
                <li><strong>Authentication posture:</strong> Shared Key / Access Key agents ranked above Entra ID</li>
              </ul>
              <p className="mt-2 text-[#616161]">This ranking updates as new telemetry is ingested. Scores reflect the last 30-day window.</p>
            </div>
          </div>
        </div>
      )}

      {/* Risk cards */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden border-l-4 border-l-[#A4262C]">
        {/* Header */}
        <div className="grid grid-cols-[minmax(260px,1.2fr)_minmax(240px,1.5fr)_90px_220px] gap-4 items-center px-6 py-3 bg-[#FAF9F8] border-b border-gray-200">
          <div className="text-[12px] font-semibold text-[#242424] uppercase tracking-wider">Agent</div>
          <div className="text-[12px] font-semibold text-[#242424] uppercase tracking-wider">Risk signals</div>
          <div className="text-[12px] font-semibold text-[#242424] uppercase tracking-wider">Last seen</div>
          <div className="text-[12px] font-semibold text-[#242424] uppercase tracking-wider">Actions</div>
        </div>

        {/* Rows */}
        {topRiskyAgents.map((agent, idx) => (
          <div
            key={agent.agentId}
            className={`grid grid-cols-[minmax(260px,1.2fr)_minmax(240px,1.5fr)_90px_220px] gap-4 items-center px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-[#FDE7E9]/10 transition-colors ${
              idx === 0 ? 'bg-[#FDE7E9]/40' : idx < 3 ? 'bg-[#FDE7E9]/15' : ''
            }`}
          >
            {/* Agent name */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <AppIcon type={agent.type} initials={agent.initials} icon={agent.icon} />
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${agent.riskLevel === 'High' ? 'bg-[#A4262C]' : 'bg-[#D83B01]'}`}>
                  {idx + 1}
                </div>
              </div>
              <div className="min-w-0">
                <button
                  onClick={() => navigate(`/proposal/agents/${agent.agentId}`)}
                  className="text-[14px] font-semibold text-[#242424] hover:text-[#0078D4] hover:underline truncate block text-left"
                >
                  {agent.name}
                </button>
                <div className="flex items-center gap-1.5 mt-1">
                  <RiskLevel level={agent.riskLevel} />
                </div>
              </div>
            </div>

            {/* Reason chips */}
            <div className="flex flex-wrap gap-1">
              {agent.reasons.map((r, i) => <ReasonChip key={i} reason={r} />)}
            </div>

            {/* Last seen */}
            <div className="text-[13px] text-[#616161] font-medium">{agent.lastSeen}</div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/proposal/agents/${agent.agentId}`)}
                className="px-4 py-2 bg-[#A4262C] text-white text-[12px] font-semibold rounded-md hover:bg-[#8B1F24] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5"><circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" /></svg>
                Investigate
              </button>
              {agent.hasApplicableControl && (
                <button className="px-4 py-2 border border-[#0078D4] text-[#0078D4] text-[12px] font-semibold rounded-md hover:bg-[#EBF3FC] transition-colors flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v5M5 4l3 3 3-3M2 10v3h12v-3" /></svg>
                  {agent.controlLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── P0-2: Activity Explorer (Trend + Sequence dual mode) ──────────

function ActivityExplorer() {
  const [mode, setMode] = useState<'trend' | 'sequence'>('trend')
  const [compareEnabled, setCompareEnabled] = useState(false)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [selectedBar, setSelectedBar] = useState<number | null>(null)

  // 30-day trend data for current + baseline
  const currentData = [0, 2, 0, 3, 8, 0, 1, 0, 0, 12, 5, 0, 2, 18, 6, 0, 0, 4, 0, 0, 0, 0, 14, 0, 0, 0, 9, 0, 0, 3]
  const baselineData = [1, 1, 0, 2, 3, 1, 0, 1, 0, 4, 2, 1, 1, 5, 2, 0, 1, 2, 0, 1, 0, 0, 3, 1, 0, 1, 2, 0, 1, 1]
  const maxVal = Math.max(...currentData, ...(compareEnabled ? baselineData : [0]))

  // Sequence data (event chain)
  const sequenceEvents = [
    { time: '08:12', agent: 'M&A Deal Room', action: 'Agent execution started', risk: false, type: 'start' },
    { time: '08:13', agent: 'M&A Deal Room', action: 'Queried SharePoint "M&A-Docs"', risk: false, type: 'read' },
    { time: '08:14', agent: 'M&A Deal Room', action: 'Accessed Board-Draft.pptx (Confidential)', risk: true, type: 'access' },
    { time: '08:14', agent: 'M&A Deal Room', action: 'Accessed M&A-Notes.pdf (Restricted)', risk: true, type: 'access' },
    { time: '08:15', agent: 'Exec Payroll Auditor', action: 'Exported Payroll-Q4.xlsx to OneDrive', risk: true, type: 'exfil' },
    { time: '08:15', agent: 'M&A Deal Room', action: 'Posted 2 docs to public SharePoint', risk: true, type: 'share' },
    { time: '08:16', agent: 'Exec Payroll Auditor', action: 'Created external sharing link', risk: true, type: 'share' },
    { time: '08:17', agent: 'Patent App Generator', action: 'Accessed trade-secret.docx', risk: true, type: 'access' },
    { time: '08:18', agent: 'M&A Deal Room', action: 'Agent execution completed', risk: false, type: 'end' },
  ]

  const dayLabels = Array.from({ length: 30 }, (_, i) => `Feb ${i + 8}`)

  const getTooltipContent = (idx: number) => {
    const riskTypes = idx === 13 ? 'Oversharing (12), Exfil (6)' : idx === 9 ? 'Oversharing (8), Exfil (4)' : idx === 22 ? 'Oversharing (10), Exfil (4)' : `Sensitive activities (${currentData[idx]})`
    return { date: dayLabels[idx], count: currentData[idx], baseline: baselineData[idx], riskTypes }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
      {/* Header with mode toggle */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-[#242424] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="#0078D4"><path d="M17 3.34A1.5 1.5 0 0 0 15.5 2h-11A1.5 1.5 0 0 0 3 3.34L8.16 10H8v6.5a1.5 1.5 0 0 0 .68 1.26l2 1.28A.45.45 0 0 0 11.36 18.68V10h-.16L17 3.34ZM4.14 3.11a.5.5 0 0 1 .36-.11h11a.5.5 0 0 1 .36.87L11 9H9L4.14 3.86a.5.5 0 0 1 0-.75Z" /></svg>
            Activity explorer
          </h3>
          <p className="text-[12px] text-[#616161] mt-0.5">Sensitive agent activities across all monitored agents — last 30 days</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Compare toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-[#616161]">Compare baseline</span>
            <button
              onClick={() => setCompareEnabled(!compareEnabled)}
              className={`relative w-9 h-5 rounded-full transition-colors ${compareEnabled ? 'bg-[#0078D4]' : 'bg-[#D1D1D1]'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${compareEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {/* Mode toggle */}
          <div className="flex bg-[#F3F2F1] rounded-md p-0.5">
            <button
              onClick={() => setMode('trend')}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${mode === 'trend' ? 'bg-white text-[#242424] shadow-sm' : 'text-[#616161] hover:text-[#242424]'}`}
            >
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 14V2M2 14h12M4 10l3-4 3 2 4-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Trend
              </span>
            </button>
            <button
              onClick={() => setMode('sequence')}
              className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${mode === 'sequence' ? 'bg-white text-[#242424] shadow-sm' : 'text-[#616161] hover:text-[#242424]'}`}
            >
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h4M6 4v8M6 12h4M10 12V8M10 8h4" strokeLinecap="round" /></svg>
                Sequence
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="px-6 py-5">
        {mode === 'trend' && (
          <>
            <div className="h-[200px] w-full flex">
              {/* Y-axis */}
              <div className="shrink-0 w-10 pr-2 pb-6 flex flex-col justify-between text-[9px] text-[#616161] text-right">
                <span>{maxVal}</span>
                <span>{Math.round(maxVal * 0.75)}</span>
                <span>{Math.round(maxVal * 0.5)}</span>
                <span>{Math.round(maxVal * 0.25)}</span>
                <span>0</span>
              </div>
              {/* Chart */}
              <div className="relative flex-1 pb-6">
                {/* Grid lines */}
                <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none">
                  {Array.from({ length: 5 }).map((_, i) => <div key={i} className="border-t border-gray-100 w-full" />)}
                </div>
                <div className="absolute top-0 bottom-6 left-0 w-px bg-gray-200" />

                {/* Bars */}
                <div className="absolute inset-0 bottom-6 flex items-end gap-[2px]">
                  {currentData.map((val, i) => {
                    const height = maxVal > 0 ? (val / maxVal) * 100 : 0
                    const baselineHeight = maxVal > 0 ? (baselineData[i] / maxVal) * 100 : 0
                    const tooltip = getTooltipContent(i)
                    const isSelected = selectedBar === i
                    const isHovered = hoveredBar === i

                    return (
                      <div
                        key={i}
                        className="flex-1 h-full flex flex-col justify-end relative cursor-pointer"
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                        onClick={() => setSelectedBar(isSelected ? null : i)}
                      >
                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-[#242424] text-white rounded-lg px-3 py-2 text-[11px] whitespace-nowrap shadow-lg pointer-events-none">
                            <div className="font-semibold">{tooltip.date}</div>
                            <div className="mt-1">{tooltip.riskTypes}</div>
                            <div className="mt-0.5 text-[#A0A0A0]">Current: {tooltip.count} activities</div>
                            {compareEnabled && <div className="text-[#A0A0A0]">Baseline: {tooltip.baseline} activities</div>}
                            <div className="text-[9px] text-[#A0A0A0] mt-1">Click to filter table below</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#242424]" />
                          </div>
                        )}

                        {/* Baseline bar (behind) */}
                        {compareEnabled && (
                          <div
                            className="w-[70%] mx-auto bg-[#E1DFDD] rounded-t-sm absolute bottom-0"
                            style={{ height: `${baselineHeight}%` }}
                          />
                        )}

                        {/* Current bar */}
                        <div
                          className={`w-[${compareEnabled ? '50' : '60'}%] mx-auto rounded-t-sm relative z-10 transition-colors ${
                            isSelected ? 'bg-[#0078D4] ring-2 ring-[#0078D4] ring-offset-1' :
                            val > 10 ? 'bg-[#A4262C]' :
                            val > 5 ? 'bg-[#D83B01]' :
                            val > 0 ? 'bg-[#4f6bed]' : 'bg-transparent'
                          }`}
                          style={{ height: `${height}%`, width: compareEnabled ? '50%' : '60%' }}
                        />

                        {/* Day label */}
                        {i % 3 === 0 && <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[8px] text-[#616161] whitespace-nowrap">{dayLabels[i].replace('Feb ', '')}</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-6 ml-10">
              <div className="flex items-center gap-1.5 text-[11px] text-[#616161]"><div className="w-2.5 h-2.5 rounded-sm bg-[#A4262C]" /> Critical (&gt;10)</div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#616161]"><div className="w-2.5 h-2.5 rounded-sm bg-[#D83B01]" /> High (6–10)</div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#616161]"><div className="w-2.5 h-2.5 rounded-sm bg-[#4f6bed]" /> Normal (1–5)</div>
              {compareEnabled && <div className="flex items-center gap-1.5 text-[11px] text-[#616161]"><div className="w-2.5 h-2.5 rounded-sm bg-[#E1DFDD]" /> 30-day baseline</div>}
              {selectedBar !== null && (
                <button onClick={() => setSelectedBar(null)} className="text-[11px] text-[#0078D4] hover:underline ml-2 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l8 8M10 2l-8 8" /></svg>
                  Clear filter
                </button>
              )}
            </div>

            {/* Filtered event table when a bar is clicked */}
            {selectedBar !== null && currentData[selectedBar] > 0 && (
              <div className="mt-4 border border-[#0078D4]/20 rounded-lg overflow-hidden bg-[#FAF9F8]">
                <div className="px-4 py-2 bg-[#EBF3FC] text-[12px] font-semibold text-[#0078D4] flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h10l-4 5v5l-2-1.5V8L3 3z" /></svg>
                  Filtered: {dayLabels[selectedBar]} — {currentData[selectedBar]} sensitive activities
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { agent: 'M&A Deal Room Assistant', action: 'Accessed Board-Draft.pptx (Confidential)', type: 'Oversharing', time: '08:14 UTC' },
                    { agent: 'Executive Payroll Auditor', action: 'Exported Payroll-Q4.xlsx to external storage', type: 'Exfiltration', time: '08:15 UTC' },
                    { agent: 'M&A Deal Room Assistant', action: 'Posted docs to public SharePoint site', type: 'Oversharing', time: '08:15 UTC' },
                  ].slice(0, Math.min(3, currentData[selectedBar])).map((evt, i) => (
                    <div key={i} className="px-4 py-2 flex items-center gap-4 text-[12px] hover:bg-white">
                      <span className="text-[#616161] font-mono text-[11px] shrink-0">{evt.time}</span>
                      <span className="font-medium text-[#242424]">{evt.agent}</span>
                      <span className="text-[#424242] flex-1 truncate">{evt.action}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        evt.type === 'Oversharing' ? 'bg-[#F3EAFA] text-[#5C2D91]' : 'bg-[#EBF3FC] text-[#0078D4]'
                      }`}>{evt.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'sequence' && (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[120px] top-0 bottom-0 w-px bg-[#E1DFDD]" />

            <div className="space-y-0">
              {sequenceEvents.map((evt, i) => (
                <div key={i} className={`flex items-start gap-4 py-2.5 pl-2 rounded-md hover:bg-[#FAF9F8] transition-colors group cursor-pointer ${evt.risk ? 'bg-[#FDE7E9]/20' : ''}`}>
                  {/* Time */}
                  <div className="w-[100px] shrink-0 text-right">
                    <span className="text-[12px] font-mono text-[#616161]">{evt.time} UTC</span>
                  </div>

                  {/* Dot */}
                  <div className="relative z-10 shrink-0 mt-1">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                      evt.type === 'start' ? 'border-[#107C10] bg-[#DFF6DD]' :
                      evt.type === 'end' ? 'border-[#616161] bg-[#F3F2F1]' :
                      evt.risk ? 'border-[#A4262C] bg-[#FDE7E9]' :
                      'border-[#0078D4] bg-[#EBF3FC]'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-medium ${evt.risk ? 'text-[#A4262C]' : 'text-[#242424]'}`}>
                        {evt.action}
                      </span>
                      {evt.risk && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="#A4262C"><path d="M8 1.5l7 13H1l7-13zM8 6v4M8 11.5h.01" /></svg>
                      )}
                    </div>
                    <div className="text-[11px] text-[#616161] mt-0.5 flex items-center gap-3">
                      <span className="font-medium">{evt.agent}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        evt.type === 'exfil' ? 'bg-[#EBF3FC] text-[#0078D4]' :
                        evt.type === 'share' ? 'bg-[#F3EAFA] text-[#5C2D91]' :
                        evt.type === 'access' ? 'bg-[#FFF4CE] text-[#835C00]' :
                        'bg-[#F3F2F1] text-[#616161]'
                      }`}>{evt.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared components (AppIcon, RiskLevel, Sparkline, etc.) ───────

function AppIcon({ type, initials, icon }: { type: 'app' | 'user'; initials?: string; icon?: string }) {
  if (type === 'app') {
    const appIcon = icon || 'copilot'
    return (
      <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
        {appIcon === 'copilot' && (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M10.5 8C10.5 12.14 13.86 15.5 18 15.5C22.14 15.5 25.5 12.14 25.5 8C25.5 3.86 22.14.5 18 .5C13.86.5 10.5 3.86 10.5 8Z" fill="#60C6E7" fillOpacity=".8" /><path d="M19 25C19 20.86 15.64 17.5 11.5 17.5C7.36 17.5 4 20.86 4 25C4 29.14 7.36 32.5 11.5 32.5C15.64 32.5 19 29.14 19 25Z" fill="#2464EB" /><path d="M18.5 16C16.57 16 15 14.43 15 12.5C15 10.57 16.57 9 18.5 9C20.43 9 22 10.57 22 12.5C22 14.43 20.43 16 18.5 16Z" fill="#60C6E7" /><path d="M12.5 24C14.43 24 16 22.43 16 20.5C16 18.57 14.43 17 12.5 17C10.57 17 9 18.57 9 20.5C9 22.43 10.57 24 12.5 24Z" fill="#2464EB" /></svg>
        )}
        {appIcon === 'excel' && <div className="w-8 h-8 bg-[#107C10] rounded flex items-center justify-center text-white font-bold text-xs">X</div>}
        {appIcon === 'custom' && (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" fill="#00BCF2" /><path d="M16 22L24 18V26L16 30L8 26V18L16 22Z" fill="#0078D4" /><path d="M16 14L24 10L16 6L8 10L16 14Z" fill="#B3E0F3" /></svg>
        )}
        {!['copilot', 'excel', 'custom'].includes(appIcon) && (
          <div className="w-8 h-8 bg-[#464EB8] rounded flex items-center justify-center"><span className="text-white font-bold text-xs">{appIcon?.[0]?.toUpperCase()}</span></div>
        )}
      </div>
    )
  }
  return (
    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-semibold shrink-0 ${initials === '?' ? 'bg-[#FDF6FF] text-[#5C2E91] border border-[#E0E0E0]' : 'bg-[#FFF4CE] text-[#785C34] border border-[#E0E0E0]'}`}>
      {initials || 'U'}
    </div>
  )
}

function RiskLevel({ level }: { level: AgentRow['riskLevel'] }) {
  let colors = ['bg-[#E0E0E0]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
  if (level === 'High') colors = ['bg-[#A4262C]', 'bg-[#A4262C]', 'bg-[#A4262C]']
  if (level === 'Low') colors = ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]']
  if (level === 'None') colors = ['bg-[#605E5C]', 'bg-[#605E5C]', 'bg-[#605E5C]']

  const textColor = level === 'High' ? 'text-[#A4262C] font-semibold' : level === 'Low' ? 'text-[#D83B01]' : 'text-[#242424]'

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[2px]">
        {colors.map((c, i) => <div key={i} className={`w-[8px] h-[8px] ${c}`} />)}
      </div>
      <span className={`text-[12px] ${textColor}`}>{level}</span>
    </div>
  )
}

function Sparkline({ data }: { data: number[] | null }) {
  if (!data) return <span className="text-[#605E5C] font-normal text-[13px]">No data available</span>
  return (
    <div className="flex items-end gap-[2px] h-8 w-[140px] relative pb-[2px]">
      <div className="absolute bottom-0 w-full border-b border-dashed border-[#5B5FC7] opacity-60" />
      {data.map((v, i) => (
        <div key={i} className="w-[6px] bg-[#4f6bed] z-10 rounded-t-[2px] mb-[1px]" style={{ height: `${v > 0 ? Math.max(v, 4) : 0}px` }} />
      ))}
    </div>
  )
}

// ── Toolbar ───────────────────────────────────────────────────────

function Toolbar() {
  return (
    <div className="flex justify-between items-center mt-6 mb-2">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-[#242424] hover:bg-gray-100 px-2 py-1 rounded">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.65 2.35A7.958 7.958 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="#242424" /></svg>
          Refresh
        </button>
        <button className="flex items-center gap-2 text-sm text-[#242424] hover:bg-gray-100 px-2 py-1 rounded">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 10v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3" stroke="#242424" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6l3 3 3-3M8 2v7" stroke="#242424" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Export
        </button>
      </div>
    </div>
  )
}

// ── Kebab Menu ────────────────────────────────────────────────────

function KebabMenu({ agent, onQuickInvestigate, onViewDetails }: { agent: AgentRow; onQuickInvestigate: () => void; onViewDetails: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-[#616161]"
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        aria-label="More actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-9 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          <button className="w-full text-left px-4 py-2 text-[13px] text-[#242424] hover:bg-[#F5F5F5] flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setOpen(false); onViewDetails() }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3C5.5 3 1.73 5.98 1 10c.73 4.02 4.5 7 9 7s8.27-2.98 9-7c-.73-4.02-4.5-7-9-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>
            View details
          </button>
          <button className="w-full text-left px-4 py-2 text-[13px] text-[#0078D4] hover:bg-[#F5F5F5] font-semibold flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setOpen(false); onQuickInvestigate() }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l4.15 4.15a.75.75 0 0 1-1.06 1.06l-4.15-4.15A5.5 5.5 0 1 1 8.5 3ZM4 8.5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Z" /></svg>
            Quick investigate
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button className="w-full text-left px-4 py-2 text-[13px] text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setOpen(false); navigator.clipboard?.writeText(agent.agentId) }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8Zm0 1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM4 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2h-1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1V6Z" /></svg>
            Copy agent ID
          </button>
        </div>
      )}
    </div>
  )
}

// ── Agent Table ───────────────────────────────────────────────────

function AgentsTable() {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = useState<{ col: keyof AgentRow; dir: 'asc' | 'desc' } | null>({ col: 'riskLevel', dir: 'desc' })
  const [quickInvestAgent, setQuickInvestAgent] = useState<AgentRow | null>(null)

  const sortedRows = React.useMemo(() => {
    const data = [...rows]
    if (!sortConfig) return data
    return data.sort((a, b) => {
      const aValue = a[sortConfig.col]
      const bValue = b[sortConfig.col]
      if (sortConfig.col === 'riskLevel') {
        const order: Record<string, number> = { High: 3, Medium: 2, Low: 1, None: 0 }
        return sortConfig.dir === 'asc' ? (order[aValue as string] || 0) - (order[bValue as string] || 0) : (order[bValue as string] || 0) - (order[aValue as string] || 0)
      }
      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      return sortConfig.dir === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1)
    })
  }, [sortConfig])

  const handleSort = (col: keyof AgentRow) => {
    setSortConfig((c) => (c?.col === col ? { col, dir: c.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' }))
  }

  return (
    <>
      <div className="bg-white rounded-none border-t border-gray-200 mt-4 font-sans">
        {/* Filters */}
        <div className="flex items-center px-6 py-3 gap-2 border-b border-gray-100 text-[13px] bg-white flex-wrap">
          <span className="text-[#616161] mr-2">Filters:</span>
          {[{ label: 'Risk level', val: 'Any' }, { label: 'Status', val: 'Any' }, { label: 'Risk types', val: 'Any' }, { label: 'Agent ID', val: 'Any' }].map((f) => (
            <div key={f.label} className="bg-[#F3F2F1] hover:bg-[#E1DFDD] px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 text-[#242424]">
              {f.label}: <span className="font-semibold">{f.val}</span>
            </div>
          ))}
          <button className="text-[#0078D4] flex items-center gap-1 ml-2 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18l-7 9v9l-4-4v-5L3 3z" /></svg>
            Add filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-[#242424] min-w-[1200px]">
            <thead className="bg-white border-b border-gray-200 text-[#242424] font-normal text-sm">
              <tr>
                {[
                  { label: 'Name', key: 'name' as keyof AgentRow },
                  { label: 'Status', key: 'status' as keyof AgentRow },
                  { label: 'Agent ID', key: 'agentId' as keyof AgentRow },
                  { label: 'Risk level', key: 'riskLevel' as keyof AgentRow },
                  { label: 'Risk types', key: 'riskType' as keyof AgentRow },
                  { label: 'Sensitive activity trend', key: 'sensitiveActivityTrend' as keyof AgentRow },
                  { label: 'Data protection', key: 'dataProtection' as keyof AgentRow },
                  { label: 'Data compliance', key: 'dataCompliance' as keyof AgentRow },
                  { label: 'Authentication', key: 'authentication' as keyof AgentRow },
                ].map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)} className="px-6 py-4 font-normal cursor-pointer hover:bg-gray-50 bg-white group select-none">
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortConfig?.col === col.key && <span className="text-[12px] text-[#616161] font-light">{sortConfig.dir === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-4 font-normal bg-white w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedRows.map((row, index) => (
                <tr key={index} className={`hover:bg-[#FAF9F8] transition-colors h-[64px] cursor-pointer ${row.riskLevel === 'High' ? 'border-l-[3px] border-l-[#A4262C]' : ''}`} onClick={() => navigate(`/proposal/agents/${row.agentId}`)}>
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <AppIcon type={row.type} initials={row.initials} icon={row.icon} />
                      <span className="font-semibold text-[#242424]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2 align-middle">
                    <div className="flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#107C10"><circle cx="12" cy="12" r="10" fill="#107C10" /><path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                      <span className="text-[#242424]">{row.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-2 text-[#616161] truncate max-w-[280px] font-normal text-[13px] tracking-tight" title={row.agentId}>{row.agentId}</td>
                  <td className="px-6 py-2"><RiskLevel level={row.riskLevel} /></td>
                  <td className="px-6 py-2 text-[13px]">{row.riskType === 'No data available' ? <span className="text-[#616161]">{row.riskType}</span> : <span className={row.riskLevel === 'High' ? 'text-[#A4262C] font-medium' : 'text-[#242424]'}>{row.riskType}</span>}</td>
                  <td className="px-6 py-2">
                    <div className="mt-2">{row.sensitiveActivityTrend ? <Sparkline data={row.sensitiveActivityTrend} /> : <span className="text-[#616161] text-[13px]">No data available</span>}</div>
                  </td>
                  <td className="px-6 py-2 text-[#242424] text-[13px]">{row.dataProtection}</td>
                  <td className="px-6 py-2 text-[#242424] text-[13px]">{row.dataCompliance}</td>
                  <td className="px-6 py-2 text-[#242424] text-[13px]">{row.authentication}</td>
                  <td className="px-4 py-2">
                    <KebabMenu
                      agent={row}
                      onQuickInvestigate={() => setQuickInvestAgent(row)}
                      onViewDetails={() => navigate(`/proposal/agents/${row.agentId}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <QuickInvestigateModal
        agent={quickInvestAgent || rows[0]}
        open={!!quickInvestAgent}
        onClose={() => setQuickInvestAgent(null)}
        onOpenFull={() => {
          if (quickInvestAgent) navigate(`/proposal/agents/${quickInvestAgent.agentId}`)
          setQuickInvestAgent(null)
        }}
      />
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────

export default function ProposalOverviewB() {
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotPrompt, setCopilotPrompt] = useState('')

  const handlePromptClick = (prompt: string) => {
    setCopilotPrompt(prompt)
    setCopilotOpen(true)
  }

  return (
    <>
      <Banner />
      <main className={`flex-1 px-6 py-6 overflow-auto transition-all duration-300 ${copilotOpen ? 'mr-[400px]' : ''}`}>
        <div className="w-full">
          {/* Proposal badge */}
          <div className="mb-4 flex items-center gap-2">
            <span className="px-2 py-1 bg-[#F3EAFA] text-[#5C2D91] text-[11px] font-semibold rounded border border-[#5C2D91]/20">
              DESIGN OPTION B
            </span>
            <span className="text-[12px] text-[#616161]">
              Decisioning-first — triage workbench + investigation-grade explorer + coverage provenance
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-[28px] font-semibold text-[#242424]">AI observability</h1>
            <p className="text-[14px] text-[#242424] mt-2">Get a centralized view of agent activity across your organization.</p>
          </div>

          {/* P0-3: Coverage & Data Freshness Strip */}
          <CoverageStrip />

          <div className="mb-4">
            <div className="text-[18px] font-semibold text-[#242424]">Key metrics</div>
            <div className="text-[14px] text-[#242424] mt-1">Metrics for your organization and trends in the last 30 days.</div>
          </div>

          <ProposalMetrics />

          {/* P0-1: Top Risks Workbench — the hero section */}
          <div className="mt-8">
            <TopRisksWorkbench />
          </div>

          {/* P0-2: Activity Explorer — dual mode */}
          <ActivityExplorer />

          {/* Copilot prompt bar */}
          <div className="mt-2">
            <CopilotPromptBar onPromptClick={handlePromptClick} />
          </div>

          <Toolbar />

          <div className="mt-2 text-[#616161]">
            <AgentsTable />
          </div>
        </div>
      </main>

      <CopilotPanel
        open={copilotOpen}
        prompt={copilotPrompt}
        onClose={() => setCopilotOpen(false)}
        onPromptClick={handlePromptClick}
      />
    </>
  )
}
