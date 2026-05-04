import React, { useEffect, useState } from 'react'
import { getMetrics } from '../lib/mockApi'

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
  // Neutral (No change)
  return (
    <div className="flex items-center gap-1 text-[11px] font-semibold translate-y-[2px]">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-[#0078D4]"><path d="M2.5 8H13.5M10.5 5L13.5 8L10.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span className="text-[#242424] font-medium">{value}</span>
    </div>
  )
}


export interface MetricsData {
  totalApps: number
  active: number
  inactive: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  sensitive: { oversharing: number; exfiltration: number; unethical: number }
  tabLabel?: string  // e.g. "cloud agents", "local agents" — omit for "all"
}

export default function Metrics({ data: propData }: { data?: MetricsData }) {
  const data = propData ?? {
    totalApps: 254,
    active: 254,
    inactive: 0,
    highRisk: 15,
    mediumRisk: 1,
    lowRisk: 2,
    sensitive: {
      oversharing: 11,
      exfiltration: 2,
      unethical: 0
    }
  }

  const isFiltered = !!data.tabLabel;
  const agentLabel = data.tabLabel || 'total agents';

  return (
    <section>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <div className="text-[16px] font-semibold text-[#242424] pb-4 border-b border-[#E0E0E0] mb-5">
            {data.totalApps} {agentLabel}
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-between xl:gap-[80px] 2xl:gap-[120px]">
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Active <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.active}</div>
                {isFiltered ? <Trend value="—" type="neutral" /> : <Trend value="3%" type="positive" />}
              </div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Inactive <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.inactive}</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold translate-y-[2px]">
                   <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-[#0078D4]"><path d="M2.5 8H13.5M10.5 5L13.5 8L10.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
           <div className="text-[16px] font-semibold text-[#242424] pb-4 border-b border-[#E0E0E0] mb-5">
            {data.highRisk} high risk {data.tabLabel ? data.tabLabel.split(' ').pop() : 'agents'}
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-between xl:gap-[40px] 2xl:gap-[80px]">
            <div>
              <div className="text-[14px] text-[#242424] mb-1">High risk</div>
              <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.highRisk}</div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] mb-1">Medium risk</div>
              <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.mediumRisk}</div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] mb-1">Low risk</div>
              <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.lowRisk}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-[16px] font-semibold text-[#242424] pb-4 border-b border-[#E0E0E0] mb-5">
            {data.sensitive.oversharing + data.sensitive.exfiltration + data.sensitive.unethical} {data.tabLabel ? data.tabLabel.split(' ').pop() : 'agents'} with sensitive interactions
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-between xl:gap-[30px] 2xl:gap-[60px]">
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Oversharing <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.sensitive.oversharing}</div>
                {isFiltered ? <Trend value="—" type="neutral" /> : <Trend value="120%" type="negative" />}
              </div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Exfiltration <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.sensitive.exfiltration}</div>
                <Trend value={isFiltered ? "—" : "No change"} type="neutral" />
              </div>
            </div>
            <div>
              <div className="text-[14px] text-[#242424] flex items-center mb-1">Unethical <InfoIcon /></div>
              <div className="flex items-baseline gap-2">
                <div className="text-[28px] font-semibold text-[#242424] leading-none">{data.sensitive.unethical}</div>
                <Trend value={isFiltered ? "—" : "No change"} type="neutral" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

