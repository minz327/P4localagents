import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { rows as agentRows } from '../../lib/agentsData'

/*
 * Copilot Side Panel — slides in from the right when a prompt is clicked.
 * Matches the Security Dashboard for AI Copilot experience.
 */

// ── Agent name → detail link mapping ──────────────────────────────

const agentNameToId: Record<string, string> = {}
agentRows.forEach((r) => { agentNameToId[r.name] = r.agentId })

const knownAgentNames = Object.keys(agentNameToId)

// ── Types ─────────────────────────────────────────────────────────

interface CopilotResponse {
  text: string
  table?: { headers: string[]; rows: string[][] }
  followUp: string
  sources?: string[]
  suggestedPrompts: string[]
}

// ── Mock response generator ───────────────────────────────────────

function generateResponse(prompt: string): CopilotResponse {
  const lower = prompt.toLowerCase()

  if (lower.includes('zero activity') || lower.includes('suddenly spiked') || lower.includes('spike')) {
    return {
      text: 'I found 3 AI agents that had minimal activity in the past 30 days but showed a significant spike in the last 48 hours. This pattern often indicates newly activated workflows or potential misuse that warrants investigation.',
      table: {
        headers: ['Agent Name', 'Owner', '30-Day Avg', 'Last 48h', 'Spike %'],
        rows: [
          ['M&A Deal Room Assistant', 'Sarah Chen', '12', '162', '+1,250%'],
          ['Patent Application Generator', 'No data available', '3', '89', '+2,867%'],
          ['Customer PII Retriever', 'James Park', '0', '47', 'New activity'],
        ],
      },
      followUp: 'The M&A Deal Room Assistant spike is the most concerning due to the +150% increase in oversharing incidents. I recommend investigating the sensitive data interactions for this agent immediately.',
      sources: ['Microsoft Purview AI Hub', 'Activity Explorer'],
      suggestedPrompts: [
        'Show me all sensitive data interactions for M&A Deal Room Assistant in the last 7 days',
        'Who owns Patent Application Generator? Show department and manager',
        'Draft an escalation email for the M&A Deal Room Assistant spike',
      ],
    }
  }

  if (lower.includes('who owns') || lower.includes('owner') || lower.includes('department')) {
    const agentMatch = prompt.match(/"([^"]+)"/)
    const agentName = agentMatch ? agentMatch[1] : 'Executive Payroll Auditor'
    return {
      text: `Here are the ownership details for "${agentName}":`,
      table: {
        headers: ['Property', 'Value'],
        rows: [
          ['Owner', 'Michael Torres'],
          ['Email', 'mtorres@contoso.com'],
          ['Department', 'Finance Operations'],
          ['Manager', 'Lisa Wang (VP Finance)'],
          ['Azure Subscription', 'Contoso-Prod-Finance-001'],
          ['Resource Group', 'rg-ai-agents-finance'],
          ['Created', 'January 15, 2026'],
          ['Last Modified', 'March 2, 2026'],
        ],
      },
      followUp: `This agent is owned by Michael Torres in Finance Operations. Given the recent exfiltration activity (+300% increase), I recommend contacting Michael directly or escalating to his manager Lisa Wang.`,
      sources: ['Microsoft Entra ID', 'Azure Resource Manager', 'Purview AI Hub'],
      suggestedPrompts: [
        `Show all sensitive data interactions for "${agentName}" in the last 7 days`,
        `What DLP policies are applied to "${agentName}"?`,
        `Draft an escalation email to Michael Torres about the exfiltration activity`,
      ],
    }
  }

  if (lower.includes('dlp') || lower.includes('policy')) {
    return {
      text: 'I found 4 high-risk AI agents that currently do not have a DLP policy applied. Based on their sensitivity label interactions, here are my policy recommendations:',
      table: {
        headers: ['Agent Name', 'Risk Level', 'Labels Accessed', 'Recommended Policy'],
        rows: [
          ['M&A Deal Room Assistant', 'High', 'Confidential, Highly Confidential', 'Financial Data Protection Policy'],
          ['Executive Payroll Auditor', 'High', 'Financial PII, HR Confidential', 'HR & Financial Compliance Policy'],
          ['Patent Application Generator', 'High', 'Attorney-Client Privilege', 'Legal Document Protection Policy'],
          ['Customer PII Retriever', 'High', 'Customer PII', 'Customer Data Handling Policy'],
        ],
      },
      followUp: 'These 4 agents represent a significant gap in your DLP coverage. The Financial Data Protection Policy and HR & Financial Compliance Policy already exist in your tenant and can be applied immediately via the Purview compliance portal.',
      sources: ['Microsoft Purview DLP', 'Sensitivity Labels', 'Compliance Portal'],
      suggestedPrompts: [
        'How do I apply the Financial Data Protection Policy to M&A Deal Room Assistant?',
        'Show me all DLP policies currently active in my tenant',
        'Generate a DLP coverage report for all AI agents by risk level',
      ],
    }
  }

  if (lower.includes('exfiltration') || lower.includes('exported') || lower.includes('transferred')) {
    return {
      text: 'I detected exfiltration activity from 2 AI agents in the last 24 hours. Here is a summary of the data transfers:',
      table: {
        headers: ['Agent', 'User', 'Files Transferred', 'Destination', 'Sensitivity'],
        rows: [
          ['Executive Payroll Auditor', 'mtorres@contoso.com', '15 files', 'External SharePoint', 'Financial PII'],
          ['Executive Payroll Auditor', 'jlee@contoso.com', '3 files', 'Personal OneDrive', 'HR Confidential'],
          ['Customer PII Retriever', 'asmith@contoso.com', '8 files', 'Third-party API', 'Customer PII'],
        ],
      },
      followUp: 'The Executive Payroll Auditor has the most concerning activity — 18 files transferred by 2 different users, including Financial PII and HR Confidential data sent to an external SharePoint site.',
      sources: ['Microsoft Purview Activity Explorer', 'DLP Alerts'],
      suggestedPrompts: [
        'What specific files were transferred by Executive Payroll Auditor?',
        'Block external sharing for Executive Payroll Auditor immediately',
        'Show the risk profile of Customer PII Retriever',
      ],
    }
  }

  if (lower.includes('executive summary') || lower.includes('weekly') || lower.includes('report')) {
    return {
      text: 'Here is the weekly executive summary for AI agent activity (Feb 25 – Mar 3, 2026):',
      table: {
        headers: ['Metric', 'This Week', 'Last Week', 'Change'],
        rows: [
          ['Total Active Agents', '23', '21', '+9.5%'],
          ['New High-Risk Agents', '2', '0', '+2 new'],
          ['Sensitive Interactions', '1,847', '1,203', '+53.5%'],
          ['DLP Coverage', '74%', '71%', '+3%'],
          ['Open Alerts', '7', '3', '+133%'],
        ],
      },
      followUp: 'The 53.5% increase in sensitive interactions is primarily driven by the M&A Deal Room Assistant (+150% oversharing) and Executive Payroll Auditor (+300% exfiltration). Two agents were newly classified as High risk this week: Source Code Vulnerability Scanner and Litigation Hold Search.',
      sources: ['Microsoft Purview AI Hub', 'Compliance Dashboard'],
      suggestedPrompts: [
        'Show me details on Source Code Vulnerability Scanner risk elevation',
        'What caused the 53.5% increase in sensitive interactions?',
        'Generate a trend report for the last 30 days',
      ],
    }
  }

  if (lower.includes('audit trail') || lower.includes('timeline') || lower.includes('activity')) {
    return {
      text: 'Here is the audit trail for the requested agent showing recent sensitive data interactions:',
      table: {
        headers: ['Timestamp', 'User', 'Action', 'File', 'Sensitivity Label'],
        rows: [
          ['Mar 3, 14:22', 'schen@contoso.com', 'Shared externally', 'Q4_MA_Targets.xlsx', 'Highly Confidential'],
          ['Mar 3, 13:45', 'schen@contoso.com', 'Downloaded', 'Board_Deck_Draft.pptx', 'Confidential'],
          ['Mar 3, 11:30', 'jpark@contoso.com', 'Accessed', 'Valuation_Model.xlsx', 'Highly Confidential'],
          ['Mar 2, 16:10', 'schen@contoso.com', 'Shared externally', 'Due_Diligence_Notes.docx', 'Confidential'],
          ['Mar 2, 09:15', 'mtorres@contoso.com', 'Uploaded', 'Financial_Summary.pdf', 'Financial PII'],
        ],
      },
      followUp: 'The most concerning activity is schen@contoso.com sharing "Q4_MA_Targets.xlsx" (labeled Highly Confidential) externally on March 3. This file relates to M&A acquisition targets and should be restricted to internal access only.',
      sources: ['Purview Activity Explorer', 'Audit Log'],
      suggestedPrompts: [
        'Who did schen@contoso.com share the Q4_MA_Targets.xlsx file with?',
        'Block external sharing for all Highly Confidential files',
        'Show all external sharing events in the last 7 days',
      ],
    }
  }

  // Generic fallback
  return {
    text: 'Based on the current AI observability data in your organization, here is what I found:',
    table: {
      headers: ['Category', 'Count', 'Status'],
      rows: [
        ['Total AI Agents', '23', 'Active'],
        ['High-Risk Agents', '5', '2 new this week'],
        ['DLP Policies Applied', '17/23', '74% coverage'],
        ['Open Alerts', '7', '3 critical'],
      ],
    },
    followUp: 'I recommend focusing on the 6 agents without DLP coverage and the 3 critical alerts first. Would you like me to drill into any of these areas?',
    sources: ['Microsoft Purview AI Hub'],
    suggestedPrompts: [
      'Which high-risk agents don\'t have a DLP policy applied?',
      'Show me the 3 critical alerts',
      'Generate a weekly executive summary',
    ],
  }
}

