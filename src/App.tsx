import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Overview from './pages/Overview'
import AgentDetails from './pages/AgentDetails'
import ProposalOverview from './pages/proposal/ProposalOverview'
import ProposalAgentDetails from './pages/proposal/ProposalAgentDetails'
import ProposalOverviewB from './pages/proposal/ProposalOverviewB'
import ExperimentOverview from './pages/experiment/ExperimentOverview'
import ExperimentAgentDetails from './pages/experiment/ExperimentAgentDetails'
import ActivityExplorer from './pages/ActivityExplorer'
import DemoOverview from './pages/demo/DemoOverview'
import DemoAgentDetails from './pages/demo/DemoAgentDetails'
import DemoActivityExplorer from './pages/demo/DemoActivityExplorer'
import EastmanOverview from './pages/eastman/EastmanOverview'
import EastmanAgentDetails from './pages/eastman/EastmanAgentDetails'
import EastmanActivityExplorer from './pages/eastman/EastmanActivityExplorer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Overview />} />
          <Route path="agents/:agentId" element={<AgentDetails />} />
          <Route path="activity-explorer" element={<ActivityExplorer />} />
          {/* Design proposal routes — separate flow, existing pages untouched */}
          <Route path="proposal" element={<ProposalOverview />} />
          <Route path="proposal/agents/:agentId" element={<ProposalAgentDetails />} />
          {/* Design Option B — decisioning-first dashboard */}
          <Route path="proposal-b" element={<ProposalOverviewB />} />
          {/* Experiment routes — cloned from proposal for experimentation */}
          <Route path="experiment" element={<ExperimentOverview />} />
          <Route path="experiment/agents/:agentId" element={<ExperimentAgentDetails />} />
          {/* Demo routes — fresh copy from root for new experiments */}
          <Route path="demo" element={<DemoOverview />} />
          <Route path="demo/agents/:agentId" element={<DemoAgentDetails />} />
          <Route path="demo/activity-explorer" element={<DemoActivityExplorer />} />
          {/* Eastman routes — customized demo for Eastman */}
          <Route path="eastman" element={<EastmanOverview />} />
          <Route path="eastman/agents/:agentId" element={<EastmanAgentDetails />} />
          <Route path="eastman/activity-explorer" element={<EastmanActivityExplorer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
