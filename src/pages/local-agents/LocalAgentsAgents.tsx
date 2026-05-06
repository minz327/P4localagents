import React from 'react'
import { useNavigate } from 'react-router-dom'
import { rows, AgentRow } from '../../lib/agentsData'

const NemoClawIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#76B900"/>
    <path d="M12.2 8.4v-.7c-.1 0-.2 0-.3 0-2.1 0-3.7 1.8-3.7 4 0 2.2 1.6 4 3.7 4 .1 0 .2 0 .3 0v-.7c-1.7-.1-3-1.5-3-3.3s1.3-3.2 3-3.3zm0-1.4v-1c-3 .1-5.4 2.5-5.4 5.5 0 3 2.4 5.4 5.4 5.5v-1c-2.5-.1-4.4-2.1-4.4-4.5s1.9-4.4 4.4-4.5zm0 2.8v-.7c-1.2.1-2.1 1.1-2.1 2.4 0 1.3.9 2.3 2.1 2.4v-.7c-.8-.1-1.4-.8-1.4-1.7s.6-1.6 1.4-1.7zm.7-2.8v1c2.3.2 4.1 2.1 4.1 4.5s-1.8 4.3-4.1 4.5v1c2.8-.2 5.1-2.5 5.1-5.5s-2.3-5.3-5.1-5.5zm0 1.4v.7c1.6.2 2.7 1.5 2.7 3.3 0 1.8-1.1 3.1-2.7 3.3v.7c2-.2 3.4-1.7 3.4-4s-1.4-3.8-3.4-4zm0 2.1v3.4c-.8-.1-1.3-.8-1.3-1.7 0-.8.4-1.5 1.3-1.7z" fill="white"/>
  </svg>
);

const OpenClawIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="18" rx="3" fill="#1a1a2e"/>
    <path d="M7 8l3 3-3 3" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 16h4" stroke="#e94560" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CopilotIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#242424"><path d="M23.922 16.992c-.861 1.495-5.859 5.023-11.922 5.023-6.063 0-11.061-3.528-11.922-5.023A.641.641 0 0 1 0 16.736v-2.869a.841.841 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.195 10.195 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952 1.399-1.136 3.392-2.093 6.122-2.093 2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.832.832 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256ZM12.172 11h-.344a4.323 4.323 0 0 1-.355.508C10.703 12.455 9.555 13 7.965 13c-1.725 0-2.989-.359-3.782-1.259a2.005 2.005 0 0 1-.085-.104L4 11.741v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.323 4.323 0 0 1-.355-.508h-.016.016Zm.641-2.935c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z"/><path d="M14.5 14.25a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Zm-5 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Z"/></svg>
);

