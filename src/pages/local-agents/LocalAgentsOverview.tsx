import React, { useState } from 'react'
import Metrics, { MetricsData } from '../../components/Metrics'
import Agents from './LocalAgentsAgents'
import { rows } from '../../lib/agentsData'

function Banner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-gradient-to-r from-[#25487B] to-[#5C2D91] text-white px-6 py-3 text-sm relative">
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4996 2C24.1484 2.0001 25.2718 3.34435 26.0631 4.85059C26.8917 6.42818 27.5867 8.61463 28.2281 11.1152C28.4316 11.9088 28.6154 12.614 28.6744 13.1914C28.7368 13.8029 28.6813 14.4556 28.234 15.0322C27.7832 15.613 27.1549 15.8267 26.5435 15.917C25.962 16.0028 25.2205 16 24.3824 16H20.6041C19.4559 16.0001 18.5746 16.2322 17.9498 16.708C17.3764 17.1448 16.8908 17.8854 16.6841 19.1924C16.4646 20.7683 16.2912 22.405 16.1744 24.0732C16.0909 25.2655 16.0231 26.2501 15.8765 27.0156C15.7272 27.7953 15.4685 28.513 14.8824 29.0596C14.3035 29.5992 13.5932 29.8119 12.8248 29.9082C12.0781 30.0017 11.1332 30 9.99958 30H7.9195C6.75091 30 5.76221 30.0029 4.97809 29.8857C4.15346 29.7624 3.4129 29.488 2.82966 28.8389C2.25784 28.2022 2.05337 27.4702 2.01227 26.6631C1.97376 25.9065 2.07631 24.9807 2.19196 23.9023C2.82758 17.9756 4.53785 12.5771 6.89997 8.62988C9.23024 4.73609 12.4438 2.00023 15.9996 2H22.4996ZM24.3082 18.0078C27.4785 18.1684 29.9996 20.7898 29.9996 24L29.9918 24.3086C29.8311 27.4789 27.2098 30 23.9996 30L23.691 29.9922C20.6231 29.8365 18.1628 27.3765 18.0074 24.3086L17.9996 24C17.9996 20.6864 20.6861 18.0002 23.9996 18L24.3082 18.0078ZM15.9996 4C13.5219 4.00023 10.8317 5.95429 8.61579 9.65723C6.4316 13.3072 4.79174 18.4138 4.18024 24.1152C4.05761 25.2587 3.98076 26 4.00934 26.5615C4.03535 27.072 4.14529 27.3107 4.31794 27.5029C4.47948 27.6825 4.71313 27.8233 5.27399 27.9072C5.87613 27.9972 6.68843 28 7.9195 28H9.99958C11.1859 28 11.9823 27.9981 12.5757 27.9238C13.147 27.8523 13.3769 27.7283 13.5181 27.5967C13.6521 27.4718 13.7967 27.2454 13.9127 26.6396C14.0314 26.0195 14.0922 25.1768 14.1793 23.9336C14.5738 18.3004 15.5912 12.9609 16.9459 9.00195C17.6211 7.0287 18.3975 5.34621 19.2564 4.13672C19.289 4.09081 19.3226 4.04529 19.356 4H15.9996ZM23.9996 20C21.7906 20.0002 19.9996 21.791 19.9996 24C19.9996 26.209 21.7906 27.9998 23.9996 28C26.2087 28 27.9996 26.2091 27.9996 24C27.9996 21.7909 26.2087 20 23.9996 20ZM22.4996 4C22.1848 4.00024 21.6239 4.25762 20.8873 5.29492C20.1854 6.28339 19.4826 7.76417 18.8375 9.64941C18.3333 11.1228 17.8759 12.8124 17.481 14.6533C18.4323 14.1708 19.5162 14 20.6041 14H24.3824C25.2844 14 25.8502 13.9977 26.2515 13.9385C26.4389 13.9108 26.5401 13.8763 26.5924 13.8516C26.6324 13.8325 26.6442 13.8191 26.6539 13.8066C26.6577 13.8022 26.7214 13.7501 26.6851 13.3945C26.645 13.0017 26.5103 12.468 26.2906 11.6113C25.6556 9.13554 25.0067 7.13993 24.2925 5.78027C23.541 4.34962 22.9219 4.0001 22.4996 4Z" fill="white"></path>
          </svg>
          <span className="font-medium">Agent 365 is now available in Microsoft Purview. Get started with deeper insights and policy capabilities.</span>
          <button className="bg-white text-[#3c3c3c] px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 ml-2">Learn more about Agent 365</button>
        </div>
        <div className="absolute right-0 top-0">
          <button className="hover:bg-white/10 p-1 rounded" onClick={() => setVisible(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.4 4.55L4.47 4.47003C4.68 4.26003 5.09999 4.29003 5.38 4.48003L5.45999 4.55003L12 10.94L18.47 4.47003C18.74 4.20003 19.17 4.17003 19.47 4.39003L19.53 4.47003C19.8 4.74003 19.83 5.17003 19.61 5.47003L19.53 5.53003L13.06 12L19.53 18.47C19.8 18.74 19.83 19.15 19.61 19.45L19.53 19.53C19.26 19.8 18.84 19.83 18.54 19.61L18.47 19.53L12 13.06L5.53 19.53C5.26 19.8 4.84001 19.83 4.54001 19.61L4.47 19.53C4.2 19.26 4.17001 18.84 4.39001 18.54L4.47 18.47L10.94 12L4.47 5.53C4.2 5.26 4.17001 4.84003 4.39001 4.54003L4.4 4.55Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function Toolbar() {
    return (
        <div className="flex justify-between items-center mt-6 mb-2">
            <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 text-sm text-[#242424] hover:bg-gray-100 px-2 py-1 rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.65 2.35A7.958 7.958 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="#242424" /></svg>
                    Refresh
                 </button>
                 <button className="flex items-center gap-2 text-sm text-[#242424] hover:bg-gray-100 px-2 py-1 rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 10v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3" stroke="#242424" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6l3 3 3-3M8 2v7" stroke="#242424" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Export
                 </button>
            </div>
            <div>
                 <button className="flex items-center gap-2 text-sm text-[#242424] hover:bg-gray-100 px-2 py-1 rounded">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M5 3v10M2 7h12" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Group
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="#242424" strokeWidth="1" strokeLinecap="round"/></svg>
                 </button>
            </div>
        </div>
    )
}

export default function LocalAgentsOverview() {
  const [activeTab, setActiveTab] = useState<'all' | 'cloud' | 'devices'>('all');

  const filteredRows = React.useMemo(() => {
    if (activeTab === 'all') return rows;
    if (activeTab === 'cloud') return rows.filter(r => r.hosting === 'cloud');
    if (activeTab === 'devices') return rows.filter(r => r.type === 'user');
    return rows;
  }, [activeTab]);

  const metricsData: MetricsData = React.useMemo(() => {
    const total = filteredRows.length;
    const active = filteredRows.filter(r => r.status === 'Active').length;
    const inactive = total - active;
    const highRisk = filteredRows.filter(r => r.riskLevel === 'High').length;
    const mediumRisk = filteredRows.filter(r => r.riskLevel === 'Medium').length;
    const lowRisk = filteredRows.filter(r => r.riskLevel === 'Low').length;
    const oversharing = filteredRows.filter(r => r.riskType.includes('Oversharing')).length;
    const exfiltration = filteredRows.filter(r => r.riskType.includes('Exfiltration')).length;
    const unethical = filteredRows.filter(r => r.riskType.includes('Unethical')).length;
    return { totalApps: total, active, inactive, highRisk, mediumRisk, lowRisk, sensitive: { oversharing, exfiltration, unethical } };
  }, [filteredRows]);

  const tabCounts = React.useMemo(() => ({
    all: rows.length,
    cloud: rows.filter(r => r.hosting === 'cloud').length,
    devices: rows.filter(r => r.type === 'user').length,
  }), []);

  return (
    <>
      <Banner />
      <main className="flex-1 px-6 py-6 overflow-auto">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-[28px] font-semibold text-[#242424]">AI observability</h1>
            <p className="text-[14px] text-[#242424] mt-2">Get a centralized view of agent activity across your organization.</p>
          </div>

          {/* Pill Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {([
              { key: 'all' as const, label: `All (${tabCounts.all})`, icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>
              )},
              { key: 'cloud' as const, label: `Cloud Agents (${tabCounts.cloud})`, icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="none"><path d="M13.5 10.5a2.5 2.5 0 0 0-1.07-2.05A3.5 3.5 0 0 0 6 7a3 3 0 0 0-2.83 2.02A2.5 2.5 0 0 0 3.5 14h10a2.5 2.5 0 0 0 0-5v1.5z"/></svg>
              )},
              { key: 'devices' as const, label: `Local Agents (${tabCounts.devices})`, icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="10" height="9" rx="1.5"/><path d="M6 14h4"/><path d="M8 11v3"/><circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none"/><path d="M5.5 8.5a3.5 3.5 0 0 1 5 0" strokeWidth="1.2"/></svg>
              )},
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all border ${
                  activeTab === tab.key
                    ? 'bg-[#242424] text-white border-[#242424] shadow-sm'
                    : 'bg-white text-[#616161] border-[#E0E0E0] hover:bg-[#F5F5F5] hover:border-[#C8C8C8]'
                }`}
              >
                <span className={activeTab === tab.key ? 'text-white' : 'text-[#616161]'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <div className="text-[18px] font-semibold text-[#242424]">Key metrics</div>
            <div className="text-[14px] text-[#242424] mt-1">Metrics for your organization and trends in the last 30 days.</div>
          </div>

          <Metrics data={metricsData} />
          
          <Toolbar />

          <div className="mt-2 text-[#616161]">
            <Agents activeTab={activeTab} />
          </div>
        </div>
      </main>
    </>
  )
}
