import React from 'react'

const MOCK_DATA = Array.from({ length: 30 }, (_, i) => {
  const oversharing = 220 + (i % 6) * 18 + (i % 3 === 0 ? 20 : 0)
  const exfiltration = 42 + (i % 5) * 6
  const unethical = 22 + (i % 4) * 4

  return {
    day: `${Math.floor((i + 28) / 30) === 0 ? '1' : '2'}/${((i + 28 - 1) % 30) + 1}`,
    oversharing,
    exfiltration,
    unethical,
  }
})

const Y_TICKS = [500, 380, 250, 130, 0]
const TOP_SUMMARY = [
  { label: 'Oversharing', value: '4', positive: true },
  { label: 'Exfiltration', value: '-2', positive: false },
  { label: 'Unethical', value: '-2', positive: false },
]

export default function SensitiveActivityTrend() {
  const maxVal = 500

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#242424]">Sensitive activity trend</h2>
        <p className="text-sm text-[#616161]">Agent activities that contain sensitive information types</p>
        <div className="flex items-center gap-1 mt-1 text-[#C50F1F] text-xs font-medium">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.96 2.3a.5.5 0 0 0-.46-.3h-4a.5.5 0 0 0 0 1h2.8L6 6.3 4.85 5.14a.5.5 0 0 0-.7 0l-3 3a.5.5 0 1 0 .7.7L4.5 6.21l1.15 1.14c.2.2.5.2.7 0L10 3.71V6.5a.5.5 0 0 0 1 0v-4a.5.5 0 0 0-.04-.2Z" />
          </svg>
          <span>166.67% in the past 30 days</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {TOP_SUMMARY.map((item) => (
          <div key={item.label} className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="text-[11px] text-[#616161]">{item.label}</div>
            <div className={`text-base font-semibold ${item.positive ? 'text-[#107C10]' : 'text-[#C50F1F]'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[220px] w-full flex overflow-hidden">
        {/* Y-Axis Labels */}
        <div className="shrink-0 w-10 pr-2 pb-6 flex flex-col justify-between">
          {Y_TICKS.map((val) => (
            <span key={val} className="text-[11px] text-gray-500 text-right leading-none">{val}</span>
          ))}
        </div>

        {/* Plot Area */}
        <div className="relative flex-1 min-w-0 pb-6">
          {/* Grid rows + bars overlay */}
          {/* Horizontal grid lines (background) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            {Y_TICKS.map((val) => (
              <div key={val} className="w-full border-t border-gray-100" />
            ))}
          </div>

          {/* Y-Axis vertical line */}
          <div className="absolute top-0 left-0 w-px bg-gray-200" style={{ bottom: 24 }} />

          {/* Bars */}
          <div className="absolute inset-0 bottom-6 flex items-end gap-[2px] px-1">
            {MOCK_DATA.map((d, i) => {
              const total = d.oversharing + d.exfiltration + d.unethical
              const pct = Math.min((total / maxVal) * 100, 100)
              return (
                <div key={i} className="flex-1 flex flex-col-reverse" style={{ height: `${pct}%` }}>
                  {d.unethical > 0 && <div className="w-full bg-[#00B7C3]" style={{ height: `${(d.unethical / total) * 100}%` }} />}
                  {d.exfiltration > 0 && <div className="w-full bg-[#0078D4]" style={{ height: `${(d.exfiltration / total) * 100}%` }} />}
                  <div className="w-full bg-[#8764B8]" style={{ height: `${(d.oversharing / total) * 100}%` }} />
                </div>
              )
            })}
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between mt-auto pt-2">
            {MOCK_DATA.map((d, i) => (
              <span key={i} className="flex-1 text-center text-[9px] text-gray-500 leading-none">
                {i % 2 === 0 ? d.day : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 rounded-full bg-[#8764B8]" />
          <span>Oversharing</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 rounded-full bg-[#0078D4]" />
          <span>Exfiltration</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 rounded-full bg-[#00B7C3]" />
          <span>Unethical</span>
        </div>
      </div>
    </div>
  )
}
