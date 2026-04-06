import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Mock DLP Alert Data ──────────────────────────────────────────

interface DlpAlert {
  id: string
  alertName: string
  subAlert?: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Active' | 'Investigating' | 'Resolved' | 'Dismissed'
  timeDetected: string
  user: string
  location: string
  policyMatched: string
  ruleMatched: string
  sensitiveInfoTypes: string
  eventsCount: number
  assignedTo: string
  classification: string
  alertId: string
  // MCP-specific fields (optional — only present for MCP server alerts)
  invocationOutcome?: 'Blocked' | 'Allowed' | 'Audited'
  actionTaken?: string
  agentName?: string
  agentId?: string
  agentClass?: string
  mcpServerName?: string
  mcpServerId?: string
  mcpEndpoint?: string
  toolInvoked?: string
  toolType?: string
  sensitivityLabels?: string
  overrideState?: string
  overrideJustification?: string
  policyException?: string
  // Investigation context
  correlationId?: string
  sessionId?: string
  dataVolume?: string
}

const mockAlerts: DlpAlert[] = [
  // ── MCP Server alerts ──
  { id: 'mcp-1', alertName: 'DLP policy match for MCP Server', subAlert: 'Agent sent PII via external MCP tool', severity: 'High', status: 'Active', timeDetected: 'Mar 30, 2026 2:15 PM', user: 'drew-test@ztaltest12.onmicrosoft.com', location: 'MCP Servers', policyMatched: 'Corp Sensitive Data Policy', ruleMatched: 'Block external MCP PII exfiltration', sensitiveInfoTypes: 'SSN, All Full Names', eventsCount: 2, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'mcp-a1b2c3d4-5e6f-7890-abcd-ef1234567890', invocationOutcome: 'Blocked', actionTaken: 'RestrictAccess, GenerateAlert', agentName: 'TravelBot', agentId: 'agent_bbf5b74ee8e44f5bbd223472b8f1', agentClass: 'Copilot Agent', mcpServerName: 'Acme Data Service', mcpServerId: 'mcp_9f2a3b4c5d6e7f8901234567', mcpEndpoint: 'https://acme-data.io/mcp/v1/query', toolInvoked: 'query_database', toolType: 'Resource query', sensitivityLabels: 'Confidential', overrideState: 'Not allowed', overrideJustification: 'None', policyException: 'None', correlationId: 'cor_3b1e4f5a-6789-0abc-def0-123456789abc', sessionId: 'ses_7d4f8e9a-bcde-f012-3456-7890abcdef01', dataVolume: '2.4 KB' },
  { id: 'mcp-2', alertName: 'DLP policy match for MCP Server', subAlert: 'Agent sent classified content to MCP tool', severity: 'Medium', status: 'Investigating', timeDetected: 'Mar 29, 2026 4:42 PM', user: 'min@ztaltest12.onmicrosoft.com', location: 'MCP Servers', policyMatched: 'Corp Sensitive Data Policy', ruleMatched: 'Audit external MCP classified content', sensitiveInfoTypes: 'Trainable classifiers', eventsCount: 1, assignedTo: 'min@ztaltest12.onmicrosoft.com', classification: 'True positive', alertId: 'mcp-b2c3d4e5-6f78-9012-bcde-f12345678901', invocationOutcome: 'Audited', actionTaken: 'GenerateAlert, Audit', agentName: 'ResearchAssistant', agentId: 'agent_77a251b5d8b4f603c91b61b34a02', agentClass: 'Custom Agent', mcpServerName: 'Internal Analytics Hub', mcpServerId: 'mcp_1a2b3c4d5e6f7g8h90123456', mcpEndpoint: 'https://analytics-hub.contoso.com/mcp/v2/analyze', toolInvoked: 'run_analysis', toolType: 'Compute', sensitivityLabels: 'Highly Confidential', overrideState: 'Pending approval', overrideJustification: 'Business-critical quarterly analysis', policyException: 'None', correlationId: 'cor_8c2d5e6f-7890-1bcd-ef01-234567890bcd', sessionId: 'ses_4e5f6a7b-cdef-0123-4567-890abcdef012', dataVolume: '14.7 KB' },
  // ── Existing Copilot Chat alerts ──
  { id: '1', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', subAlert: 'Sensitive info in user prompt', severity: 'Low', status: 'Active', timeDetected: 'Mar 20, 2026 2:25 PM', user: 'Agent_bbf5b74ee8e44f5bbd223472b...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'df112b85-36ed-a302-9800-08de86c7009b' },
  { id: '2', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 20, 2026 2:25 PM', user: 'agent_bbf5b74ee8e44f5bbd223472b...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'a8f21c44-5e01-b7d3-9800-08de86c700a1' },
  { id: '3', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 20, 2026 1:56 PM', user: 'babish@ztaltest12.onmicrosoft.com', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'c3e45d67-89ab-cdef-0123-456789abcdef' },
  { id: '4', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 20, 2026 1:56 PM', user: 'babish@ztaltest12.onmicrosoft.com', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 2, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'd4f56e78-90bc-def0-1234-567890abcde0' },
  { id: '5', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 6:32 PM', user: 'Agent_b7a4808d8f2429fb51bd58406...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'Trainable classifiers', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'e5g67f89-01cd-ef01-2345-678901bcdef1' },
  { id: '6', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 5:18 PM', user: 'aktio_5bdb096c7e5948715aa508b808f...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'f6h78g90-12de-f012-3456-789012cdef02' },
  { id: '7', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 5:01 PM', user: 'Share_458936B0ae7a47429522870B6...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'g7i89h01-23ef-0123-4567-890123def003' },
  { id: '8', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 4:35 PM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'h8j90i12-34f0-1234-5678-901234ef0004' },
  { id: '9', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 4:25 PM', user: 'Share_123b0aeb3e1459f0ade87dd3...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'i9k01j23-45g1-2345-6789-012345fg0005' },
  { id: '10', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 11:47 AM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'j0l12k34-56h2-3456-7890-123456gh0006' },
  { id: '11', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 11:45 AM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'k1m23l45-67i3-4567-8901-234567hi0007' },
  { id: '12', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 19, 2026 11:44 AM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'l2n34m56-78j4-5678-9012-345678ij0008' },
  { id: '13', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 18, 2026 9:36 AM', user: 'min@ztaltest12.onmicrosoft.com', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'm3o45n67-89k5-6789-0123-456789jk0009' },
  { id: '14', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 18, 2026 9:36 AM', user: 'min@ztaltest12.onmicrosoft.com', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'n4p56o78-90l6-7890-1234-567890kl000a' },
  { id: '15', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 17, 2026 2:56 PM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'o5q67p89-01m7-8901-2345-678901lm000b' },
  { id: '16', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Medium', status: 'Active', timeDetected: 'Mar 17, 2026 2:11 PM', user: 'Agent_77a251b5d8b4f603c91b61b34...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'Trainable classifiers', eventsCount: 3, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'p6r78q90-12n8-9012-3456-789012mn000c' },
  { id: '17', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 17, 2026 1:59 PM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'q7s89r01-23o9-0123-4567-890123no000d' },
  { id: '18', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 17, 2026 1:50 PM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 'r8t90s12-34p0-1234-5678-901234op000e' },
  { id: '19', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 16, 2026 11:36 PM', user: 'wliang@ztaltest12.onmicrosoft.com', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 's9u01t23-45q1-2345-6789-012345pq000f' },
  { id: '20', alertName: 'DLP policy match for Microsoft 365 Copilot and Copilot Chat', severity: 'Low', status: 'Active', timeDetected: 'Mar 16, 2026 3:22 PM', user: 'drew-test@ztaltest12.onmicrosoft.c...', location: 'ExtendedApplications', policyMatched: 'Dom Policy', ruleMatched: 'Copilot rule Dom', sensitiveInfoTypes: 'All Full Names', eventsCount: 1, assignedTo: 'No one is assigned', classification: 'Not set', alertId: 't0v12u34-56r2-3456-7890-123456qr0010' },
]

// ── Severity bar component ───────────────────────────────────────

function SeverityBars({ severity }: { severity: DlpAlert['severity'] }) {
  const colors = {
    Critical: ['bg-[#A4262C]', 'bg-[#A4262C]', 'bg-[#A4262C]', 'bg-[#A4262C]'],
    High: ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]'],
    Medium: ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]'],
    Low: ['bg-[#D83B01]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]'],
  }
  const bars = colors[severity]
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-[2px]">
        {bars.map((c, i) => <div key={i} className={`w-[8px] h-[14px] ${c}`} />)}
      </div>
      <span className="text-[13px] text-[#242424]">{severity}</span>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────

function CopyableId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center gap-1.5 group">
      <span className="text-[12px] text-[#242424] break-all leading-relaxed">{value}</span>
      <button onClick={handleCopy} className="text-[#616161] hover:text-[#0078D4] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" title="Copy">
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#107C10" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        )}
      </button>
    </div>
  )
}

function TruncatedUri({ value }: { value: string }) {
  const truncated = value.length > 42 ? value.slice(0, 42) + '…' : value
  return (
    <div className="flex items-center gap-1.5 group">
      <span className="text-[12px] text-[#242424]" title={value}>{truncated}</span>
      <button onClick={() => { navigator.clipboard.writeText(value) }} className="text-[#616161] hover:text-[#0078D4] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" title="Copy full URI">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
    </div>
  )
}

function FieldRow({ label, value, copyable, uri }: { label: string; value?: string | null; copyable?: boolean; uri?: boolean }) {
  if (!value || value === 'None') return null
  return (
    <div>
      <div className="text-[12px] text-[#616161] mb-0.5">{label}</div>
      {copyable ? <CopyableId value={value} /> : uri ? <TruncatedUri value={value} /> : <div className="text-[12px] text-[#242424]">{value}</div>}
    </div>
  )
}

// ── Detail Flyout ────────────────────────────────────────────────

function CollapsibleSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-6 py-3 hover:bg-[#FAF9F8] transition-colors">
        <span className="text-[14px] font-semibold text-[#242424]">{title}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M2 4l4 4 4-4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && <div className="px-6 pb-4">{children}</div>}
    </div>
  )
}

