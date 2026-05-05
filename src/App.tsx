import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import DlpLayout from './components/DlpLayout'
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
import ClevelandOverview from './pages/cleveland/ClevelandOverview'
import ClevelandAgentDetails from './pages/cleveland/ClevelandAgentDetails'
import MOSIntegrationOverview from './pages/mosintegration/MOSIntegrationOverview'
import MOSIntegrationAgentDetails from './pages/mosintegration/MOSIntegrationAgentDetails'
import MOSIntegrationActivityExplorer from './pages/mosintegration/MOSIntegrationActivityExplorer'
import EastmanDlpAlerts from './pages/eastman/EastmanDlpAlerts'
import LocalAgentsOverview from './pages/local-agents/LocalAgentsOverview'
import LocalAgentsAgentDetails from './pages/local-agents/LocalAgentsAgentDetails'
import LocalAgentsActivityExplorer from './pages/local-agents/LocalAgentsActivityExplorer'
import LocalAgentsSessions from './pages/local-agents/LocalAgentsSessions'
import LocalAgentDetail from './pages/local-agents/LocalAgentDetail'

export default function App() {
  return (
    <BrowserRouter basename="/P4A365BwCPrototype">
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
          {/* Cleveland routes — spike-to-action investigation prototype (cloned from proposal) */}
          <Route path="cleveland" element={<ClevelandOverview />} />
          <Route path="cleveland/agents/:agentId" element={<ClevelandAgentDetails />} />
          {/* MOSIntegration routes — cloned from demo */}
          <Route path="mosintegration" element={<MOSIntegrationOverview />} />
          <Route path="mosintegration/agents/:agentId" element={<MOSIntegrationAgentDetails />} />
          <Route path="mosintegration/activity-explorer" element={<MOSIntegrationActivityExplorer />} />
          {/* Local Agents routes — cloned from demo for local agent scenarios */}
          <Route path="local-agents" element={<LocalAgentsOverview />} />
          <Route path="local-agents/agents/:agentId" element={<LocalAgentsAgentDetails />} />
          <Route path="local-agents/activity-explorer" element={<LocalAgentsActivityExplorer />} />
          <Route path="local-agents/sessions" element={<LocalAgentsSessions />} />
          <Route path="local-agents/detail" element={<LocalAgentDetail />} />
        </Route>
        {/* DLP routes — separate layout with DLP sidebar */}
        <Route path="/dlp" element={<DlpLayout />}>
          <Route path="alerts" element={<EastmanDlpAlerts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
