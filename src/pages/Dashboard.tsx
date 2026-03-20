import React from 'react'
import Metrics from '../components/Metrics'
import SensitiveActivityTrend from '../components/SensitiveActivityTrend'

export default function Dashboard() {
  return (
    <div>
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">AI observability</h1>
        <p className="text-sm text-gray-700 mt-2">Get a centralized view of agent activity across your organization.</p>
      </div>

      <div className="mt-6">
        <Metrics />
      </div>

      <div className="mt-6">
        <SensitiveActivityTrend />
      </div>
    </div>
  )
}
