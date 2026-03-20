import React, { useState } from 'react'
import { mockAnomalies } from '../../lib/proposalData'

/*
 * Copilot Prompt Bar + Prompt Gallery
 * Bar: 3 contextual prompts driven by anomaly data + "View more prompts"
 * Gallery: Full modal matching Security Dashboard for AI prompt gallery design
 */

// ── Prompt data ───────────────────────────────────────────────────

interface PromptItem {
  text: string
  category: string
}

const allPrompts: PromptItem[] = [
  // Triage & Detection
  { text: 'Which AI agents had zero or near-zero activity in the past 30 days but showed a sudden spike in the last 48 hours?', category: 'Triage & Detection' },
  { text: 'Show me all AI agents whose sensitive interactions increased more than 50% in the last 24 hours, sorted by severity.', category: 'Triage & Detection' },
  { text: 'Show me the top 5 AI agents with the highest oversharing incidents this week, including sensitivity labels involved and whether a DLP policy is applied.', category: 'Triage & Detection' },
  { text: 'Summarize all high-risk AI agents — show risk category, sensitive interactions in the last 7 days, and current DLP policy status.', category: 'Triage & Detection' },
  { text: 'Are there any AI agents with exfiltration activity in the last 24 hours? Show what data was transferred and which users triggered it.', category: 'Triage & Detection' },

  // Investigation & Drill-Down
  { text: 'Who is the owner of the AI agent "M&A Deal Room Assistant"? Show the owner name, email, department, manager, and Azure subscription.', category: 'Investigation & Drill-Down' },
  { text: 'For the agent "M&A Deal Room Assistant", show all sensitive data interactions in the last 7 days — file names, sensitivity labels, actions taken, and users involved.', category: 'Investigation & Drill-Down' },
  { text: 'Show the risk profile of users who interacted with "Executive Payroll Auditor" this week. Did any exhibit unusual behavior like excessive downloads or external sharing?', category: 'Investigation & Drill-Down' },
  { text: 'Which AI agents accessed files labeled "Confidential" or "Highly Confidential" in the last 30 days? Were any of these files subsequently shared externally?', category: 'Investigation & Drill-Down' },
  { text: 'The "Source Code Vulnerability Scanner" agent was recently elevated from Low to High risk. Show the specific activities that triggered this change.', category: 'Investigation & Drill-Down' },
  { text: 'Show me all AI agents where the owner field is empty or marked "No data available". Include the Azure subscription and resource group.', category: 'Investigation & Drill-Down' },

  // Remediation & Policy
  { text: 'Which active high-risk AI agents do not have a DLP policy applied? Recommend which existing policies from my tenant would be most appropriate.', category: 'Remediation & Policy' },
  { text: 'Draft an escalation email to the owner of "M&A Deal Room Assistant" summarizing the oversharing spike, files involved, and recommended remediation.', category: 'Remediation & Policy' },
  { text: 'What actions can I take to prevent "Executive Payroll Auditor" from exfiltrating sensitive data again? Recommend specific DLP rules and access restrictions.', category: 'Remediation & Policy' },
  { text: 'Show AI agent interactions using only our custom DLP sensitivity labels — exclude standard medical terminology classifiers. Focus on PHI, Financial PII, and Confidential labels.', category: 'Remediation & Policy' },

  // Reporting & Compliance
  { text: 'Generate a weekly executive summary of AI agent activity — total active agents, new high-risk agents, top 3 incidents, DLP coverage %, and week-over-week trend.', category: 'Reporting & Compliance' },
  { text: 'Create an audit trail for "M&A Deal Room Assistant" between March 1–3, 2026 — timestamps, users, files, sensitivity labels, and actions taken.', category: 'Reporting & Compliance' },
  { text: 'How many of our AI agents are covered by at least one DLP policy? Show a breakdown by risk level and identify high-risk agents with no policy coverage.', category: 'Reporting & Compliance' },
  { text: 'Summarize the 30-day trend of sensitive interactions across all AI agents by type (Oversharing, Exfiltration, Unethical). Highlight any weeks exceeding 25% above baseline.', category: 'Reporting & Compliance' },
]

const categories = ['All', 'Triage & Detection', 'Investigation & Drill-Down', 'Remediation & Policy', 'Reporting & Compliance']

// ── Icons ─────────────────────────────────────────────────────────

