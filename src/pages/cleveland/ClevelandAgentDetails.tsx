import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from 'react-flow-renderer'
import { rows } from '../../lib/agentsData'
import { getEnrichment, getRecentActivities, AgentEnrichment, mockAnomalies } from '../../lib/clevelandData'

/*
 * Proposal Agent Detail — Enhanced with:
 *   Option A: Resource context / owner enrichment section
 *   Activity timeline enhancement preview
 */

// --- Custom Node for ReactFlow Graph ---
const CustomNode = ({ data }: { data: any }) => {
  const isRoot = data.type === 'root'
  const hasCount = !!data.countBadge
  const inheritedRingColorClass = isRoot
    ? 'ring-[#0078D4]'
    : data.isRisk
      ? 'ring-[#C50F1F]'
      : hasCount
        ? 'ring-[#0078D4]'
        : 'ring-gray-400'

  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${data.selected ? 'item-selected' : ''} ${data.expandable ? 'cursor-pointer' : ''}`}>
      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white
        ${data.isLastClicked ? `ring-4 ${inheritedRingColorClass} ring-offset-2 ring-offset-white animate-pulse` : ''}
        ${isRoot ? 'border-[#0078D4]' :
          data.isRisk ? 'border-[#C50F1F] bg-red-50' :
            hasCount ? 'border-[#0078D4] bg-[#EBF3FC]' : 'border-gray-300'}`}>
        {data.countBadge && (
          <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-[#0078D4] text-white text-[10px] leading-5 font-semibold text-center">
            {data.countBadge}
          </span>
        )}
        {!data.countBadge && data.avatarInitials && (
          <div className="w-7 h-7 rounded-full bg-[#E1DFDD] text-[#616161] text-[10px] font-semibold flex items-center justify-center">
            {data.avatarInitials}
          </div>
        )}
        {data.label === 'Sales Agent' && <svg width="20" height="20" viewBox="0 0 24 24" fill="#0078D4"><path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z"/></svg>}
        {data.label === 'Users' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
        {data.label === 'Knowledge sources' && <svg width="16" height="16" viewBox="0 0 24 24" fill="#0078D4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="white"/></svg>}
        {data.label === 'Tools' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
        {data.label === 'Agents' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
        {!data.countBadge && data.label === 'SharePoint sites' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        {!data.countBadge && data.label === 'Files' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>}
        {data.label?.toLowerCase().includes('sharepoint') && <svg width="16" height="16" viewBox="0 0 24 24" fill="#0078D4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="white"/></svg>}
        {data.label === 'TeamCel' && <svg width="16" height="16" viewBox="0 0 24 24" fill="#C50F1F"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="white"/></svg>}
      </div>
      <div className="text-[11px] text-gray-600 mt-1 max-w-[110px] text-center leading-tight font-medium">{data.label}</div>
      {data.subLabel && <div className="text-[10px] text-gray-400 text-center">{data.subLabel}</div>}
      <Handle type="target" position={Position.Top} className="!bg-gray-300 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-300 !w-1 !h-1" />
    </div>
  )
}

const proposalNodeTypes = { custom: CustomNode }

// --- Graph Data ---
const knowledgeSourceCount = 1
const sharePointSensitiveFiles = [
  { id: 'file-1', name: 'Payroll-Q4.xlsx', isRisk: true },
  { id: 'file-2', name: 'CompPlan-2026.docx', isRisk: true },
  { id: 'file-3', name: 'M&A-Notes.pdf', isRisk: false },
  { id: 'file-4', name: 'Board-Draft.pptx', isRisk: false },
  { id: 'file-5', name: 'Customer-PII.csv', isRisk: false },
]
const knowledgeSensitiveCount = sharePointSensitiveFiles.filter(f => f.isRisk).length
const knowledgeBranchHasRisk = knowledgeSensitiveCount > 0

const proposalGraphNodes: any[] = [
  { id: '1', type: 'custom', position: { x: 540, y: 0 }, data: { label: 'Sales Agent', type: 'root' } },
  { id: 'users', type: 'custom', position: { x: 80, y: 220 }, data: { label: 'Users', subLabel: '3 users', countBadge: '+3', expandable: true, groupId: 'users' } },
  { id: 'sites', type: 'custom', position: { x: 340, y: 220 }, data: { label: 'Knowledge sources', subLabel: 'SharePoint', countBadge: knowledgeSourceCount > 0 ? `+${knowledgeSourceCount}` : undefined, isRisk: knowledgeBranchHasRisk, expandable: true, groupId: 'sites' } },
  { id: 'tools', type: 'custom', position: { x: 620, y: 220 }, data: { label: 'Tools', subLabel: '13 tools', countBadge: '+13', expandable: true, groupId: 'tools' } },
  { id: 'agents', type: 'custom', position: { x: 900, y: 220 }, data: { label: 'Agents', subLabel: '3 agents', countBadge: '+3', isRisk: true, expandable: true, groupId: 'agents' } },
]

const proposalGraphEdges: any[] = [
  { id: 'e1-users', source: '1', target: 'users', type: 'smoothstep' },
  { id: 'e1-sites', source: '1', target: 'sites', type: 'smoothstep', animated: true, style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
  { id: 'e1-tools', source: '1', target: 'tools', type: 'smoothstep' },
  { id: 'e1-agents', source: '1', target: 'agents', type: 'smoothstep', animated: true, style: { stroke: '#C50F1F' } },
]

const proposalGroupChildren: Record<string, any[]> = {
  users: [
    { id: 'user-1', type: 'custom', position: { x: -70, y: 430 }, data: { label: 'Riley Chen', subLabel: 'Marketing', avatarInitials: 'RC' } },
    { id: 'user-2', type: 'custom', position: { x: 90, y: 430 }, data: { label: 'Morgan Lee', subLabel: 'Editor', avatarInitials: 'ML' } },
    { id: 'user-3', type: 'custom', position: { x: 250, y: 430 }, data: { label: 'Jordan Patel', subLabel: 'Admin', avatarInitials: 'JP' } },
  ],
  sites: [
    { id: 'site-1', type: 'custom', position: { x: 340, y: 430 }, data: { label: 'SharePoint', subLabel: 'Sensitive files', isRisk: knowledgeBranchHasRisk, countBadge: knowledgeSensitiveCount > 0 ? `+${knowledgeSensitiveCount}` : undefined, expandable: true, groupId: 'siteFiles' } },
  ],
  siteFiles: sharePointSensitiveFiles.map((file, index) => ({
    id: file.id, type: 'custom', position: { x: 40 + (index * 120), y: 670 }, data: { label: file.name, isRisk: file.isRisk },
  })),
  tools: [
    { id: 'tool-1', type: 'custom', position: { x: 470, y: 430 }, data: { label: 'Microsoft Word' } },
    { id: 'tool-2', type: 'custom', position: { x: 620, y: 430 }, data: { label: 'Excel' } },
    { id: 'tool-3', type: 'custom', position: { x: 770, y: 430 }, data: { label: 'PowerPoint' } },
    { id: 'tool-more', type: 'custom', position: { x: 920, y: 430 }, data: { label: 'More tools', countBadge: '+10', expandable: true, groupId: 'toolsMore' } },
  ],
  toolsMore: [
    { id: 'tool-4', type: 'custom', position: { x: 260, y: 670 }, data: { label: 'OneDrive' } },
    { id: 'tool-5', type: 'custom', position: { x: 360, y: 670 }, data: { label: 'Teams' } },
    { id: 'tool-6', type: 'custom', position: { x: 460, y: 670 }, data: { label: 'Outlook' } },
    { id: 'tool-7', type: 'custom', position: { x: 560, y: 670 }, data: { label: 'Planner' } },
    { id: 'tool-8', type: 'custom', position: { x: 660, y: 670 }, data: { label: 'Loop' } },
    { id: 'tool-9', type: 'custom', position: { x: 760, y: 670 }, data: { label: 'Whiteboard' } },
    { id: 'tool-10', type: 'custom', position: { x: 860, y: 670 }, data: { label: 'Forms' } },
    { id: 'tool-11', type: 'custom', position: { x: 960, y: 670 }, data: { label: 'Power BI' } },
    { id: 'tool-12', type: 'custom', position: { x: 1060, y: 670 }, data: { label: 'SharePoint' } },
    { id: 'tool-13', type: 'custom', position: { x: 1160, y: 670 }, data: { label: 'Copilot Studio' } },
  ],
  agents: [
    { id: 'agent-1', type: 'custom', position: { x: 760, y: 430 }, data: { label: 'Research agent', subLabel: '13 calls', isRisk: true } },
    { id: 'agent-2', type: 'custom', position: { x: 920, y: 430 }, data: { label: 'Writer agent', subLabel: '7 calls', isRisk: false } },
    { id: 'agent-3', type: 'custom', position: { x: 1080, y: 430 }, data: { label: 'Reviewer agent', subLabel: '4 calls', isRisk: false } },
  ],
}

const proposalGroupChildEdges: Record<string, any[]> = {
  users: [
    { id: 'e-users-1', source: 'users', target: 'user-1', type: 'smoothstep' },
    { id: 'e-users-2', source: 'users', target: 'user-2', type: 'smoothstep' },
    { id: 'e-users-3', source: 'users', target: 'user-3', type: 'smoothstep' },
  ],
  sites: [
    { id: 'e-sites-1', source: 'sites', target: 'site-1', type: 'smoothstep', style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
  ],
  siteFiles: [
    { id: 'e-site-file-1', source: 'site-1', target: 'file-1', type: 'smoothstep', style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
    { id: 'e-site-file-2', source: 'site-1', target: 'file-2', type: 'smoothstep', style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
    { id: 'e-site-file-3', source: 'site-1', target: 'file-3', type: 'smoothstep', style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
    { id: 'e-site-file-4', source: 'site-1', target: 'file-4', type: 'smoothstep', style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
    { id: 'e-site-file-5', source: 'site-1', target: 'file-5', type: 'smoothstep', style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
  ],
  tools: [
    { id: 'e-tools-1', source: 'tools', target: 'tool-1', type: 'smoothstep' },
    { id: 'e-tools-2', source: 'tools', target: 'tool-2', type: 'smoothstep' },
    { id: 'e-tools-3', source: 'tools', target: 'tool-3', type: 'smoothstep' },
    { id: 'e-tools-more', source: 'tools', target: 'tool-more', type: 'smoothstep' },
  ],
  toolsMore: [
    { id: 'e-tools-4', source: 'tool-more', target: 'tool-4', type: 'smoothstep' },
    { id: 'e-tools-5', source: 'tool-more', target: 'tool-5', type: 'smoothstep' },
    { id: 'e-tools-6', source: 'tool-more', target: 'tool-6', type: 'smoothstep' },
    { id: 'e-tools-7', source: 'tool-more', target: 'tool-7', type: 'smoothstep' },
    { id: 'e-tools-8', source: 'tool-more', target: 'tool-8', type: 'smoothstep' },
    { id: 'e-tools-9', source: 'tool-more', target: 'tool-9', type: 'smoothstep' },
    { id: 'e-tools-10', source: 'tool-more', target: 'tool-10', type: 'smoothstep' },
    { id: 'e-tools-11', source: 'tool-more', target: 'tool-11', type: 'smoothstep' },
    { id: 'e-tools-12', source: 'tool-more', target: 'tool-12', type: 'smoothstep' },
    { id: 'e-tools-13', source: 'tool-more', target: 'tool-13', type: 'smoothstep' },
  ],
  agents: [
    { id: 'e-agents-1', source: 'agents', target: 'agent-1', type: 'smoothstep', style: { stroke: '#C50F1F' } },
    { id: 'e-agents-2', source: 'agents', target: 'agent-2', type: 'smoothstep', style: { stroke: '#C50F1F' } },
    { id: 'e-agents-3', source: 'agents', target: 'agent-3', type: 'smoothstep', style: { stroke: '#C50F1F' } },
  ],
}

const proposalGroupHierarchy: Record<string, string[]> = {
  sites: ['siteFiles'],
  tools: ['toolsMore'],
}

const proposalUsersPanelRows = (proposalGroupChildren.users ?? []).map((node: any, index: number) => {
  const name = String(node?.data?.label ?? 'Unknown User')
  const normalizedName = name.toLowerCase().replace(/\s+/g, '.')
  const isRisk = !!node?.data?.isRisk
  const totalInteractions = isRisk ? Math.max(14, 36 - (index * 6)) : Math.max(8, 24 - (index * 4))
  const sensitiveActivities = isRisk ? Math.max(3, 7 - index) : Math.max(0, 2 - index)
  return {
    id: String(node?.id ?? `user-${index + 1}`),
    name,
    email: `${normalizedName}@contoso.com`,
    totalInteractions,
    sensitiveActivities,
    riskLevel: isRisk ? 'High' : 'Low',
    riskScore: isRisk ? 3 : 1,
    avatarBg: isRisk ? 'bg-[#5B73E8]' : 'bg-[#C3008F]',
    initials: String(node?.data?.avatarInitials ?? '?'),
  }
})

function getProposalDescendantGroups(groupId: string): string[] {
  const directChildren = proposalGroupHierarchy[groupId] ?? []
  return directChildren.reduce<string[]>((all, childId) => {
    return [...all, childId, ...getProposalDescendantGroups(childId)]
  }, [])
}

function getProposalActivitiesGraphData(expandedGroups: string[]) {
  const nodes = [...proposalGraphNodes]
  const edges = [...proposalGraphEdges]
  expandedGroups.forEach((groupId) => {
    if (proposalGroupChildren[groupId]) nodes.push(...proposalGroupChildren[groupId])
    if (proposalGroupChildEdges[groupId]) edges.push(...proposalGroupChildEdges[groupId])
  })
  const riskNodeIds = new Set(nodes.filter((n: any) => !!n?.data?.isRisk).map((n: any) => n.id))
  const styledEdges = edges.map((edge: any) => {
    const isRiskTarget = riskNodeIds.has(edge.target)
    return { ...edge, animated: isRiskTarget, style: { ...(edge.style ?? {}), stroke: isRiskTarget ? '#C50F1F' : '#B3B3B3' } }
  })
  return { nodes, edges: styledEdges }
}

function getProposalNodeDetailModel(node: any) {
  const id = String(node?.id ?? '')
  const label = node?.data?.label ?? 'Node'
  const subLabel = node?.data?.subLabel ?? '-'
  const isRisk = !!node?.data?.isRisk
  if (id.startsWith('user-')) return { title: label, category: 'User', summary: 'User activity connected to this agent execution path.', items: [{ label: 'Name', value: label }, { label: 'Role', value: subLabel }, { label: 'Source', value: 'Users branch' }], status: isRisk ? 'Potential risk' : 'Monitored' }
  if (id.startsWith('file-')) return { title: label, category: 'File', summary: 'File surfaced from knowledge source activity.', items: [{ label: 'File name', value: label }, { label: 'Repository', value: 'SharePoint' }, { label: 'Sensitivity', value: isRisk ? 'Sensitive' : 'Standard' }], status: isRisk ? 'Potential risk' : 'Monitored' }
  if (id.startsWith('tool-')) return { title: label, category: 'Tool', summary: 'Tool invoked by this agent during activity execution.', items: [{ label: 'Tool', value: label }, { label: 'Family', value: 'Microsoft 365' }, { label: 'Type', value: 'Productivity tool' }], status: isRisk ? 'Potential risk' : 'Monitored' }
  if (id.startsWith('agent-')) return { title: label, category: 'Agent', summary: 'Connected downstream agent in the activity chain.', items: [{ label: 'Agent name', value: label }, { label: 'Usage', value: subLabel }, { label: 'Branch', value: 'Agents' }], status: isRisk ? 'Potential risk' : 'Monitored' }
  return { title: label, category: 'Node', summary: 'Selected graph node details.', items: [{ label: 'Label', value: label }, { label: 'Details', value: subLabel }], status: isRisk ? 'Potential risk' : 'Monitored' }
}

function ResourceContextSection({ enrichment }: { enrichment: AgentEnrichment }) {
  return (
    <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-[#242424] flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="#0078D4"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-.5 3h1v5h-1V6Zm0 6h1v1h-1v-1Z" /></svg>
          Resource context
        </h3>
        <span className="px-2 py-0.5 bg-[#EBF3FC] text-[#0078D4] text-[10px] font-semibold rounded">NEW</span>
      </div>

      <div className="grid grid-cols-3 gap-y-5 gap-x-6 text-sm">
        {/* Row 1 */}
        <div>
          <div className="text-[#616161] text-[12px] mb-1">Subscription</div>
          <div className="text-[#0078D4] text-[13px] hover:underline cursor-pointer flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.41a2 2 0 0 0-.59-1.41l-3.41-3.42A2 2 0 0 0 10.59 2H6Z" /></svg>
            {enrichment.subscription.name}
          </div>
          <div className="text-[10px] text-[#616161] font-mono mt-0.5" title={enrichment.subscription.id}>
            {enrichment.subscription.id.slice(0, 18)}...
          </div>
        </div>
        <div>
          <div className="text-[#616161] text-[12px] mb-1">Resource group</div>
          <div className="text-[13px] text-[#242424] flex items-center gap-2">
            {enrichment.resourceGroup}
            <span className="text-[10px] bg-[#F3F2F1] text-[#616161] px-1.5 py-0.5 rounded">{enrichment.subscription.region}</span>
          </div>
        </div>
        <div>
          <div className="text-[#616161] text-[12px] mb-1">Tenant</div>
          <div className="text-[13px] text-[#242424] flex items-center gap-2">
            {enrichment.tenant.name}
            {enrichment.tenant.aadLinked && (
              <span className="text-[10px] bg-[#DFF6DD] text-[#107C10] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="6" /><path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" fill="none" /></svg>
                Entra linked
              </span>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div>
          <div className="text-[#616161] text-[12px] mb-1">Department</div>
          <div className="text-[13px] text-[#242424]">{enrichment.department}</div>
        </div>
        <div>
          <div className="text-[#616161] text-[12px] mb-1">Cost center</div>
          <div className="text-[13px] text-[#242424]">{enrichment.costCenter}</div>
        </div>
        <div>
          <div className="text-[#616161] text-[12px] mb-1">Manager</div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#C3008F] text-white text-[10px] font-semibold flex items-center justify-center">
              SK
            </div>
            <div>
              <div className="text-[13px] text-[#242424] leading-tight">{enrichment.manager.name}</div>
              <div className="text-[11px] text-[#616161] leading-tight">{enrichment.manager.title}</div>
            </div>
            <button className="ml-auto text-[11px] text-[#616161] hover:text-[#242424] flex items-center gap-1 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 4A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5V11h-1v3.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5H9V4H5.5Zm5.5 0v1h2.79l-4.15 4.15.71.7L14.5 5.71V8.5h1V4h-4.5Z" /></svg>
              View in Azure
            </button>
          </div>
        </div>
      </div>

      {/* Registered users preview */}
      <div className="border-t border-[#E0E0E0] mt-5 pt-4">
        <div className="text-[12px] font-semibold text-[#242424] mb-2">Registered users (3)</div>
        <div className="flex gap-4">
          {[
            { name: 'Riley Chen', role: 'Marketing', initials: 'RC', activities: 36, bg: 'bg-[#5B73E8]' },
            { name: 'Morgan Lee', role: 'Editor', initials: 'ML', activities: 24, bg: 'bg-[#C3008F]' },
            { name: 'Jordan Patel', role: 'Admin', initials: 'JP', activities: 18, bg: 'bg-[#00B7C3]' },
          ].map((u) => (
            <div key={u.name} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-[#F5F5F5] cursor-pointer">
              <div className={`w-7 h-7 rounded-full ${u.bg} text-white text-[10px] font-semibold flex items-center justify-center`}>{u.initials}</div>
              <div>
                <div className="text-[12px] text-[#242424] font-medium">{u.name}</div>
                <div className="text-[10px] text-[#616161]">{u.role} · {u.activities} activities</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActivitiesContent() {
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [detailPanelWidth, setDetailPanelWidth] = useState(520)
  const [isResizingRightPanel, setIsResizingRightPanel] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const initialGraphData = getProposalActivitiesGraphData([])
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraphData.nodes as any)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraphData.edges)
  const [selectedActivity, setSelectedActivity] = useState(1)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [lastClickedNodeId, setLastClickedNodeId] = useState<string | null>(null)
  const [selectedUsersPanelRow, setSelectedUsersPanelRow] = useState<any | null>(null)

  const selectedNodeDetails = selectedNode ? getProposalNodeDetailModel(selectedNode) : null
  const isUsersSummaryNode = selectedNode?.id === 'users'
  const isUsersRowDetailView = isUsersSummaryNode && !!selectedUsersPanelRow

  useEffect(() => {
    const nextGraphData = getProposalActivitiesGraphData(expandedGroups)
    const highlightedNodes = (nextGraphData.nodes as any[]).map((node: any) => ({
      ...node,
      data: { ...node.data, isLastClicked: node.id === lastClickedNodeId },
    }))
    setNodes(highlightedNodes as any)
    setEdges(nextGraphData.edges as any)
  }, [expandedGroups, lastClickedNodeId, setNodes, setEdges])

  // Listen for navigate-to-group events from Overview connected resources
  useEffect(() => {
    const handler = (e: Event) => {
      const groupId = (e as CustomEvent).detail
      if (groupId && !expandedGroups.includes(groupId)) {
        setExpandedGroups(prev => [...prev, groupId])
      }
      setLastClickedNodeId(groupId)
      setSelectedNode(proposalGraphNodes.find((n: any) => n.id === groupId) ?? null)
      setShowRightPanel(true)
    }
    window.addEventListener('navigate-to-group', handler)
    return () => window.removeEventListener('navigate-to-group', handler)
  }, [expandedGroups])

  useEffect(() => {
    if (!reactFlowInstance) return
    const fitGraph = () => {
      reactFlowInstance.fitView({ padding: 0.2, minZoom: 0.35, maxZoom: 1, duration: 250 })
    }
    const frame = window.requestAnimationFrame(fitGraph)
    window.addEventListener('resize', fitGraph)
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('resize', fitGraph) }
  }, [reactFlowInstance, expandedGroups, showLeftPanel, showRightPanel])

  useEffect(() => {
    if (!isResizingRightPanel) return
    const onMouseMove = (event: MouseEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return
      const nextWidth = containerRect.right - event.clientX
      setDetailPanelWidth(Math.max(340, Math.min(760, nextWidth)))
    }
    const onMouseUp = () => setIsResizingRightPanel(false)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [isResizingRightPanel])

  useEffect(() => {
    if (!isUsersSummaryNode) setSelectedUsersPanelRow(null)
  }, [isUsersSummaryNode])

  return (
    <div ref={containerRef} className={`flex h-[78vh] min-h-[560px] max-h-[900px] border border-gray-200 bg-white shadow-sm rounded-md overflow-hidden ${isResizingRightPanel ? 'select-none' : ''}`}>

      {/* Left Pane - Activity List */}
      {showLeftPanel && <div className="w-[340px] border-r border-gray-200 flex flex-col bg-[#F8F9FA]">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-[#242424]">Agent activities</h2>
            <button className="text-gray-500 hover:text-black" onClick={() => setShowLeftPanel(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <button className="px-3 py-1 bg-[#242424] text-white text-[11px] rounded-full font-medium">Oversharing (18)</button>
            <button className="px-3 py-1 bg-gray-200 text-[#616161] text-[11px] rounded-full hover:bg-gray-300 transition-colors">Exfiltration (7)</button>
          </div>
          <div className="flex justify-between items-center">
            <button className="px-3 py-1 bg-white border border-gray-300 text-[#616161] text-[11px] rounded-full hover:bg-gray-50 transition-colors">Unethical (0)</button>
            <a href="#" className="text-[#0078D4] text-[11px] hover:underline">Open activity explorer</a>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          <div onClick={() => setSelectedActivity(1)} className={`p-3 rounded border cursor-pointer transition-all ${selectedActivity === 1 ? 'bg-white border-[#0078D4] shadow-md ring-1 ring-[#0078D4]' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <div className="flex items-start gap-2 mb-1">
              <button className="mt-0.5 text-gray-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg></button>
              <div>
                <h3 className="text-[13px] font-semibold text-[#242424] leading-tight">Posted sensitive document to public SharePoint site</h3>
                <div className="text-[10px] text-[#616161] mt-1">June 24, 2025 (UTC)</div>
                <div className="text-[9px] bg-gray-100 text-[#616161] px-1.5 py-0.5 rounded w-fit mt-1">Oversharing</div>
                <p className="text-[11px] text-[#616161] mt-2 leading-snug">Riley accessed 402 items containing sensitive info that are not labeled for protection.</p>
              </div>
            </div>
          </div>

          <div onClick={() => setSelectedActivity(2)} className={`p-3 rounded border cursor-pointer transition-all ${selectedActivity === 2 ? 'bg-white border-[#0078D4] shadow-md ring-1 ring-[#0078D4]' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <div className="flex items-start gap-2">
              <button className="mt-0.5 text-gray-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div className="w-full">
                <h3 className="text-[13px] font-semibold text-[#242424] leading-tight">402 unlabeled sensitive files accessed</h3>
                <div className="text-[10px] text-[#616161] mt-1">June 24, 2025 (UTC)</div>
                <div className="text-[9px] bg-gray-100 text-[#616161] px-1.5 py-0.5 rounded w-fit mt-1 mb-2">Oversharing</div>
                <button className="text-[10px] border border-gray-300 px-2 py-1 rounded w-full text-center hover:bg-gray-50">View details</button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded border border-gray-200 hover:border-gray-300 cursor-pointer">
            <div className="flex items-start gap-2">
              <button className="mt-0.5 text-gray-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div className="w-full">
                <h3 className="text-[13px] font-semibold text-[#242424] leading-tight">Created public sharing link</h3>
                <div className="text-[10px] text-[#616161] mt-1">June 24, 2025 (UTC)</div>
                <div className="text-[9px] bg-gray-100 text-[#616161] px-1.5 py-0.5 rounded w-fit mt-1 mb-2">Oversharing</div>
                <button className="text-[10px] border border-gray-300 px-2 py-1 rounded w-full text-center hover:bg-gray-50">View details</button>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* Middle Pane - Interactive Graph */}
      <div className={`flex-1 bg-[#F9F9F9] relative ${showRightPanel ? 'border-r border-gray-200' : ''}`}>
        {!showLeftPanel && (
          <button className="absolute top-3 left-3 z-20 px-2 py-1 text-[11px] rounded border border-gray-300 bg-white text-[#242424] hover:bg-gray-50" onClick={() => setShowLeftPanel(true)}>
            Show activities
          </button>
        )}
        {!showRightPanel && (
          <button className="absolute top-3 right-3 z-20 px-2 py-1 text-[11px] rounded border border-gray-300 bg-white text-[#242424] hover:bg-gray-50" onClick={() => setShowRightPanel(true)}>
            Show details
          </button>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setReactFlowInstance}
          onNodeClick={(_, node) => {
            setLastClickedNodeId(node?.id ?? null)
            if (node?.id !== '1') {
              setSelectedNode(node)
              setShowRightPanel(true)
            }
            if (node?.data?.expandable && node?.data?.groupId) {
              setExpandedGroups((previous) => {
                if (previous.includes(node.data.groupId)) {
                  const descendants = getProposalDescendantGroups(node.data.groupId)
                  return previous.filter((groupId) => groupId !== node.data.groupId && !descendants.includes(groupId))
                }
                return [...previous, node.data.groupId]
              })
            }
          }}
          nodeTypes={proposalNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, minZoom: 0.35, maxZoom: 1 }}
          minZoom={0.35}
          attributionPosition="bottom-left"
        >
          <Controls className="!bg-white !shadow-sm !border !border-gray-200" />
          <Background color="#aaa" gap={16} size={1} />
          <MiniMap
            nodeStrokeColor={(n) => n.type === 'custom' ? '#ddd' : '#eee'}
            nodeColor={(n) => n.data?.isRisk ? '#ffccce' : '#fff'}
            className="!bg-white !shadow-sm !border !border-gray-200"
          />
        </ReactFlow>
      </div>

      {showRightPanel && (
        <div
          className="w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
          onMouseDown={() => setIsResizingRightPanel(true)}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize details panel"
        />
      )}

      {/* Right Pane - Detail View */}
      {showRightPanel && <div className="bg-white flex flex-col h-full overflow-hidden" style={{ width: detailPanelWidth }}>
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between">
            {isUsersRowDetailView ? (
              <button className="text-[#616161] hover:text-[#242424]" onClick={() => setSelectedUsersPanelRow(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
            ) : <div />}
            <button className="text-[#616161] hover:text-[#242424]" onClick={() => setShowRightPanel(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <h2 className="text-[15px] font-semibold text-[#242424] mt-3 break-words">
            {isUsersRowDetailView ? selectedUsersPanelRow?.name : (selectedNodeDetails?.title ?? 'Node details')}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8 space-y-5">
          {!selectedNodeDetails && (
            <div className="text-[12px] text-[#616161] border border-gray-200 rounded-md p-3 bg-white">
              Click a leaf node to view details for users, files, tools, or agents.
            </div>
          )}

          {selectedNodeDetails && isUsersSummaryNode && !isUsersRowDetailView && (
            <>
              <div>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input value="" readOnly placeholder="Search" className="w-full h-10 rounded border border-gray-300 bg-white pl-10 pr-3 text-[14px] placeholder:text-[#616161]" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-[minmax(180px,1fr)_120px_72px_92px] gap-2 items-center border-b border-gray-200 pb-1">
                  <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">User</div>
                  <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">User risk</div>
                  <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">Activities</div>
                  <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">Sensitive activities</div>
                </div>
                {proposalUsersPanelRows.map((row) => (
                  <button key={row.id} className="w-full text-left grid grid-cols-[minmax(180px,1fr)_120px_72px_92px] gap-2 items-center rounded-sm hover:bg-[#F9F9F9] px-1 py-1" onClick={() => setSelectedUsersPanelRow(row)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full text-white text-[12px] leading-none font-semibold flex items-center justify-center shrink-0 ${row.avatarBg}`}>{row.initials}</div>
                      <div className="min-w-0"><div className="text-[13px] leading-[18px] font-semibold text-[#242424] truncate">{row.name}</div></div>
                    </div>
                    <div className="w-[104px]">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4].map((block) => {
                            const isActive = block <= row.riskScore
                            const activeColor = row.riskLevel === 'High' ? 'bg-[#A80000]' : 'bg-[#F7630C]'
                            return <div key={block} className={`w-2 h-2 shrink-0 ${isActive ? activeColor : 'bg-[#D1D1D1]'}`} />
                          })}
                        </div>
                        <span className="text-[10px] leading-[14px] text-[#616161] whitespace-nowrap">{row.riskLevel}</span>
                      </div>
                    </div>
                    <div className="text-[12px] leading-[16px] font-semibold text-[#242424]">{row.totalInteractions}</div>
                    <div className="text-[12px] leading-[16px] font-semibold text-[#242424]">{row.sensitiveActivities}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedNodeDetails && isUsersRowDetailView && selectedUsersPanelRow && (
            <>
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <div className="text-[11px] text-[#616161] mb-1">User</div>
                <div className="text-[14px] font-semibold text-[#242424]">{selectedUsersPanelRow.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="text-[11px] text-[#616161]">Email</div>
                  <div className="text-[12px] text-[#242424] mt-1 break-all">{selectedUsersPanelRow.email}</div>
                </div>
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="text-[11px] text-[#616161]">Risk level</div>
                  <div className={`text-[12px] font-semibold mt-1 ${selectedUsersPanelRow.riskLevel === 'High' ? 'text-[#A80000]' : 'text-[#616161]'}`}>{selectedUsersPanelRow.riskLevel}</div>
                </div>
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="text-[11px] text-[#616161]">Activities</div>
                  <div className="text-[12px] font-semibold text-[#242424] mt-1">{selectedUsersPanelRow.totalInteractions}</div>
                </div>
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div className="text-[11px] text-[#616161]">Sensitive activities</div>
                  <div className="text-[12px] font-semibold text-[#242424] mt-1">{selectedUsersPanelRow.sensitiveActivities}</div>
                </div>
              </div>
            </>
          )}

          {selectedNodeDetails && !isUsersSummaryNode && (
            <>
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <div className="text-[11px] text-[#616161] mb-1">Summary</div>
                <div className="text-[12px] text-[#242424]">{selectedNodeDetails.summary}</div>
              </div>
              <div>
                <div className="text-[12px] font-semibold text-[#242424] mb-2">Details</div>
                <div className="space-y-2">
                  {selectedNodeDetails.items.map((item: any) => (
                    <div key={item.label} className="flex justify-between gap-3 border-b border-gray-100 pb-2">
                      <span className="text-[11px] text-[#616161]">{item.label}</span>
                      <span className="text-[11px] text-[#242424] text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`text-[11px] inline-flex items-center px-2 py-1 rounded ${selectedNode?.data?.isRisk ? 'bg-[#FDE7E9] text-[#C50F1F]' : 'bg-[#EBF3FC] text-[#0078D4]'}`}>
                {selectedNodeDetails.status}
              </div>
            </>
          )}
        </div>
      </div>}
    </div>
  )
}

// ── Recommendations Section (Combined Option C + A) ────────────────

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'resolved'

interface Recommendation {
  id: number
  severity: Severity
  title: string
  description: string
  chain: string
  primaryAction: string
  secondaryAction?: string
  riskType?: string
}

function getAgentRecommendations(agent: any): Recommendation[] {
  const riskTypes = (agent.riskType ?? '').toLowerCase()
  const hasOversharing = riskTypes.includes('oversharing')
  const hasExfiltration = riskTypes.includes('exfiltration')
  const hasUnethical = riskTypes.includes('unethical')
  const hasDLP = agent.dataProtection !== '0 Policies'
  const hasCompliance = agent.dataCompliance !== '0 Policies'
  const authIsWeak = agent.authentication === 'Shared Key' || agent.authentication === 'Access Key'

  const recs: Recommendation[] = []
  let id = 1

  // 0. IRM Alert Triage — always first when there are active alerts
  recs.push({
    id: id++,
    severity: 'critical',
    title: 'Triage 8 insider risk alerts for this agent',
    description: 'This agent has 8 unresolved alerts in Insider Risk Management (3 High, 4 Medium, 1 Low). Review each alert to confirm or dismiss — confirmed alerts may require actions like blocking the agent or escalating to legal. Dismissing alerts will recalculate the agent\'s risk level.',
    chain: 'Insider Risk Management → Agentic risks → 8 alerts pending',
    primaryAction: 'Review in IRM',
    secondaryAction: 'View alert details',
  })

  // 1. Knowledge Sources — sensitive file access
  if (hasOversharing || hasExfiltration) {
    recs.push({
      id: id++,
      severity: 'critical',
      title: 'Restrict access to sensitive files in SharePoint',
      description: `This agent accessed sensitive files including Payroll-Q4.xlsx and CompPlan-2026.docx without DLP protection. ${hasOversharing ? 'Oversharing risk means these files may be exposed to unauthorized users or downstream agents.' : 'Exfiltration risk means data could be copied to external locations.'}`,
      chain: 'Knowledge sources → SharePoint → Payroll-Q4.xlsx, CompPlan-2026.docx',
      primaryAction: 'Apply sensitivity labels',
      secondaryAction: 'View file activity',
      riskType: hasOversharing ? 'Oversharing' : 'Exfiltration',
    })
  }

  // 2. Downstream Agents — inter-agent data flow
  recs.push({
    id: id++,
    severity: hasOversharing || hasExfiltration ? 'critical' : 'high',
    title: 'Restrict data flow to downstream Research agent',
    description: 'Research agent made 13 calls to this agent and is flagged as risky. No inter-agent DLP policy exists to prevent sensitive data from propagating through the agent chain.',
    chain: 'Agent → Agents → Research agent (13 calls, flagged)',
    primaryAction: 'Create inter-agent policy',
    secondaryAction: 'View agent graph',
    riskType: hasExfiltration ? 'Exfiltration' : hasOversharing ? 'Oversharing' : undefined,
  })

  // 3. DLP Policy Gap
  if (!hasDLP) {
    recs.push({
      id: id++,
      severity: 'high',
      title: `Create DLP policy for ${agent.name}`,
      description: 'This agent has 0 DLP policies. All 13 connected tools (SharePoint, Excel, Word, Teams, Outlook, OneDrive, and 7 more) can access and share sensitive data without restriction.',
      chain: 'Agent → Tools → 13 tools (unrestricted)',
      primaryAction: 'Create DLP policy',
      secondaryAction: 'View policy templates',
      riskType: hasOversharing ? 'Oversharing' : hasExfiltration ? 'Exfiltration' : undefined,
    })
  }

  // 4. User Permissions
  recs.push({
    id: id++,
    severity: 'high',
    title: 'Review user access permissions — Admin privilege detected',
    description: 'Jordan Patel has Admin-level access to all knowledge sources connected to this agent. Under least-privilege principle, admin access should be scoped to required resources only.',
    chain: 'Agent → Users → Jordan Patel (Admin)',
    primaryAction: 'Review permissions',
    secondaryAction: 'View user activity',
  })

  // 5. Unethical-specific content filter
  if (hasUnethical) {
    recs.push({
      id: id++,
      severity: 'critical',
      title: 'Apply content safety filter for unethical content',
      description: 'This agent has generated content flagged as unethical. Apply Azure AI Content Safety filters to block harmful, biased, or non-compliant outputs before they reach downstream consumers.',
      chain: 'Agent output → Content filter (not configured)',
      primaryAction: 'Configure content filter',
      secondaryAction: 'View flagged outputs',
      riskType: 'Unethical',
    })
  }

  // 6. Compliance Policy Gap
  if (!hasCompliance) {
    recs.push({
      id: id++,
      severity: 'medium',
      title: 'Enable compliance and retention policy',
      description: `This agent has 0 compliance policies. Consider applying retention, audit, and eDiscovery-hold policies${hasOversharing ? ' — especially for M&A or privileged data that may be subject to legal hold.' : '.'}`,
      chain: 'Agent-level policy configuration',
      primaryAction: 'Create compliance policy',
      secondaryAction: 'View templates',
    })
  }

  return recs
}

const severityConfig: Record<Severity, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  critical: {
    label: 'CRITICAL',
    bg: 'bg-[#FDE7E9]',
    text: 'text-[#A4262C]',
    border: 'border-[#A4262C]',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2.5l6 10.5H2L8 2.5Z" fill="#A4262C" /><path d="M7.5 6h1v3.5h-1V6Zm0 4.5h1v1h-1v-1Z" fill="white" /></svg>,
  },
  high: {
    label: 'HIGH',
    bg: 'bg-[#FFF4CE]',
    text: 'text-[#835C00]',
    border: 'border-[#D83B01]',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2.5l6 10.5H2L8 2.5Z" fill="#D83B01" /><path d="M7.5 6h1v3.5h-1V6Zm0 4.5h1v1h-1v-1Z" fill="white" /></svg>,
  },
  medium: {
    label: 'MEDIUM',
    bg: 'bg-[#F3F2F1]',
    text: 'text-[#616161]',
    border: 'border-[#616161]',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#616161" strokeWidth="1.5" /><path d="M7.5 4.5h1v4h-1v-4Zm0 5.5h1v1h-1v-1Z" fill="#616161" /></svg>,
  },
  low: {
    label: 'LOW',
    bg: 'bg-[#DFF6DD]',
    text: 'text-[#107C10]',
    border: 'border-[#107C10]',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#107C10" strokeWidth="1.5" /><path d="M5 8l2 2 4-4" stroke="#107C10" strokeWidth="1.5" fill="none" /></svg>,
  },
  resolved: {
    label: 'RESOLVED',
    bg: 'bg-[#DFF6DD]',
    text: 'text-[#107C10]',
    border: 'border-[#107C10]',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#107C10" /><path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" fill="none" /></svg>,
  },
}

const riskTypeColors: Record<string, { bg: string; text: string }> = {
  Oversharing: { bg: 'bg-[#F3EAFA]', text: 'text-[#5C2D91]' },
  Exfiltration: { bg: 'bg-[#EBF3FC]', text: 'text-[#0078D4]' },
  Unethical: { bg: 'bg-[#E6F9FA]', text: 'text-[#006B6B]' },
}

function RecommendationsSection({ agent }: { agent: any }) {
  const [expandedRec, setExpandedRec] = useState<number | null>(null)
  const recs = getAgentRecommendations(agent)
  const actionableCount = recs.filter(r => r.severity !== 'resolved').length

  return (
    <div className="pt-4">
      {/* Clean header */}
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-[14px] font-semibold text-[#242424]">Recommended actions</h2>
        <span className="text-[12px] text-[#616161]">{actionableCount} to resolve</span>
      </div>

      {/* Single clean list */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {recs.map((rec, idx) => {
          const sev = severityConfig[rec.severity]
          const isExpanded = expandedRec === rec.id
          const isResolved = rec.severity === 'resolved'

          return (
            <div key={rec.id} className={`border-b border-gray-100 last:border-b-0 ${isResolved ? 'bg-[#FAFFFE]' : ''}`}>
              {/* Row */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#FAF9F8] transition-colors"
                onClick={() => !isResolved && setExpandedRec(isExpanded ? null : rec.id)}
              >
                {/* Severity dot */}
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  rec.severity === 'critical' ? 'bg-[#A4262C]' :
                  rec.severity === 'high' ? 'bg-[#D83B01]' :
                  rec.severity === 'medium' ? 'bg-[#8A8886]' :
                  'bg-[#107C10]'
                }`} />

                {/* Severity text */}
                <span className={`text-[11px] w-[52px] shrink-0 ${sev.text} font-semibold`}>{sev.label}</span>

                {/* Title */}
                <span className={`text-[13px] flex-1 ${isResolved ? 'text-[#8A8886] line-through' : 'text-[#242424]'}`}>{rec.title}</span>

                {/* Primary action as inline link (not a big button) */}
                {rec.primaryAction && !isResolved && (
                  <button className="text-[12px] text-[#0078D4] hover:underline shrink-0">{rec.primaryAction}</button>
                )}

                {/* Chevron */}
                {!isResolved && (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <path d="M4 6l4 4 4-4" stroke="#8A8886" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}

                {isResolved && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M5 8l2 2 4-4" stroke="#107C10" strokeWidth="1.5" fill="none" /></svg>
                )}
              </div>

              {/* Expand */}
              {isExpanded && !isResolved && (
                <div className="px-4 pb-3 pl-[72px]">
                  <p className="text-[12px] text-[#616161] leading-relaxed mb-2">{rec.description}</p>
                  <div className="text-[11px] text-[#8A8886] mb-3">
                    <span className="font-mono">{rec.chain}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {rec.primaryAction && (
                      <button className={`px-3 py-1.5 text-white text-[12px] font-medium rounded transition-colors ${
                        rec.severity === 'critical' ? 'bg-[#A4262C] hover:bg-[#8B1F24]' : 'bg-[#0078D4] hover:bg-[#106EBE]'
                      }`}>
                        {rec.primaryAction}
                      </button>
                    )}
                    {rec.secondaryAction && (
                      <button className="text-[12px] text-[#0078D4] hover:underline">{rec.secondaryAction}</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OverviewContent({ agent, onNavigateToActivities }: { agent: any; onNavigateToActivities?: (targetGroup?: string) => void }) {
  const enrichment = getEnrichment(agent.agentId)
  const recentActivities = getRecentActivities(agent.agentId)
  const [trendFilter, setTrendFilter] = useState<string[]>([])
  const anomaly = mockAnomalies.find(a => a.agentId === agent.agentId)

  return (
    <div className="space-y-5">

      {/* Spike investigation banner — carries context AND guides next steps */}
      {anomaly && (
        <div className="bg-white rounded-lg border-l-4 border-[#C50F1F] border border-gray-200 shadow-sm overflow-hidden">
          {/* Alert header */}
          <div className="flex items-start gap-3 px-5 py-4 bg-[#FDE7E9]/40">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#C50F1F" className="shrink-0 mt-0.5"><path d="M10 2l8 14H2L10 2Zm-.5 5v4h1V7h-1Zm0 5v1h1v-1h-1Z" /></svg>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-[#242424]">{anomaly.riskType} spike detected — {anomaly.delta}</div>
              <div className="text-[13px] text-[#616161] mt-0.5">{anomaly.message}</div>
              <div className="text-[11px] text-[#A19F9D] mt-1">Detected {anomaly.detectedAgo}</div>
            </div>
          </div>

          {/* Recommended next steps for this spike */}
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-3">Recommended next steps</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#FAFAFA] rounded-lg border border-gray-100 hover:border-[#0078D4] hover:bg-[#F5F9FE] cursor-pointer transition-colors group">
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 bg-[#FDE7E9] text-[#C50F1F] text-[10px] font-bold rounded">CRITICAL</span>
                  <span className="text-[13px] text-[#242424]">Create DLP policy to block exfiltration from this agent</span>
                </div>
                <span className="text-[11px] text-[#0078D4] opacity-0 group-hover:opacity-100 transition-opacity">Create DLP policy →</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#FAFAFA] rounded-lg border border-gray-100 hover:border-[#0078D4] hover:bg-[#F5F9FE] cursor-pointer transition-colors group">
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 bg-[#FDE7E9] text-[#C50F1F] text-[10px] font-bold rounded">CRITICAL</span>
                  <span className="text-[13px] text-[#242424]">Review {recentActivities.filter(a => a.isSensitive).length} sensitive activities in the last 48 hours</span>
                </div>
                <span className="text-[11px] text-[#0078D4] opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); onNavigateToActivities?.() }}>View in Activity graph →</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 bg-[#FAFAFA] rounded-lg border border-gray-100 hover:border-[#0078D4] hover:bg-[#F5F9FE] cursor-pointer transition-colors group">
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 bg-[#FFF4CE] text-[#8A6914] text-[10px] font-bold rounded">HIGH</span>
                  <span className="text-[13px] text-[#242424]">Contact owner {enrichment.owner.name} ({enrichment.department}) about this spike</span>
                </div>
                <a href={`mailto:${enrichment.owner.email}`} className="text-[11px] text-[#0078D4] opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>{enrichment.owner.email} →</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ① SITUATION — "What am I looking at?"
          Full agent context — customers need this to orient.
         ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-[13px] font-semibold text-[#242424]">Agent details</h3>
          <span className="text-[11px] text-[#0078D4] hover:underline cursor-pointer">Show less</span>
        </div>

        {/* 4-column grid — Purview design pattern */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-4 gap-y-6 gap-x-6 text-sm">
            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Status</div>
              <div className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="#107C10"><circle cx="6" cy="6" r="6" /></svg>
                <span className="text-[#242424] font-medium text-[13px]">{agent.status}</span>
              </div>
            </div>
            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Platform</div>
              <div className="text-[#242424] text-[13px]">Microsoft 365 Agents</div>
            </div>
            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Agent Type</div>
              <div className="text-[#242424] text-[13px]">Autonomous Agent</div>
            </div>
            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Agent ID</div>
              <div className="text-[#242424] text-[13px] font-mono">{agent.agentId}</div>
            </div>

            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Owner</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E1DFDD] flex items-center justify-center text-[9px] font-semibold text-[#616161]">{enrichment.owner.initials}</div>
                <div>
                  <div className="text-[#242424] text-[13px] font-medium leading-tight">{enrichment.owner.name}</div>
                  <div className="text-[#616161] text-[11px] leading-tight">{enrichment.owner.email}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Created</div>
              <div className="text-[#242424] text-[13px]">Nov 3, 2025</div>
            </div>
            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Collection</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 border border-[#107C10] text-[#107C10] rounded-sm text-[10px] bg-green-50">Global</span>
                <span className="px-1.5 py-0.5 bg-gray-100 text-[#242424] rounded-sm text-[10px]">Sales team</span>
              </div>
            </div>
            <div>
              <div className="text-[#616161] text-[12px] mb-1.5">Description</div>
              <div className="text-[#242424] text-[13px] leading-relaxed">Sales enablement agent that retrieves customer data, generates proposals, and summarizes deal history.</div>
            </div>

            <div className="col-span-2">
              <div className="text-[#616161] text-[12px] mb-1.5">Knowledge sources & tools</div>
              <div className="flex flex-wrap gap-1.5">
                {['SharePoint', 'CRM-MCP', 'Salesforce-MCP', 'Outlook', 'Teams', 'OneDrive', 'SQL-Connector'].map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-gray-50 text-[#242424] rounded text-[11px] border border-gray-200">{t}</span>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-[#616161] text-[12px] mb-1.5">Instructions</div>
              <div className="text-[#242424] text-[13px] leading-relaxed">
                Process new leads from CRM, pull data from SharePoint and Salesforce, draft customer profiles and proposals…
                <span className="text-[#0078D4] text-[11px] hover:underline cursor-pointer ml-1.5">See More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ② ACTIVITY SUMMARY — "What's happening and how bad?"
          Risk signals + Connected resources + Policy gaps + Trend
         ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-[13px] font-semibold text-[#242424]">Activity summary</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigateToActivities?.()} className="text-[11px] text-[#0078D4] hover:underline">View in Activity graph →</button>
          </div>
        </div>

        <div className="p-5">
          {/* Top row: Risk level + Risk type breakdown */}
          <div className="flex items-start gap-8 mb-5">
            {/* Risk Level */}
            <div className="shrink-0">
              <div className="text-[11px] text-[#616161] mb-1.5 font-medium uppercase tracking-wide">Risk level</div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#C50F1F] font-bold text-[22px] leading-none">High</span>
                <div className="flex gap-0.5">
                  <div className="w-3.5 h-3.5 bg-[#C50F1F] rounded-sm" />
                  <div className="w-3.5 h-3.5 bg-[#C50F1F] rounded-sm" />
                  <div className="w-3.5 h-3.5 bg-[#C50F1F] rounded-sm" />
                  <div className="w-3.5 h-3.5 bg-gray-200 rounded-sm" />
                </div>
              </div>
              <div className="text-[10px] text-[#616161] mt-1.5">Based on 8 alerts from <span className="text-[#0078D4] hover:underline cursor-pointer">Insider Risk Management</span></div>
            </div>

            <div className="h-12 w-px bg-gray-200 shrink-0" />

            {/* Risk Type Breakdown */}
            <div className="flex-1">
              <div className="text-[11px] text-[#616161] mb-2 font-medium uppercase tracking-wide">Risk types (past 30 days)</div>
              <div className="flex items-end gap-6">
                {[
                  { type: 'Oversharing', count: 4, pct: '16%', color: 'bg-[#5C2D91]' },
                  { type: 'Exfiltration', count: 2, pct: '2%', color: 'bg-[#0078D4]' },
                  { type: 'Unethical', count: 2, pct: '2%', color: 'bg-[#00B7C3]' },
                ].map(({ type, count, pct, color }) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                    <span className="text-[18px] font-bold text-[#242424] leading-none">{count}</span>
                    <span className="text-[12px] text-[#616161]">{type}</span>
                    <span className="text-[10px] text-[#C50F1F] bg-[#FDE7E9] px-1 rounded">↑{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-5" />

          {/* Activity trend — all activities with risky ones highlighted */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] text-[#616161] font-medium uppercase tracking-wide">Activity trend</div>
              <span className="text-[10px] text-[#616161]">Past 30 days</span>
            </div>
            {(() => {
              const maxVal = 12
              const yTicks = [0, 4, 8, 12]
              const legendItems = [
                { key: 'normal', label: 'Normal activity', color: 'bg-[#E1DFDD]', barColor: '#E1DFDD' },
                { key: 'oversharing', label: 'Oversharing', color: 'bg-[#5C2D91]', barColor: '#5C2D91' },
                { key: 'exfiltration', label: 'Exfiltration', color: 'bg-[#0078D4]', barColor: '#0078D4' },
                { key: 'unethical', label: 'Unethical', color: 'bg-[#00B7C3]', barColor: '#00B7C3' },
              ]
              const noFilter = trendFilter.length === 0
              return (
                <>
                  <div className="h-[88px] w-full flex">
                    {/* Y-axis labels */}
                    <div className="shrink-0 w-6 pr-1.5 pb-4 flex flex-col justify-between text-[9px] text-[#616161] text-right">
                      {[...yTicks].reverse().map(v => <span key={v}>{v}</span>)}
                    </div>
                    {/* Chart area */}
                    <div className="relative flex-1 pb-4">
                      {/* Grid lines */}
                      <div className="absolute inset-0 pb-4 flex flex-col justify-between pointer-events-none">
                        {yTicks.map((_, i) => <div key={i} className="border-t border-gray-100 w-full" />)}
                      </div>
                      {/* Bars */}
                      <div className="absolute inset-0 bottom-4 flex items-end gap-[2px]">
                        {Array.from({ length: 30 }, (_, index) => {
                          // Normal (baseline) activity per day — variable pattern
                          const normalBase = [3, 5, 7, 4, 8, 6, 2, 4, 6, 8, 5, 3, 7, 4, 9, 6, 3, 5, 8, 4, 6, 3, 7, 5, 4, 6, 8, 3, 5, 7][index]
                          // Risky activities layered on top
                          const oversharing = [4, 9, 14, 22].includes(index) ? 1 : 0
                          const exfiltration = [14, 26].includes(index) ? 1 : 0
                          const unethical = [9, 18].includes(index) ? 1 : 0
                          const riskyTotal = oversharing + exfiltration + unethical
                          const total = normalBase + riskyTotal
                          const fullHeight = Math.min((total / maxVal) * 100, 100)
                          const normalHeight = (normalBase / total) * 100
                          const hasRisk = riskyTotal > 0

                          // Filter logic
                          const showNormal = noFilter || trendFilter.includes('normal')
                          const showOversharing = (noFilter || trendFilter.includes('oversharing')) && oversharing > 0
                          const showExfiltration = (noFilter || trendFilter.includes('exfiltration')) && exfiltration > 0
                          const showUnethical = (noFilter || trendFilter.includes('unethical')) && unethical > 0
                          const visibleRisky = (showOversharing ? oversharing : 0) + (showExfiltration ? exfiltration : 0) + (showUnethical ? unethical : 0)
                          const visibleTotal = (showNormal ? normalBase : 0) + visibleRisky
                          const barH = Math.min((visibleTotal / maxVal) * 100, 100)

                          return (
                            <div key={index} className="flex-1 h-full flex flex-col justify-end" title={`Day ${index + 1}: ${normalBase} normal${hasRisk ? `, ${riskyTotal} risky` : ''}  (${total} total)`}>
                              <div className="w-[75%] mx-auto flex flex-col-reverse" style={{ height: `${barH}%` }}>
                                {/* Normal activity base */}
                                {showNormal && visibleTotal > 0 && <div className="bg-[#E1DFDD] rounded-t-[1px]" style={{ height: `${(normalBase / visibleTotal) * 100}%`, minHeight: '1px' }} />}
                                {/* Risk segments stacked on top */}
                                {showOversharing && <div className="bg-[#5C2D91]" style={{ height: `${(oversharing / visibleTotal) * 100}%`, minHeight: '2px' }} />}
                                {showExfiltration && <div className="bg-[#0078D4]" style={{ height: `${(exfiltration / visibleTotal) * 100}%`, minHeight: '2px' }} />}
                                {showUnethical && <div className="bg-[#00B7C3]" style={{ height: `${(unethical / visibleTotal) * 100}%`, minHeight: '2px' }} />}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      {/* X-axis line */}
                      <div className="absolute bottom-4 left-0 right-0 border-t border-gray-200" />
                    </div>
                  </div>
                  {/* Clickable legend */}
                  <div className="flex items-center gap-4 ml-6 mt-1">
                    {legendItems.map(({ key, label, color }) => {
                      const isActive = noFilter || trendFilter.includes(key)
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setTrendFilter(prev => {
                              if (prev.length === 0) return [key]
                              if (prev.includes(key)) {
                                const next = prev.filter(k => k !== key)
                                return next.length === 0 ? [] : next
                              }
                              return [...prev, key]
                            })
                          }}
                          className={`flex items-center gap-1.5 text-[10px] transition-all px-1.5 py-0.5 rounded ${
                            isActive ? 'text-[#242424]' : 'text-[#A19F9D] opacity-50'
                          } hover:opacity-100`}
                        >
                          <div className={`w-2 h-2 rounded-full ${isActive ? color : 'bg-[#C8C6C4]'} transition-colors`} />
                          {label}
                        </button>
                      )
                    })}
                    {trendFilter.length > 0 && (
                      <button onClick={() => setTrendFilter([])} className="text-[10px] text-[#0078D4] hover:underline ml-1">Reset</button>
                    )}
                  </div>
                </>
              )
            })()}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-5" />

          {/* Connected Resources — derived from graph data */}
          <div>
            <div className="text-[11px] text-[#616161] mb-2.5 font-medium uppercase tracking-wide">Connected resources</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#616161" strokeWidth="1.2"><circle cx="8" cy="5" r="3" /><path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>,
                  count: proposalGroupChildren.users?.length ?? 0,
                  label: 'Users',
                  sub: null,
                  subColor: '',
                  targetGroup: 'users',
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#616161" strokeWidth="1.2"><rect x="3" y="1" width="10" height="14" rx="1" /><path d="M6 4h4M6 7h4" /></svg>,
                  count: proposalGroupChildren.siteFiles?.length ?? 0,
                  label: 'Files',
                  sub: `${proposalGroupChildren.siteFiles?.filter((n: any) => n.data?.isRisk).length ?? 0} sensitive`,
                  subColor: 'text-[#A4262C]',
                  targetGroup: 'sites',
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#616161" strokeWidth="1.2"><path d="M8 1l2 3h5l-4 3 1.5 5L8 9.5 3.5 12 5 7 1 4h5l2-3Z" /></svg>,
                  count: (proposalGroupChildren.tools?.length ?? 0) + (proposalGroupChildren.toolsMore?.length ?? 0) - 1,
                  label: 'Tools',
                  sub: null,
                  subColor: '',
                  targetGroup: 'tools',
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#616161" strokeWidth="1.2"><circle cx="8" cy="8" r="3" /><circle cx="8" cy="8" r="6" /></svg>,
                  count: proposalGroupChildren.agents?.length ?? 0,
                  label: 'Agents',
                  sub: `${proposalGroupChildren.agents?.filter((n: any) => n.data?.isRisk).length ?? 0} risky`,
                  subColor: 'text-[#A4262C]',
                  targetGroup: 'agents',
                },
              ].map((r) => (
                <div
                  key={r.label}
                  onClick={() => onNavigateToActivities?.(r.targetGroup)}
                  className="bg-[#FAFAFA] border border-gray-100 rounded-lg px-4 py-3 hover:border-[#0078D4] hover:bg-[#F5F9FE] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[#616161] group-hover:text-[#0078D4] transition-colors">{r.icon}</span>
                    <span className="text-[18px] font-bold text-[#242424]">{r.count}</span>
                  </div>
                  <div className="text-[12px] text-[#616161]">{r.label}</div>
                  {r.sub && <div className={`text-[11px] ${r.subColor} font-medium mt-0.5`}>{r.sub}</div>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RECENT SENSITIVE ACTIVITIES — "What happened?"
         ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-[13px] font-semibold text-[#242424]">Recent sensitive activities</h3>
          <span className="text-[11px] text-[#0078D4] hover:underline cursor-pointer">View all activities</span>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivities.map((act) => (
            <div key={act.id} className={`px-5 py-3 flex items-center gap-3 ${act.isSensitive ? 'bg-[#FDE7E9]/20' : ''}`}>
              {act.isSensitive ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="#C50F1F" className="shrink-0"><path d="M8 2l6 11H2L8 2Zm-.5 4v3h1V6h-1Zm0 4v1h1v-1h-1Z" /></svg>
              ) : (
                <div className="w-[14px] shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[#242424] truncate">{act.title}</div>
              </div>
              <div className="text-[11px] text-[#616161] shrink-0 mr-3">{act.date}</div>
              {act.riskType && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FDE7E9] text-[#C50F1F] font-medium shrink-0">{act.riskType}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DATA PROTECTION
         ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-[13px] font-semibold text-[#242424]">Data protection</h3>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-4">
            {[
              { label: 'DLP policies', value: agent.dataProtection, isGap: agent.dataProtection === '0 Policies' },
              { label: 'Compliance policies', value: agent.dataCompliance, isGap: agent.dataCompliance === '0 Policies' },
            ].map(({ label, value, isGap }) => (
              <div key={label} className={`flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg border ${isGap ? 'bg-[#FDE7E9]/30 border-[#C50F1F]/20' : 'bg-[#DFF6DD]/30 border-[#107C10]/20'}`}>
                {isGap ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#C50F1F"><path d="M8 2l6 11H2L8 2Zm-.5 4v3h1V6h-1Zm0 4v1h1v-1h-1Z" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#107C10"><circle cx="8" cy="8" r="7" /><path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" /></svg>
                )}
                <div>
                  <div className="text-[11px] text-[#616161]">{label}</div>
                  <div className={`text-[13px] font-semibold ${isGap ? 'text-[#C50F1F]' : 'text-[#107C10]'}`}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RECOMMENDED ACTIONS
         ═══════════════════════════════════════════════════════════ */}
      <RecommendationsSection agent={agent} />
    </div>
  )
}

export default function ClevelandAgentDetails() {
  const { agentId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const agent = rows.find((r) => r.agentId === agentId)

  if (!agent) {
    return <div className="p-6">Agent not found</div>
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-auto">
      {/* Breadcrumb */}
      <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center gap-2">
        <button onClick={() => navigate('/cleveland')} className="text-[#0078D4] hover:underline flex items-center gap-1 text-sm font-semibold">
          &larr; Back
        </button>
        <span className="text-[#616161] text-sm">/ Agents / {agent.name}</span>
        <span className="ml-auto px-2 py-0.5 bg-[#EBF3FC] text-[#0078D4] text-[10px] font-semibold rounded border border-[#0078D4]/20">CLEVELAND</span>
      </div>

      <div className="w-full">
        {/* Header */}
        <div className="bg-white px-8 pt-6 pb-0 shadow-sm border-b border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" fill="#0078D4" />
                <path d="M12 5.5L17 8.39V14.17L12 17.06L7 14.17V8.39L12 5.5Z" fill="#FFFFFF" />
                <path d="M12 8L14.5 9.44V12.33L12 13.77L9.5 12.33V9.44L12 8Z" fill="#0078D4" />
              </svg>
            </div>
            <div>
              <h1 className="text-[20px] font-semibold text-[#242424]">{agent.name}</h1>
              <p className="text-[12px] text-[#616161] mt-1 max-w-3xl">
                [This agent helps the North America Sales team process new leads, pulling data from CRM and SharePoint and drafting customer profiles.]
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-6">
            {['Overview', 'Activity graph', 'Recommendations', 'Policies'].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 font-medium text-sm cursor-pointer transition-colors ${activeTab === tab ? 'border-[#0078D4] text-[#242424] font-semibold' : 'border-transparent text-[#616161] hover:text-[#242424]'}`}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-gray-50 min-h-screen">
          {activeTab === 'Overview' && <OverviewContent agent={agent} onNavigateToActivities={(targetGroup?: string) => { setActiveTab('Activity graph'); if (targetGroup) { setTimeout(() => { const event = new CustomEvent('navigate-to-group', { detail: targetGroup }); window.dispatchEvent(event); }, 100); } }} />}
          {activeTab === 'Activity graph' && (
            <div>
              <ActivitiesContent />
            </div>
          )}
          {activeTab === 'Recommendations' && (
            <div className="p-12 text-center text-gray-500">Recommendations content would go here.</div>
          )}
          {activeTab === 'Policies' && (
            <div className="p-12 text-center text-gray-500">Policies content would go here.</div>
          )}
        </div>
      </div>
    </div>
  )
}

