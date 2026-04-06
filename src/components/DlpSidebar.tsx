import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldPerson20Regular } from '@fluentui/react-icons'
import {
  HomeIcon,
  SolutionsIcon,
  AgentsIcon,
  LearnIcon,
  UsageCenterIcon,
  SettingsIcon,
  DSPMIcon,
  DLPIcon,
} from './SidebarIcons'

const InsiderRiskIcon = () => <ShieldPerson20Regular style={{ fontSize: 20 }} />

// ── DLP-specific sidebar icons ───────────────────────────────────

const OverviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
  </svg>
)

const PoliciesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
  </svg>
)

const RecommendationsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
)

const AlertsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#D83B01">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
)

const ClassifiersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const ExplorersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
)

const DiagnosticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

const PostureReportsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
)

const DSIIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6" /><path d="M8 11h6" />
  </svg>
)

const InfoProtectionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IRMIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><path d="M12 11l-2 4h4l-2 4" />
  </svg>
)

// ── Left rail item ───────────────────────────────────────────────

function LeftRailItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center py-3 cursor-pointer group relative ${active ? 'text-[#0078D4]' : 'text-[#616161] hover:text-[#242424]'}`}>
      {active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#0078D4] rounded-r" />}
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] text-center leading-3 px-1">{label}</span>
    </div>
  )
}

// ── Secondary nav item ───────────────────────────────────────────

function SecondaryNavItem({ label, active, icon, indent, onClick, hasChevron }: { label: string; active?: boolean; icon?: React.ReactNode; indent?: boolean; onClick?: () => void; hasChevron?: boolean }) {
  return (
    <div onClick={onClick} className={`relative flex items-center h-9 px-4 cursor-pointer text-[14px] ${active ? 'bg-[#EFF6FC] text-[#0078D4] font-semibold' : 'text-[#242424] hover:bg-[#F5F5F5]'}`}>
      {active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#0078D4] rounded-r" />}
      {icon && <span className="mr-3 text-[#616161]">{icon}</span>}
      <span className={indent ? 'ml-8' : ''}>{label}</span>
      {hasChevron && (
        <span className="ml-auto text-[#616161]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      )}
    </div>
  )
}

// ── Collapsible section ──────────────────────────────────────────

function CollapsibleSection({ title, icon, children, defaultOpen = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <div
        className="flex items-center px-4 h-9 cursor-pointer hover:bg-[#F5F5F5] text-[#242424] select-none"
        onClick={() => setOpen(!open)}
      >
        {icon && <span className="mr-3 text-[#616161]">{icon}</span>}
        <span className="text-[14px]">{title}</span>
        <span className={`ml-auto transition-transform text-[#616161] ${open ? 'rotate-180' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}

// ── Main DlpSidebar component ────────────────────────────────────

export default function DlpSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isAlerts = location.pathname.includes('/dlp/alerts')

  return (
    <div className="flex h-full">
      {/* Primary Rail — same as main sidebar */}
      <div className="w-[72px] bg-[#F0F0F0] border-r border-[#E0E0E0] flex flex-col items-center py-2 overflow-y-auto scrollbar-hide">
        <div className="mb-2">
          <HomeIcon />
          <div className="text-[10px] text-center mt-1 text-[#616161]">Home</div>
        </div>

        <div className="w-8 h-px bg-[#E0E0E0] my-1" />

        <LeftRailItem icon={<SolutionsIcon />} label="Solutions" />
        <LeftRailItem icon={<AgentsIcon />} label="Agents" />
        <LeftRailItem icon={<LearnIcon />} label="Learn" />
        <LeftRailItem icon={<UsageCenterIcon />} label="Usage center (preview)" />
        <LeftRailItem icon={<SettingsIcon />} label="Settings" />

        <div className="w-8 h-px bg-[#E0E0E0] my-1" />

        <LeftRailItem icon={<InsiderRiskIcon />} label="Insider Risk Managem..." />
        <LeftRailItem icon={<DLPIcon />} label="Data Loss Prevention" active />
        <LeftRailItem icon={<DSPMIcon />} label="DSPM (preview)" onClick={() => navigate('/eastman')} />
      </div>

      {/* Secondary Navigation — DLP-specific */}
      <div
        className={`bg-[#FAF9F8] border-r border-[#E0E0E0] flex flex-col transition-all duration-200 ease-in-out overflow-hidden ${
          collapsed ? 'w-0 border-r-0' : 'w-[260px]'
        }`}
      >
        {/* Header */}
        <div className="h-12 flex items-center px-4 border-b border-[#EDEBE9] min-w-[260px]">
          <div className="flex items-center gap-2 flex-1">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#dlp-hdr)"><path d="M17 2V9C17 10.6569 18.3431 12 20 12H27V27C27 28.6569 25.6569 30 24 30H16.4649C16.8052 29.4117 17 28.7286 17 28V22C17 20.1076 15.6859 18.5221 13.9204 18.1064C13.4991 15.7714 11.4564 14 9 14C7.3644 14 5.91223 14.7853 5 15.9995V5C5 3.34315 6.34315 2 8 2H17ZM19 2.11664V9C19 9.55229 19.4477 10 20 10H26.8834C26.7442 9.51572 26.484 9.06977 26.1213 8.70711L20.2929 2.87868C19.9302 2.51602 19.4843 2.2558 19 2.11664ZM5.5 19.5H5C3.61929 19.5 2.5 20.6193 2.5 22V28C2.5 29.3807 3.61929 30.5 5 30.5H13C14.3807 30.5 15.5 29.3807 15.5 28V22C15.5 20.6193 14.3807 19.5 13 19.5H12.5V19C12.5 17.067 10.933 15.5 9 15.5C7.067 15.5 5.5 17.067 5.5 19V19.5ZM7.5 19C7.5 18.1716 8.17157 17.5 9 17.5C9.82843 17.5 10.5 18.1716 10.5 19V19.5H7.5V19ZM11 25C11 26.1046 10.1046 27 9 27C7.89543 27 7 26.1046 7 25C7 23.8954 7.89543 23 9 23C10.1046 23 11 23.8954 11 25Z" fill="url(#dlp-hdr-grad)"/></g><defs><linearGradient id="dlp-hdr-grad" x1="14.75" y1="2" x2="14.75" y2="30.5" gradientUnits="userSpaceOnUse"><stop offset="0.296875" stopColor="#2886DE"/><stop offset="1" stopColor="#316BAA"/></linearGradient><clipPath id="dlp-hdr"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
            <span className="font-semibold text-[16px] text-[#242424] whitespace-nowrap">Data Loss Prevention</span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded hover:bg-[#E0E0E0] text-[#616161] hover:text-[#242424] transition-colors shrink-0"
            title="Collapse navigation"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2 min-w-[260px]">
          <SecondaryNavItem label="Overview" icon={<OverviewIcon />} />
          <SecondaryNavItem label="Policies" icon={<PoliciesIcon />} />
          <SecondaryNavItem label="Recommendations" icon={<RecommendationsIcon />} />
          <SecondaryNavItem
            label="Alerts"
            icon={<AlertsIcon />}
            active={isAlerts}
            onClick={() => navigate('/dlp/alerts')}
          />

          <CollapsibleSection title="Classifiers" icon={<ClassifiersIcon />}>
            <SecondaryNavItem label="Trainable classifiers" indent />
            <SecondaryNavItem label="Exact data matches" indent />
            <SecondaryNavItem label="Sensitive info types" indent />
          </CollapsibleSection>

          <CollapsibleSection title="Explorers" icon={<ExplorersIcon />}>
            <SecondaryNavItem label="Activity explorer" indent />
            <SecondaryNavItem label="Content explorer" indent />
          </CollapsibleSection>

          <SecondaryNavItem label="Diagnostics" icon={<DiagnosticsIcon />} />
          <SecondaryNavItem label="Posture reports" icon={<PostureReportsIcon />} />

          {/* Separator */}
          <div className="my-3 mx-4 border-t border-[#E0E0E0]" />

          {/* Related solutions */}
          <div className="px-4 mb-2">
            <span className="text-[13px] font-semibold text-[#242424]">Related solutions</span>
          </div>
          <SecondaryNavItem label="Data Security Investigations" icon={<DSIIcon />} />
          <SecondaryNavItem label="Information Protection" icon={<InfoProtectionIcon />} />
          <SecondaryNavItem label="Insider Risk Management" icon={<IRMIcon />} />
        </div>
      </div>

      {/* Expand button — shown when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="h-12 w-6 flex items-center justify-center bg-[#FAF9F8] border-r border-[#E0E0E0] hover:bg-[#EDEBE9] text-[#616161] hover:text-[#242424] transition-colors shrink-0 cursor-pointer"
          title="Expand navigation"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