// ── Alert-level flyout (main row click) ─────────────────────────

function AlertLevelFlyout({ alert, onClose }: { alert: DlpAlert; onClose: () => void }) {
  const [detailTab, setDetailTab] = useState<'details' | 'activity'>('details')

  return (
    <div className="w-[592px] shrink-0 h-full bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Top bar */}
      <div className="flex items-center justify-end gap-1 px-4 pt-3 pb-1">
        <button className="text-[#616161] hover:text-[#242424] p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg></button>
        <button className="text-[#616161] hover:text-[#242424] p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg></button>
        <button onClick={onClose} className="text-[#616161] hover:text-[#242424] p-1 ml-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Title */}
      <div className="px-6 pb-3">
        <h2 className="text-[16px] font-semibold text-[#242424] leading-snug">Alert: {alert.alertName}</h2>
        <button className="text-[13px] text-[#0078D4] hover:underline mt-1.5 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0078D4" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
          Open alerts page
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 px-6 border-b border-gray-200">
        {(['details', 'activity'] as const).map(t => (
          <button
            key={t}
            onClick={() => setDetailTab(t)}
            className={`px-4 pb-2.5 pt-1 text-[13px] font-medium border-b-2 transition-colors ${detailTab === t ? 'border-[#0078D4] text-[#242424]' : 'border-transparent text-[#616161] hover:text-[#242424]'}`}
          >
            {t === 'details' ? 'Details' : 'User activity summary'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {detailTab === 'details' && (
          <div>
            <CollapsibleSection title="What happened" defaultOpen={!!alert.mcpServerName}>
              <div className="text-[12px] text-[#242424] leading-relaxed">
                {alert.mcpServerName ? (
                  <>Agent &ldquo;{alert.agentName}&rdquo; attempted to send sensitive data ({alert.sensitiveInfoTypes}) to external MCP server &ldquo;{alert.mcpServerName}&rdquo; via the &ldquo;{alert.toolInvoked}&rdquo; tool. The invocation was <strong>{alert.invocationOutcome?.toLowerCase()}</strong>.{alert.actionTaken && <> Actions taken: {alert.actionTaken}.</>}</>
                ) : (
                  <>A DLP policy match was detected for Microsoft 365 Copilot and Copilot Chat.</>
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Alert information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Alert ID</div>
                  <div className="text-[12px] text-[#242424] break-all">{alert.alertId}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Time detected</div>
                  <div className="text-[12px] text-[#242424]">{alert.timeDetected}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Alert status</div>
                  <div className="text-[12px] text-[#242424]">{alert.status}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Alert severity</div>
                  <div className="mt-0.5"><SeverityBars severity={alert.severity} /></div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Number of events</div>
                  <div className="text-[12px] text-[#242424]">{alert.eventsCount}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">DLP policy matched</div>
                  <div className="text-[12px] text-[#242424]">{alert.policyMatched}</div>
                </div>
                {alert.invocationOutcome && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-0.5">Invocation outcome</div>
                    <div className="text-[12px]"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      alert.invocationOutcome === 'Blocked' ? 'bg-[#FDE7E9] text-[#A4262C]' :
                      alert.invocationOutcome === 'Audited' ? 'bg-[#FFF4CE] text-[#835C00]' :
                      'bg-[#DFF6DD] text-[#107C10]'
                    }`}>{alert.invocationOutcome}</span></div>
                  </div>
                )}
                {alert.actionTaken && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-0.5">Action taken</div>
                    <div className="text-[12px] text-[#242424]">{alert.actionTaken}</div>
                  </div>
                )}
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Locations</div>
                  <div className="text-[12px] text-[#242424]">{alert.location}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Assigned to</div>
                  <div className="text-[12px] text-[#242424]">{alert.assignedTo}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[12px] text-[#616161] mb-0.5">Classification</div>
                  <div className="text-[12px] text-[#242424]">{alert.classification}</div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Policy information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Policy matched</div>
                  <div className="text-[12px] text-[#242424]">{alert.policyMatched}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Rule matched</div>
                  <div className="text-[12px] text-[#242424]">{alert.ruleMatched}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Sensitive info types</div>
                  <div className="text-[12px] text-[#242424]">{alert.sensitiveInfoTypes}</div>
                </div>
                {alert.sensitivityLabels && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-0.5">Sensitivity labels</div>
                    <div className="text-[12px] text-[#242424]">{alert.sensitivityLabels}</div>
                  </div>
                )}
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Locations</div>
                  <div className="text-[12px] text-[#242424]">{alert.location}</div>
                </div>
                {alert.overrideState && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-0.5">Override state</div>
                    <div className="text-[12px] text-[#242424]">{alert.overrideState}</div>
                  </div>
                )}
                {alert.overrideJustification && alert.overrideJustification !== 'None' && (
                  <div className="col-span-2">
                    <div className="text-[12px] text-[#616161] mb-0.5">Override justification</div>
                    <div className="text-[12px] text-[#242424]">{alert.overrideJustification}</div>
                  </div>
                )}
                {alert.policyException && alert.policyException !== 'None' && (
                  <div className="col-span-2">
                    <div className="text-[12px] text-[#616161] mb-0.5">Policy exception</div>
                    <div className="text-[12px] text-[#242424]">{alert.policyException}</div>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Users who performed the event">
              <div className="space-y-4">
                {alert.agentName && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-2">Agent</div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <div className="text-[11px] text-[#616161] mb-0.5">Agent name</div>
                        <div className="text-[12px] text-[#242424] font-medium">{alert.agentName}</div>
                      </div>
                      {alert.agentClass && (
                        <div>
                          <div className="text-[11px] text-[#616161] mb-0.5">Agent class</div>
                          <div className="text-[12px] text-[#242424]">{alert.agentClass}</div>
                        </div>
                      )}
                      {alert.agentId && (
                        <div className="col-span-2">
                          <div className="text-[11px] text-[#616161] mb-0.5">Agent ID</div>
                          <CopyableId value={alert.agentId} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className={alert.agentName ? 'border-t border-gray-100 pt-3' : ''}>
                  <div className="text-[12px] text-[#616161] mb-2">User</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0078D4] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">{alert.user.charAt(0).toLowerCase()}</div>
                    <div>
                      <div className="text-[12px] text-[#242424]">{alert.user}</div>
                      <div className="text-[11px] text-[#616161]">{alert.user}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {detailTab === 'activity' && (
          <div className="px-6 py-5">
            <div className="text-[13px] text-[#616161]">User activity summary will appear here when activity data is available.</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center gap-3">
        <button className="px-4 py-[7px] bg-[#0078D4] text-white text-[13px] font-semibold rounded hover:bg-[#106EBE] transition-colors">
          Manage alert
        </button>
        <button className="px-4 py-[7px] border border-gray-300 text-[13px] text-[#242424] rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5">
          Summarize
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}

// ── Event-level flyout (sub-row click) ──────────────────────────

function EventDetailFlyout({ alert, onClose }: { alert: DlpAlert; onClose: () => void }) {
  const [detailTab, setDetailTab] = useState<'details' | 'source' | 'metadata'>('details')
  const eventName = alert.subAlert || alert.alertName
  const eventId = 'bcfe5454-efaf-4c8c-8691-87ae0e2d39c4'

  return (
    <div className="w-[592px] shrink-0 h-full bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Top bar: nav arrows + close */}
      <div className="flex items-center justify-end gap-1 px-4 pt-3 pb-1">
        <button className="text-[#616161] hover:text-[#242424] p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg></button>
        <button className="text-[#616161] hover:text-[#242424] p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg></button>
        <button onClick={onClose} className="text-[#616161] hover:text-[#242424] p-1 ml-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Title + View all events */}
      <div className="px-6 pb-3">
        <h2 className="text-[16px] font-semibold text-[#242424] leading-snug">Event: {eventName}</h2>
        <button className="text-[13px] text-[#0078D4] hover:underline mt-1.5 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0078D4" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
          View all events
        </button>
      </div>

      {/* Tabs: Details | Source | Metadata */}
      <div className="flex gap-0 px-6 border-b border-gray-200">
        {(['details', 'source', 'metadata'] as const).map(t => (
          <button
            key={t}
            onClick={() => setDetailTab(t)}
            className={`px-4 pb-2.5 pt-1 text-[13px] font-medium border-b-2 transition-colors capitalize ${detailTab === t ? 'border-[#0078D4] text-[#242424]' : 'border-transparent text-[#616161] hover:text-[#242424]'}`}
          >
            {t === 'details' ? 'Details' : t === 'source' ? 'Source' : 'Metadata'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {detailTab === 'details' && (
          <div>
            {/* Event details */}
            <CollapsibleSection title="Event details">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">ID</div>
                  <CopyableId value={eventId} />
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Location</div>
                  <div className="text-[12px] text-[#242424]">{alert.mcpServerName ? 'MCP Servers' : 'Copilot-Sydney'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[12px] text-[#616161] mb-0.5">Time of activity</div>
                  <div className="text-[12px] text-[#242424]">{alert.timeDetected}</div>
                </div>
                {alert.mcpServerName && (
                  <>
                    <div>
                      <div className="text-[12px] text-[#616161] mb-0.5">MCP server</div>
                      <div className="text-[12px] text-[#242424] font-medium">{alert.mcpServerName}</div>
                    </div>
                    <FieldRow label="Server ID" value={alert.mcpServerId} copyable />
                    <div className="col-span-2">
                      <div className="text-[12px] text-[#616161] mb-0.5">MCP endpoint</div>
                      <TruncatedUri value={alert.mcpEndpoint!} />
                    </div>
                    <FieldRow label="Tool invoked" value={alert.toolInvoked} />
                    <FieldRow label="Tool type" value={alert.toolType} />
                  </>
                )}
              </div>
            </CollapsibleSection>

            {/* Impacted entities */}
            <CollapsibleSection title="Impacted entities">
              <div className="space-y-4">
                {alert.agentName && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-2">Agent</div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <div className="text-[11px] text-[#616161] mb-0.5">Agent name</div>
                        <div className="text-[12px] text-[#242424] font-medium">{alert.agentName}</div>
                      </div>
                      {alert.agentClass && (
                        <div>
                          <div className="text-[11px] text-[#616161] mb-0.5">Agent class</div>
                          <div className="text-[12px] text-[#242424]">{alert.agentClass}</div>
                        </div>
                      )}
                      {alert.agentId && (
                        <div className="col-span-2">
                          <div className="text-[11px] text-[#616161] mb-0.5">Agent ID</div>
                          <CopyableId value={alert.agentId} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className={alert.agentName ? 'border-t border-gray-100 pt-3' : ''}>
                  <div className="text-[12px] text-[#616161] mb-2">User</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0078D4] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">{alert.user.charAt(0).toLowerCase()}</div>
                    <div>
                      <div className="text-[12px] text-[#242424]">{alert.user}</div>
                      <div className="text-[11px] text-[#616161]">{alert.user}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Policy details */}
            <CollapsibleSection title="Policy details">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">DLP policy matched</div>
                  <div className="text-[12px] text-[#242424]">{alert.policyMatched}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Rule matched</div>
                  <div className="text-[12px] text-[#242424]">{alert.ruleMatched}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Sensitive info types detected</div>
                  <div className="text-[12px] text-[#0078D4] hover:underline cursor-pointer">{alert.sensitiveInfoTypes}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Trainable classifiers detected</div>
                  <div className="text-[12px] text-[#242424]">None</div>
                </div>
                {alert.sensitivityLabels && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-0.5">Sensitivity labels detected</div>
                    <div className="text-[12px] text-[#242424]">{alert.sensitivityLabels}</div>
                  </div>
                )}
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">Actions taken</div>
                  <div className="text-[12px] text-[#242424]">{alert.actionTaken || 'GenerateAlert, RestrictAccess'}</div>
                </div>
                <div>
                  <div className="text-[12px] text-[#616161] mb-0.5">User override policy</div>
                  <div className="text-[12px] text-[#242424]">{alert.overrideState || 'No'}</div>
                </div>
                {alert.overrideJustification && alert.overrideJustification !== 'None' && (
                  <div className="col-span-2">
                    <div className="text-[12px] text-[#616161] mb-0.5">Override justification text</div>
                    <div className="text-[12px] text-[#242424]">{alert.overrideJustification}</div>
                  </div>
                )}
                {alert.policyException && alert.policyException !== 'None' && (
                  <div className="col-span-2">
                    <div className="text-[12px] text-[#616161] mb-0.5">Policy exception</div>
                    <div className="text-[12px] text-[#242424]">{alert.policyException}</div>
                  </div>
                )}
                {alert.dataVolume && (
                  <div>
                    <div className="text-[12px] text-[#616161] mb-0.5">Data volume</div>
                    <div className="text-[12px] text-[#242424]">{alert.dataVolume}</div>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          </div>
        )}

        {detailTab === 'source' && (
          <div className="px-6 py-5">
            <div className="text-[13px] text-[#616161]">Source information will appear here.</div>
          </div>
        )}

        {detailTab === 'metadata' && (
          <div className="px-6 py-5">
            <div className="text-[13px] text-[#616161]">Metadata will appear here.</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center gap-4">
        <button className="px-4 py-[7px] bg-[#0078D4] text-white text-[13px] font-semibold rounded hover:bg-[#106EBE] transition-colors flex items-center gap-1.5">
          Actions
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button className="text-[13px] text-[#242424] hover:text-[#0078D4] transition-colors">
          Update alert status
        </button>
      </div>
    </div>
  )
}

// ── Main DLP Alerts Page ─────────────────────────────────────────

export default function EastmanDlpAlerts() {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'triage' | 'standard'>('standard')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [flyoutAlert, setFlyoutAlert] = useState<DlpAlert | null>(null)
  const [flyoutType, setFlyoutType] = useState<'alert' | 'event' | null>(null)

  const totalAlerts = 71 // mock total

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedRow(prev => prev === id ? null : id)
  }

  const openAlert = (alert: DlpAlert) => {
    setFlyoutAlert(alert)
    setFlyoutType('alert')
    setSelected(new Set([alert.id]))
  }

  const openEvent = (alert: DlpAlert, e: React.MouseEvent) => {
    e.stopPropagation()
    setFlyoutAlert(alert)
    setFlyoutType('event')
    setSelected(new Set([alert.id]))
  }

  const closeFlyout = () => {
    setFlyoutAlert(null)
    setFlyoutType(null)
  }

  return (
    <div className="flex h-full bg-white min-w-0">
      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
      {/* Page Header */}
      <div className="px-8 pt-6 pb-0 shrink-0">
        <h1 className="text-[28px] font-semibold text-[#242424] mb-4">Alerts</h1>

        {/* View toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveView('triage')}
            className={`px-4 py-1.5 text-[13px] font-medium rounded border transition-colors ${
              activeView === 'triage'
                ? 'bg-white border-[#0078D4] text-[#0078D4]'
                : 'bg-white border-gray-300 text-[#242424] hover:bg-gray-50'
            }`}
          >
            Triage Agent
          </button>
          <button
            onClick={() => setActiveView('standard')}
            className={`px-4 py-1.5 text-[13px] font-medium rounded border transition-colors ${
              activeView === 'standard'
                ? 'bg-[#242424] border-[#242424] text-white'
                : 'bg-white border-gray-300 text-[#242424] hover:bg-gray-50'
            }`}
          >
            Standard
          </button>
        </div>

        {/* Info banner */}
        <div className="mb-5 bg-[#EBF3FC] border border-[#0078D4]/20 rounded-md px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] text-[#242424]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0078D4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Did you know you can now manage your DLP alerts in the Microsoft Defender portal? Alerts are automatically combined into incidents, which provide a comprehensive view into potential policy violations and advanced tools for investigation and remediation.
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button className="px-3 py-1.5 text-[12px] font-medium text-[#242424] border border-gray-300 rounded hover:bg-white transition-colors whitespace-nowrap">
              Learn more about incidents
            </button>
            <button className="px-3 py-1.5 text-[12px] font-medium text-[#242424] border border-gray-300 rounded hover:bg-white transition-colors whitespace-nowrap">
              Go to Incidents page
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-[13px] text-[#242424]">
            <button className="flex items-center gap-1.5 hover:text-[#0078D4] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#0078D4] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Refresh
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#0078D4] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Set status
            </button>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-[#616161]">
            <span>{selected.size} of {totalAlerts} selected</span>
            <button className="flex items-center gap-1.5 text-[#242424] hover:text-[#0078D4] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Customize columns
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-4 text-[13px]">
          <button className="flex items-center gap-1 text-[#242424] hover:text-[#0078D4]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18l-7 9v9l-4-4v-5L3 3z"/></svg>
            Filter
          </button>
          <button className="flex items-center gap-1 text-[#242424] hover:text-[#0078D4]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/></svg>
            Reset
          </button>
          <button className="flex items-center gap-1 text-[#242424] hover:text-[#0078D4]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18l-7 9v9l-4-4v-5L3 3z"/></svg>
            Filters
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#0078D4] text-white px-3 py-1 rounded-full text-[12px] font-medium">Time range: 2/20/2026-3/20/2026</span>
            <span className="bg-[#F3F2F1] px-3 py-1 rounded-full text-[12px]">User: <b>Any</b></span>
            <span className="bg-[#F3F2F1] px-3 py-1 rounded-full text-[12px]">Alert status: <b>Any</b></span>
            <span className="bg-[#F3F2F1] px-3 py-1 rounded-full text-[12px]">Alert severity: <b>Any</b></span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-w-0">
        <table className="w-full text-left text-[13px] text-[#242424] min-w-[1100px]">
          <thead className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="w-[40px] px-3 py-3"><input type="checkbox" className="w-4 h-4 accent-[#0078D4]" /></th>
              <th className="w-[32px] px-0 py-3"></th>
              <th className="px-4 py-3 font-normal text-[13px]">
                <div className="flex items-center gap-1">Alert name <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              </th>
              <th className="px-4 py-3 font-normal text-[13px] min-w-[100px]">
                <div className="flex items-center gap-1">
                  Severity
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#616161" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </th>
              <th className="px-4 py-3 font-normal text-[13px]">
                <div className="flex items-center gap-1">Status <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              </th>
              <th className="px-4 py-3 font-normal text-[13px] min-w-[160px]">Time detected</th>
              <th className="px-4 py-3 font-normal text-[13px] min-w-[240px]">
                <div className="flex items-center gap-1">Users <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              </th>
              <th className="px-4 py-3 font-normal text-[13px]">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockAlerts.map(alert => (
              <React.Fragment key={alert.id}>
                <tr
                  className={`h-[44px] transition-colors cursor-pointer ${selected.has(alert.id) ? 'bg-[#EFF6FC]' : 'hover:bg-[#FAF9F8]'}`}
                  onClick={() => openAlert(alert)}
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(alert.id)}
                      onChange={() => {}}
                      onClick={(e) => toggleSelect(alert.id, e)}
                      className="w-4 h-4 accent-[#0078D4]"
                    />
                  </td>
                  <td className="px-0 py-2">
                    <button onClick={(e) => toggleExpand(alert.id, e)} className="text-[#616161] hover:text-[#242424] p-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${expandedRow === alert.id ? 'rotate-90' : ''}`}>
                        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-2 text-[13px] text-[#242424]">{alert.alertName}</td>
                  <td className="px-4 py-2"><SeverityBars severity={alert.severity} /></td>
                  <td className="px-4 py-2 text-[13px] text-[#242424]">{alert.status}</td>
                  <td className="px-4 py-2 text-[13px] text-[#616161]">{alert.timeDetected}</td>
                  <td className="px-4 py-2 text-[13px] text-[#616161] truncate max-w-[240px]">{alert.user}</td>
                  <td className="px-4 py-2 text-[13px] text-[#616161]">{alert.location}</td>
                </tr>
                {/* Expanded sub-alert row */}
                {expandedRow === alert.id && alert.subAlert && (
                  <tr
                    className={`cursor-pointer transition-colors ${flyoutType === 'event' && flyoutAlert?.id === alert.id ? 'bg-[#EFF6FC]' : 'bg-[#FAF9F8] hover:bg-[#F3F2F1]'}`}
                    onClick={(e) => openEvent(alert, e)}
                  >
                    <td className="px-3 py-2"><input type="checkbox" checked={selected.has(alert.id)} onChange={() => {}} onClick={(e) => toggleSelect(alert.id, e)} className="w-4 h-4 accent-[#0078D4]" /></td>
                    <td className="px-0 py-2"></td>
                    <td className="px-4 py-2 pl-10 text-[13px] text-[#242424]">{alert.subAlert}</td>
                    <td colSpan={5}></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Detail Flyout (inline side panel) */}
      {flyoutAlert && flyoutType === 'alert' && <AlertLevelFlyout alert={flyoutAlert} onClose={closeFlyout} />}
      {flyoutAlert && flyoutType === 'event' && <EventDetailFlyout alert={flyoutAlert} onClose={closeFlyout} />}
    </div>
  )
}
