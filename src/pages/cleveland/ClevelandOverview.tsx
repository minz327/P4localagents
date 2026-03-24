import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { rows, AgentRow } from '../../lib/agentsData'
import { spikeAgents, getSpikePercent, getEnrichment } from '../../lib/clevelandData'
import ClevelandMetrics from '../../components/cleveland/ClevelandMetrics'
import QuickInvestigateModal from '../../components/cleveland/QuickInvestigateModal'
import CopilotPromptBar from '../../components/cleveland/CopilotPromptBar'
import CopilotPanel from '../../components/cleveland/CopilotPanel'

/*
 * Cleveland Overview — Enhanced AI Observability dashboard
 * Combines: Option B (card anomaly indicators) + Option C (quick investigate from table)
 * Does NOT modify original pages.
 */

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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.4 4.55L4.47 4.47003C4.68 4.26003 5.09999 4.29003 5.38 4.48003L5.45999 4.55003L12 10.94L18.47 4.47003C18.74 4.20003 19.17 4.17003 19.47 4.39003L19.53 4.47003C19.8 4.74003 19.83 5.17003 19.61 5.47003L19.53 5.53003L13.06 12L19.53 18.47C19.8 18.74 19.83 19.15 19.61 19.45L19.53 19.53C19.26 19.8 18.84 19.83 18.54 19.61L18.47 19.53L12 13.06L5.53 19.53C5.26 19.8 4.84001 19.83 4.54001 19.61L4.47 19.53C4.2 19.26 4.17001 18.84 4.39001 18.54L4.47 18.47L10.94 12L4.47 5.53C4.2 5.26 4.17001 4.84003 4.39001 4.54003L4.4 4.55Z" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

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

// ── Agent Table with Quick Investigate ────────────────────────────

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

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-[2px]">
        {colors.map((c, i) => <div key={i} className={`w-[10px] h-[10px] ${c}`} />)}
      </div>
      <span className="text-[#242424] text-[13px]">{level}</span>
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

// Kebab menu component
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
          <button
            className="w-full text-left px-4 py-2 text-[13px] text-[#242424] hover:bg-[#F5F5F5] flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onViewDetails() }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3C5.5 3 1.73 5.98 1 10c.73 4.02 4.5 7 9 7s8.27-2.98 9-7c-.73-4.02-4.5-7-9-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>
            View details
          </button>
          <button
            className="w-full text-left px-4 py-2 text-[13px] text-[#0078D4] hover:bg-[#F5F5F5] font-semibold flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); setOpen(false); onQuickInvestigate() }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l4.15 4.15a.75.75 0 0 1-1.06 1.06l-4.15-4.15A5.5 5.5 0 1 1 8.5 3ZM4 8.5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Z" /></svg>
            Quick investigate
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            className="w-full text-left px-4 py-2 text-[13px] text-[#616161] hover:bg-[#F5F5F5] flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); setOpen(false); navigator.clipboard?.writeText(agent.agentId) }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8Zm0 1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM4 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2h-1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1V6Z" /></svg>
            Copy agent ID
          </button>
        </div>
      )}
    </div>
  )
}

