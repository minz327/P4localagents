
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'react-flow-renderer';
import { rows } from '../../lib/agentsData'

// --- Custom Node Components for the Graph ---

const CustomNode = ({ data }: { data: any }) => {
  const isRoot = data.type === 'root';
    const hasCount = !!data.countBadge;
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
        
                {/* Icon based on label */}
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
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// --- Mock Data ---

const knowledgeSourceCount = 1
const sharePointSensitiveFiles = [
    { id: 'file-1', name: 'Payroll-Q4.xlsx', isRisk: true },
    { id: 'file-2', name: 'CompPlan-2026.docx', isRisk: true },
    { id: 'file-3', name: 'M&A-Notes.pdf', isRisk: false },
    { id: 'file-4', name: 'Board-Draft.pptx', isRisk: false },
    { id: 'file-5', name: 'Customer-PII.csv', isRisk: false },
]
const knowledgeSensitiveCount = sharePointSensitiveFiles.filter(file => file.isRisk).length
const knowledgeBranchHasRisk = knowledgeSensitiveCount > 0

const graphNodes: any[] = [
  // Root
        { id: '1', type: 'custom', position: { x: 540, y: 0 }, data: { label: 'Sales Agent', type: 'root' } },
    // Level 2 asset groups
                { id: 'users', type: 'custom', position: { x: 80, y: 220 }, data: { label: 'Users', subLabel: '3 users', countBadge: '+3', expandable: true, groupId: 'users' } },
                { id: 'sites', type: 'custom', position: { x: 340, y: 220 }, data: { label: 'Knowledge sources', subLabel: 'SharePoint', countBadge: knowledgeSourceCount > 0 ? `+${knowledgeSourceCount}` : undefined, isRisk: knowledgeBranchHasRisk, expandable: true, groupId: 'sites' } },
                { id: 'tools', type: 'custom', position: { x: 620, y: 220 }, data: { label: 'Tools', subLabel: '13 tools', countBadge: '+13', expandable: true, groupId: 'tools' } },
                { id: 'agents', type: 'custom', position: { x: 900, y: 220 }, data: { label: 'Agents', subLabel: '3 agents', countBadge: '+3', isRisk: true, expandable: true, groupId: 'agents' } },
];

const graphEdges: any[] = [
    { id: 'e1-users', source: '1', target: 'users', type: 'smoothstep' },
    { id: 'e1-sites', source: '1', target: 'sites', type: 'smoothstep', animated: true, style: knowledgeBranchHasRisk ? { stroke: '#C50F1F' } : undefined },
    { id: 'e1-tools', source: '1', target: 'tools', type: 'smoothstep' },
    { id: 'e1-agents', source: '1', target: 'agents', type: 'smoothstep', animated: true, style: { stroke: '#C50F1F' } },
];

const groupChildren: Record<string, any[]> = {
    users: [
        { id: 'user-1', type: 'custom', position: { x: -70, y: 430 }, data: { label: 'Riley Chen', subLabel: 'Marketing', avatarInitials: 'RC' } },
        { id: 'user-2', type: 'custom', position: { x: 90, y: 430 }, data: { label: 'Morgan Lee', subLabel: 'Editor', avatarInitials: 'ML' } },
        { id: 'user-3', type: 'custom', position: { x: 250, y: 430 }, data: { label: 'Jordan Patel', subLabel: 'Admin', avatarInitials: 'JP' } },
    ],
    sites: [
        { id: 'site-1', type: 'custom', position: { x: 340, y: 430 }, data: { label: 'SharePoint', subLabel: 'Sensitive files', isRisk: knowledgeBranchHasRisk, countBadge: knowledgeSensitiveCount > 0 ? `+${knowledgeSensitiveCount}` : undefined, expandable: true, groupId: 'siteFiles' } },
    ],
    siteFiles: sharePointSensitiveFiles.map((file, index) => ({
        id: file.id,
        type: 'custom',
        position: { x: 40 + (index * 120), y: 670 },
        data: { label: file.name, isRisk: file.isRisk },
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

const groupChildEdges: Record<string, any[]> = {
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

const groupHierarchy: Record<string, string[]> = {
    sites: ['siteFiles'],
    tools: ['toolsMore'],
}

const usersPanelRows = (groupChildren.users ?? []).map((node: any, index: number) => {
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

const shouldShowUsersPagination = usersPanelRows.length > 10

function getDescendantGroups(groupId: string): string[] {
    const directChildren = groupHierarchy[groupId] ?? []
    return directChildren.reduce<string[]>((all, childId) => {
        return [...all, childId, ...getDescendantGroups(childId)]
    }, [])
}

function getActivitiesGraphData(expandedGroups: string[]) {
    const nodes = [...graphNodes]
    const edges = [...graphEdges]

    expandedGroups.forEach((groupId) => {
        if (groupChildren[groupId]) {
            nodes.push(...groupChildren[groupId])
        }
        if (groupChildEdges[groupId]) {
            edges.push(...groupChildEdges[groupId])
        }
    })

    const riskNodeIds = new Set(
        nodes
            .filter((node: any) => !!node?.data?.isRisk)
            .map((node: any) => node.id)
    )

    const styledEdges = edges.map((edge: any) => {
        const isRiskTarget = riskNodeIds.has(edge.target)
        return {
            ...edge,
            animated: isRiskTarget,
            style: {
                ...(edge.style ?? {}),
                stroke: isRiskTarget ? '#C50F1F' : '#B3B3B3',
            },
        }
    })

    return { nodes, edges: styledEdges }
}

function getNodeDetailModel(node: any) {
    const id = String(node?.id ?? '')
    const label = node?.data?.label ?? 'Node'
    const subLabel = node?.data?.subLabel ?? '-'
    const isRisk = !!node?.data?.isRisk

    if (id.startsWith('user-')) {
        return {
            title: label,
            category: 'User',
            summary: 'User activity connected to this agent execution path.',
            items: [
                { label: 'Name', value: label },
                { label: 'Role', value: subLabel },
                { label: 'Source', value: 'Users branch' },
            ],
            status: isRisk ? 'Potential risk' : 'Monitored',
        }
    }

    if (id.startsWith('file-')) {
        return {
            title: label,
            category: 'File',
            summary: 'File surfaced from knowledge source activity.',
            items: [
                { label: 'File name', value: label },
                { label: 'Repository', value: 'SharePoint' },
                { label: 'Sensitivity', value: isRisk ? 'Sensitive' : 'Standard' },
            ],
            status: isRisk ? 'Potential risk' : 'Monitored',
        }
    }

    if (id.startsWith('tool-')) {
        return {
            title: label,
            category: 'Tool',
            summary: 'Tool invoked by this agent during activity execution.',
            items: [
                { label: 'Tool', value: label },
                { label: 'Family', value: 'Microsoft 365' },
                { label: 'Type', value: 'Productivity tool' },
            ],
            status: isRisk ? 'Potential risk' : 'Monitored',
        }
    }

    if (id.startsWith('agent-')) {
        return {
            title: label,
            category: 'Agent',
            summary: 'Connected downstream agent in the activity chain.',
            items: [
                { label: 'Agent name', value: label },
                { label: 'Usage', value: subLabel },
                { label: 'Branch', value: 'Agents' },
            ],
            status: isRisk ? 'Potential risk' : 'Monitored',
        }
    }

    return {
        title: label,
        category: 'Node',
        summary: 'Selected graph node details.',
        items: [
            { label: 'Label', value: label },
            { label: 'Details', value: subLabel },
        ],
        status: isRisk ? 'Potential risk' : 'Monitored',
    }
}

function ActivitiesContent() {
    const [showLeftPanel, setShowLeftPanel] = useState(false)
    const [showRightPanel, setShowRightPanel] = useState(false)
    const [detailPanelWidth, setDetailPanelWidth] = useState(520)
    const [isResizingRightPanel, setIsResizingRightPanel] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
        const [expandedGroups, setExpandedGroups] = useState<string[]>([])
        const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
        const initialGraphData = getActivitiesGraphData([])
        const [nodes, setNodes, onNodesChange] = useNodesState(initialGraphData.nodes as any);
        const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraphData.edges);
  const [selectedActivity, setSelectedActivity] = useState(1);
      const [selectedNode, setSelectedNode] = useState<any>(null)
    const [lastClickedNodeId, setLastClickedNodeId] = useState<string | null>(null)
        const [selectedUsersPanelRow, setSelectedUsersPanelRow] = useState<any | null>(null)

          const selectedNodeDetails = selectedNode ? getNodeDetailModel(selectedNode) : null
                    const isUsersSummaryNode = selectedNode?.id === 'users'
                                        const isUsersRowDetailView = isUsersSummaryNode && !!selectedUsersPanelRow

        useEffect(() => {
            const nextGraphData = getActivitiesGraphData(expandedGroups)
            const highlightedNodes = (nextGraphData.nodes as any[]).map((node: any) => ({
                ...node,
                data: {
                    ...node.data,
                    isLastClicked: node.id === lastClickedNodeId,
                },
            }))

            setNodes(highlightedNodes as any)
            setEdges(nextGraphData.edges as any)
        }, [expandedGroups, lastClickedNodeId, setNodes, setEdges])

        useEffect(() => {
            if (!reactFlowInstance) {
                return
            }

            const fitGraph = () => {
                reactFlowInstance.fitView({
                    padding: 0.2,
                    minZoom: 0.35,
                    maxZoom: 1,
                    duration: 250,
                })
            }

            const frame = window.requestAnimationFrame(fitGraph)
            window.addEventListener('resize', fitGraph)

            return () => {
                window.cancelAnimationFrame(frame)
                window.removeEventListener('resize', fitGraph)
            }
        }, [reactFlowInstance, expandedGroups, showLeftPanel, showRightPanel])

        useEffect(() => {
            if (!isResizingRightPanel) {
                return
            }

            const onMouseMove = (event: MouseEvent) => {
                const containerRect = containerRef.current?.getBoundingClientRect()
                if (!containerRect) {
                    return
                }

                const nextWidth = containerRect.right - event.clientX
                const clampedWidth = Math.max(340, Math.min(760, nextWidth))
                setDetailPanelWidth(clampedWidth)
            }

            const onMouseUp = () => {
                setIsResizingRightPanel(false)
            }

            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp)

            return () => {
                window.removeEventListener('mousemove', onMouseMove)
                window.removeEventListener('mouseup', onMouseUp)
            }
        }, [isResizingRightPanel])

        useEffect(() => {
            if (!isUsersSummaryNode) {
                setSelectedUsersPanelRow(null)
            }
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
                 {/* Card 1 (Active) */}
                 <div 
                    onClick={() => setSelectedActivity(1)}
                    className={`p-3 rounded border cursor-pointer transition-all ${selectedActivity === 1 ? 'bg-white border-[#0078D4] shadow-md ring-1 ring-[#0078D4]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                 >
                     <div className="flex items-start gap-2 mb-1">
                        <button className="mt-0.5 text-gray-500">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                        </button>
                        <div>
                             <h3 className="text-[13px] font-semibold text-[#242424] leading-tight">Posted sensitive document to public SharePoint site</h3>
                             <div className="text-[10px] text-[#616161] mt-1">June 24, 2025 (UTC)</div>
                             <div className="text-[9px] bg-gray-100 text-[#616161] px-1.5 py-0.5 rounded w-fit mt-1">Oversharing</div>
                             <p className="text-[11px] text-[#616161] mt-2 leading-snug">
                                 Riley accessed 402 items containing sensitive info that are not labeled for protection.
                             </p>
                        </div>
                     </div>
                 </div>

                 {/* Card 2 */}
                 <div 
                    onClick={() => setSelectedActivity(2)}
                    className={`p-3 rounded border cursor-pointer transition-all ${selectedActivity === 2 ? 'bg-white border-[#0078D4] shadow-md ring-1 ring-[#0078D4]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                 >
                     <div className="flex items-start gap-2">
                        <button className="mt-0.5 text-gray-500">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        <div className="w-full">
                             <h3 className="text-[13px] font-semibold text-[#242424] leading-tight">402 unlabeled sensitive files accessed</h3>
                             <div className="text-[10px] text-[#616161] mt-1">June 24, 2025 (UTC)</div>
                             <div className="text-[9px] bg-gray-100 text-[#616161] px-1.5 py-0.5 rounded w-fit mt-1 mb-2">Oversharing</div>
                             <button className="text-[10px] border border-gray-300 px-2 py-1 rounded w-full text-center hover:bg-gray-50">View details</button>
                        </div>
                     </div>
                 </div>

                 {/* Card 3 */}
                 <div className="p-3 bg-white rounded border border-gray-200 hover:border-gray-300 cursor-pointer">
                     <div className="flex items-start gap-2">
                        <button className="mt-0.5 text-gray-500">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
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
                            <button
                                className="absolute top-3 left-3 z-20 px-2 py-1 text-[11px] rounded border border-gray-300 bg-white text-[#242424] hover:bg-gray-50"
                                onClick={() => setShowLeftPanel(true)}
                            >
                                Show activities
                            </button>
                        )}
                        {!showRightPanel && (
                            <button
                                className="absolute top-3 right-3 z-20 px-2 py-1 text-[11px] rounded border border-gray-300 bg-white text-[#242424] hover:bg-gray-50"
                                onClick={() => setShowRightPanel(true)}
                            >
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
                                            const descendants = getDescendantGroups(node.data.groupId)
                                            return previous.filter((groupId) => groupId !== node.data.groupId && !descendants.includes(groupId))
                                        }
                                        return [...previous, node.data.groupId]
                                    })
                                }
                            }}
              nodeTypes={nodeTypes}
              fitView
                            fitViewOptions={{ padding: 0.2, minZoom: 0.35, maxZoom: 1 }}
                            minZoom={0.35}
              attributionPosition="bottom-left"
            >
                <Controls className="!bg-white !shadow-sm !border !border-gray-200" />
                <Background color="#aaa" gap={16} size={1} />
                <MiniMap 
                    nodeStrokeColor={(n) => {
                        if (n.type === 'custom') return '#ddd';
                        return '#eee';
                    }}
                    nodeColor={(n) => {
                        if (n.data?.isRisk) return '#ffccce';
                        return '#fff';
                    }}
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
                    ) : (
                        <div />
                    )}
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
                                <input
                                    value=""
                                    readOnly
                                    placeholder="Search"
                                    className="w-full h-10 rounded border border-gray-300 bg-white pl-10 pr-3 text-[14px] placeholder:text-[#616161]"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-[minmax(180px,1fr)_120px_72px_92px] gap-2 items-center border-b border-gray-200 pb-1">
                                <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">User</div>
                                <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">User risk</div>
                                <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">Activities</div>
                                <div className="text-[11px] leading-[16px] font-semibold text-[#424242]">Sensitive activities</div>
                            </div>
                            {usersPanelRows.map((row) => (
                                <button
                                    key={row.id}
                                    className="w-full text-left grid grid-cols-[minmax(180px,1fr)_120px_72px_92px] gap-2 items-center rounded-sm hover:bg-[#F9F9F9] px-1 py-1"
                                    onClick={() => setSelectedUsersPanelRow(row)}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-9 h-9 rounded-full text-white text-[12px] leading-none font-semibold flex items-center justify-center shrink-0 ${row.avatarBg}`}>{row.initials}</div>
                                        <div className="min-w-0">
                                            <div className="text-[13px] leading-[18px] font-semibold text-[#242424] truncate">{row.name}</div>
                                        </div>
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

                        {shouldShowUsersPagination && (
                            <div className="flex items-center justify-center gap-8 pt-3">
                                <button className="text-[#616161] hover:text-[#242424]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                                </button>
                                <div className="flex items-center gap-8 text-[14px] leading-[18px]">
                                    <span className="text-[#242424] border-b-4 border-[#0F6CBD] pb-1">1</span>
                                </div>
                                <button className="text-[#616161] hover:text-[#242424]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            </div>
                        )}
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

function OverviewContent({ agent, onOpenActivities }: { agent: any; onOpenActivities: () => void }) {
    const trendData = Array.from({ length: 30 }, (_, index) => {
        const oversharing = [4, 9, 14, 22].includes(index) ? 1 : 0
        const exfiltration = [14, 26].includes(index) ? 1 : 0
        const unethical = [9, 18].includes(index) ? 1 : 0

        return {
            day: `Nov ${index + 1}`,
            oversharing,
            exfiltration,
            unethical,
        }
    })

    const trendMax = 2

  return (
    <div className="space-y-6">
      {/* Agent Details Section (Expanded) */}
      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-[14px] font-bold text-[#242424]">Agent details</h3>
              <span className="text-xs text-[#0078D4] hover:underline cursor-pointer">Show less</span>
          </div>
          
          <div className="grid grid-cols-4 gap-y-6 gap-x-4 text-sm">
              {/* Row 1 */}
              <div>
                  <div className="text-[#616161] mb-1">Status</div>
                  <div className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="#107C10"><circle cx="6" cy="6" r="6" /><path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" fill="none"/></svg>
                      <span className="text-[#242424] font-medium">{agent.status}</span>
                  </div>
              </div>
              <div>
                  <div className="text-[#616161] mb-1">Collection</div>
                  <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 border border-[#107C10] text-[#107C10] rounded-sm text-[10px] bg-green-50 flex items-center gap-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg> Global</span>
                      <span className="px-1.5 py-0.5 bg-gray-100 text-[#242424] rounded-sm text-[10px]">Sales team</span>
                      <span className="px-1.5 py-0.5 border border-[#C50F1F] text-[#C50F1F] rounded-sm text-[10px] bg-red-50 flex items-center gap-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> Quarantined</span>
                  </div>
              </div>
              <div>
                  <div className="text-[#616161] mb-1">Platform</div>
                  <div className="text-[#242424]">Agent 365</div>
              </div>
              <div>
                  <div className="text-[#616161] mb-1">Knowledge sources and tools</div>
                  <div className="flex flex-wrap gap-1">
                      {['SharePoint', 'CRM-MCP','Salesforce-MCP', 'Outlook', 'Teams'].map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-[#242424] rounded text-[11px] border border-gray-200">{t}</span>
                      ))}
                      <span className="px-1.5 py-0.5 bg-gray-100 text-[#242424] rounded text-[11px] border border-gray-200">+2</span>
                  </div>
              </div>

              {/* Row 2 */}
              <div>
                   <div className="text-[#616161] mb-1">Policy coverage</div>
                   <div className="text-[#242424] text-[13px]">{agent.dataProtection} (10), {agent.dataCompliance} (10)</div>
                   <div className="text-[#0078D4] text-xs hover:underline cursor-pointer mt-0.5">View policies</div>
              </div>
              <div>
                  <div className="text-[#616161] mb-1">Created</div>
                  <div className="text-[#242424] text-[13px]">Nov 3, 2025</div>
              </div>
              <div>
                  <div className="text-[#616161] mb-1">Owner</div>
                  <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#E1DFDD] flex items-center justify-center text-[10px] font-semibold text-[#616161]">JB</div>
                      <div>
                          <div className="text-[#242424] text-[13px] leading-tight">John Brown</div>
                          <div className="text-[#616161] text-[11px] leading-tight">johnbrown@contoso.com</div>
                      </div>
                  </div>
              </div>
              <div>
                  <div className="text-[#616161] mb-1">Agent ID</div>
                  <div className="text-[#242424] text-[13px] font-mono">{agent.agentId}</div>
              </div>

              {/* Row 3 */}
              <div>
                  <div className="text-[#616161] mb-1">Instance of</div>
                  <div className="flex items-center gap-1 text-[#0078D4] text-[13px] hover:underline cursor-pointer">
                      <span className="w-3 h-3 bg-blue-100 rounded-sm inline-block"></span> Sales Agent
                  </div>
              </div>
              <div>
                  <div className="text-[#616161] mb-1">Agent user ID</div>
                  <div className="text-[#242424] text-[13px]">a-riley.sales@contoso.com</div>
              </div>
          </div>
      </div>

      {/* Activity Section */}
      <div>
          <div className="flex justify-between items-end mb-2">
              <div>
                  <h2 className="text-sm font-bold text-[#242424]">Activity</h2>
                  <p className="text-xs text-[#616161]">View potentially risky agent activity based on alerts generated by Insider Risk Management policies.</p>
              </div>
                            <span
                                className="text-xs text-[#0078D4] hover:underline cursor-pointer"
                                onClick={onOpenActivities}
                            >
                                View all activities
                            </span>
          </div>

           {/* Risk Level Card */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-6">
              <div className="text-[#616161] text-xs font-semibold mb-2">Risk level</div>
              <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#C50F1F] font-bold text-lg">High risk</span>
              </div>
              <div className="flex gap-1 mb-6">
                  <div className="w-4 h-4 bg-[#C50F1F]"></div>
                  <div className="w-4 h-4 bg-[#C50F1F]"></div>
                  <div className="w-4 h-4 bg-[#C50F1F]"></div>
                  <div className="w-4 h-4 bg-gray-200"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-6">
                 {['Oversharing', 'Exfiltration', 'Unethical'].map((type, i) => (
                     <div key={type}>
                          <div className="flex items-baseline gap-1">
                              <span className="text-xl font-bold text-[#242424]">{i === 0 ? '4' : '2'}</span>
                              <span className="text-[10px] text-[#C50F1F] bg-[#FDE7E9] px-1 rounded flex items-center">
                                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M6 3L3.5 5.5M6 3L8.5 5.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                                  {i === 0 ? '16%' : '2%'} in the past 30 days
                              </span>
                          </div>
                          <div className="text-xs text-[#616161] mt-1">{type}</div>
                     </div>
                 ))}
              </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
               <div className="mb-6">
                   <h3 className="text-sm font-bold text-[#242424]">Sensitive activity trend</h3>
                   <p className="text-xs text-[#616161] mt-1">Agent activities that contain sensitive information types</p>
                   <div className="text-[10px] text-[#C50F1F] bg-[#FDE7E9] inline-flex items-center gap-1 px-1 rounded mt-2">
                       <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M6 3L3.5 5.5M6 3L8.5 5.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                       54% in the past 30 days
                   </div>
               </div>

               {/* Chart Bars */}
               <div className="h-[220px] w-full mt-8 flex">
                    <div className="shrink-0 w-10 pr-2 pb-6 flex flex-col justify-between text-[9px] text-[#616161] text-right">
                        <span>2</span>
                        <span>1.5</span>
                        <span>1</span>
                        <span>0.5</span>
                        <span>0</span>
                    </div>

                    <div className="relative flex-1 pb-6">
                        <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="border-t border-gray-100 w-full" />
                            ))}
                        </div>

                        <div className="absolute top-0 bottom-6 left-0 w-px bg-gray-200" />

                        <div className="absolute inset-0 bottom-6 flex items-end justify-between gap-1">
                            {trendData.map((item, i) => {
                                const total = item.oversharing + item.exfiltration + item.unethical
                                const barHeight = Math.min((total / trendMax) * 100, 100)

                                return (
                                    <div key={item.day} className="flex-1 h-full flex flex-col justify-end group relative">
                                        <div className="w-[60%] mx-auto flex flex-col-reverse gap-[1px]" style={{ height: `${barHeight}%` }}>
                                            {total > 0 && item.unethical > 0 && <div className="bg-[#00B7C3] hover:opacity-80 transition-opacity" style={{ height: `${(item.unethical / total) * 100}%` }}></div>}
                                            {total > 0 && item.exfiltration > 0 && <div className="bg-[#0078D4] hover:opacity-80 transition-opacity" style={{ height: `${(item.exfiltration / total) * 100}%` }}></div>}
                                            {total > 0 && item.oversharing > 0 && <div className="bg-[#5C2D91] hover:opacity-80 transition-opacity" style={{ height: `${(item.oversharing / total) * 100}%` }}></div>}
                                        </div>
                                        {i % 2 === 0 && (
                                            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[9px] text-[#616161] whitespace-nowrap">
                                                {item.day}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
               </div>
               {/* Legend */}
               <div className="flex items-center gap-4 mt-8 ml-4">
                   <div className="flex items-center gap-1.5 text-[11px] text-[#616161]">
                       <div className="w-2 h-2 rounded-full bg-[#5C2D91]"></div> Oversharing
                   </div>
                   <div className="flex items-center gap-1.5 text-[11px] text-[#616161]">
                       <div className="w-2 h-2 rounded-full bg-[#0078D4]"></div> Exfiltration
                   </div>
                   <div className="flex items-center gap-1.5 text-[11px] text-[#616161]">
                       <div className="w-2 h-2 rounded-full bg-[#00B7C3]"></div> Unethical
                   </div>
               </div>
          </div>
      </div>

      {/* Recommendations Section */}
      <div>
          <div className="flex justify-between items-end mb-2 pt-4">
              <div>
                  <h2 className="text-sm font-bold text-[#242424]">Recommendations</h2>
                  <p className="text-xs text-[#616161]">View key actions to take based on risky behavior detected.</p>
              </div>
              <span className="text-xs text-[#0078D4] hover:underline cursor-pointer">View recommendations</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                  <span className="px-2 py-1 bg-gray-100 text-[#616161] text-[10px] font-semibold border border-gray-200 rounded flex items-center gap-1 w-fit mb-3">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      Users and other agents
                  </span>
                  <h3 className="text-sm font-bold text-[#242424] mb-2">Detect and remediate potential insider risks</h3>
                  <p className="text-xs text-[#616161] leading-relaxed mb-4">
                      Create an Insider Risk Management (IRM) policy combining email indicators, the upload-to-web indicator, sensitive info types (SITs), and unallowed domains. This helps to detect, investigate, and address potential insider risks, such as data theft, data leaks, and other risky behaviors.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                      <span className="text-[#0078D4] text-xs hover:underline cursor-pointer flex items-center gap-1">
                          Learn more about Insider Risk Management <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </span>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-[#D1D1D1] rounded text-[11px] font-semibold text-[#242424] hover:bg-gray-50 mt-4">
                      Investigate alerts <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </button>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                  <span className="px-2 py-1 bg-gray-100 text-[#616161] text-[10px] font-semibold border border-gray-200 rounded flex items-center gap-1 w-fit mb-3">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                      Tools
                  </span>
                  <h3 className="text-sm font-bold text-[#242424] mb-2">Identify risks from sensitive info exposure</h3>
                  <p className="text-xs text-[#616161] leading-relaxed mb-4">
                      Create a Data Security Investigations (preview) to analyze and respond to data security incidents, risky insiders, and data breaches. Investigations help you quickly identify risks from sensitive info exposure and more effectively collaborate with your partner teams to remediate the issues and simplify tasks.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                      <span className="text-[#0078D4] text-xs hover:underline cursor-pointer flex items-center gap-1">
                          Learn more about Data Security Investigations <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </span>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-[#D1D1D1] rounded text-[11px] font-semibold text-[#242424] hover:bg-gray-50 mt-4">
                      Create investigation <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </button>
              </div>
          </div>
      </div>
    </div>
  )
}

function RecommendationsContent() {
    const cards = [
      {
        category: 'Users and other agents',
        categoryIcon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#616161" strokeWidth="1.3"><circle cx="7" cy="6" r="3" /><path d="M1 16c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5" /><circle cx="14" cy="7" r="2.5" /><path d="M14 11.5c2.5 0 5 1.5 5 4" /></svg>,
        title: 'Detect and remediate potential insider risks',
        description: 'Create an Insider Risk Management (IRM) policy combining email indicators, the upload-to-web indicator, sensitive info types (SITs), and unallowed domains. This helps to detect, investigate, and address potential insider risks, such as data theft, data leaks, and other risky behaviors.',
        learnMoreLabel: 'Learn more about Insider Risk Management',
        learnMoreUrl: '#',
        actionLabel: 'Investigate alerts',
        actionUrl: '#',
      },
      {
        category: 'Tools',
        categoryIcon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#616161" strokeWidth="1.3"><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="11" y="3" width="6" height="6" rx="1" /><rect x="3" y="11" width="6" height="6" rx="1" /><rect x="11" y="11" width="6" height="6" rx="1" /></svg>,
        title: 'Identify risks from sensitive info exposure',
        description: 'Create a Data Security Investigations (preview) to analyze and respond to data security incidents, risky insiders, and data breaches. Investigations help you quickly identify risks from sensitive info exposure and more effectively collaborate with your partner teams to remediate the issues and simplify tasks that traditionally are time consuming and complex.',
        learnMoreLabel: 'Learn more about Data Security Investigations',
        learnMoreUrl: '#',
        actionLabel: 'Create investigation',
        actionUrl: '#',
      },
      {
        category: 'Activities',
        categoryIcon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#616161" strokeWidth="1.3"><rect x="3" y="2" width="14" height="16" rx="2" /><path d="M7 6h6M7 10h6M7 14h4" /></svg>,
        title: 'Prevent loss of sensitive info',
        description: 'Create a Data Loss Protection (DLP) policy using the highlighted sensitive info types (SITs), targeting Exchange and devices, and including restricted domains. This limits unauthorized sharing, use, or transfer of sensitive information in devices, apps, and services, including AI apps and agents.',
        learnMoreLabel: 'Learn more about sensitive data protection policies in DLP',
        learnMoreUrl: '#',
        actionLabel: 'Review alerts',
        actionUrl: '#',
      },
      {
        category: 'Activities',
        categoryIcon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#616161" strokeWidth="1.3"><rect x="3" y="2" width="14" height="16" rx="2" /><path d="M7 6h6M7 10h6M7 14h4" /></svg>,
        title: 'Manage unethical conversations',
        description: 'Create a Communication compliance policy to detect, capture, and act on inappropriate messages that can lead to potential data security or compliance incidents within your organization.',
        learnMoreLabel: 'Learn more about Communication Compliance',
        learnMoreUrl: '#',
        actionLabel: 'Manage communications',
        actionUrl: '#',
      },
      {
        category: 'Knowledge sources',
        categoryIcon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#616161" strokeWidth="1.3"><path d="M3 4c0-1 2-2 7-2s7 1 7 2v12c0 1-2 2-7 2s-7-1-7-2V4Z" /><path d="M3 4c0 1 2 2 7 2s7-1 7-2" /></svg>,
        title: 'Classify and protect data',
        description: 'Protect your data as it travels inside and outside your organization with sensitivity labels.',
        learnMoreLabel: 'Learn more about auto-labeling in MIP',
        learnMoreUrl: '#',
        actionLabel: 'Auto-label knowledge sources',
        actionUrl: '#',
      },
      {
        category: 'Knowledge sources',
        categoryIcon: <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#616161" strokeWidth="1.3"><path d="M3 4c0-1 2-2 7-2s7 1 7 2v12c0 1-2 2-7 2s-7-1-7-2V4Z" /><path d="M3 4c0 1 2 2 7 2s7-1 7-2" /></svg>,
        title: 'Retention',
        description: 'Manage and delete unused sensitive files from your organization for better security practices.',
        learnMoreLabel: 'Learn more about Data Lifecycle Management',
        learnMoreUrl: '#',
        actionLabel: 'Create retention policies',
        actionUrl: '#',
      },
    ]

    return (
      <div>
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-[15px] font-bold text-[#242424]">Recommendations</h2>
          <p className="text-[13px] text-[#616161] mt-0.5">Recommended actions based on agent activities in the past 30 days</p>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-5">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
              {/* Category badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F5F5] border border-gray-200 rounded-full text-[12px] text-[#616161]">
                  {card.categoryIcon}
                  {card.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-semibold text-[#242424] mb-3 leading-snug">{card.title}</h3>

              {/* Description */}
              <p className="text-[13px] text-[#616161] leading-relaxed mb-3 flex-1">{card.description}</p>

              {/* Learn more link */}
              <a href={card.learnMoreUrl} className="text-[13px] text-[#0078D4] hover:underline mb-4 inline-flex items-center gap-1">
                {card.learnMoreLabel}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h8v8" /><path d="M13 3L3 13" /></svg>
              </a>

              {/* Action button */}
              <div>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded text-[13px] text-[#242424] bg-white hover:bg-[#F5F5F5] transition-colors">
                  {card.actionLabel}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#616161" strokeWidth="1.5"><path d="M5 3h8v8" /><path d="M13 3L3 13" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}

export default function MOSIntegrationAgentDetails() {
  const { agentId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const agent = rows.find(r => r.agentId === agentId)

  if (!agent) {
    return <div className="p-6">Agent not found</div>
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-auto">
       {/* Breadcrumb / Back */}
       <div className="px-6 py-4 border-b border-[#E0E0E0] flex items-center gap-2">
          <button onClick={() => navigate('/demo')} className="text-[#0078D4] hover:underline flex items-center gap-1 text-sm font-semibold">
             &larr; Back
          </button>
          <span className="text-[#616161] text-sm">/ Agents / {agent.name}</span>
       </div>

       <div className="w-full">
           {/* Header Area */}
           <div className="bg-white px-8 pt-6 pb-0 shadow-sm border-b border-gray-200">
              <div className="flex items-start gap-4 mb-4">
                 <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                    {/* Placeholder Icon - Blue Hexagon */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" fill="#0078D4"/>
                      <path d="M12 5.5L17 8.39V14.17L12 17.06L7 14.17V8.39L12 5.5Z" fill="#FFFFFF"/>
                      <path d="M12 8L14.5 9.44V12.33L12 13.77L9.5 12.33V9.44L12 8Z" fill="#0078D4"/>
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
                  {['Overview', 'Recommendations'].map((tab) => (
                      <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 border-b-2 font-medium text-sm cursor-pointer transition-colors flex items-center gap-2
                            ${activeTab === tab 
                                ? 'border-[#0078D4] text-[#242424] font-semibold' 
                                : 'border-transparent text-[#616161] hover:text-[#242424]'
                            }`}
                      >
                          {tab}
                      </div>
                  ))}
              </div>
           </div>

           <div className="p-8 bg-gray-50 min-h-screen">
              {activeTab === 'Overview' && <OverviewContent agent={agent} onOpenActivities={() => navigate(`/demo/activity-explorer?agent=${encodeURIComponent(agent.name)}`)} />}
              {activeTab === 'Recommendations' && <RecommendationsContent />}
           </div>
       </div>
    </div>
  )
}