function AppIcon({ type, initials, icon, platform }: { type: 'app' | 'user'; initials?: string; icon?: string; platform?: string }) {
  if (platform === 'GitHub Copilot CLI') {
    return <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center"><CopilotIcon size={28} /></div>;
  }
  if (platform === 'OpenClaw') {
    return <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center"><OpenClawIcon size={28} /></div>;
  }
  if (platform === 'NemoClaw') {
    return <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center"><NemoClawIcon size={28} /></div>;
  }
  if (type === 'app') {
    const appIcon = icon || 'copilot';
    return (
      <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
        {appIcon === 'copilot' && <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M10.5 8C10.5 12.14 13.86 15.5 18 15.5C22.14 15.5 25.5 12.14 25.5 8C25.5 3.86 22.14 0.5 18 0.5C13.86 0.5 10.5 3.86 10.5 8Z" fill="#60C6E7" fillOpacity="0.8"/><path d="M19 25C19 20.86 15.64 17.5 11.5 17.5C7.36 17.5 4 20.86 4 25C4 29.14 7.36 32.5 11.5 32.5C15.64 32.5 19 29.14 19 25Z" fill="#2464EB"/><path d="M18.5 16C16.57 16 15 14.43 15 12.5C15 10.57 16.57 9 18.5 9C20.43 9 22 10.57 22 12.5C22 14.43 20.43 16 18.5 16Z" fill="#60C6E7"/><path d="M12.5 24C14.43 24 16 22.43 16 20.5C16 18.57 14.43 17 12.5 17C10.57 17 9 18.57 9 20.5C9 22.43 10.57 24 12.5 24Z" fill="#2464EB"/></svg>}
        {appIcon === 'excel' && <div className="w-8 h-8 bg-[#107C10] rounded flex items-center justify-center text-white font-bold text-xs">X</div>}
        {appIcon === 'teams' && <div className="w-8 h-8 bg-[#464EB8] rounded flex items-center justify-center"><span className="text-white font-bold text-xs">T</span></div>}
        {appIcon === 'slack' && <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 15a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#E01E5A"/><path d="M6 15v2.5a2.5 2.5 0 1 1-5 0V15h5z" fill="#E01E5A"/><path d="M9 15a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#36C5F0"/><path d="M9 15V9a2.5 2.5 0 0 1 5 0v6H9z" fill="#36C5F0"/><path d="M9 6a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#2EB67D"/><path d="M9 6H6.5a2.5 2.5 0 1 1 0 5H9V6z" fill="#2EB67D"/><path d="M15 9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#ECB22E"/><path d="M15 9v-2.5a2.5 2.5 0 1 1 5 0V9h-5z" fill="#ECB22E"/></svg></div>}
        {appIcon === 'salesforce' && <div className="w-8 h-8 flex items-center justify-center"><svg viewBox="0 0 24 24" width="28" height="28" fill="#00A1E0"><path d="M16.1 11c.5 0 .9-.3 1-.8.2-1.1 1.2-1.9 2.4-1.9.7 0 1.3.3 1.8.7.4.4.9.4 1.3.1.2-.2.3-.5.2-.8-.8-1.5-2.4-2.4-4.1-2.4-.7 0-1.4.2-2 .5-.2-.8-.7-1.5-1.4-2-1.1-.8-2.5-.9-3.7-.3C10.7 2.4 9 1.7 7.2 2.5c-1.6.7-2.6 2.3-2.6 4.1 0 .2 0 .5.1.7-1.6.4-2.8 1.8-2.8 3.5 0 2 1.6 3.6 3.6 3.6h10.6c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5c0 .1 0 .1 0 .1zm-3.5 5.2c-.3.3-.8.3-1.1 0L9.4 14c-.2-.2-.2-.5 0-.7s.5-.2.7 0l1.2 1.2 2.8-2.8c.2-.2.5-.2.7 0s.2.5 0 .7l-3.2 3.2z"/></svg></div>}
        {appIcon === 'custom' && <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center"><svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" fill="#00BCF2"/><path d="M16 22L24 18V26L16 30L8 26V18L16 22Z" fill="#0078D4"/><path d="M16 14L24 10L16 6L8 10L16 14Z" fill="#B3E0F3"/></svg></div>}
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
  if (level === 'Medium') colors = ['bg-[#D83B01]', 'bg-[#D83B01]', 'bg-[#E0E0E0]']
  if (level === 'Low') colors = ['bg-[#D83B01]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
  if (level === 'None') colors = ['bg-[#E0E0E0]', 'bg-[#E0E0E0]', 'bg-[#E0E0E0]']
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
  return (
    <div className="flex items-end gap-[2px] h-8 w-[140px] relative pb-[2px]">
      <div className="absolute bottom-0 w-full border-b border-dashed border-[#5B5FC7] opacity-60"></div>
      {data.map((v, i) => (
        <div key={i} className="w-[6px] bg-[#4f6bed] z-10 rounded-t-[2px] mb-[1px]" style={{ height: `${v > 0 ? Math.max(v, 4) : 0}px` }}></div>
      ))}
    </div>
  )
}

// Filter dropdown component
function FilterPill({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={`px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 text-[#242424] ${value !== 'Any' ? 'bg-[#EBF3FC] border border-[#0078D4] text-[#0078D4]' : 'bg-[#F3F2F1] hover:bg-[#E1DFDD]'}`}
      >
        {label}: <span className="font-semibold">{value}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg z-50 min-w-[180px] py-1">
          <div
            onClick={() => { onChange('Any'); setOpen(false) }}
            className={`px-4 py-2 text-[13px] cursor-pointer hover:bg-[#F5F5F5] ${value === 'Any' ? 'text-[#0078D4] font-semibold' : 'text-[#242424]'}`}
          >Any</div>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`px-4 py-2 text-[13px] cursor-pointer hover:bg-[#F5F5F5] ${value === opt ? 'text-[#0078D4] font-semibold' : 'text-[#242424]'}`}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  )
}

// Logical column order per tab — designed for scan path
const cloudColumns = [
  { label: 'Name', key: 'name' },
  { label: 'Platform', key: 'platform' },
  { label: 'Status', key: 'status' },
  { label: 'Agent ID', key: 'agentId' },
  { label: 'Risk level', key: 'riskLevel', w: 'min-w-[140px]' },
  { label: 'Risk types', key: 'riskType' },
  { label: 'Risk activity trend', key: 'sensitiveActivityTrend', tooltip: 'This shows how risk signals (e.g., DLP blocks, risky interactions) evolved over time across sessions.' },
  { label: 'Policies', key: 'dataProtection' },
]

const localColumns = [
  { label: 'Name', key: 'name' },
  { label: 'Platform', key: 'platform' },
  { label: 'Status', key: 'status' },
  { label: 'Agent ID', key: 'agentId' },
  { label: 'Risk level', key: 'riskLevel', w: 'min-w-[140px]' },
  { label: 'Risk types', key: 'riskType' },
  { label: 'Risk activity trend', key: 'sensitiveActivityTrend', tooltip: 'This shows how risk signals (e.g., DLP blocks, risky interactions) evolved over time across sessions.' },
  { label: 'Policies', key: 'dataProtection' },
  { label: 'Used by', key: 'userName' },
  { label: 'Device', key: 'device' },
]

function PoliciesCell({ row }: { row: AgentRow }) {
  const p = parseInt(row.dataProtection) || 0;
  const c = parseInt(row.dataCompliance) || 0;
  const total = p + c;
  return <>{total === 0 ? '0 Policies' : total === 1 ? '1 Policy' : `${total} Policies`}</>;
}

function TypeBadge({ hosting }: { hosting?: string }) {
  if (hosting === 'local') return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0E6FA] text-[#5C2D91] border border-[#D4B8E8]">Local</span>;
  return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E8F4FD] text-[#0078D4] border border-[#B3D7F2]">Cloud</span>;
}

const cloudUserPools: { initials: string; bg: string; text: string }[][] = [
  [{ initials: 'JB', bg: '#E8DAEF', text: '#5B2C6F' }, { initials: 'EW', bg: '#D5F5E3', text: '#1E8449' }, { initials: 'MB', bg: '#D6DBDF', text: '#2C3E50' }],
  [{ initials: 'KR', bg: '#FADBD8', text: '#922B21' }, { initials: 'TL', bg: '#D4E6F1', text: '#1A5276' }, { initials: 'AS', bg: '#FCF3CF', text: '#7D6608' }, { initials: 'NP', bg: '#D5F5E3', text: '#1E8449' }],
  [{ initials: 'RC', bg: '#E8DAEF', text: '#5B2C6F' }, { initials: 'DM', bg: '#FADBD8', text: '#922B21' }],
  [{ initials: 'LH', bg: '#D4E6F1', text: '#1A5276' }, { initials: 'SG', bg: '#FCF3CF', text: '#7D6608' }, { initials: 'VP', bg: '#D5F5E3', text: '#1E8449' }, { initials: 'AK', bg: '#E8DAEF', text: '#5B2C6F' }, { initials: 'JT', bg: '#FADBD8', text: '#922B21' }],
];

function CloudFacepile({ seed }: { seed: number }) {
  const pool = cloudUserPools[seed % cloudUserPools.length];
  const shown = pool.slice(0, 3);
  const extra = pool.length - 3;
  return (
    <div className="flex items-center">
      {shown.map((u, i) => (
        <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border-2 border-white shrink-0" style={{ backgroundColor: u.bg, color: u.text, marginLeft: i > 0 ? '-6px' : 0, zIndex: shown.length - i }}>{u.initials}</div>
      ))}
      {extra > 0 && <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium border-2 border-white shrink-0 bg-[#F0F0F0] text-[#616161]" style={{ marginLeft: '-6px', zIndex: 0 }}>+{extra}</div>}
    </div>
  );
}

function SessionsBadge({ sessions }: { sessions?: { total: number; highRisk: number } }) {
  if (!sessions || sessions.total === 0) return <span className="text-[#616161] text-[13px]">No sessions</span>;
  return (
    <span className="text-[13px]">
      <span className="text-[#242424] font-medium">{sessions.total} sessions</span>
      {sessions.highRisk > 0 && <span className="text-[#C50F1F] ml-1">({sessions.highRisk} high-risk)</span>}
    </span>
  );
}

function AgentRow_({ row, navigate, tab, columns }: { row: AgentRow; navigate: (path: string) => void; tab: 'cloud' | 'devices' | 'aiapps'; columns: { label: string; key: string }[] }) {
  const handleClick = () => {
    navigate(`/local-agents/agents/${row.agentId}`);
  };

  const renderCell = (key: string) => {
    switch (key) {
      case 'name': return <td key={key} className="px-6 py-2"><div className="flex items-center gap-3"><AppIcon type={row.type} initials={row.initials} icon={row.icon} platform={row.platform} /><span className="font-semibold text-[#242424]">{row.name}</span></div></td>;
      case 'userName': return <td key={key} className="px-6 py-2">{row.userName ? <div className="flex items-center"><div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 border-2 border-white" style={{ backgroundColor: '#FFF4CE', color: '#785C34' }}>{row.initials || 'U'}</div><span className="text-[#242424] text-[13px] ml-2">{row.userName}</span></div> : row.hosting === 'cloud' ? <CloudFacepile seed={row.agentId.charCodeAt(0) + row.agentId.charCodeAt(row.agentId.length - 1)} /> : null}</td>;
      case 'device': return <td key={key} className="px-6 py-2 text-[#242424] text-[13px]">{row.device || ''}</td>;
      case 'hosting': return <td key={key} className="px-6 py-2"><TypeBadge hosting={row.hosting} /></td>;
      case 'status': return <td key={key} className="px-6 py-2 align-middle"><div className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill={row.status === 'Active' ? '#107C10' : '#616161'}><circle cx="12" cy="12" r="10"/><path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg><span className="text-[#242424]">{row.status}</span></div></td>;
      case 'sessions': return <td key={key} className="px-6 py-2"><SessionsBadge sessions={row.sessions} /></td>;
      case 'platform': return <td key={key} className="px-6 py-2 text-[#242424] text-[13px]">{row.platform || '\u2014'}</td>;
      case 'agentId': return <td key={key} className="px-6 py-2 text-[#616161] truncate max-w-[280px] font-normal text-[13px] tracking-tight" title={row.agentId}>{row.agentId}</td>;
      case 'riskLevel': return <td key={key} className="px-6 py-2"><RiskLevel level={row.riskLevel} /></td>;
      case 'riskType': return <td key={key} className="px-6 py-2 text-[#242424] text-[13px]">{row.riskType === 'No data available' ? <span className="text-[#616161]">{row.riskType}</span> : row.riskType}</td>;
      case 'sensitiveActivityTrend': return <td key={key} className="px-6 py-2"><div className="mt-2">{row.sensitiveActivityTrend ? <Sparkline data={row.sensitiveActivityTrend} /> : <span className="text-[#616161] text-[13px]">No data available</span>}</div></td>;
      case 'dataProtection': return <td key={key} className="px-6 py-2 text-[#242424] text-[13px]"><PoliciesCell row={row} /></td>;
      default: return <td key={key} className="px-6 py-2">—</td>;
    }
  };

  return (
    <tr className="hover:bg-[#FAF9F8] transition-colors h-[64px] cursor-pointer" onClick={handleClick}>
      {columns.map(col => renderCell(col.key))}
    </tr>
  )
}

export default function LocalAgentsAgents({ activeTab = 'cloud', groupBy = 'none' }: { activeTab?: 'cloud' | 'devices' | 'aiapps'; groupBy?: 'none' | 'platform' | 'user' | 'device' }) {
  const navigate = useNavigate()
  const [sortConfig, setSortConfig] = React.useState<{ col: keyof AgentRow; dir: 'asc' | 'desc' } | null>({ col: 'riskLevel', dir: 'desc' });
  const [filters, setFilters] = React.useState<{ riskLevel: string; status: string; platform: string; riskTypes: string; userName: string; device: string }>({ riskLevel: 'Any', status: 'Any', platform: 'Any', riskTypes: 'Any', userName: 'Any', device: 'Any' });

  const tabFilteredRows = React.useMemo(() => {
    if (activeTab === 'cloud') return rows.filter(r => r.hosting === 'cloud');
    if (activeTab === 'devices') return rows.filter(r => r.hosting === 'local');
    if (activeTab === 'aiapps') return rows.filter(r => r.hosting === 'aiapp');
    return rows;
  }, [activeTab]);

  // Compute unique values for filter dropdowns
  const filterOptions = React.useMemo(() => ({
    riskLevel: [...new Set(tabFilteredRows.map(r => r.riskLevel))].sort(),
    status: [...new Set(tabFilteredRows.map(r => r.status))].sort(),
    platform: [...new Set(tabFilteredRows.map(r => r.platform || 'Unknown'))].sort(),
    riskTypes: [...new Set(tabFilteredRows.flatMap(r => r.riskType.split(', ')))].filter(t => t !== 'No data available').sort(),
    userName: [...new Set(tabFilteredRows.map(r => r.userName).filter(Boolean))].sort() as string[],
    device: [...new Set(tabFilteredRows.map(r => r.device).filter(Boolean))].sort() as string[],
  }), [tabFilteredRows]);

  const filteredRows = React.useMemo(() => {
    return tabFilteredRows.filter(r => {
      if (filters.riskLevel !== 'Any' && r.riskLevel !== filters.riskLevel) return false;
      if (filters.status !== 'Any' && r.status !== filters.status) return false;
      if (filters.platform !== 'Any' && (r.platform || 'Unknown') !== filters.platform) return false;
      if (filters.riskTypes !== 'Any' && !r.riskType.includes(filters.riskTypes)) return false;
      if (filters.userName !== 'Any' && r.userName !== filters.userName) return false;
      if (filters.device !== 'Any' && r.device !== filters.device) return false;
      return true;
    });
  }, [tabFilteredRows, filters]);

  const sortedRows = React.useMemo(() => {
    const data = [...filteredRows];
    if (!sortConfig) return data;
    return data.sort((a, b) => {
      const aVal = a[sortConfig.col]; const bVal = b[sortConfig.col];
      if (sortConfig.col === 'riskLevel') {
        const o: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0 };
        return sortConfig.dir === 'asc' ? (o[aVal as string] || 0) - (o[bVal as string] || 0) : (o[bVal as string] || 0) - (o[aVal as string] || 0);
      }
      if (sortConfig.col === 'sensitiveActivityTrend') {
        const aS = Array.isArray(aVal) ? (aVal as number[]).reduce((x, y) => x + y, 0) : 0;
        const bS = Array.isArray(bVal) ? (bVal as number[]).reduce((x, y) => x + y, 0) : 0;
        return sortConfig.dir === 'asc' ? aS - bS : bS - aS;
      }
      if (aVal === bVal) return 0;
      if (aVal == null) return 1; if (bVal == null) return -1;
      return sortConfig.dir === 'asc' ? (aVal < bVal ? -1 : 1) : (aVal < bVal ? 1 : -1);
    });
  }, [sortConfig, filteredRows]);

  // Group by platform, user, or device
  const groups = React.useMemo(() => {
    if (groupBy === 'none') return null;
    const map = new Map<string, AgentRow[]>();
    sortedRows.forEach(r => {
      let key: string;
      if (groupBy === 'platform') key = r.platform || 'Unknown';
      else if (groupBy === 'user') key = r.userName || r.name;
      else key = r.device || '—';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [sortedRows, groupBy]);

  const handleSort = (col: keyof AgentRow) => {
    setSortConfig(c => c?.col === col ? { col, dir: c.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'desc' });
  };

  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());

  const toggleGroup = (platform: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform); else next.add(platform);
      return next;
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== 'Any').length;

  const columns = activeTab === 'devices' ? localColumns : cloudColumns;

  const renderHeader = () => (
    <thead className="bg-white border-b border-gray-200 text-[#242424] font-normal text-sm">
      <tr>
        {columns.map(col => (
          <th key={col.key} onClick={() => handleSort(col.key as keyof AgentRow)} className={`px-6 py-4 font-normal cursor-pointer hover:bg-gray-50 bg-white group select-none ${(col as any).w || ''}`}>
            <div className="flex items-center gap-1">
              {col.label}
              {(col as any).tooltip && (
                <div className="ml-1 cursor-help text-[#616161]" title={(col as any).tooltip}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7.5v3.5M8 4.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
              )}
              {sortConfig?.col === col.key && <span className="text-[12px] text-[#616161] font-light">{sortConfig.dir === 'asc' ? '↑' : '↓'}</span>}
              <span className={`text-[10px] text-[#616161] ml-0.5 font-light ${sortConfig?.col === col.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>∨</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="bg-white rounded-none border-t border-gray-200 mt-4 font-sans">
      {/* Filters Bar */}
      <div className="flex items-center px-6 py-3 gap-2 border-b border-gray-100 text-[13px] bg-white flex-wrap">
        <span className="text-[#616161] mr-2">Filters:</span>
        <FilterPill label="Risk level" value={filters.riskLevel} options={filterOptions.riskLevel} onChange={v => setFilters(f => ({ ...f, riskLevel: v }))} />
        <FilterPill label="Status" value={filters.status} options={filterOptions.status} onChange={v => setFilters(f => ({ ...f, status: v }))} />
        <FilterPill label="Platform" value={filters.platform} options={filterOptions.platform} onChange={v => setFilters(f => ({ ...f, platform: v }))} />
        <FilterPill label="Risk types" value={filters.riskTypes} options={filterOptions.riskTypes} onChange={v => setFilters(f => ({ ...f, riskTypes: v }))} />
        {filterOptions.userName.length > 0 && activeTab === 'devices' && (
          <FilterPill label="Used by" value={filters.userName} options={filterOptions.userName} onChange={v => setFilters(f => ({ ...f, userName: v }))} />
        )}
        {filterOptions.device.length > 0 && activeTab === 'devices' && (
          <FilterPill label="Device" value={filters.device} options={filterOptions.device} onChange={v => setFilters(f => ({ ...f, device: v }))} />
        )}
        {activeFilterCount > 0 && (
          <button onClick={() => setFilters({ riskLevel: 'Any', status: 'Any', platform: 'Any', riskTypes: 'Any', userName: 'Any', device: 'Any' })} className="text-[#C50F1F] flex items-center gap-1 ml-2 font-medium text-[13px]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {groups ? (
          // Grouped view
          <div>
            {groups.map(([platform, agentRows]) => {
              const isCollapsed = collapsedGroups.has(platform);
              return (
                <div key={platform}>
                  <div
                    onClick={() => toggleGroup(platform)}
                    className="px-6 py-3 bg-[#FAFAFA] border-b border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-[#F0F0F0] select-none"
                  >
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`transition-transform duration-150 ${isCollapsed ? '' : 'rotate-90'}`}
                    >
                      <path d="M4 2l4 4-4 4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M5 3v10M2 7h12"/></svg>
                    <span className="text-[14px] font-semibold text-[#242424]">{platform}</span>
                    <span className="text-[13px] text-[#616161]">({agentRows.length})</span>
                  </div>
                  {!isCollapsed && (
                    <table className="w-full text-left text-[14px] text-[#242424] min-w-[1200px]">
                      {renderHeader()}
                      <tbody className="divide-y divide-gray-100">
                        {agentRows.map((row, i) => <AgentRow_ key={i} row={row} navigate={navigate} tab={activeTab} columns={columns} />)}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Flat view
          <table className="w-full text-left text-[14px] text-[#242424] min-w-[1200px]">
            {renderHeader()}
            <tbody className="divide-y divide-gray-100">
              {sortedRows.map((row, i) => <AgentRow_ key={i} row={row} navigate={navigate} tab={activeTab} columns={columns} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
