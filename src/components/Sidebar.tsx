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
  PostureIcon,
  ObjectivesIcon,
  AIObservabilityIcon,
  TasksIcon,
  ReportsIcon
} from './SidebarIcons'

const InsiderRiskIcon = () => <ShieldPerson20Regular style={{ fontSize: 20 }} />

function LeftRailItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center py-3 cursor-pointer group relative ${active ? 'text-[#0078D4]' : 'text-[#616161] hover:text-[#242424]'}`}>
      {active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#0078D4] rounded-r" />}
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] text-center leading-3 px-1">{label}</span>
    </div>
  )
}

function SecondaryNavItem({ label, active, icon, indent, onClick }: { label: string; active?: boolean; icon?: React.ReactNode; indent?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`relative flex items-center h-9 px-4 cursor-pointer text-[14px] ${active ? 'bg-[#EFF6FC] text-[#0078D4] font-semibold' : 'text-[#242424] hover:bg-[#F5F5F5]'}`}>
      {active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#0078D4] rounded-r" />}
      {icon && <span className="mr-3 text-[#616161]">{icon}</span>}
      <span className={indent ? 'ml-8' : ''}>{label}</span>
      {active && icon && <span className="ml-auto text-[#0078D4]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>}
    </div>
  )
}

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  
  return (
    <div>
      <div 
        className="flex items-center px-4 h-9 cursor-pointer hover:bg-[#FAF9F8] text-[#242424] select-none"
        onClick={() => setOpen(!open)}
      >
        <div className={`mr-3 transition-transform ${open ? 'rotate-90' : ''}`}>
           <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="#616161" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className="text-[14px]">{title}</span>
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isActivityExplorer = location.pathname === '/activity-explorer'
  const isRoot = location.pathname === '/' || location.pathname.startsWith('/agents')

  return (
    <div className="flex h-full">
      {/* Primary Rail */}
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
        <LeftRailItem icon={<DLPIcon />} label="Data Loss Prevention" />
        <LeftRailItem icon={<DSPMIcon />} label="DSPM (preview)" active />
      </div>

      {/* Secondary Navigation — collapsible */}
      <div
        className={`bg-[#FAF9F8] border-r border-[#E0E0E0] flex flex-col transition-all duration-200 ease-in-out overflow-hidden ${
          collapsed ? 'w-0 border-r-0' : 'w-[260px]'
        }`}
      >
        {/* Header */}
        <div className="h-12 flex items-center px-4 border-b border-[#EDEBE9] min-w-[260px]">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[#0078D4]"><DSPMIcon size={20} /></span>
            <span className="font-semibold text-[16px] text-[#242424] whitespace-nowrap">DSPM (preview)</span>
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
          <SecondaryNavItem label="Posture" icon={<PostureIcon />} />
          <SecondaryNavItem label="Objectives" icon={<ObjectivesIcon />} />
          <SecondaryNavItem label="AI observability" active={isRoot && !isActivityExplorer} icon={<AIObservabilityIcon />} onClick={() => navigate('/')} />
          
          <CollapsibleSection title="Discover">
            <SecondaryNavItem label="Apps and agents" indent />
            <SecondaryNavItem label="Activity explorer" indent active={isActivityExplorer} onClick={() => navigate('/activity-explorer')} />
            <SecondaryNavItem label="Asset explorer" indent />
            <SecondaryNavItem label="Data risk assessments" indent />
          </CollapsibleSection>

          <CollapsibleSection title="Tasks and actions">
            <SecondaryNavItem label="Setup tasks" icon={<TasksIcon />} />
            <SecondaryNavItem label="Remediation actions" indent />
          </CollapsibleSection>
          
          <SecondaryNavItem label="Reports" icon={<ReportsIcon />} />
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