function CopilotIcon({ size = 24 }: { size?: number }) {
  return (
    <svg className="shrink-0" width={size} height={size} viewBox="0 0 20 17.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.64517 0.989724C4.44456 0.398066 3.88926 0 3.26452 0L2.36398 0C1.66288 0 1.06107 0.499046 0.931308 1.18803L0 6.13282L0.46302 4.54883C0.644723 3.92722 1.21471 3.5 1.86233 3.5L4.7411 3.5L5.9856 5.12858L7.09359 3.5L6.5414 3.5C5.91666 3.5 5.36136 3.10193 5.16075 2.51027L4.64517 0.989724Z" fill="url(#cpb_a)" transform="translate(10.71, 0.09) scale(1.25)" />
      <path d="M2.43277 4.86887C2.63136 5.46393 3.18834 5.86523 3.81567 5.86523H5.2819C6.07767 5.86523 6.72643 5.2271 6.73956 4.43143L6.8127 0L6.42736 1.31681C6.24552 1.93821 5.67564 2.36523 5.02818 2.36523L2.13826 2.36523L0.90791 1.27989L0 2.36523H0.546876C1.1742 2.36523 1.73118 2.76654 1.92977 3.3616L2.43277 4.86887Z" fill="url(#cpb_b)" transform="translate(0.85, 8.93) scale(1.25)" />
      <g transform="translate(0, 2.19) scale(1.25)">
        <path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#cpb_c)" />
        <path d="M10.0004 0H4.16755C2.50102 0 1.50109 2.20235 0.834479 4.40471C0.044714 7.01392 -0.988711 10.5035 2.00105 10.5035H4.69024C5.34194 10.5035 5.91403 10.0727 6.09306 9.44608C6.52129 7.94725 7.32308 5.15282 7.94795 3.04403C8.25428 2.01026 8.50944 1.12243 8.90103 0.569545C9.12058 0.259577 9.48649 0 10.0004 0Z" fill="url(#cpb_c2)" />
      </g>
      <g transform="translate(7.5, 4.69) scale(1.25)">
        <path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#cpb_d)" />
        <path d="M0 10.5023H5.83288C7.49941 10.5023 8.49934 8.30024 9.16595 6.09814C9.95572 3.48921 10.9891 0 7.99938 0H5.31016C4.65848 0 4.08639 0.4308 3.90735 1.0574C3.47911 2.55609 2.67734 5.35014 2.05248 7.45866C1.74615 8.49232 1.49099 9.38005 1.0994 9.93287C0.879853 10.2428 0.513946 10.5023 0 10.5023Z" fill="url(#cpb_d2)" />
      </g>
      <defs>
        <radialGradient id="cpb_a" cx="0" cy="0" r="1" gradientTransform="matrix(-4.02 -5 -4.34 4.2 6.06 6.17)" gradientUnits="userSpaceOnUse">
          <stop offset="0.096" stopColor="#00AEFF" />
          <stop offset="0.773" stopColor="#2253CE" />
          <stop offset="1" stopColor="#0736C4" />
        </radialGradient>
        <radialGradient id="cpb_b" cx="0" cy="0" r="1" gradientTransform="matrix(3.56 4.42 4.21 -3.61 1.24 1.93)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB657" />
          <stop offset="0.634" stopColor="#FF5F3D" />
          <stop offset="0.923" stopColor="#C02B3C" />
        </radialGradient>
        <radialGradient id="cpb_c" cx="0" cy="0" r="1" gradientTransform="matrix(-0.53 -9.31 52.28 -2.97 4.02 10.5)" gradientUnits="userSpaceOnUse">
          <stop offset="0.03" stopColor="#FFC800" />
          <stop offset="0.31" stopColor="#98BD42" />
          <stop offset="0.49" stopColor="#52B471" />
          <stop offset="0.844" stopColor="#0D91E1" />
        </radialGradient>
        <linearGradient id="cpb_c2" x1="4.55" y1="0" x2="5" y2="10.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3DCBFF" />
          <stop offset="0.247" stopColor="#0588F7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cpb_d" cx="0" cy="0" r="1" gradientTransform="matrix(-4.61 13.17 -15.68 -5.81 8.3 -1.03)" gradientUnits="userSpaceOnUse">
          <stop offset="0.066" stopColor="#8C48FF" />
          <stop offset="0.5" stopColor="#F2598A" />
          <stop offset="0.896" stopColor="#FFB152" />
        </radialGradient>
        <linearGradient id="cpb_d2" x1="8.76" y1="-0.64" x2="8.75" y2="2.22" gradientUnits="userSpaceOnUse">
          <stop offset="0.058" stopColor="#F8ADFA" />
          <stop offset="0.708" stopColor="#A86EDD" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M12.92 2.87a2.97 2.97 0 0 1 4.2 4.21l-.66.67-4.2-4.21.66-.67Zm-1.37 1.38-8.3 8.3a1.5 1.5 0 0 0-.4.65l-1.27 4.47a.5.5 0 0 0 .62.62l4.47-1.27a1.5 1.5 0 0 0 .65-.4l8.3-8.3-4.07-4.07Z" fill="#616161"/>
    </svg>
  )
}

function RunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M17.22 8.69a1.5 1.5 0 0 1 0 2.62l-10.5 6a1.5 1.5 0 0 1-2.22-1.31V3.99a1.5 1.5 0 0 1 2.22-1.31l10.5 6Z" fill="#616161"/>
    </svg>
  )
}

// ── Prompt Gallery Modal ──────────────────────────────────────────

function PromptGallery({ open, onClose, onPromptClick }: { open: boolean; onClose: () => void; onPromptClick?: (prompt: string) => void }) {
  const [activeTab, setActiveTab] = useState<'Prompts' | 'Promptbooks'>('Prompts')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')

  if (!open) return null

  const filtered = allPrompts.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSearch = !search || p.text.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] max-h-[85vh] flex flex-col overflow-hidden pointer-events-auto">

          {/* Header */}
          <div className="px-8 pt-6 pb-0 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <CopilotIcon size={28} />
              <h2 className="text-[18px] font-semibold text-[#242424]">Copilot Prompt Gallery for AI Observability</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-[#F5F5F5] text-[#616161]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M4.09 4.22l.06-.07a.5.5 0 0 1 .64-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 0 1 .63-.06l.07.06a.5.5 0 0 1 .06.64l-.06.07L10.71 10l5.14 5.15a.5.5 0 0 1 .06.63l-.06.07a.5.5 0 0 1-.64.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.64l.06-.07L9.29 10 4.15 4.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z"/></svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-8 pt-4 flex items-center gap-1 shrink-0">
            {(['Prompts', 'Promptbooks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-[#242424] text-white' : 'bg-[#F5F5F5] text-[#424242] hover:bg-[#E8E8E8]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="px-8 pt-4 pb-3 flex items-center justify-between shrink-0">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none border border-[#D1D1D1] rounded-md px-3 py-1.5 pr-8 text-[13px] text-[#424242] bg-white hover:border-[#C8C6C4] focus:outline-none focus:border-[#0078D4]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'Filter by category' : c}</option>
                ))}
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 16 16" fill="#616161"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            </div>
            <div className="relative w-[240px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 20 20" fill="#616161"><path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.82l4.15 4.15a.5.5 0 0 1-.64.76l-.07-.06-4.15-4.15A5.5 5.5 0 1 1 8.5 3Zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/></svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#D1D1D1] rounded-md pl-9 pr-3 py-1.5 text-[13px] text-[#424242] placeholder-[#A19F9D] focus:outline-none focus:border-[#0078D4]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-6">
            {activeTab === 'Prompts' ? (
              <div className="grid grid-cols-4 gap-4">
                {filtered.map((prompt, i) => (
                  <div key={i} className="border border-[#E0E0E0] rounded-lg p-4 flex flex-col justify-between hover:shadow-md hover:border-[#C8C6C4] transition-all cursor-pointer min-h-[140px]" onClick={() => { onPromptClick?.(prompt.text); onClose() }}>
                    <p className="text-[13px] text-[#242424] leading-[18px] mb-4 line-clamp-4">{prompt.text}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-[#616161] bg-[#F5F5F5] px-2 py-0.5 rounded">{prompt.category}</span>
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]" title="Edit prompt" onClick={(e) => e.stopPropagation()}><EditIcon /></button>
                        <button className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]" title="Run prompt" onClick={(e) => { e.stopPropagation(); onPromptClick?.(prompt.text); onClose() }}><RunIcon /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Promptbooks tab */
              <div className="grid grid-cols-4 gap-4">
                <div className="border border-[#E0E0E0] rounded-lg p-4 flex flex-col justify-between hover:shadow-md hover:border-[#C8C6C4] transition-all cursor-pointer min-h-[140px]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-[#0078D4] text-white flex items-center justify-center text-[10px] font-bold">6</div>
                      <span className="text-[12px] text-[#616161]">6 prompts</span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#242424] leading-[18px] mb-1">AI Agent Spike Investigation</p>
                    <p className="text-[12px] text-[#616161] leading-[16px]">Detect spike → Triage → Identify owner → Trace data → Check DLP → Draft escalation</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-[#616161] bg-[#F5F5F5] px-2 py-0.5 rounded">Investigation</span>
                    <button className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]" title="Run promptbook"><RunIcon /></button>
                  </div>
                </div>

                <div className="border border-[#E0E0E0] rounded-lg p-4 flex flex-col justify-between hover:shadow-md hover:border-[#C8C6C4] transition-all cursor-pointer min-h-[140px]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-[#0078D4] text-white flex items-center justify-center text-[10px] font-bold">4</div>
                      <span className="text-[12px] text-[#616161]">4 prompts</span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#242424] leading-[18px] mb-1">DLP Coverage Gap Analysis</p>
                    <p className="text-[12px] text-[#616161] leading-[16px]">Inventory agents → Check policies → Identify gaps → Recommend policies to apply</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-[#616161] bg-[#F5F5F5] px-2 py-0.5 rounded">Remediation</span>
                    <button className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]" title="Run promptbook"><RunIcon /></button>
                  </div>
                </div>

                <div className="border border-[#E0E0E0] rounded-lg p-4 flex flex-col justify-between hover:shadow-md hover:border-[#C8C6C4] transition-all cursor-pointer min-h-[140px]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-[#0078D4] text-white flex items-center justify-center text-[10px] font-bold">3</div>
                      <span className="text-[12px] text-[#616161]">3 prompts</span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#242424] leading-[18px] mb-1">Weekly AI Posture Report</p>
                    <p className="text-[12px] text-[#616161] leading-[16px]">Summarize activity → Highlight anomalies → Generate executive report</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-[#616161] bg-[#F5F5F5] px-2 py-0.5 rounded">Reporting</span>
                    <button className="p-1 rounded hover:bg-[#F5F5F5] text-[#616161]" title="Run promptbook"><RunIcon /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ── Bar components ────────────────────────────────────────────────

function PromptChip({ text, onClick }: { text: string; onClick?: (text: string) => void }) {
  return (
    <button
      onClick={() => onClick?.(text)}
      className="flex-1 min-w-0 text-left px-4 py-2.5 border border-[#E0E0E0] rounded-lg text-[13px] text-[#424242] hover:bg-[#F5F5F5] hover:border-[#C8C6C4] transition-colors truncate leading-snug"
    >
      {text}
    </button>
  )
}

function ViewMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-[13px] text-[#424242] hover:text-[#242424] whitespace-nowrap px-3 py-2 hover:bg-[#F5F5F5] rounded-lg transition-colors shrink-0">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" fill="#424242"/>
        <path d="M7.5 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V8.71l-3.14 3.15a.5.5 0 0 1-.72-.71L10.79 8H8a.5.5 0 0 1-.5-.5Z" fill="#424242"/>
      </svg>
      View more prompts
    </button>
  )
}

// ── Main export ───────────────────────────────────────────────────

export default function CopilotPromptBar({ onPromptClick }: { onPromptClick?: (prompt: string) => void }) {
  const [galleryOpen, setGalleryOpen] = useState(false)

  // Build 3 contextual prompts from anomaly data
  const prompts: string[] = []

  const oversharingAnomaly = mockAnomalies.find((a) => a.riskType === 'Oversharing')
  if (oversharingAnomaly) {
    prompts.push('Which AI agents had zero activity but suddenly spiked in the last 48 hours? Show agent name, owner, and activity count.')
  }

  const exfiltrationAnomaly = mockAnomalies.find((a) => a.riskType === 'Exfiltration')
  if (exfiltrationAnomaly) {
    prompts.push(`Who owns "${exfiltrationAnomaly.agentName}"? Show owner, department, manager, and Azure subscription so I can escalate.`)
  }

  const riskAnomaly = mockAnomalies.find((a) => a.riskType === 'Risk elevation')
  if (riskAnomaly) {
    prompts.push("Which high-risk AI agents don't have a DLP policy applied? Recommend existing policies to apply based on their sensitivity labels.")
  }

  // Fallback
  if (prompts.length === 0) {
    prompts.push(
      'Which AI agents had zero activity but suddenly spiked in the last 48 hours?',
      'Show all AI agents where the owner field is empty or has no data available.',
      "Which high-risk AI agents don't have a DLP policy applied?"
    )
  }

  return (
    <>
      <div className="bg-white border border-[#E0E0E0] rounded-xl px-6 py-4 shadow-sm">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-1">
          <CopilotIcon />
          <div>
            <div className="text-[14px] font-semibold text-[#242424]">Try Microsoft Security Copilot to analyze AI activity</div>
            <div className="text-[12px] text-[#616161]">Analyze the latest AI activity insights for your organization.</div>
          </div>
        </div>

        {/* Prompt chips row */}
        <div className="flex items-center gap-3 mt-3">
          {prompts.map((p, i) => (
            <PromptChip key={i} text={p} onClick={onPromptClick} />
          ))}
          <ViewMoreButton onClick={() => setGalleryOpen(true)} />
        </div>
      </div>

      <PromptGallery open={galleryOpen} onClose={() => setGalleryOpen(false)} onPromptClick={onPromptClick} />
    </>
  )
}
