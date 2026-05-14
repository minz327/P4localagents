import React from 'react'
import { useNavigate } from 'react-router-dom'
import { rows, AgentRow } from '../../lib/agentsData'
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
  Toolbar,
  ToolbarButton,
} from '@fluentui/react-components'
import { ArrowSyncRegular, ArrowDownloadRegular } from '@fluentui/react-icons'

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
        {appIcon === 'm365copilot' && <svg width="32" height="32" viewBox="0 0 20 17.5" fill="none"><path d="M4.64517 0.989724C4.44456 0.398066 3.88926 0 3.26452 0L2.36398 0C1.66288 0 1.06107 0.499046 0.931308 1.18803L0 6.13282L0.46302 4.54883C0.644723 3.92722 1.21471 3.5 1.86233 3.5L4.7411 3.5L5.9856 5.12858L7.09359 3.5L6.5414 3.5C5.91666 3.5 5.36136 3.10193 5.16075 2.51027L4.64517 0.989724Z" fill="url(#m365a)" transform="translate(10.71, 0.09) scale(1.25)"/><path d="M2.43277 4.86887C2.63136 5.46393 3.18834 5.86523 3.81567 5.86523H5.2819C6.07767 5.86523 6.72643 5.2271 6.73956 4.43143L6.8127 0L6.42736 1.31681C6.24552 1.93821 5.67564 2.36523 5.02818 2.36523L2.13826 2.36523L0.90791 1.27989L0 2.36523H0.546876C1.1742 2.36523 1.73118 2.76654 1.92977 3.3616L2.43277 4.86887Z" fill="url(#m365b)" transform="translate(0.85, 8.93) scale(1.25)"/><g transform="translate(0, 2.19) scale(1.25)"><path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#m365c)"/><path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#m365c2)"/></g><g transform="translate(7.5, 4.69) scale(1.25)"><path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#m365d)"/><path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#m365d2)"/></g><defs><radialGradient id="m365a" cx="0" cy="0" r="1" gradientTransform="matrix(-4.02 -5 -4.34 4.2 6.06 6.17)" gradientUnits="userSpaceOnUse"><stop offset="0.096" stopColor="#00AEFF"/><stop offset="0.773" stopColor="#2253CE"/><stop offset="1" stopColor="#0736C4"/></radialGradient><radialGradient id="m365b" cx="0" cy="0" r="1" gradientTransform="matrix(3.56 4.42 4.21 -3.61 1.24 1.93)" gradientUnits="userSpaceOnUse"><stop stopColor="#FFB657"/><stop offset="0.634" stopColor="#FF5F3D"/><stop offset="0.923" stopColor="#C02B3C"/></radialGradient><radialGradient id="m365c" cx="0" cy="0" r="1" gradientTransform="matrix(-0.53 -9.31 52.28 -2.97 4.02 10.5)" gradientUnits="userSpaceOnUse"><stop offset="0.03" stopColor="#FFC800"/><stop offset="0.31" stopColor="#98BD42"/><stop offset="0.49" stopColor="#52B471"/><stop offset="0.844" stopColor="#0D91E1"/></radialGradient><linearGradient id="m365c2" x1="4.55" y1="0" x2="5" y2="10.5" gradientUnits="userSpaceOnUse"><stop stopColor="#3DCBFF"/><stop offset="0.247" stopColor="#0588F7" stopOpacity="0"/></linearGradient><radialGradient id="m365d" cx="0" cy="0" r="1" gradientTransform="matrix(-4.61 13.17 -15.68 -5.81 8.3 -1.03)" gradientUnits="userSpaceOnUse"><stop offset="0.066" stopColor="#8C48FF"/><stop offset="0.5" stopColor="#F2598A"/><stop offset="0.896" stopColor="#FFB152"/></radialGradient><linearGradient id="m365d2" x1="8.76" y1="-0.64" x2="8.75" y2="2.22" gradientUnits="userSpaceOnUse"><stop offset="0.058" stopColor="#F8ADFA"/><stop offset="0.708" stopColor="#A86EDD" stopOpacity="0"/></linearGradient></defs></svg>}
        {appIcon === 'excel' && <div className="w-8 h-8 bg-[#107C10] rounded flex items-center justify-center text-white font-bold text-xs">X</div>}
        {appIcon === 'teams' && <div className="w-8 h-8 bg-[#464EB8] rounded flex items-center justify-center"><span className="text-white font-bold text-xs">T</span></div>}
        {appIcon === 'slack' && <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 15a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#E01E5A"/><path d="M6 15v2.5a2.5 2.5 0 1 1-5 0V15h5z" fill="#E01E5A"/><path d="M9 15a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#36C5F0"/><path d="M9 15V9a2.5 2.5 0 0 1 5 0v6H9z" fill="#36C5F0"/><path d="M9 6a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#2EB67D"/><path d="M9 6H6.5a2.5 2.5 0 1 1 0 5H9V6z" fill="#2EB67D"/><path d="M15 9a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#ECB22E"/><path d="M15 9v-2.5a2.5 2.5 0 1 1 5 0V9h-5z" fill="#ECB22E"/></svg></div>}
        {appIcon === 'salesforce' && <div className="w-8 h-8 flex items-center justify-center"><svg viewBox="0 0 24 24" width="28" height="28" fill="#00A1E0"><path d="M16.1 11c.5 0 .9-.3 1-.8.2-1.1 1.2-1.9 2.4-1.9.7 0 1.3.3 1.8.7.4.4.9.4 1.3.1.2-.2.3-.5.2-.8-.8-1.5-2.4-2.4-4.1-2.4-.7 0-1.4.2-2 .5-.2-.8-.7-1.5-1.4-2-1.1-.8-2.5-.9-3.7-.3C10.7 2.4 9 1.7 7.2 2.5c-1.6.7-2.6 2.3-2.6 4.1 0 .2 0 .5.1.7-1.6.4-2.8 1.8-2.8 3.5 0 2 1.6 3.6 3.6 3.6h10.6c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5c0 .1 0 .1 0 .1zm-3.5 5.2c-.3.3-.8.3-1.1 0L9.4 14c-.2-.2-.2-.5 0-.7s.5-.2.7 0l1.2 1.2 2.8-2.8c.2-.2.5-.2.7 0s.2.5 0 .7l-3.2 3.2z"/></svg></div>}
        {appIcon === 'chatgpt' && <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10A37F"/></svg></div>}
        {appIcon === 'fabric' && <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center"><svg width="28" height="28" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="fabricGrad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#86E0B1"/><stop offset="100%" stopColor="#34D399"/></linearGradient><linearGradient id="fabricGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5EC4A0"/><stop offset="100%" stopColor="#1A8A6A"/></linearGradient><linearGradient id="fabricGrad3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2BA882"/><stop offset="100%" stopColor="#0E6B55"/></linearGradient></defs><path d="M10 8h14c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H14l-4-6z" fill="url(#fabricGrad1)"/><path d="M10 8L14 14l-4 6V8z" fill="url(#fabricGrad2)"/><path d="M10 20l4-6v12l-4-6z" fill="url(#fabricGrad3)"/><path d="M14 14h-4l4 6V14z" fill="url(#fabricGrad2)" opacity="0.7"/></svg></div>}
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
function getCloudColumns(navigate: (path: string) => void): TableColumnDefinition<AgentRow>[] {
  return [
    createTableColumn<AgentRow>({
      columnId: 'name',
      renderHeaderCell: () => 'Name',
      renderCell: (item) => (
        <TableCellLayout truncate>
          <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => navigate(`/marpar-local-agents/agents/${item.agentId}`)}>
            <AppIcon type={item.type} initials={item.initials} icon={item.icon} platform={item.platform} />
            <span className="font-semibold text-[#242424] truncate">{item.name}</span>
          </div>
        </TableCellLayout>
      ),
      compare: (a, b) => a.name.localeCompare(b.name),
    }),
    createTableColumn<AgentRow>({
      columnId: 'platform',
      renderHeaderCell: () => 'Platform',
      renderCell: (item) => <TableCellLayout truncate><span className="text-[#242424] text-[13px] truncate">{item.platform || '\u2014'}</span></TableCellLayout>,
      compare: (a, b) => (a.platform || '').localeCompare(b.platform || ''),
    }),
    createTableColumn<AgentRow>({
      columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: (item) => (
        <TableCellLayout truncate>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={item.status === 'Active' ? '#107C10' : '#616161'}><circle cx="12" cy="12" r="10"/><path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span className="text-[#242424]">{item.status}</span>
          </div>
        </TableCellLayout>
      ),
      compare: (a, b) => a.status.localeCompare(b.status),
    }),
    createTableColumn<AgentRow>({
      columnId: 'agentId',
      renderHeaderCell: () => 'Agent ID',
      renderCell: (item) => <TableCellLayout truncate><span className="text-[#616161] truncate font-normal text-[13px] tracking-tight" title={item.agentId}>{item.agentId}</span></TableCellLayout>,
      compare: (a, b) => a.agentId.localeCompare(b.agentId),
    }),
    createTableColumn<AgentRow>({
      columnId: 'riskLevel',
      renderHeaderCell: () => 'Risk level',
      renderCell: (item) => <TableCellLayout truncate><RiskLevel level={item.riskLevel} /></TableCellLayout>,
      compare: (a, b) => {
        const o: Record<string, number> = { High: 3, Medium: 2, Low: 1, None: 0 };
        return (o[a.riskLevel] || 0) - (o[b.riskLevel] || 0);
      },
    }),
    createTableColumn<AgentRow>({
      columnId: 'riskType',
      renderHeaderCell: () => 'Risk types',
      renderCell: (item) => <TableCellLayout truncate><span className={`text-[13px] truncate ${item.riskType === 'No data available' ? 'text-[#616161]' : 'text-[#242424]'}`}>{item.riskType}</span></TableCellLayout>,
      compare: (a, b) => a.riskType.localeCompare(b.riskType),
    }),
    createTableColumn<AgentRow>({
      columnId: 'sensitiveActivityTrend',
      renderHeaderCell: () => 'Risk activity trend',
      renderCell: (item) => <TableCellLayout truncate>{item.sensitiveActivityTrend ? <Sparkline data={item.sensitiveActivityTrend} /> : <span className="text-[#616161] text-[13px]">No data available</span>}</TableCellLayout>,
      compare: (a, b) => {
        const aS = a.sensitiveActivityTrend ? a.sensitiveActivityTrend.reduce((x, y) => x + y, 0) : 0;
        const bS = b.sensitiveActivityTrend ? b.sensitiveActivityTrend.reduce((x, y) => x + y, 0) : 0;
        return aS - bS;
      },
    }),
    createTableColumn<AgentRow>({
      columnId: 'dataProtection',
      renderHeaderCell: () => 'Policies',
      renderCell: (item) => <TableCellLayout truncate><PoliciesCell row={item} /></TableCellLayout>,
      compare: (a, b) => {
        const aT = (parseInt(a.dataProtection) || 0) + (parseInt(a.dataCompliance) || 0);
        const bT = (parseInt(b.dataProtection) || 0) + (parseInt(b.dataCompliance) || 0);
        return aT - bT;
      },
    }),
  ];
}

function getLocalColumns(navigate: (path: string) => void): TableColumnDefinition<AgentRow>[] {
  return [
    createTableColumn<AgentRow>({
      columnId: 'platform',
      renderHeaderCell: () => 'Agent type',
      renderCell: (item) => (
        <TableCellLayout truncate>
          <div className="flex items-center gap-2 cursor-pointer min-w-0" onClick={() => navigate(`/marpar-local-agents/agents/${item.agentId}`)}>
            <AppIcon type={item.type} initials={item.initials} icon={item.icon} platform={item.platform} />
            <span className="text-[#242424] text-[13px] truncate">{item.platform}</span>
          </div>
        </TableCellLayout>
      ),
      compare: (a, b) => (a.platform || '').localeCompare(b.platform || ''),
    }),
    createTableColumn<AgentRow>({
      columnId: 'userName',
      renderHeaderCell: () => 'Used by',
      renderCell: (item) => (
        <TableCellLayout truncate>
          {item.userName ? (
            <div className="flex items-center min-w-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 border-2 border-white" style={{ backgroundColor: '#FFF4CE', color: '#785C34' }}>{item.initials || 'U'}</div>
              <span className="text-[#242424] text-[13px] ml-2 truncate">{item.userName}</span>
            </div>
          ) : item.hosting === 'cloud' ? (
            <CloudFacepile seed={item.agentId.charCodeAt(0) + item.agentId.charCodeAt(item.agentId.length - 1)} />
          ) : null}
        </TableCellLayout>
      ),
      compare: (a, b) => (a.userName || '').localeCompare(b.userName || ''),
    }),
    createTableColumn<AgentRow>({
      columnId: 'device',
      renderHeaderCell: () => 'Device',
      renderCell: (item) => <TableCellLayout truncate><span className="text-[#242424] text-[13px] truncate">{item.device || ''}</span></TableCellLayout>,
      compare: (a, b) => (a.device || '').localeCompare(b.device || ''),
    }),
    createTableColumn<AgentRow>({
      columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: (item) => (
        <TableCellLayout truncate>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={item.status === 'Active' ? '#107C10' : '#616161'}><circle cx="12" cy="12" r="10"/><path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            <span className="text-[#242424]">{item.status}</span>
          </div>
        </TableCellLayout>
      ),
      compare: (a, b) => a.status.localeCompare(b.status),
    }),
    createTableColumn<AgentRow>({
      columnId: 'agentId',
      renderHeaderCell: () => 'Agent ID',
      renderCell: (item) => <TableCellLayout truncate><span className="text-[#616161] truncate font-normal text-[13px] tracking-tight" title={item.agentId}>{item.agentId}</span></TableCellLayout>,
      compare: (a, b) => a.agentId.localeCompare(b.agentId),
    }),
    createTableColumn<AgentRow>({
      columnId: 'riskLevel',
      renderHeaderCell: () => 'Risk level',
      renderCell: (item) => <TableCellLayout truncate><RiskLevel level={item.riskLevel} /></TableCellLayout>,
      compare: (a, b) => {
        const o: Record<string, number> = { High: 3, Medium: 2, Low: 1, None: 0 };
        return (o[a.riskLevel] || 0) - (o[b.riskLevel] || 0);
      },
    }),
    createTableColumn<AgentRow>({
      columnId: 'riskType',
      renderHeaderCell: () => 'Risk types',
      renderCell: (item) => <TableCellLayout truncate><span className={`text-[13px] truncate ${item.riskType === 'No data available' ? 'text-[#616161]' : 'text-[#242424]'}`}>{item.riskType}</span></TableCellLayout>,
      compare: (a, b) => a.riskType.localeCompare(b.riskType),
    }),
    createTableColumn<AgentRow>({
      columnId: 'sensitiveActivityTrend',
      renderHeaderCell: () => 'Risk activity trend',
      renderCell: (item) => <TableCellLayout truncate>{item.sensitiveActivityTrend ? <Sparkline data={item.sensitiveActivityTrend} /> : <span className="text-[#616161] text-[13px]">No data available</span>}</TableCellLayout>,
      compare: (a, b) => {
        const aS = a.sensitiveActivityTrend ? a.sensitiveActivityTrend.reduce((x, y) => x + y, 0) : 0;
        const bS = b.sensitiveActivityTrend ? b.sensitiveActivityTrend.reduce((x, y) => x + y, 0) : 0;
        return aS - bS;
      },
    }),
    createTableColumn<AgentRow>({
      columnId: 'dataProtection',
      renderHeaderCell: () => 'Policies',
      renderCell: (item) => <TableCellLayout truncate><PoliciesCell row={item} /></TableCellLayout>,
      compare: (a, b) => {
        const aT = (parseInt(a.dataProtection) || 0) + (parseInt(a.dataCompliance) || 0);
        const bT = (parseInt(b.dataProtection) || 0) + (parseInt(b.dataCompliance) || 0);
        return aT - bT;
      },
    }),
  ];
}

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
  // Legacy component — no longer used, kept for reference
  return null;
}

export default function MarparAgentsAgents({ activeTab = 'cloud', groupBy = 'none', externalFilter }: { activeTab?: 'cloud' | 'devices' | 'aiapps'; groupBy?: 'none' | 'platform' | 'user' | 'device'; externalFilter?: { definitionId: string; kind: string; selectedOptionId?: string | null; selectedOptionIds?: string[] } | null }) {
  const navigate = useNavigate()
  const [filterSelections, setFilterSelections] = React.useState<any[]>([]);
  const [savedFilterSets, setSavedFilterSets] = React.useState<{ id: string; name: string; selections: any[] }[]>([]);
  const [selectedFilterSet, setSelectedFilterSet] = React.useState<string | undefined>(undefined);

  const tabFilteredRows = React.useMemo(() => {
    if (activeTab === 'cloud') return rows.filter(r => r.hosting === 'cloud');
    if (activeTab === 'devices') return rows.filter(r => r.hosting === 'local');
    if (activeTab === 'aiapps') return rows.filter(r => r.hosting === 'aiapp');
    return rows;
  }, [activeTab]);

  // Build InPageFilter definitions from data
  const filterDefinitions = React.useMemo(() => {
    const riskLevels = [...new Set(tabFilteredRows.map(r => r.riskLevel))].sort();
    const statuses = [...new Set(tabFilteredRows.map(r => r.status))].sort();
    const platforms = [...new Set(tabFilteredRows.map(r => r.platform || 'Unknown'))].sort();
    const riskTypes = [...new Set(tabFilteredRows.flatMap(r => r.riskType.split(', ')))].filter(t => t !== 'No data available').sort();

    const defs: any[] = [
      {
        kind: 'single-select' as const,
        id: 'riskLevel',
        title: 'Risk level',
        initialOptions: riskLevels.map(r => ({ id: r, text: r })),
      },
      {
        kind: 'single-select' as const,
        id: 'status',
        title: 'Status',
        initialOptions: statuses.map(s => ({ id: s, text: s })),
      },
      {
        kind: 'single-select' as const,
        id: 'platform',
        title: activeTab === 'devices' ? 'Agent type' : 'Platform',
        initialOptions: platforms.map(p => ({ id: p, text: p })),
      },
      {
        kind: 'multi-select' as const,
        id: 'riskTypes',
        title: 'Risk types',
        initialOptions: riskTypes.map(r => ({ id: r, text: r })),
      },
    ];

    if (activeTab === 'devices') {
      const userNames = [...new Set(tabFilteredRows.map(r => r.userName).filter(Boolean))].sort() as string[];
      const devices = [...new Set(tabFilteredRows.map(r => r.device).filter(Boolean))].sort() as string[];
      if (userNames.length > 0) {
        defs.push({
          kind: 'single-select' as const,
          id: 'userName',
          title: 'Used by',
          initialOptions: userNames.map(u => ({ id: u, text: u })),
        });
      }
      if (devices.length > 0) {
        defs.push({
          kind: 'single-select' as const,
          id: 'device',
          title: 'Device',
          initialOptions: devices.map(d => ({ id: d, text: d })),
        });
      }
    }

    return defs;
  }, [tabFilteredRows, activeTab]);

  // Reset selections when tab changes
  React.useEffect(() => {
    setFilterSelections([]);
  }, [activeTab]);

  // Apply external filter from metric card clicks
  React.useEffect(() => {
    if (externalFilter) {
      setFilterSelections([externalFilter]);
    }
  }, [externalFilter]);

  // Filter rows based on InPageFilter selections
  const filteredRows = React.useMemo(() => {
    if (filterSelections.length === 0) return tabFilteredRows;

    return tabFilteredRows.filter(r => {
      for (const sel of filterSelections) {
        const id = sel.definitionId;
        if (id === 'riskLevel' && sel.selectedOptionId && r.riskLevel !== sel.selectedOptionId) return false;
        if (id === 'status' && sel.selectedOptionId && r.status !== sel.selectedOptionId) return false;
        if (id === 'platform' && sel.selectedOptionId && (r.platform || 'Unknown') !== sel.selectedOptionId) return false;
        if (id === 'riskTypes' && sel.selectedOptionIds?.length > 0 && !sel.selectedOptionIds.some((optId: string) => r.riskType.includes(optId))) return false;
        if (id === 'userName' && sel.selectedOptionId && r.userName !== sel.selectedOptionId) return false;
        if (id === 'device' && sel.selectedOptionId && r.device !== sel.selectedOptionId) return false;
      }
      return true;
    });
  }, [tabFilteredRows, filterSelections]);

  const columns = React.useMemo(
    () => activeTab === 'devices' ? getLocalColumns(navigate) : getCloudColumns(navigate),
    [activeTab, navigate]
  );

  return (
    <div className="bg-white rounded-none border-t border-gray-200 mt-4 font-sans w-full">
      <FluentProvider theme={webLightTheme} style={{ width: '100%' }}>
        <CompositeDataGrid
          style={{ width: '100%' }}
          inPageFilter={{
            filterDefinitions,
            selections: filterSelections,
            onSelectionsChange: setFilterSelections,
            savedFilterSets,
            onSavedFilterSetsChange: setSavedFilterSets,
            selectedFilterSet,
            onSelectedFilterSetChange: setSelectedFilterSet,
            defaultFiltersExpanded: true,
            filterApplyButton: 'Apply',
            filterClearButton: 'Clear',
            filterCancelButton: 'Cancel',
            filterSet: {
              noFilterSetSelectionLabel: 'No filter set selected',
              saveItems: [
                { children: 'Save as new filter set', onClick: () => {
                  const name = `Filter set ${savedFilterSets.length + 1}`;
                  const newSet = { id: `set-${Date.now()}`, name, selections: [...filterSelections] };
                  setSavedFilterSets(prev => [...prev, newSet]);
                  setSelectedFilterSet(newSet.id);
                }},
                { children: 'Save to current filter set', disabled: !selectedFilterSet, onClick: () => {
                  if (!selectedFilterSet) return;
                  setSavedFilterSets(prev => prev.map(s => s.id === selectedFilterSet ? { ...s, selections: [...filterSelections] } : s));
                }},
              ],
              save: { primaryActionButton: { 'aria-label': 'Save filters' } },
            },
            filterBar: {
              showMoreFiltersText: (n: number) => `+${n} more`,
              showLessFiltersText: () => '',
              allFiltersAppliedText: (n: number) => `${n} filters applied`,
              filterOverflowButton: null,
              resetButton: { children: 'Reset' },
              actionsOverflowButton: { 'aria-label': 'More filter actions' },
              addFilter: {
                addFilterButton: 'Add filter',
                addButton: 'Add',
                cancelButton: 'Cancel',
                backButton: 'Back',
                clearButton: 'Clear all',
                heading: 'Add a filter',
                searchBox: null,
              },
            },
          }}
          toolbar={{
            children: (
              <>
                <ToolbarButton appearance="subtle" icon={<ArrowSyncRegular />}>
                  Refresh
                </ToolbarButton>
                <ToolbarButton appearance="subtle" icon={<ArrowDownloadRegular />}>
                  Export
                </ToolbarButton>
              </>
            ),
          }}
          dataGrid={{
            items: filteredRows,
            columns,
            sortable: true,
            defaultSortState: { sortColumn: 'riskLevel', sortDirection: 'descending' },
            containerSizing: 'fill',
            resizableColumnsOptions: {},
            containerSizing: 'fill',
            resizableColumnsOptions: { autoFitColumns: true },
            columnSizingOptions: {
              name: { idealWidth: 220, minWidth: 150 },
              platform: { idealWidth: 160, minWidth: 100 },
              status: { idealWidth: 80, minWidth: 70 },
              agentId: { idealWidth: 200, minWidth: 120 },
              riskLevel: { idealWidth: 90, minWidth: 80 },
              riskType: { idealWidth: 120, minWidth: 90 },
              sensitiveActivityTrend: { idealWidth: 140, minWidth: 100 },
              dataProtection: { idealWidth: 75, minWidth: 60 },
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
                <DataGridBody<AgentRow>>
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
  )
}
