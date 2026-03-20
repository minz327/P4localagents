import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { demoAgents, DemoAgent, GovernanceState, governanceStateOrder, getGovernanceColor, getRiskTypeColor } from '../../lib/eastmanData'

// ── Icon helpers ──────────────────────────────────────────────────

function AppIcon({ agent }: { agent: DemoAgent }) {
  if (agent.type === 'app') {
    const appIcon = agent.icon || 'copilot'
    return (
      <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
        {appIcon === 'copilot' && (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4995 8C10.4995 12.1421 13.8574 15.5 17.9995 15.5C22.1416 15.5 25.4995 12.1421 25.4995 8C25.4995 3.85786 22.1416 0.5 17.9995 0.5C13.8574 0.5 10.4995 3.85786 10.4995 8Z" fill="#60C6E7" fillOpacity="0.8"/>
            <path d="M18.9995 25C18.9995 20.8579 15.6416 17.5 11.4995 17.5C7.35736 17.5 3.99951 20.8579 3.99951 25C3.99951 29.1421 7.35736 32.5 11.4995 32.5C15.6416 32.5 18.9995 29.1421 18.9995 25Z" fill="#2464EB"/>
            <path d="M18.4995 16C16.5665 16 14.9995 14.433 14.9995 12.5C14.9995 10.567 16.5665 9 18.4995 9C20.4325 9 21.9995 10.567 21.9995 12.5C21.9995 14.433 20.4325 16 18.4995 16Z" fill="#60C6E7"/>
            <path d="M12.4995 24C14.4325 24 15.9995 22.433 15.9995 20.5C15.9995 18.567 14.4325 17 12.4995 17C10.5665 17 8.99951 18.567 8.99951 20.5C8.99951 22.433 10.5665 24 12.4995 24Z" fill="#2464EB"/>
          </svg>
        )}
        {appIcon === 'excel' && (
          <div className="w-8 h-8 bg-[#107C10] rounded flex items-center justify-center text-white font-bold text-xs">X</div>
        )}
        {appIcon === 'custom' && (
          <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" fill="#00BCF2"/><path d="M16 22L24 18V26L16 30L8 26V18L16 22Z" fill="#0078D4"/><path d="M16 14L24 10L16 6L8 10L16 14Z" fill="#B3E0F3"/></svg>
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-semibold shrink-0 bg-[#FFF4CE] text-[#785C34] border border-[#E0E0E0]">
      {agent.initials || 'U'}
    </div>
  )
}

function RiskLevel({ level }: { level: DemoAgent['riskLevel'] }) {
  let colors = ['bg-[#E0E0E0]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
  if (level === 'High') colors = ['bg-[#A4262C]', 'bg-[#A4262C]', 'bg-[#A4262C]']
  if (level === 'Medium') colors = ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]']
  if (level === 'Low') colors = ['bg-[#D83B01]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
  if (level === 'None') colors = ['bg-[#605E5C]', 'bg-[#605E5C]', 'bg-[#605E5C]']

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-[2px]">
        {colors.map((c, i) => <div key={i} className={`w-[10px] h-[10px] ${c}`} />)}
      </div>
      <span className="text-[#242424] text-[13px]">{level}</span>
    </div>
  )
}

function AuthIcon({ type }: { type: DemoAgent['authType'] }) {
  const isEntra = type === 'Entra ID' || type === 'Managed Identity'
  return (
    <div className="flex items-center gap-2">
      {isEntra ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0078D4"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.4 9.36-7 10.5V3.18z"/><path d="M12 3.18V21.5c3.6-1.14 7-5.67 7-10.5V6.3l-7-3.12z" fillOpacity="0.5"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#D83B01"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
      )}
      <span className="text-[13px] text-[#242424]">{type}</span>
    </div>
  )
}

function PolicyBadge({ hasDLP, count }: { hasDLP: boolean; count: number }) {
  if (hasDLP) {
    return (
      <div className="flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#107C10"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
        <span className="text-[13px] text-[#107C10] font-medium">{count} {count === 1 ? 'policy' : 'policies'}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#A4262C"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm1 15h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
      <span className="text-[13px] text-[#A4262C] font-medium">No policy</span>
    </div>
  )
}

function GovernancePill({ state, onClick }: { state: GovernanceState; onClick?: (e: React.MouseEvent) => void }) {
  const color = getGovernanceColor(state)
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium border ${color.bg} ${color.text} ${color.border} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
    >
      {state === 'Reviewed' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
      )}
      {state === 'Changed since review' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
      )}
      {state === 'Never reviewed' && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M13 7h-2v6h2V7zm0 8h-2v2h2v-2z" fill="white"/></svg>
      )}
      {state}
    </button>
  )
}

