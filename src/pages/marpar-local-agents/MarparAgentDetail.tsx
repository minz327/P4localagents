import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { rows } from '../../lib/agentsData'

function RiskLevelBadge({ level }: { level: string }) {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    High: { bg: 'bg-[#FDE7E9]', text: 'text-[#C50F1F]', border: 'border-[#F1BBBC]' },
    Medium: { bg: 'bg-[#FFF9F5]', text: 'text-[#DA3B01]', border: 'border-[#FDCFB4]' },
    Low: { bg: 'bg-[#FFF4CE]', text: 'text-[#835C00]', border: 'border-[#F5D565]' },
    None: { bg: 'bg-[#F3F2F1]', text: 'text-[#616161]', border: 'border-[#D2D0CE]' },
  }
  const c = config[level] || config.None
  return <span className={`px-3 py-1.5 rounded-md text-[14px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>{level}</span>
}

function RiskTypePill({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Oversharing: 'bg-purple-50 text-purple-700 border-purple-200',
    Exfiltration: 'bg-red-50 text-red-700 border-red-200',
    Unethical: 'bg-teal-50 text-teal-700 border-teal-200',
  }
  return <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium border ${colors[type] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>{type}</span>
}

function Sparkline({ data }: { data: number[] }) {
  return (
    <div className="flex items-end gap-[3px] h-12 w-full relative pb-[2px]">
      <div className="absolute bottom-0 w-full border-b border-dashed border-[#5B5FC7] opacity-60"></div>
      {data.map((v, i) => (
        <div key={i} className="w-[8px] bg-[#4f6bed] z-10 rounded-t-[2px] mb-[1px]" style={{ height: `${v > 0 ? Math.max(v * 1.5, 4) : 0}px` }}></div>
      ))}
    </div>
  )
}

export default function MarparAgentDetail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const user = searchParams.get('user') || ''
  const device = searchParams.get('device') || ''
  const platform = searchParams.get('platform') || ''

  const agent = React.useMemo(() => {
    return rows.find(r => r.hosting === 'local' && r.userName === user && r.device === device && r.platform === platform)
  }, [user, device, platform])

  if (!agent) {
    return (
      <main className="flex-1 px-6 py-6 overflow-auto">
        <button onClick={() => navigate('/marpar-local-agents')} className="text-[#0078D4] text-[13px] hover:underline mb-4">← Back to Local Agents</button>
        <div className="text-[#616161]">Agent not found.</div>
      </main>
    )
  }

  const riskTypes = agent.riskType !== 'No data available' ? agent.riskType.split(', ') : []
  const sessions = agent.sessions || { total: 0, highRisk: 0 }

  return (
    <main className="flex-1 px-6 py-6 overflow-auto">
      <div className="max-w-[960px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#616161] mb-6">
          <button onClick={() => navigate('/marpar-local-agents')} className="hover:text-[#0078D4] hover:underline">Local Agents</button>
          <span>›</span>
          <span className="text-[#242424] font-medium">{user} ({device})</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#FFF4CE] text-[#785C34] flex items-center justify-center text-[16px] font-semibold border border-[#E0E0E0]">
            {agent.initials || user.split(' ').map(w => w[0]).join('')}
          </div>
          <div>
            <h1 className="text-[24px] font-semibold text-[#242424]">{user} ({device})</h1>
            <p className="text-[14px] text-[#616161]">Using {platform}</p>
          </div>
        </div>

        {/* Usage Details */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-[#242424] mb-4">Usage details</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-1">User</div>
              <div className="text-[14px] text-[#242424] font-medium">{user}</div>
            </div>
            <div>
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-1">Device</div>
              <div className="text-[14px] text-[#242424] font-medium">{device}</div>
            </div>
            <div>
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-1">Platform</div>
              <div className="text-[14px] text-[#242424] font-medium">{platform}</div>
            </div>
            <div>
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-1">Status</div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill={agent.status === 'Active' ? '#107C10' : '#616161'}><circle cx="12" cy="12" r="10"/><path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                <span className="text-[14px] text-[#242424] font-medium">{agent.status}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-1">Agent ID</div>
            <div className="text-[13px] text-[#616161] font-mono">{agent.agentId}</div>
          </div>
        </section>

        {/* Risk */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-[#242424] mb-5">Risk</h2>

          {/* Risk level - hero */}
          <div className="mb-5">
            <RiskLevelBadge level={agent.riskLevel} />
          </div>

          {/* Session summary */}
          <div className="mb-5">
            <div className="text-[13px] text-[#242424]">
              {sessions.total === 0 ? (
                <span className="text-[#616161]">No sessions recorded</span>
              ) : (
                <>
                  <span className="font-semibold text-[#C50F1F]">{sessions.highRisk} high-risk session{sessions.highRisk !== 1 ? 's' : ''}</span>
                  <span className="text-[#616161]"> ({sessions.total} total)</span>
                </>
              )}
            </div>
          </div>

          {/* Risk types */}
          {riskTypes.length > 0 && (
            <div className="mb-6">
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-2">Risk types</div>
              <div className="flex gap-2 flex-wrap">
                {riskTypes.map(t => <RiskTypePill key={t} type={t.trim()} />)}
              </div>
            </div>
          )}

          {/* Risk activity trend */}
          {agent.sensitiveActivityTrend && (
            <div className="mb-6">
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-2 flex items-center gap-1">
                Risk activity trend
                <div className="ml-1 cursor-help text-[#616161]" title="This shows how risk signals (e.g., DLP blocks, risky interactions) evolved over time across sessions.">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7.5v3.5M8 4.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-md p-4 border border-gray-100">
                <Sparkline data={agent.sensitiveActivityTrend} />
              </div>
            </div>
          )}

          {/* IRM deep-link */}
          <div className="pt-4 border-t border-gray-100">
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0078D4] text-white rounded-md text-[14px] font-medium hover:bg-[#106EBE] transition-colors"
              onClick={() => { /* IRM navigation stub */ }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3H3v10h10v-3"/><path d="M9 2h5v5"/><path d="M14 2L7 9"/></svg>
              View details in Insider Risk Management
            </button>
            <p className="text-[12px] text-[#616161] mt-2">Investigate individual sessions, interactions, and DLP events in IRM.</p>
          </div>
        </section>

        {/* Policies */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-[#242424] mb-4">Policies</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-1">Data protection</div>
              <div className="text-[14px] text-[#242424] font-medium">{agent.dataProtection}</div>
            </div>
            <div>
              <div className="text-[12px] text-[#616161] uppercase tracking-wide mb-1">Data compliance</div>
              <div className="text-[14px] text-[#242424] font-medium">{agent.dataCompliance}</div>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-[16px] font-semibold text-[#242424] mb-4">Recommendations</h2>
          <div className="space-y-3">
            {agent.riskLevel === 'High' && (
              <>
                <div className="flex items-start gap-3 p-3 bg-[#FDE7E9] rounded-md border border-[#F1BBBC]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#C50F1F" className="mt-0.5 shrink-0"><path d="M8 1l7 14H1L8 1z"/><path d="M8 6v4M8 12h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <div className="text-[13px] text-[#242424]"><span className="font-semibold">Apply DLP policy</span> — No data protection policies are applied to this agent instance. Consider applying a policy to prevent sensitive data exfiltration.</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#FFF9F5] rounded-md border border-[#FDCFB4]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#DA3B01" className="mt-0.5 shrink-0"><circle cx="8" cy="8" r="7"/><path d="M8 4v5M8 11h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <div className="text-[13px] text-[#242424]"><span className="font-semibold">Review in IRM</span> — This user has {sessions.highRisk} high-risk sessions. Review the session details in Insider Risk Management for further investigation.</div>
                </div>
              </>
            )}
            {agent.riskLevel === 'Medium' && (
              <div className="flex items-start gap-3 p-3 bg-[#FFF9F5] rounded-md border border-[#FDCFB4]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#DA3B01" className="mt-0.5 shrink-0"><circle cx="8" cy="8" r="7"/><path d="M8 4v5M8 11h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <div className="text-[13px] text-[#242424]"><span className="font-semibold">Monitor activity</span> — This user has moderate risk activity. Continue monitoring and consider applying additional policies.</div>
              </div>
            )}
            {(agent.riskLevel === 'Low' || agent.riskLevel === 'None') && (
              <div className="flex items-start gap-3 p-3 bg-[#DFF6DD] rounded-md border border-[#9BE09A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#107C10" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                <div className="text-[13px] text-[#242424]"><span className="font-semibold">No action required</span> — Risk activity is within normal parameters.</div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
