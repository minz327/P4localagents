import React, { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { rows } from '../../lib/agentsData'
import { CompositeDataGrid } from '@sfe/react-composite-datagrid'
import {
  createTableColumn,
  TableCellLayout,
  DataGridHeader,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridHeaderCell,
} from '@sfe/react-datagrid'
import type { TableColumnDefinition } from '@sfe/react-datagrid'
import {
  FluentProvider,
  webLightTheme,
  ToolbarButton,
} from '@fluentui/react-components'
import { ArrowSyncRegular, ArrowDownloadRegular } from '@fluentui/react-icons'

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
export default function MarparAgentsActivityExplorer() {
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

  const columns: TableColumnDefinition<ActivityEvent>[] = useMemo(() => [
    createTableColumn<ActivityEvent>({
      columnId: 'activityType',
      renderHeaderCell: () => 'Activity type',
      renderCell: (item) => <TableCellLayout><span className="text-[12px] text-[#242424]">{item.activityType}</span></TableCellLayout>,
      compare: (a, b) => a.activityType.localeCompare(b.activityType),
    }),
    createTableColumn<ActivityEvent>({
      columnId: 'activity',
      renderHeaderCell: () => 'Activity',
      renderCell: (item) => <TableCellLayout><span className="text-[12px] text-[#242424]">{item.activity}</span></TableCellLayout>,
      compare: (a, b) => a.activity.localeCompare(b.activity),
    }),
    createTableColumn<ActivityEvent>({
      columnId: 'timestamp',
      renderHeaderCell: () => 'Timestamp (UTC)',
      renderCell: (item) => <TableCellLayout><span className="text-[12px] text-[#616161]">{item.timestamp}</span></TableCellLayout>,
      compare: (a, b) => a.timestamp.localeCompare(b.timestamp),
    }),
    createTableColumn<ActivityEvent>({
      columnId: 'appAccessedIn',
      renderHeaderCell: () => 'App accessed in',
      renderCell: (item) => <TableCellLayout><span className="text-[12px] text-[#616161]">{item.appAccessedIn}</span></TableCellLayout>,
      compare: (a, b) => a.appAccessedIn.localeCompare(b.appAccessedIn),
    }),
    createTableColumn<ActivityEvent>({
      columnId: 'agentName',
      renderHeaderCell: () => 'Agent name',
      renderCell: (item) => <TableCellLayout><span className="text-[12px] text-[#616161]">{item.agentName}</span></TableCellLayout>,
      compare: (a, b) => a.agentName.localeCompare(b.agentName),
    }),
    createTableColumn<ActivityEvent>({
      columnId: 'agentParticipant',
      renderHeaderCell: () => 'Agent participant',
      renderCell: (item) => <TableCellLayout><span className="text-[12px] text-[#616161]">{item.agentParticipant}</span></TableCellLayout>,
      compare: (a, b) => a.agentParticipant.localeCompare(b.agentParticipant),
    }),
    createTableColumn<ActivityEvent>({
      columnId: 'executionType',
      renderHeaderCell: () => 'Execution type',
      renderCell: (item) => (
        <TableCellLayout>
          {item.executionType && <span className="text-[12px] text-[#0078D4]">{item.executionType}</span>}
        </TableCellLayout>
      ),
      compare: (a, b) => a.executionType.localeCompare(b.executionType),
    }),
  ], [])

  return (
    <div className="flex-1 flex flex-col p-[16px] pb-0 overflow-hidden bg-[#F0F0F0]">
      <div className="w-full flex-1 min-h-[500px] overflow-auto bg-white rounded-t-[12px] pt-[32px] px-[32px] pb-0 shadow-[0_0_2px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.14)]">
      {/* Page Header */}
      <div className="pb-0">
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
      <div className="mb-2">
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

      {/* DataGrid */}
      <div className="mt-4 font-sans w-full overflow-hidden">
        <FluentProvider theme={webLightTheme} style={{ width: '100%' }}>
          <CompositeDataGrid
            style={{ width: '100%' }}
            toolbar={{
              toolbarButtons: (
                <>
                  <ToolbarButton icon={<ArrowDownloadRegular />} appearance="subtle">
                    Export
                  </ToolbarButton>
                  <ToolbarButton icon={<ArrowSyncRegular />} appearance="subtle">
                    Refresh
                  </ToolbarButton>
                </>
              ),
            }}
            dataGrid={{
              items: events,
              columns,
              sortable: true,
              defaultSortState: { sortColumn: 'timestamp', sortDirection: 'descending' },
              containerSizing: 'fill',
              resizableColumnsOptions: { autoFitColumns: true },
              columnSizingOptions: {
                activityType: { idealWidth: 130, minWidth: 100 },
                activity: { idealWidth: 160, minWidth: 120 },
                timestamp: { idealWidth: 200, minWidth: 150 },
                appAccessedIn: { idealWidth: 160, minWidth: 100 },
                agentName: { idealWidth: 200, minWidth: 120 },
                agentParticipant: { idealWidth: 200, minWidth: 120 },
                executionType: { idealWidth: 130, minWidth: 100 },
              },
              children: (
                <>
                  <DataGridHeader>
                    <DataGridRow>
                      {({ renderHeaderCell }: any) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                      )}
                    </DataGridRow>
                  </DataGridHeader>
                  <DataGridBody<ActivityEvent>>
                    {({ item, rowId }: any) => (
                      <DataGridRow key={rowId}>
                        {({ renderCell }: any) => (
                          <DataGridCell>{renderCell(item)}</DataGridCell>
                        )}
                      </DataGridRow>
                    )}
                  </DataGridBody>
                </>
              ),
            }}
          />
        </FluentProvider>
      </div>
      </div>
    </div>
  )
}
