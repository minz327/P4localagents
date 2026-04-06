import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { mosRows, MOSAgentRow, MOSCategory } from '../../lib/mosintegrationData'

function AppIcon({ type, initials, icon }: { type: 'app' | 'user'; initials?: string; icon?: string }) {
  if (type === 'app') {
    // Default to copilot if not specified
    const appIcon = icon || 'copilot';

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
          <div className="w-8 h-8 bg-[#107C10] rounded flex items-center justify-center text-white font-bold text-xs">
            X
          </div>
        )}
        {appIcon === 'teams' && (
           <div className="w-8 h-8 bg-[#464EB8] rounded flex items-center justify-center">
             <span className="text-white font-bold text-xs">T</span>
           </div>
        )}
        {appIcon === 'slack' && (
          <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
               <path d="M6 15a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#E01E5A"/>
               <path d="M6 15v2.5a2.5 2.5 0 1 1-5 0V15h5z" fill="#E01E5A"/>
               <path d="M9 15a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#36C5F0"/>
               <path d="M9 15V9a2.5 2.5 0 0 1 5 0v6H9z" fill="#36C5F0"/>
               <path d="M9 6a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#2EB67D"/>
               <path d="M9 6H6.5a2.5 2.5 0 1 1 0 5H9V6z" fill="#2EB67D"/>
               <path d="M15 9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#ECB22E"/>
               <path d="M15 9v-2.5a2.5 2.5 0 1 1 5 0V9h-5z" fill="#ECB22E"/>
             </svg>
          </div>
        )}
        {appIcon === 'salesforce' && (
            <div className="w-8 h-8 flex items-center justify-center">
               <svg viewBox="0 0 24 24" width="28" height="28" fill="#00A1E0">
                 <path d="M16.1 11c.5 0 .9-.3 1-.8.2-1.1 1.2-1.9 2.4-1.9.7 0 1.3.3 1.8.7.4.4.9.4 1.3.1.2-.2.3-.5.2-.8-.8-1.5-2.4-2.4-4.1-2.4-.7 0-1.4.2-2 .5-.2-.8-.7-1.5-1.4-2-1.1-.8-2.5-.9-3.7-.3C10.7 2.4 9 1.7 7.2 2.5c-1.6.7-2.6 2.3-2.6 4.1 0 .2 0 .5.1.7-1.6.4-2.8 1.8-2.8 3.5 0 2 1.6 3.6 3.6 3.6h10.6c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5c0 .1 0 .1 0 .1zm-3.5 5.2c-.3.3-.8.3-1.1 0L9.4 14c-.2-.2-.2-.5 0-.7s.5-.2.7 0l1.2 1.2 2.8-2.8c.2-.2.5-.2.7 0s.2.5 0 .7l-3.2 3.2z"/>
               </svg>
            </div>
        )}
        {appIcon === 'custom' && (
           <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" fill="#00BCF2"/>
                <path d="M16 22L24 18V26L16 30L8 26V18L16 22Z" fill="#0078D4"/>
                <path d="M16 14L24 10L16 6L8 10L16 14Z" fill="#B3E0F3"/>
              </svg>
           </div>
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

function RiskLevel({ level }: { level: MOSAgentRow['riskLevel'] }) {
  // Exact match for the 3 blocks
  // Screenshot High: 3 Dark Red blocks (#A4262C or similar)
  // Low: 2 Orange blocks (#D83B01)
  
  let colors = ['bg-[#E0E0E0]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
  if (level === 'High') colors = ['bg-[#A4262C]', 'bg-[#A4262C]', 'bg-[#A4262C]']
  if (level === 'Low') colors = ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]'] 
  if (level === 'None') colors = ['bg-[#605E5C]', 'bg-[#605E5C]', 'bg-[#605E5C]'] 

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

function Sparkline({ data }: { data: number[] | null }) {
  if (!data) return <span className="text-[#605E5C] font-normal text-[13px]">No data available</span>
  
  // Bar chart with dashed line at the BOTTOM
  // The bars sit on top of the line.
  return (
    <div className="flex items-end gap-[2px] h-8 w-[140px] relative pb-[2px]">
       {/* dashed line at the bottom */}
       <div className="absolute bottom-0 w-full border-b border-dashed border-[#5B5FC7] opacity-60"></div> 
      {data.map((v, i) => (
        <div key={i} className="w-[6px] bg-[#4f6bed] z-10 rounded-t-[2px] mb-[1px]" style={{ height: `${v > 0 ? Math.max(v, 4) : 0}px` }}></div>
      ))}
    </div>
  )
}

function CategoryPill({ category }: { category: MOSCategory }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
      category === 'Agent'
        ? 'bg-[#E8F0FE] text-[#0078D4]'
        : 'bg-[#F3F2F1] text-[#616161]'
    }`}>
      {category}
    </span>
  )
}

function StatusBadge({ status }: { status: MOSAgentRow['status'] }) {
  if (status === 'Active') {
    return (
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#107C10">
          <circle cx="12" cy="12" r="10" fill="#107C10" />
          <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span className="text-[#242424]">Active</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#A19F9D" strokeWidth="2" />
        <path d="M8 12h8" stroke="#A19F9D" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className="text-[#A19F9D]">Inactive</span>
    </div>
  )
}

export default function MOSIntegrationAgents() {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = useState<{ col: string; dir: 'asc' | 'desc' } | null>({ col: 'riskLevel', dir: 'desc' })
  const [typeFilter, setTypeFilter] = useState<MOSCategory | 'Any'>('Any')
  const [riskFilter, setRiskFilter] = useState<string>('Any')
  const [statusFilter, setStatusFilter] = useState<string>('Any')

  const filteredAndSorted = useMemo(() => {
    let data = [...mosRows]

    // Apply filters
    if (typeFilter !== 'Any') data = data.filter(r => r.category === typeFilter)
    if (riskFilter !== 'Any') data = data.filter(r => r.riskLevel === riskFilter)
    if (statusFilter !== 'Any') data = data.filter(r => r.status === statusFilter)

    // Apply sort
    if (sortConfig) {
      data.sort((a, b) => {
        if (sortConfig.col === 'riskLevel') {
          const order: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0 }
          const aRank = order[a.riskLevel] || 0
          const bRank = order[b.riskLevel] || 0
          return sortConfig.dir === 'asc' ? aRank - bRank : bRank - aRank
        }
        if (sortConfig.col === 'sensitiveActivityTrend') {
          const aSum = a.sensitiveActivityTrend ? a.sensitiveActivityTrend.reduce((x, y) => x + y, 0) : 0
          const bSum = b.sensitiveActivityTrend ? b.sensitiveActivityTrend.reduce((x, y) => x + y, 0) : 0
          return sortConfig.dir === 'asc' ? aSum - bSum : bSum - aSum
        }
        const aVal = (a as any)[sortConfig.col]
        const bVal = (b as any)[sortConfig.col]
        if (aVal === bVal) return 0
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1
        const cmp = aVal < bVal ? -1 : 1
        return sortConfig.dir === 'asc' ? cmp : -cmp
      })
    }

    return data
  }, [sortConfig, typeFilter, riskFilter, statusFilter])

  const handleSort = (col: string) => {
    setSortConfig(current => {
      if (current?.col === col) return { col, dir: current.dir === 'asc' ? 'desc' : 'asc' }
      return { col, dir: 'desc' }
    })
  }

  return (
    <div className="bg-white rounded-none border-t border-gray-200 mt-4 font-sans">
      
      {/* Filters Bar */}
      <div className="flex items-center px-6 py-3 gap-2 border-b border-gray-100 text-[13px] bg-white flex-wrap">
        <span className="text-[#616161] mr-2">Filters:</span>
        <button
          onClick={() => setTypeFilter(v => v === 'Any' ? 'Agent' : v === 'Agent' ? 'AI app' : 'Any')}
          className={`px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 text-[#242424] ${typeFilter !== 'Any' ? 'bg-[#E8F0FE] border border-[#0078D4]/30' : 'bg-[#F3F2F1] hover:bg-[#E1DFDD]'}`}
        >
          Type: <span className="font-semibold">{typeFilter}</span>
        </button>
        <button
          onClick={() => setRiskFilter(v => v === 'Any' ? 'High' : v === 'High' ? 'Medium' : v === 'Medium' ? 'Low' : v === 'Low' ? 'None' : 'Any')}
          className={`px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 text-[#242424] ${riskFilter !== 'Any' ? 'bg-[#E8F0FE] border border-[#0078D4]/30' : 'bg-[#F3F2F1] hover:bg-[#E1DFDD]'}`}
        >
          Risk level: <span className="font-semibold">{riskFilter}</span>
        </button>
        <button
          onClick={() => setStatusFilter(v => v === 'Any' ? 'Active' : v === 'Active' ? 'Inactive' : 'Any')}
          className={`px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 text-[#242424] ${statusFilter !== 'Any' ? 'bg-[#E8F0FE] border border-[#0078D4]/30' : 'bg-[#F3F2F1] hover:bg-[#E1DFDD]'}`}
        >
          Status: <span className="font-semibold">{statusFilter}</span>
        </button>
        <div className="bg-[#F3F2F1] hover:bg-[#E1DFDD] px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 text-[#242424]">
          Risk types: <span className="font-semibold">Any</span>
        </div>
        <button className="text-[#0078D4] flex items-center gap-1 ml-2 font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18l-7 9v9l-4-4v-5L3 3z"/></svg>
          Add filter
        </button>
        <span className="ml-auto text-[#616161] text-[12px]">{filteredAndSorted.length} items</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-[#242424] min-w-[1200px]">
          <thead className="bg-white border-b border-gray-200 text-[#242424] font-normal text-sm">
            <tr>
              {[
                { label: 'Name', key: 'name' },
                { label: 'Type', key: 'category', widthClass: 'min-w-[90px]' },
                { label: 'Status', key: 'status', widthClass: 'min-w-[120px]' },
                { label: 'Risk level', key: 'riskLevel', widthClass: 'min-w-[140px]' },
                { label: 'Risk types', key: 'riskType' },
                { label: 'Sensitive activity trend', key: 'sensitiveActivityTrend' },
                { label: 'Policies', key: 'dataProtection' },
              ].map((col) => (
                <th 
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-6 py-4 font-normal cursor-pointer hover:bg-gray-50 bg-white group select-none ${col.widthClass || ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig?.col === col.key && (
                      <span className="text-[12px] text-[#616161] font-light">
                        {sortConfig.dir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                    <span className={`text-[10px] text-[#616161] ml-0.5 font-light ${sortConfig?.col === col.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>∨</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSorted.map((row, index) => (
              <tr 
                key={index} 
                className={`transition-colors h-[64px] cursor-pointer ${row.status === 'Inactive' ? 'hover:bg-[#FAF9F8] opacity-75' : 'hover:bg-[#FAF9F8]'}`}
                onClick={() => navigate(`/mosintegration/agents/${row.agentId}`)}
              >
                <td className="px-6 py-2">
                  <div className="flex items-center gap-3">
                    <AppIcon type={row.type} initials={row.initials} icon={row.icon} />
                    <span className="font-semibold text-[#242424]">{row.name}</span>
                  </div>
                </td>
                <td className="px-6 py-2">
                  <CategoryPill category={row.category} />
                </td>
                <td className="px-6 py-2 align-middle">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-6 py-2">
                  <RiskLevel level={row.riskLevel} />
                </td>
                <td className="px-6 py-2 text-[#242424] text-[13px]">
                  {row.riskType === 'No data available' || row.riskType === '—' 
                    ? <span className="text-[#A19F9D]">{row.riskType}</span> 
                    : row.riskType}
                </td>
                <td className="px-6 py-2">
                  <div className="mt-2">
                    {row.sensitiveActivityTrend ? (
                      <Sparkline data={row.sensitiveActivityTrend} />
                    ) : <span className="text-[#A19F9D] text-[13px]">{row.status === 'Inactive' ? '—' : 'No data available'}</span>}
                  </div>
                </td>
                <td className="px-6 py-2 text-[#242424] text-[13px]">
                  <div className="flex flex-col gap-0.5">
                    {row.dataProtection && <span>{row.dataProtection}</span>}
                    {row.dataCompliance && row.dataCompliance !== row.dataProtection && <span>{row.dataCompliance}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    </div>
  )
}

