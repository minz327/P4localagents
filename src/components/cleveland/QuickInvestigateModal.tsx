import React from 'react'
import { AgentRow } from '../../lib/agentsData'
import { getEnrichment, getRecentActivities } from '../../lib/clevelandData'

// ── Quick Investigate Modal (Option C from design spec) ───────────
interface Props {
  agent: AgentRow
  open: boolean
  onClose: () => void
  onOpenFull: () => void
}

export default function QuickInvestigateModal({ agent, open, onClose, onOpenFull }: Props) {
  if (!open) return null

  const enrichment = getEnrichment(agent.agentId)
  const activities = getRecentActivities(agent.agentId)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center" onClick={onClose}>
        <div
          className="bg-white rounded-lg shadow-2xl w-[720px] max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={`Quick investigation: ${agent.name}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#EBF3FC] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0078D4"><path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" /></svg>
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-[#242424]">Quick Investigation</h2>
                <p className="text-[12px] text-[#616161]">{agent.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#616161] hover:text-[#242424] p-1" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* Summary Bar */}
            <div className="bg-[#FAFAFA] border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-[11px] text-[#616161] mb-1">Risk level</div>
                  <div className="flex items-center gap-2">
                    <RiskBlocks level={agent.riskLevel} />
                    <span className={`text-[13px] font-semibold ${agent.riskLevel === 'High' ? 'text-[#C50F1F]' : agent.riskLevel === 'Low' ? 'text-[#D83B01]' : 'text-[#242424]'}`}>
                      {agent.riskLevel}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#616161] mb-1">Status</div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#107C10"><circle cx="6" cy="6" r="6" /><path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" fill="none" /></svg>
                    <span className="text-[13px] text-[#242424]">{agent.status}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#616161] mb-1">Owner</div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E1DFDD] flex items-center justify-center text-[10px] font-semibold text-[#616161]">
                      {enrichment.owner.initials}
                    </div>
                    <div>
                      <div className="text-[13px] text-[#242424] leading-tight">{enrichment.owner.name}</div>
                      <div className="text-[10px] text-[#616161]">{enrichment.owner.title}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[11px] text-[#616161] mb-1">Subscription</div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="#0078D4"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-.5 3h1v5h-1V6Zm0 6h1v1h-1v-1Z" /></svg>
                    <span className="text-[13px] text-[#242424]">{enrichment.subscription.name}</span>
                  </div>
                  <div className="text-[10px] text-[#616161] mt-0.5">{enrichment.subscription.region}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#616161] mb-1">Department</div>
                  <span className="text-[13px] text-[#242424]">{enrichment.department}</span>
                </div>
                <div>
                  <div className="text-[11px] text-[#616161] mb-1">Risk type</div>
                  <span className="text-[13px] text-[#242424]">{agent.riskType}</span>
                </div>
              </div>
            </div>

            {/* Recent Sensitive Activities */}
            <div>
              <h3 className="text-[14px] font-semibold text-[#242424] mb-3">Recent sensitive activities (Top 5)</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {activities.map((act, i) => (
                  <div
                    key={act.id}
                    className={`flex items-center gap-3 px-4 py-3 ${act.isSensitive ? 'bg-[#FDE7E9]/40' : 'bg-white'} ${i > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    {act.isSensitive && (
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="#C50F1F"><path d="M8.68 2.79a1.5 1.5 0 0 1 2.64 0l6.5 12A1.5 1.5 0 0 1 16.5 17h-13a1.5 1.5 0 0 1-1.32-2.21l6.5-12ZM10.5 13.5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0ZM10 7a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 1 0v-4A.5.5 0 0 0 10 7Z" /></svg>
                    )}
                    {!act.isSensitive && <div className="w-[14px]" />}
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] text-[#242424]">{act.title}</span>
                    </div>
                    <span className="text-[11px] text-[#616161] shrink-0">{act.date}</span>
                    {act.riskType && (
                      <span className="text-[10px] bg-[#FDE7E9] text-[#C50F1F] px-1.5 py-0.5 rounded shrink-0">{act.riskType}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Resources */}
            <div>
              <h3 className="text-[14px] font-semibold text-[#242424] mb-3">Connected resources</h3>
              <div className="grid grid-cols-4 gap-3">
                <ResourceCard icon={<UserIcon />} count={3} label="Users" />
                <ResourceCard icon={<FileIcon />} count={5} label="Files" sublabel="2 sensitive" warning />
                <ResourceCard icon={<ToolIcon />} count={13} label="Tools" />
                <ResourceCard icon={<AgentIcon />} count={3} label="Agents" sublabel="1 risky" warning />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
            <button
              onClick={onOpenFull}
              className="px-4 py-2 bg-[#0078D4] text-white rounded text-[13px] font-semibold hover:bg-[#106EBE] transition-colors"
            >
              Open full details
            </button>
            <button className="px-4 py-2 border border-[#D1D1D1] rounded text-[13px] font-semibold text-[#242424] hover:bg-gray-50 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h12v12H4z" /><path d="M8 2v4M12 2v4M2 8h4M14 8h4" /></svg>
              Escalate
            </button>
            <button className="px-4 py-2 border border-[#D1D1D1] rounded text-[13px] font-semibold text-[#242424] hover:bg-gray-50 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z" /><path d="M10 6v4l3 3" /></svg>
              Apply policy
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function RiskBlocks({ level }: { level: string }) {
  const colors = {
    High: ['bg-[#A4262C]', 'bg-[#A4262C]', 'bg-[#A4262C]'],
    Medium: ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]'],
    Low: ['bg-[#D83B01]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]'],
    None: ['bg-[#E0E0E0]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]'],
  }
  const c = colors[level as keyof typeof colors] || colors.None
  return (
    <div className="flex gap-[2px]">
      {c.map((cls, i) => <div key={i} className={`w-[8px] h-[8px] ${cls}`} />)}
    </div>
  )
}

function ResourceCard({ icon, count, label, sublabel, warning }: { icon: React.ReactNode; count: number; label: string; sublabel?: string; warning?: boolean }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-[#F5F5F5] cursor-pointer transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#616161]">{icon}</span>
        <span className="text-[20px] font-semibold text-[#242424]">{count}</span>
      </div>
      <div className="text-[12px] text-[#616161]">{label}</div>
      {sublabel && (
        <div className={`text-[10px] mt-0.5 ${warning ? 'text-[#C50F1F]' : 'text-[#616161]'}`}>{sublabel}</div>
      )}
    </div>
  )
}

// Mini icons
function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM7 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-3 9a2.75 2.75 0 0 1 2.75-2.75h6.5A2.75 2.75 0 0 1 16 15c0 1.7-1.53 3.5-6 3.5S4 16.7 4 15Z" /></svg>
}
function FileIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.41a2 2 0 0 0-.59-1.41l-3.41-3.42A2 2 0 0 0 10.59 2H6Zm0 1h4v3.5A1.5 1.5 0 0 0 11.5 8H15v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /></svg>
}
function ToolIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M11.93 2.78a4.5 4.5 0 0 0-5.4 6.63l-4.72 4.72a1.5 1.5 0 0 0 0 2.12l.84.84a1.5 1.5 0 0 0 2.12 0l4.72-4.72a4.5 4.5 0 0 0 6.63-5.4l-2.97 2.97-1.23-.37-.37-1.23 2.97-2.97-.59-.59Z" /></svg>
}
function AgentIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l6 3.5v5L10 14l-6-3.5v-5L10 2Zm0 1.15L5 6.35v3.3L10 12.85l5-3.2v-3.3L10 3.15Z" /></svg>
}