// ── Icons ─────────────────────────────────────────────────────────

function CopilotGradientIcon() {
  return (
    <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 17.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.64517 0.989724C4.44456 0.398066 3.88926 0 3.26452 0L2.36398 0C1.66288 0 1.06107 0.499046 0.931308 1.18803L0 6.13282L0.46302 4.54883C0.644723 3.92722 1.21471 3.5 1.86233 3.5L4.7411 3.5L5.9856 5.12858L7.09359 3.5L6.5414 3.5C5.91666 3.5 5.36136 3.10193 5.16075 2.51027L4.64517 0.989724Z" fill="url(#cpanel_a)" transform="translate(10.71, 0.09) scale(1.25)" />
      <path d="M2.43277 4.86887C2.63136 5.46393 3.18834 5.86523 3.81567 5.86523H5.2819C6.07767 5.86523 6.72643 5.2271 6.73956 4.43143L6.8127 0L6.42736 1.31681C6.24552 1.93821 5.67564 2.36523 5.02818 2.36523L2.13826 2.36523L0.90791 1.27989L0 2.36523H0.546876C1.1742 2.36523 1.73118 2.76654 1.92977 3.3616L2.43277 4.86887Z" fill="url(#cpanel_b)" transform="translate(0.85, 8.93) scale(1.25)" />
      <g transform="translate(0, 2.19) scale(1.25)">
        <path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#cpanel_c)" />
        <path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#cpanel_c2)" />
      </g>
      <g transform="translate(7.5, 4.69) scale(1.25)">
        <path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#cpanel_d)" />
        <path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#cpanel_d2)" />
      </g>
      <defs>
        <radialGradient id="cpanel_a" cx="0" cy="0" r="1" gradientTransform="matrix(-4.02 -5 -4.34 4.2 6.06 6.17)" gradientUnits="userSpaceOnUse"><stop offset="0.096" stopColor="#00AEFF" /><stop offset="0.773" stopColor="#2253CE" /><stop offset="1" stopColor="#0736C4" /></radialGradient>
        <radialGradient id="cpanel_b" cx="0" cy="0" r="1" gradientTransform="matrix(3.56 4.42 4.21 -3.61 1.24 1.93)" gradientUnits="userSpaceOnUse"><stop stopColor="#FFB657" /><stop offset="0.634" stopColor="#FF5F3D" /><stop offset="0.923" stopColor="#C02B3C" /></radialGradient>
        <radialGradient id="cpanel_c" cx="0" cy="0" r="1" gradientTransform="matrix(-0.53 -9.31 52.28 -2.97 4.02 10.5)" gradientUnits="userSpaceOnUse"><stop offset="0.03" stopColor="#FFC800" /><stop offset="0.31" stopColor="#98BD42" /><stop offset="0.49" stopColor="#52B471" /><stop offset="0.844" stopColor="#0D91E1" /></radialGradient>
        <linearGradient id="cpanel_c2" x1="4.55" y1="0" x2="5" y2="10.5" gradientUnits="userSpaceOnUse"><stop stopColor="#3DCBFF" /><stop offset="0.247" stopColor="#0588F7" stopOpacity="0" /></linearGradient>
        <radialGradient id="cpanel_d" cx="0" cy="0" r="1" gradientTransform="matrix(-4.61 13.17 -15.68 -5.81 8.3 -1.03)" gradientUnits="userSpaceOnUse"><stop offset="0.066" stopColor="#8C48FF" /><stop offset="0.5" stopColor="#F2598A" /><stop offset="0.896" stopColor="#FFB152" /></radialGradient>
        <linearGradient id="cpanel_d2" x1="8.76" y1="-0.64" x2="8.75" y2="2.22" gradientUnits="userSpaceOnUse"><stop offset="0.058" stopColor="#F8ADFA" /><stop offset="0.708" stopColor="#A86EDD" stopOpacity="0" /></linearGradient>
      </defs>
    </svg>
  )
}

// ── Typing animation hook ─────────────────────────────────────────

function useTypingAnimation(text: string, speed = 12) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return { displayed, done }
}

