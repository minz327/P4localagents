import React, { useState, useEffect } from 'react'
import { mockAnomalies, AnomalyAlert } from '../../lib/clevelandData'

// ── Notification Panel (slides from right) ────────────────────────
export default function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Animate in
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [open])

  if (!open && !visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-[100] transition-opacity duration-200 ${visible && open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[101] flex flex-col transition-transform duration-200 ${visible && open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="Notifications"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-[18px] font-semibold text-[#242424]">Notifications</h2>
          <div className="flex items-center gap-3">
            <button className="text-[12px] text-[#0078D4] hover:underline">Mark all read</button>
            <button
              className="text-[#616161] hover:text-[#242424]"
              onClick={onClose}
              aria-label="Close notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Today</div>
          {mockAnomalies.map((a) => (
            <NotificationCard key={a.id} alert={a} />
          ))}

          {/* Older placeholder */}
          <div className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Yesterday</div>
          <div className="px-6 py-4 text-[13px] text-[#616161]">No notifications</div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between">
          <button className="text-[13px] text-[#0078D4] hover:underline">View all notifications</button>
          <button className="text-[13px] text-[#0078D4] hover:underline">Configure alert rules →</button>
        </div>
      </div>
    </>
  )
}

function SeverityDot({ severity }: { severity: AnomalyAlert['severity'] }) {
  const colors = {
    critical: 'bg-[#C50F1F]',
    warning: 'bg-[#F7630C]',
    info: 'bg-[#0078D4]',
  }
  return <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[severity]}`} />
}

function NotificationCard({ alert }: { alert: AnomalyAlert }) {
  return (
    <div className="px-4 py-3 hover:bg-[#F5F5F5] cursor-pointer border-l-[3px] border-l-[#0078D4] mx-2 mb-1 rounded-r">
      <div className="flex items-start gap-3">
        <SeverityDot severity={alert.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[13px] font-semibold text-[#242424] truncate">{alert.agentName}</span>
            <span className="text-[11px] text-[#616161] shrink-0">{alert.detectedAgo}</span>
          </div>
          <p className="text-[12px] text-[#616161] leading-[16px] mb-2">{alert.message}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#FDE7E9] text-[#C50F1F] px-1.5 py-0.5 rounded font-medium">{alert.riskType}</span>
            <span className="text-[10px] bg-[#FDE7E9] text-[#C50F1F] px-1.5 py-0.5 rounded font-medium">{alert.delta}</span>
          </div>
          <button className="text-[12px] text-[#0078D4] hover:underline mt-2 flex items-center gap-1">
            Investigate →
          </button>
        </div>
      </div>
    </div>
  )
}