// ── Review flyout (Flow 2) ────────────────────────────────────────

function ReviewFlyout({ agent, onClose, onMarkReviewed }: { agent: DemoAgent; onClose: () => void; onMarkReviewed: () => void }) {
  const [tab, setTab] = useState<'overview' | 'changes'>('overview')
  const hasChanges = agent.governanceState === 'Changed since review' && agent.changes && agent.changes.length > 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative w-[560px] max-w-full h-full bg-white shadow-2xl flex flex-col animate-slide-in-right" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[18px] font-semibold text-[#242424]">Agent review</h2>
            <button onClick={onClose} className="text-[#616161] hover:text-[#242424] p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <AppIcon agent={agent} />
            <div>
              <div className="text-[14px] font-semibold text-[#242424]">{agent.name}</div>
              <div className="text-[12px] text-[#616161]">{agent.agentCategory} · {agent.platform}</div>
              <div className="text-[12px] text-[#616161]">{agent.owner} · {agent.department}</div>
            </div>
            <GovernancePill state={agent.governanceState} />
          </div>

          {/* Tabs */}
          {hasChanges && (
            <div className="flex gap-4">
              {(['overview', 'changes'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 text-[13px] font-medium border-b-2 transition-colors ${tab === t ? 'border-[#0078D4] text-[#242424]' : 'border-transparent text-[#616161] hover:text-[#242424]'}`}
                >
                  {t === 'overview' ? 'Overview' : `Changes (${agent.changes!.length})`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {tab === 'overview' && (
            <>
              {/* Agent info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="text-[11px] text-[#616161]">Risk level</div>
                  <div className="mt-1"><RiskLevel level={agent.riskLevel} /></div>
                </div>
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="text-[11px] text-[#616161]">Availability</div>
                  <div className={`inline-flex items-center gap-1.5 text-[13px] mt-1 font-medium ${
                    agent.availability === 'Blocked' ? 'text-[#A4262C]' :
                    agent.availability === 'Some users' ? 'text-[#8A6914]' :
                    'text-[#107C10]'
                  }`}>
                    {agent.availability === 'All users' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>}
                    {agent.availability === 'Some users' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>}
                    {agent.availability === 'Blocked' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 014 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0120 12c0 4.42-3.58 8-8 8z"/></svg>}
                    {agent.availability}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="text-[11px] text-[#616161]">Policy coverage</div>
                  <div className="mt-1"><PolicyBadge hasDLP={agent.hasDLP} count={agent.dlpPolicyCount} /></div>
                </div>
                <div className="border border-gray-200 rounded-md p-3">
                  <div className="text-[11px] text-[#616161]">Owner</div>
                  <div className="text-[13px] text-[#242424] mt-1 font-medium">{agent.owner}</div>
                  {agent.ownerEmail && <div className="text-[11px] text-[#616161]">{agent.ownerEmail}</div>}
                </div>
              </div>

              {/* Risk types */}
              {agent.riskTypes.length > 0 && (
                <div>
                  <div className="text-[12px] font-semibold text-[#242424] mb-2">Risk types</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.riskTypes.map(rt => {
                      const c = getRiskTypeColor(rt)
                      return <span key={rt} className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${c.bg} ${c.text}`}>{rt}</span>
                    })}
                  </div>
                </div>
              )}

              {/* Review history */}
              <div>
                <div className="text-[12px] font-semibold text-[#242424] mb-2">Review history</div>
                <div className="border border-gray-200 rounded-md">
                  {agent.lastReviewedDate ? (
                    <div className="p-3">
                      <div className="text-[12px] text-[#242424]">Last reviewed on {new Date(agent.lastReviewedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-[11px] text-[#616161]">by {agent.lastReviewedBy}</div>
                    </div>
                  ) : (
                    <div className="p-3 text-[12px] text-[#616161]">This agent has never been reviewed.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'changes' && agent.changes && (
            <>
              {agent.previousVersion && (
                <div className="bg-[#FFF4CE] border border-[#835C00]/20 rounded-md p-3 text-[12px]">
                  <span className="font-semibold text-[#835C00]">Version changed:</span>{' '}
                  <span className="text-[#242424]">{agent.previousVersion} → {agent.currentVersion}</span>
                </div>
              )}

              <div className="space-y-3">
                {agent.changes.map((change, i) => {
                  const isAdded = change.type.includes('added')
                  const isRemoved = change.type.includes('removed')
                  const isChanged = change.type.includes('changed')

                  return (
                    <div key={i} className="border border-gray-200 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {isAdded && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#DFF6DD] text-[#107C10]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                            Added
                          </span>
                        )}
                        {isRemoved && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FDE7E9] text-[#A4262C]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
                            Removed
                          </span>
                        )}
                        {isChanged && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FFF4CE] text-[#835C00]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                            Changed
                          </span>
                        )}
                        <span className="text-[13px] font-semibold text-[#242424]">{change.label}</span>
                      </div>
                      <div className="text-[12px] text-[#616161]">{change.detail}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer action */}
        <div className="px-6 py-4 border-t border-gray-200 bg-[#FAFAFA] flex items-center gap-3">
          <button
            onClick={onMarkReviewed}
            className="px-4 py-2 bg-[#0078D4] text-white text-[13px] font-semibold rounded hover:bg-[#106EBE] transition-colors"
          >
            {hasChanges ? 'Re-review & approve' : 'Mark as reviewed'}
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-[13px] text-[#242424] rounded hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main EastmanAgents component (Flow 1 table) ─────────────────────

export type GovernanceFilter = 'needsReview' | 'noPolicy' | 'changedSinceReview' | 'neverReviewed' | null

export default function EastmanAgents({ activeFilter, onClearFilter }: { activeFilter?: GovernanceFilter; onClearFilter?: () => void }) {
  const navigate = useNavigate()
  const [agents, setAgents] = useState(demoAgents)
  const [sortConfig, setSortConfig] = useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'governanceState', dir: 'asc' })
  const [flyoutAgent, setFlyoutAgent] = useState<DemoAgent | null>(null)

  // Apply governance filter from cards
  const filteredAgents = React.useMemo(() => {
    if (!activeFilter) return agents
    switch (activeFilter) {
      case 'needsReview': return agents.filter(a => a.governanceState !== 'Reviewed')
      case 'noPolicy': return agents.filter(a => !a.hasDLP)
      case 'changedSinceReview': return agents.filter(a => a.governanceState === 'Changed since review')
      case 'neverReviewed': return agents.filter(a => a.governanceState === 'Never reviewed')
      default: return agents
    }
  }, [agents, activeFilter])

  const sortedAgents = React.useMemo(() => {
    const data = [...filteredAgents]
    return data.sort((a, b) => {
      if (sortConfig.col === 'governanceState') {
        const aRank = governanceStateOrder[a.governanceState]
        const bRank = governanceStateOrder[b.governanceState]
        if (aRank !== bRank) return sortConfig.dir === 'asc' ? aRank - bRank : bRank - aRank
        // secondary sort by risk level
        const riskOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2, None: 3 }
        return (riskOrder[a.riskLevel] || 3) - (riskOrder[b.riskLevel] || 3)
      }
      if (sortConfig.col === 'riskLevel') {
        const order: Record<string, number> = { High: 3, Medium: 2, Low: 1, None: 0 }
        return sortConfig.dir === 'asc' ? (order[a.riskLevel] || 0) - (order[b.riskLevel] || 0) : (order[b.riskLevel] || 0) - (order[a.riskLevel] || 0)
      }
      if (sortConfig.col === 'name') {
        return sortConfig.dir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      if (sortConfig.col === 'activities30d') {
        return sortConfig.dir === 'asc'
          ? a.activities30d - b.activities30d
          : b.activities30d - a.activities30d
      }
      if (sortConfig.col === 'availability') {
        return sortConfig.dir === 'asc' ? a.availability.localeCompare(b.availability) : b.availability.localeCompare(a.availability)
      }
      return 0
    })
  }, [filteredAgents, sortConfig])

  const handleSort = (col: string) => {
    setSortConfig(current => {
      if (current.col === col) return { col, dir: current.dir === 'asc' ? 'desc' : 'asc' }
      return { col, dir: 'asc' }
    })
  }

  const handleMarkReviewed = (agentId: string) => {
    setAgents(prev => prev.map(a =>
      a.agentId === agentId
        ? { ...a, governanceState: 'Reviewed' as GovernanceState, lastReviewedDate: new Date().toISOString(), lastReviewedBy: 'You', changes: undefined }
        : a
    ))
    setFlyoutAgent(null)
  }

  const openFlyout = (agent: DemoAgent, e: React.MouseEvent) => {
    e.stopPropagation()
    setFlyoutAgent(agent)
  }

  return (
    <>
      <div className="bg-white rounded-none border-t border-gray-200 mt-4 font-sans">
        {/* Active filter banner */}
        {activeFilter && (
          <div className="flex items-center justify-between px-6 py-2.5 bg-[#EBF3FC] border-b border-[#0078D4]/20">
            <div className="flex items-center gap-2 text-[13px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0078D4" strokeWidth="2"><path d="M3 3h18l-7 9v9l-4-4v-5L3 3z"/></svg>
              <span className="text-[#0078D4] font-medium">
                Filtered: {activeFilter === 'needsReview' && 'Agents needing review'}
                {activeFilter === 'noPolicy' && 'Without policy coverage'}
                {activeFilter === 'changedSinceReview' && 'Changed since review'}
                {activeFilter === 'neverReviewed' && 'Never reviewed'}
              </span>
              <span className="text-[#616161]">· Showing {filteredAgents.length} of {agents.length} agents</span>
            </div>
            <button
              onClick={onClearFilter}
              className="flex items-center gap-1 px-2.5 py-1 text-[12px] text-[#0078D4] bg-white border border-[#0078D4]/30 rounded-full hover:bg-[#EBF3FC] transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Clear filter
            </button>
          </div>
        )}
        {/* Nudge for never reviewed */}
        {activeFilter === 'neverReviewed' && filteredAgents.length > 0 && (
          <div className="px-6 py-2.5 bg-[#FFF4CE] border-b border-[#835C00]/15 text-[12px] text-[#835C00] flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#835C00"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            These agents have never been reviewed. Start with the highest-risk agent.
          </div>
        )}
        {/* Filters Bar */}
        <div className="flex items-center px-6 py-3 gap-2 border-b border-gray-100 text-[13px] bg-white flex-wrap">
          <span className="text-[#616161] mr-2">Filters:</span>
          {[
            { label: 'Governance state', val: 'Any' },
            { label: 'Risk level', val: 'Any' },
            { label: 'Policy coverage', val: 'Any' },
            { label: 'Risk types', val: 'Any' },
          ].map(f => (
            <div key={f.label} className="bg-[#F3F2F1] hover:bg-[#E1DFDD] px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 text-[#242424]">
              {f.label}: <span className="font-semibold">{f.val}</span>
            </div>
          ))}
          <button className="text-[#0078D4] flex items-center gap-1 ml-2 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18l-7 9v9l-4-4v-5L3 3z"/></svg>
            Add filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-[#242424] min-w-[1200px]">
            <thead className="bg-white border-b border-gray-200 text-[#242424] font-normal text-sm">
              <tr>
                {[
                  // ── Group 1: Metadata & Configuration ──
                  { label: 'Name', key: 'name', w: '' },
                  { label: 'Availability', key: 'availability', w: 'min-w-[120px]' },
                  { label: 'Activities (30d)', key: 'activities30d', w: 'min-w-[130px]' },
                  // ── Group 2: Risks ──
                  { label: 'Risk level', key: 'riskLevel', w: 'min-w-[130px]' },
                  { label: 'Risk types', key: 'riskTypes', w: '' },
                  // ── Group 3: Protection & Governance ──
                  { label: 'Policy coverage', key: 'dlp', w: 'min-w-[140px]' },
                  { label: 'Governance state', key: 'governanceState', w: 'min-w-[180px]' },
                  { label: '', key: 'actions', w: 'w-[100px]' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.key !== 'actions' && handleSort(col.key)}
                    className={`px-6 py-4 font-normal ${col.key !== 'actions' ? 'cursor-pointer hover:bg-gray-50' : ''} bg-white group select-none ${col.w}`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortConfig.col === col.key && (
                        <span className="text-[12px] text-[#616161] font-light">{sortConfig.dir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedAgents.map((agent) => (
                <tr
                  key={agent.agentId}
                  className="hover:bg-[#FAF9F8] transition-colors h-[60px] cursor-pointer"
                  onClick={() => navigate(`/eastman/agents/${agent.agentId}`)}
                >
                  {/* Name */}
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <AppIcon agent={agent} />
                      <div className="min-w-0">
                        <div className="font-semibold text-[#242424] truncate">{agent.name}</div>
                        <div className="text-[11px] text-[#707070] truncate">{agent.agentCategory} · {agent.platform}</div>
                      </div>
                    </div>
                  </td>
                  {/* Availability */}
                  <td className="px-6 py-2">
                    <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${
                      agent.availability === 'Blocked' ? 'text-[#A4262C]' :
                      agent.availability === 'Some users' ? 'text-[#8A6914]' :
                      'text-[#107C10]'
                    }`}>
                      {agent.availability === 'All users' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                      )}
                      {agent.availability === 'Some users' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                      )}
                      {agent.availability === 'Blocked' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 014 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0120 12c0 4.42-3.58 8-8 8z"/></svg>
                      )}
                      {agent.availability}
                    </span>
                  </td>
                  {/* Activities (30d) */}
                  <td className="px-6 py-2">
                    <span className={`text-[13px] tabular-nums ${
                      agent.activities30d >= 5000 ? 'text-[#242424] font-semibold' :
                      agent.activities30d >= 1000 ? 'text-[#242424] font-medium' :
                      'text-[#616161]'
                    }`}>
                      {agent.activities30d.toLocaleString()}
                    </span>
                  </td>
                  {/* Risk level */}
                  <td className="px-6 py-2"><RiskLevel level={agent.riskLevel} /></td>
                  {/* Risk types */}
                  <td className="px-6 py-2">
                    <div className="flex flex-wrap gap-1">
                      {agent.riskTypes.length > 0 ? agent.riskTypes.map(rt => {
                        const c = getRiskTypeColor(rt)
                        return <span key={rt} className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${c.bg} ${c.text}`}>{rt}</span>
                      }) : <span className="text-[#616161] text-[13px]">—</span>}
                    </div>
                  </td>
                  {/* Policy coverage */}
                  <td className="px-6 py-2"><PolicyBadge hasDLP={agent.hasDLP} count={agent.dlpPolicyCount} /></td>
                  {/* Governance */}
                  <td className="px-6 py-2">
                    <GovernancePill
                      state={agent.governanceState}
                      onClick={agent.governanceState === 'Changed since review' ? (e) => openFlyout(agent, e) : undefined}
                    />
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-2">
                    <button
                      onClick={(e) => openFlyout(agent, e)}
                      className="px-3 py-1.5 text-[12px] font-medium text-[#0078D4] border border-[#0078D4] rounded hover:bg-[#EBF3FC] transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Flyout (Flow 2) */}
      {flyoutAgent && (
        <ReviewFlyout
          agent={flyoutAgent}
          onClose={() => setFlyoutAgent(null)}
          onMarkReviewed={() => handleMarkReviewed(flyoutAgent.agentId)}
        />
      )}
    </>
  )
}