// ── Panel component ───────────────────────────────────────────────

interface CopilotPanelProps {
  open: boolean
  prompt: string
  onClose: () => void
  onPromptClick: (prompt: string) => void
}

export default function CopilotPanel({ open, prompt, onClose, onPromptClick }: CopilotPanelProps) {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [response, setResponse] = useState<CopilotResponse | null>(null)
  const [showTable, setShowTable] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Render text with agent names as clickable links
  const renderTextWithLinks = (text: string) => {
    // Find all agent names in the text
    const parts: (string | JSX.Element)[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      let earliestMatch: { name: string; index: number } | null = null

      for (const name of knownAgentNames) {
        const idx = remaining.indexOf(name)
        if (idx !== -1 && (!earliestMatch || idx < earliestMatch.index)) {
          earliestMatch = { name, index: idx }
        }
      }

      if (earliestMatch) {
        if (earliestMatch.index > 0) {
          parts.push(remaining.slice(0, earliestMatch.index))
        }
        const agentId = agentNameToId[earliestMatch.name]
        parts.push(
          <button
            key={key++}
            className="text-[#0078D4] hover:underline font-medium"
            onClick={() => navigate(`/proposal/agents/${encodeURIComponent(agentId)}`)}
          >
            {earliestMatch.name}
          </button>
        )
        remaining = remaining.slice(earliestMatch.index + earliestMatch.name.length)
      } else {
        parts.push(remaining)
        break
      }
    }

    return parts
  }

  // Render a table cell — if it matches a known agent name, make it a link
  const renderCell = (cell: string) => {
    const matchedAgent = knownAgentNames.find((name) => cell === name)
    if (matchedAgent) {
      return (
        <button
          className="text-[#0078D4] hover:underline font-medium text-left"
          onClick={() => navigate(`/proposal/agents/${encodeURIComponent(agentNameToId[matchedAgent])}`)}
        >
          {cell}
        </button>
      )
    }
    return cell
  }

  // Generate response when prompt changes
  useEffect(() => {
    if (prompt) {
      setShowTable(false)
      const resp = generateResponse(prompt)
      setResponse(resp)
    }
  }, [prompt])

  const { displayed: typedText, done: textDone } = useTypingAnimation(
    response?.text || '',
    10
  )

  // Show table after text finishes typing
  useEffect(() => {
    if (textDone && response?.table) {
      const timer = setTimeout(() => setShowTable(true), 200)
      return () => clearTimeout(timer)
    }
  }, [textDone, response])

  // Scroll to bottom as content appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [typedText, showTable])

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onPromptClick(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div
      className={`fixed top-12 right-0 bottom-0 bg-white border-l border-[#E0E0E0] shadow-xl z-40 flex flex-col transition-all duration-300 ease-in-out ${open ? 'w-[400px] translate-x-0' : 'w-0 translate-x-full overflow-hidden'}`}
    >
      {open && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8] shrink-0">
            <div className="flex items-center gap-2.5">
              <CopilotGradientIcon />
              <span className="text-[16px] font-semibold text-[#242424]">Copilot</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-[#F5F5F5] text-[#616161]">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M4.09 4.22l.06-.07a.5.5 0 0 1 .64-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 0 1 .63-.06l.07.06a.5.5 0 0 1 .06.64l-.06.07L10.71 10l5.14 5.15a.5.5 0 0 1 .06.63l-.06.07a.5.5 0 0 1-.64.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.64l.06-.07L9.29 10 4.15 4.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z"/></svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
            {/* User prompt */}
            <div className="flex justify-end mb-4">
              <div className="bg-[#E8EBFA] rounded-xl rounded-br-sm px-4 py-2.5 max-w-[320px] text-[13px] text-[#242424] leading-[18px]">
                {prompt}
              </div>
            </div>

            {/* Copilot response */}
            <div className="mb-4">
              {/* Copilot label + actions */}
              <div className="flex items-center gap-2 mb-2">
                <CopilotGradientIcon />
                <span className="text-[13px] font-semibold text-[#242424]">Copilot</span>
                {textDone && (
                  <div className="flex items-center gap-1 ml-auto">
                    <button className="p-1 rounded hover:bg-[#F5F5F5]" title="Copy">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="#616161"><path d="M8 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8Zm0 1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM4 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2h-1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1V6Z"/></svg>
                    </button>
                    <button className="p-1 rounded hover:bg-[#F5F5F5]" title="Like">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="#616161"><path d="M13.46 2.02a2.2 2.2 0 0 1 2.41 1.52l.04.15.53 2.81h1.06a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3.3l-1.8 2.4a1 1 0 0 1-.76.38L11.5 18.3a1 1 0 0 1-.97-.68l-.02-.1-.51-3.02H6.5a2 2 0 0 1-2-2V7.14a2 2 0 0 1 .59-1.42l4.3-4.3a1.5 1.5 0 0 1 1.95-.17l.12.1.53.53-1.04 3.12h2.5Z"/></svg>
                    </button>
                    <button className="p-1 rounded hover:bg-[#F5F5F5]" title="Dislike">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="#616161"><path d="M6.54 17.98a2.2 2.2 0 0 1-2.41-1.52l-.04-.15-.53-2.81H2.5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h3.3l1.8-2.4a1 1 0 0 1 .76-.38L8.5 1.7a1 1 0 0 1 .97.68l.02.1.51 3.02H13.5a2 2 0 0 1 2 2v5.36a2 2 0 0 1-.59 1.42l-4.3 4.3a1.5 1.5 0 0 1-1.95.17l-.12-.1-.53-.53 1.04-3.12h-2.5Z"/></svg>
                    </button>
                    <button className="p-1 rounded hover:bg-[#F5F5F5]" title="Share">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="#616161"><path d="M13 3a3 3 0 1 1-1.42 5.64L7.91 10.5a3.01 3.01 0 0 1 0 1.01l3.67 1.86a3 3 0 1 1-.45.9L7.46 12.4a3 3 0 1 1 0-2.82l3.67-1.86A3.01 3.01 0 0 1 13 3Z"/></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Response text */}
              <div className="text-[13px] text-[#242424] leading-[20px] ml-7">
                {textDone ? renderTextWithLinks(typedText) : typedText}
                {!textDone && <span className="inline-block w-[2px] h-[14px] bg-[#242424] ml-0.5 animate-pulse" />}
              </div>

              {/* Table */}
              {showTable && response?.table && (
                <div className="mt-4 ml-7 border border-[#E0E0E0] rounded-lg overflow-hidden">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-[#FAFAFA]">
                        {response.table.headers.map((h, i) => (
                          <th key={i} className="text-left px-3 py-2 font-semibold text-[#424242] border-b border-[#E0E0E0]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {response.table.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 1 ? 'bg-[#FAFAFA]' : ''}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-1.5 text-[#242424] border-b border-[#F0F0F0]">{renderCell(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Follow-up text */}
              {showTable && response?.followUp && (
                <div className="mt-3 ml-7 text-[13px] text-[#242424] leading-[20px]">
                  {renderTextWithLinks(response.followUp)}
                </div>
              )}

              {/* Sources */}
              {showTable && response?.sources && (
                <div className="mt-3 ml-7 flex items-center gap-2">
                  <span className="text-[11px] text-[#616161] font-medium">Sources</span>
                  {response.sources.map((s, i) => (
                    <span key={i} className="text-[11px] text-[#0078D4] bg-[#F0F6FF] px-2 py-0.5 rounded cursor-pointer hover:bg-[#E0EDFF]">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Suggested follow-up prompts */}
          {showTable && response?.suggestedPrompts && (
            <div className="px-5 py-3 border-t border-[#E8E8E8] shrink-0">
              <div className="flex flex-col gap-1.5">
                {response.suggestedPrompts.map((sp, i) => (
                  <button
                    key={i}
                    onClick={() => onPromptClick(sp)}
                    className="text-left text-[12px] text-[#0078D4] hover:text-[#106EBE] hover:bg-[#F5F5F5] px-3 py-2 rounded-lg border border-[#E0E0E0] hover:border-[#C8C6C4] transition-colors leading-[16px] truncate"
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="px-5 py-3 border-t border-[#E8E8E8] shrink-0">
            <div className="flex items-center gap-2 border border-[#D1D1D1] rounded-lg px-3 py-2 focus-within:border-[#0078D4]">
              <input
                type="text"
                placeholder="Ask Copilot..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 text-[13px] text-[#242424] placeholder-[#A19F9D] outline-none bg-transparent"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="p-1 rounded hover:bg-[#F5F5F5] disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="#0078D4"><path d="M2.72 2.05l15.74 7.1a1 1 0 0 1 0 1.7l-15.74 7.1A1 1 0 0 1 1.33 17l1.85-6.49H9.5a.5.5 0 0 0 0-1H3.18L1.33 3.02a1 1 0 0 1 1.39-.97Z"/></svg>
              </button>
            </div>
            <p className="text-[10px] text-[#A19F9D] mt-1.5 text-center">AI-generated content may be incorrect</p>
          </div>
        </>
      )}
    </div>
  )
}
