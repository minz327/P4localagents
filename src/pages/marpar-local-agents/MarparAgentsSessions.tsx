import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface SessionRow {
  sessionId: string
  startTime: string
  riskLevel: 'High' | 'Medium' | 'Low' | 'None'
  dlpEvents: number
  status: 'Active' | 'Ended'
}

function generateSessions(user: string, device: string, platform: string): SessionRow[] {
  const seed = (user + device + platform).length
  const count = 2 + (seed % 7)
  const sessions: SessionRow[] = []
  const riskLevels: SessionRow['riskLevel'][] = ['High', 'Medium', 'Low', 'None']
  const baseDate = new Date('2026-05-04T09:00:00Z')

  for (let i = 0; i < count; i++) {
    const s = seed * (i + 1)
    const startDate = new Date(baseDate.getTime() - i * 3600000 * (2 + (s % 8)))
    sessions.push({
      sessionId: `SES-${(s * 31337).toString(16).slice(0, 8).toUpperCase()}`,
      startTime: startDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
      riskLevel: riskLevels[s % 4 < 1 ? 0 : s % 4 < 2 ? 1 : s % 4 < 3 ? 2 : 3],
      dlpEvents: s % 5 === 0 ? 0 : (s % 3) + 1,
      status: i === 0 ? 'Active' : 'Ended',
    })
  }
  return sessions
}

function RiskLevel({ level }: { level: SessionRow['riskLevel'] }) {
  let colors = ['bg-[#E0E0E0]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
  if (level === 'High') colors = ['bg-[#A4262C]', 'bg-[#A4262C]', 'bg-[#A4262C]']
  if (level === 'Medium') colors = ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]']
  if (level === 'Low') colors = ['bg-[#D83B01]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-[2px]">
        <div className={`w-[10px] h-[10px] ${colors[0]}`}></div>
        <div className={`w-[10px] h-[10px] ${colors[1]}`}></div>
        <div className={`w-[10px] h-[10px] ${colors[2]}`}></div>
      </div>
      <span className="text-[#242424] text-[13px]">{level}</span>
    </div>
  )
}

export default function MarparAgentsSessions() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const user = searchParams.get('user') || ''
  const device = searchParams.get('device') || ''
  const platform = searchParams.get('platform') || ''

  const sessions = React.useMemo(() => generateSessions(user, device, platform), [user, device, platform])

  return (
    <main className="flex-1 px-6 py-6 overflow-auto">
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#616161] mb-4">
          <button onClick={() => navigate('/marpar-local-agents')} className="hover:text-[#0078D4] hover:underline">Local Agents</button>
          <span>›</span>
          <span className="text-[#242424]">{user} ({device})</span>
          <span>›</span>
          <span className="text-[#242424]">{platform}</span>
          <span>›</span>
          <span className="text-[#0078D4] font-medium">Sessions</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-semibold text-[#242424]">Sessions</h1>
          <p className="text-[14px] text-[#616161] mt-1">
            {user} on {device} using {platform} — {sessions.length} sessions
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-[13px] text-[#616161] mb-1">Total sessions</div>
            <div className="text-[24px] font-semibold text-[#242424]">{sessions.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-[13px] text-[#616161] mb-1">High-risk sessions</div>
            <div className="text-[24px] font-semibold text-[#C50F1F]">{sessions.filter(s => s.riskLevel === 'High').length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-[13px] text-[#616161] mb-1">Total DLP events</div>
            <div className="text-[24px] font-semibold text-[#242424]">{sessions.reduce((sum, s) => sum + s.dlpEvents, 0)}</div>
          </div>
        </div>

        {/* Sessions table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-[14px] text-[#242424]">
            <thead className="bg-[#FAFAFA] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium text-[13px] text-[#616161]">Session ID</th>
                <th className="px-6 py-3 font-medium text-[13px] text-[#616161]">Start time</th>
                <th className="px-6 py-3 font-medium text-[13px] text-[#616161]">Risk level</th>
                <th className="px-6 py-3 font-medium text-[13px] text-[#616161]"># DLP events</th>
                <th className="px-6 py-3 font-medium text-[13px] text-[#616161]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((session, i) => (
                <tr key={i} className="hover:bg-[#FAF9F8] h-[56px]">
                  <td className="px-6 py-2">
                    <span className="font-mono text-[13px] text-[#0078D4]">{session.sessionId}</span>
                  </td>
                  <td className="px-6 py-2 text-[13px] text-[#242424]">{session.startTime}</td>
                  <td className="px-6 py-2"><RiskLevel level={session.riskLevel} /></td>
                  <td className="px-6 py-2 text-[13px]">
                    {session.dlpEvents > 0
                      ? <span className="text-[#C50F1F] font-medium">{session.dlpEvents} events</span>
                      : <span className="text-[#616161]">0</span>
                    }
                  </td>
                  <td className="px-6 py-2">
                    {session.status === 'Active'
                      ? <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DFF6DD] text-[#0E7A0D] border border-[#9BE09A]">Active</span>
                      : <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F3F2F1] text-[#616161] border border-[#D2D0CE]">Ended</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
