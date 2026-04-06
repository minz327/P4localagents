import React, { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { rows } from '../../lib/agentsData'

// ── Mock activity data generator ──────────────────────────────────
interface ActivityEvent {
  id: string
  activityType: string
  activity: string
  timestamp: string
  appAccessedIn: string
  agentName: string
  agentParticipant: string
  executionType: string
}

const activityVariants = [
  { activity: 'Copilot Interaction', appAccessedIn: 'Microsoft 365 apps', executionType: '' },
  { activity: 'Invoke Agent', appAccessedIn: '', executionType: 'HumanToAgent' },
  { activity: 'Copilot Interaction', appAccessedIn: 'Teams', executionType: '' },
  { activity: 'Invoke Agent', appAccessedIn: '', executionType: 'AgentToAgent' },
  { activity: 'Copilot Interaction', appAccessedIn: 'SharePoint', executionType: '' },
  { activity: 'Invoke Agent', appAccessedIn: '', executionType: 'HumanToAgent' },
  { activity: 'Copilot Interaction', appAccessedIn: 'Microsoft 365 apps', executionType: '' },
  { activity: 'Invoke Agent', appAccessedIn: '', executionType: 'HumanToAgent' },
  { activity: 'Copilot Interaction', appAccessedIn: 'Outlook', executionType: '' },
  { activity: 'Invoke Agent', appAccessedIn: '', executionType: 'AgentToAgent' },
]

function generateMockActivities(agentName: string): ActivityEvent[] {
  const events: ActivityEvent[] = []
  const baseDate = new Date('2026-03-04T19:28:00Z')
  const count = 40 + Math.floor(agentName.length * 1.3) // vary by agent

  for (let i = 0; i < count; i++) {
    const variant = activityVariants[i % activityVariants.length]
    const ts = new Date(baseDate.getTime() - i * 47000) // ~47s apart
    const hours = ts.getUTCHours()
    const mins = ts.getUTCMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    const dateStr = `${ts.toLocaleString('en-US', { month: 'short' })} ${ts.getUTCDate()}, ${ts.getUTCFullYear()} ${h12}:${String(mins).padStart(2, '0')} ${ampm}`

    events.push({
      id: `evt-${i}`,
      activityType: 'AI Interaction',
      activity: variant.activity,
      timestamp: dateStr,
      appAccessedIn: variant.appAccessedIn,
      agentName,
      agentParticipant: agentName,
      executionType: variant.executionType,
    })
  }
  return events
}

// Compute daily bar chart data from events
function getDailyBars(events: ActivityEvent[]): { label: string; count: number }[] {
  // Generate ~14 days of data
  const now = new Date('2026-03-04')
  const days: { label: string; count: number }[] = []
  for (let d = 13; d >= 0; d--) {
    const day = new Date(now.getTime() - d * 86400000)
    const label = `${day.getUTCMonth() + 1}/${day.getUTCDate()}/${day.getUTCFullYear()}`
    // Distribute events across days with some pattern
    const base = d < 4 ? Math.floor(events.length / 6) : Math.floor(events.length / 14)
    const jitter = ((d * 7 + 3) % 5) - 2
    days.push({ label, count: Math.max(0, base + jitter) })
  }
  return days
}

// ── Main Component ────────────────────────────────────────────────
export default function MOSIntegrationActivityExplorer() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const agentParam = searchParams.get('agent') || ''

  // Find the agent row
  const agentRow = rows.find(r => r.name === agentParam)
  const agentName = agentRow?.name || agentParam

  const [activeTab, setActiveTab] = useState<'all' | 'ai'>('ai')
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const events = useMemo(() => agentName ? generateMockActivities(agentName) : [], [agentName])
  const dailyBars = useMemo(() => getDailyBars(events), [events])
  const maxBar = Math.max(...dailyBars.map(b => b.count), 1)
  // Nice y-axis ticks
  const yMax = Math.ceil(maxBar / 5) * 5 || 15
  const yTicks = [0, Math.round(yMax / 3), Math.round((yMax * 2) / 3), yMax]

  const filters = [
    { label: 'Timestamp', value: '2/16/2026-3/18/2026', active: true },
    { label: 'Activity type', value: 'Any', active: false },
    { label: 'AI app category', value: 'Any', active: false },
    { label: 'App', value: 'Any', active: false },
    { label: 'App accessed in', value: 'Any', active: false },
    { label: 'Agents involved', value: agentName || 'Any', active: !!agentName },
    { label: 'User participant', value: 'Any', active: false },
    { label: 'Sensitive info type', value: 'Any', active: false },
    { label: 'Web searched', value: 'Any', active: false },
    { label: 'Sensitivity label', value: 'Any', active: false },
  ]

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* Page Header */}
      <div className="px-8 pt-6 pb-0">
        <h1 className="text-[22px] font-semibold text-[#242424] mb-2">Activity explorer</h1>
        <p className="text-[13px] text-[#616161] leading-relaxed max-w-3xl mb-5">
          Review activity related to content that contains sensitive info or has labels applied, such as what labels were changed, files were modified, and more. Label activity is monitored across Exchange, SharePoint, OneDrive, and endpoint devices. Support for more data sources is coming soon.
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-gray-200 mb-5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-[#0078D4] text-[#242424] font-semibold'
                : 'border-transparent text-[#616161] hover:text-[#242424]'
            }`}
          >
            All activity types
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === 'ai'
                ? 'border-[#0078D4] text-[#242424] font-semibold'
                : 'border-transparent text-[#616161] hover:text-[#242424]'
            }`}
          >
            AI activities
          </button>
        </div>

        <p className="text-[13px] text-[#616161] mb-4">
          Review AI activity including AI interactions (prompts and responses), activity with sensitive info types, and more.
        </p>

        {/* Filter pills row */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-[12px] text-[#616161] font-medium mr-1">Filters:</span>
          {filters.map((f, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-full text-[12px] border transition-colors ${
                f.active
                  ? 'bg-[#0078D4] text-white border-[#0078D4]'
                  : 'bg-white text-[#242424] border-gray-300 hover:bg-[#F5F5F5]'
              }`}
            >
              {f.label}: {f.value}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 py-1 text-[12px] text-[#0078D4] hover:underline">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="3" x2="8" y2="13" /><line x1="3" y1="8" x2="13" y2="8" /></svg>
            Add filter
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-[12px] text-[#616161] hover:text-[#242424]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5" /></svg>
            Reset all
          </button>
        </div>
      </div>

      {/* Chart area */}
      <div className="px-8 mb-2">
        <div className="h-[180px] flex">
          {/* Y-axis */}
          <div className="shrink-0 w-8 pr-2 flex flex-col justify-between text-[11px] text-[#616161] text-right pb-6">
            {[...yTicks].reverse().map(v => <span key={v}>{v}</span>)}
          </div>
          {/* Chart */}
          <div className="relative flex-1 pb-6">
            {/* Gridlines */}
            <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none">
              {yTicks.map((_, i) => <div key={i} className="border-t border-gray-100 w-full" />)}
            </div>
            {/* Bars */}
            <div className="absolute inset-0 bottom-6 flex items-end gap-[3px] px-1">
              {dailyBars.map((bar, i) => {
                const pct = (bar.count / yMax) * 100
                return (
                  <div
                    key={i}
                    className="flex-1 h-full flex flex-col justify-end relative"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div
                      className="w-[80%] mx-auto bg-[#1B1A5B] rounded-t-[1px] transition-all hover:bg-[#2B2A7B]"
                      style={{ height: `${pct}%`, minHeight: bar.count > 0 ? '2px' : '0' }}
                    />
                    {/* Tooltip */}
                    {hoveredBar === i && bar.count > 0 && (
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-lg rounded px-2.5 py-1.5 text-[11px] whitespace-nowrap z-10 pointer-events-none">
                        <div className="text-[#616161]">{bar.label}</div>
                        <div className="text-[#242424] font-semibold">AI Interaction {bar.count}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
              {dailyBars.filter((_, i) => i % 2 === 0).map((bar, i) => (
                <span key={i} className="text-[10px] text-[#616161]">{bar.label}</span>
              ))}
            </div>
            {/* Chart timezone label */}
            <div className="absolute bottom-0 right-0 text-[10px] text-[#8A8886]">Chart time zone: UTC</div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 ml-8 mb-4">
          <div className="w-3 h-3 bg-[#1B1A5B] rounded-sm" />
          <span className="text-[11px] text-[#616161]">AI Interaction</span>
        </div>
      </div>

      {/* Table toolbar */}
      <div className="px-8 flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-[13px] text-[#242424] hover:text-[#0078D4]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M4 9l4 4 4-4" /></svg>
            Export
          </button>
          <button className="flex items-center gap-1.5 text-[13px] text-[#242424] hover:text-[#0078D4]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8a6 6 0 0 1 12 0" /><path d="M14 8a6 6 0 0 1-12 0" /><path d="M12 6l2 2-2 2" /></svg>
            Refresh
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[#616161]">{events.length} items</span>
          <button className="flex items-center gap-1.5 text-[13px] text-[#242424] hover:text-[#0078D4]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="2" width="5" height="5" rx="0.5" /><rect x="9" y="2" width="5" height="5" rx="0.5" /><rect x="2" y="9" width="5" height="5" rx="0.5" /><rect x="9" y="9" width="5" height="5" rx="0.5" /></svg>
            Customize columns
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="px-8 pb-8 flex-1">
        <div className="border border-gray-200 rounded overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[40px_130px_150px_170px_140px_1fr_1fr_130px] bg-[#FAFAFA] border-b border-gray-200 sticky top-0 z-10">
            <div className="px-3 py-2.5 flex items-center">
              <input type="checkbox" className="w-3.5 h-3.5 accent-[#0078D4]" readOnly />
            </div>
            {['Activity type', 'Activity', 'Timestamp (UTC)', 'App accessed in', 'Agent name', 'Agent participant', 'Execution type'].map((col) => (
              <div key={col} className="px-3 py-2.5 text-[12px] font-semibold text-[#242424] flex items-center gap-1">
                {col}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 5l3 3 3-3" stroke="#8A8886" strokeWidth="1.2" /></svg>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="max-h-[400px] overflow-y-auto">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="grid grid-cols-[40px_130px_150px_170px_140px_1fr_1fr_130px] border-b border-gray-100 hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="px-3 py-2.5 flex items-center">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-[#0078D4]" readOnly />
                </div>
                <div className="px-3 py-2.5 text-[12px] text-[#242424]">{evt.activityType}</div>
                <div className="px-3 py-2.5 text-[12px] text-[#242424]">{evt.activity}</div>
                <div className="px-3 py-2.5 text-[12px] text-[#616161]">{evt.timestamp}</div>
                <div className="px-3 py-2.5 text-[12px] text-[#616161]">{evt.appAccessedIn}</div>
                <div className="px-3 py-2.5 text-[12px] text-[#616161] truncate">{evt.agentName}</div>
                <div className="px-3 py-2.5 text-[12px] text-[#616161] truncate">{evt.agentParticipant}</div>
                <div className="px-3 py-2.5 text-[12px]">
                  {evt.executionType && (
                    <span className="text-[#0078D4]">{evt.executionType}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