function ClevelandAgentsTable({ spikeFilter, onClearSpikeFilter }: { spikeFilter?: boolean; onClearSpikeFilter?: () => void }) {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = useState<{ col: keyof AgentRow; dir: 'asc' | 'desc' } | null>({ col: 'riskLevel', dir: 'desc' })
  const [quickInvestAgent, setQuickInvestAgent] = useState<AgentRow | null>(null)

  const sortedRows = React.useMemo(() => {
    let data = [...rows]
    // If spike filter active, only show agents with spikes, sorted by spike %
    if (spikeFilter) {
      const spikeIds = new Set(spikeAgents.map(s => s.agentId))
      data = data.filter(r => spikeIds.has(r.agentId))
      data.sort((a, b) => (getSpikePercent(b.agentId) || 0) - (getSpikePercent(a.agentId) || 0))
      return data
    }
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
        {/* Spike filter banner */}
        {spikeFilter && (
          <div className="flex items-center justify-between px-6 py-3 bg-[#FDE7E9] border-b border-[#C50F1F]/20">
            <div className="flex items-center gap-2 text-[13px] text-[#242424]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#C50F1F"><path d="M8 2l6 11H2L8 2Zm-.5 4v3h1V6h-1Zm0 4v1h1v-1h-1Z" /></svg>
              <span className="font-semibold">Spike contributors</span>
              <span className="text-[#616161]">· Showing {sortedRows.length} agents contributing to sensitive interaction spike</span>
            </div>
            <button onClick={onClearSpikeFilter} className="text-[#0078D4] text-[13px] font-medium hover:underline flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="4" x2="4" y2="12"/><line x1="4" y1="4" x2="12" y2="12"/></svg>
              Clear filter
            </button>
          </div>
        )}
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
                  ...(spikeFilter ? [{ label: 'Spike', key: 'agentId' as keyof AgentRow }] : []),
                  ...(spikeFilter ? [{ label: 'Owner', key: 'agentId' as keyof AgentRow }] : []),
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
                {/* New: Actions column */}
                <th className="px-4 py-4 font-normal bg-white w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedRows.map((row, index) => (
                <tr key={index} className="hover:bg-[#FAF9F8] transition-colors h-[64px] cursor-pointer" onClick={() => navigate(`/cleveland/agents/${row.agentId}`)}>
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
                  <td className="px-6 py-2 text-[#242424] text-[13px]">{row.riskType === 'No data available' ? <span className="text-[#616161]">{row.riskType}</span> : row.riskType}</td>
                  {spikeFilter && (
                    <td className="px-6 py-2">
                      {(() => { const sp = getSpikePercent(row.agentId); return sp ? (
                        <span className="text-[#C50F1F] font-bold text-[13px]">+{sp}%</span>
                      ) : <span className="text-[#616161] text-[13px]">—</span> })()}
                    </td>
                  )}
                  {spikeFilter && (
                    <td className="px-6 py-2 text-[#242424] text-[13px]">
                      {getEnrichment(row.agentId).owner.name}
                    </td>
                  )}
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
                      onViewDetails={() => navigate(`/cleveland/agents/${row.agentId}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Investigate Modal */}
      <QuickInvestigateModal
        agent={quickInvestAgent || rows[0]}
        open={!!quickInvestAgent}
        onClose={() => setQuickInvestAgent(null)}
        onOpenFull={() => {
          if (quickInvestAgent) navigate(`/cleveland/agents/${quickInvestAgent.agentId}`)
          setQuickInvestAgent(null)
        }}
      />
    </>
  )
}

// ── Main Cleveland Overview Page ───────────────────────────────────

export default function ClevelandOverview() {
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotPrompt, setCopilotPrompt] = useState('')
  const [spikeFilter, setSpikeFilter] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)

  const handlePromptClick = (prompt: string) => {
    setCopilotPrompt(prompt)
    setCopilotOpen(true)
  }

  return (
    <>
      <Banner />
      <main className={`flex-1 px-6 py-6 overflow-auto transition-all duration-300 ${copilotOpen ? 'mr-[400px]' : ''}`}>
        <div className="w-full">
          {/* Cleveland badge */}
          <div className="mb-4 flex items-center gap-2">
            <span className="px-2 py-1 bg-[#EBF3FC] text-[#0078D4] text-[11px] font-semibold rounded border border-[#0078D4]/20">
              CLEVELAND PROTOTYPE
            </span>
            <span className="text-[12px] text-[#616161]">
              Enhanced AI Observability — anomaly alerts + investigation drill-down
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-[28px] font-semibold text-[#242424]">AI observability</h1>
            <p className="text-[14px] text-[#242424] mt-2">Get a centralized view of agent activity across your organization.</p>
          </div>

          <div className="mb-4 mt-8">
            <div className="text-[18px] font-semibold text-[#242424]">Key metrics</div>
            <div className="text-[14px] text-[#242424] mt-1">Metrics for your organization and trends in the last 30 days.</div>
          </div>

          {/* Enhanced metrics with anomaly indicators */}
          <ClevelandMetrics onSpikeClick={() => {
            setSpikeFilter(prev => !prev)
            setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
          }} />

          {/* Copilot prompt bar — consolidates anomaly signals */}
          <div className="mt-6">
            <CopilotPromptBar onPromptClick={handlePromptClick} />
          </div>

          <Toolbar />

          <div ref={tableRef} className="mt-2 text-[#616161]">
            <ClevelandAgentsTable spikeFilter={spikeFilter} onClearSpikeFilter={() => setSpikeFilter(false)} />
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


