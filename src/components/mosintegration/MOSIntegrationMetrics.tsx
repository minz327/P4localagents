import React from 'react'
import { MOSAgentRow } from '../../lib/mosintegrationData'

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 min-h-[170px] flex flex-col">{children}</div>
}

function InfoIcon() {
  return (
    <div className="ml-1.5 cursor-help text-[#616161]" title="More info">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7.5v3.5M8 4.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Trend({ value, type }: { value: string; type: 'positive' | 'negative' | 'neutral' }) {
  if (type === 'positive') {
    return (
      <div className="flex items-center gap-1 text-[11px] font-semibold translate-y-[2px]">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-[#107C10]"><path d="M3.5 12.5L12.5 3.5M12.5 3.5H4.5M12.5 3.5V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="text-[#242424] font-medium">{value}</span>
      </div>
    )
  }
  if (type === 'negative') {
    return (
      <div className="flex items-center gap-1 text-[11px] font-semibold translate-y-[2px]">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-[#C50F1F]"><path d="M3.5 12.5L12.5 3.5M12.5 3.5H4.5M12.5 3.5V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="text-[#242424] font-medium">{value}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-[11px] font-semibold translate-y-[2px]">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-[#0078D4]"><path d="M2.5 8H13.5M10.5 5L13.5 8L10.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span className="text-[#242424] font-medium">{value}</span>
    </div>
  )
}

export default function MOSIntegrationMetrics({ rows }: { rows: MOSAgentRow[] }) {
  const agents = rows.filter(r => r.category === 'Agent')
  const aiApps = rows.filter(r => r.category === 'AI app')

  const agentsActive = agents.filter(r => r.status === 'Active').length
  const agentsInactive = agents.filter(r => r.status === 'Inactive').length

  const allHigh = rows.filter(r => r.riskLevel === 'High').length
  const allMedium = rows.filter(r => r.riskLevel === 'Medium').length
  const allLow = rows.filter(r => r.riskLevel === 'Low').length

  const oversharing = rows.filter(r => r.riskType.includes('Oversharing')).length
  const exfiltration = rows.filter(r => r.riskType.includes('Exfiltration')).length
  const unethical = rows.filter(r => r.riskType.includes('Unethical')).length

  return (
    <section>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Agents (MOS) */}
        <Card>
          <div className="text-[16px] font-semibold text-[#242424] pb-4 border-b border-[#E0E0E0] mb-5">
            {agents.length} Agents
          </div>
          <div className="flex gap-8 justify-between">
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Active <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{agentsActive}</div>
                <Trend value="12%" type="negative" />
              </div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Inactive <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{agentsInactive}</div>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F3F2F1]">
            <span className="text-[11px] text-[#616161]">Complete inventory (MOS)</span>
          </div>
        </Card>

        {/* Card 2: AI Apps (audit logs) */}
        <Card>
          <div className="text-[16px] font-semibold text-[#242424] pb-4 border-b border-[#E0E0E0] mb-5">
            {aiApps.length} AI apps
          </div>
          <div className="flex gap-8 justify-between">
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Active <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{aiApps.length}</div>
                <Trend value="3%" type="positive" />
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F3F2F1]">
            <span className="text-[11px] text-[#616161]">Last 30 days activity</span>
          </div>
        </Card>

        {/* Card 3: Risk overview (combined) */}
        <Card>
          <div className="text-[16px] font-semibold text-[#242424] pb-4 border-b border-[#E0E0E0] mb-5">
            {allHigh} high risk
          </div>
          <div className="flex gap-6 justify-between">
            <div>
              <div className="text-[14px] text-[#242424] mb-1">High</div>
              <div className="text-[28px] font-semibold text-[#242424] leading-none">{allHigh}</div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] mb-1">Medium</div>
              <div className="text-[28px] font-semibold text-[#242424] leading-none">{allMedium}</div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] mb-1">Low</div>
              <div className="text-[28px] font-semibold text-[#242424] leading-none">{allLow}</div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F3F2F1]">
            <span className="text-[11px] text-[#616161]">Last 30 days activity</span>
          </div>
        </Card>

        {/* Card 4: Sensitive interactions (combined) */}
        <Card>
          <div className="text-[16px] font-semibold text-[#242424] pb-4 border-b border-[#E0E0E0] mb-5">
            {oversharing + exfiltration + unethical} with sensitive interactions
          </div>
          <div className="flex gap-6 justify-between">
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Oversharing <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{oversharing}</div>
                <Trend value="120%" type="negative" />
              </div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Exfiltration <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{exfiltration}</div>
                <Trend value="No change" type="neutral" />
              </div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Unethical <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{unethical}</div>
                <Trend value="No change" type="neutral" />
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F3F2F1]">
            <span className="text-[11px] text-[#616161]">Last 30 days activity</span>
          </div>
        </Card>
      </div>
    </section>
  )
}
