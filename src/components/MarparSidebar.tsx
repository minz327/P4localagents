import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  tokens,
  Tooltip,
  createPresenceComponent,
  motionTokens,
} from '@fluentui/react-components'
import {
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  Hamburger,
  AppItemStatic,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
  type OnNavItemSelectData,
} from '@fluentui/react-components'
import { ShieldPerson20Regular } from '@fluentui/react-icons'
import {
  TargetArrow20Filled,
  TargetArrow20Regular,
  Apps20Filled,
  Apps20Regular,
  DocumentSearch20Filled,
  DocumentSearch20Regular,
  Database20Filled,
  Database20Regular,
  ShieldTask20Filled,
  ShieldTask20Regular,
  Wrench20Filled,
  Wrench20Regular,
  ArrowReset20Filled,
  ArrowReset20Regular,
  ChartMultiple20Filled,
  ChartMultiple20Regular,
  Navigation20Regular,
  DataTrendingFilled,
  DataTrendingRegular,
  GlassesFilled,
  GlassesRegular,
  SearchSparkleFilled,
  SearchSparkleRegular,
  PinRegular,
  TaskListSquareLtrFilled,
  TaskListSquareLtrRegular,
  ShieldCheckmarkFilled,
  ShieldCheckmarkRegular,
  bundleIcon,
} from '@fluentui/react-icons'
import {
  HomeIcon,
  SolutionsIcon,
  AgentsIcon,
  LearnIcon,
  UsageCenterIcon,
  SettingsIcon,
  DSPMIcon,
  DLPIcon,
} from './SidebarIcons'

const PostureNav = bundleIcon(DataTrendingFilled, DataTrendingRegular)
const ObjectivesNav = bundleIcon(TargetArrow20Filled, TargetArrow20Regular)
const AIObservabilityNav = bundleIcon(SearchSparkleFilled, SearchSparkleRegular)
const AppsAgentsNav = bundleIcon(Apps20Filled, Apps20Regular)
const ActivityExplorerNav = bundleIcon(DocumentSearch20Filled, DocumentSearch20Regular)
const AssetExplorerNav = bundleIcon(Database20Filled, Database20Regular)
const DataRiskNav = bundleIcon(ShieldTask20Filled, ShieldTask20Regular)
const PoliciesNav = bundleIcon(ShieldCheckmarkFilled, ShieldCheckmarkRegular)
const DiscoverNav = bundleIcon(GlassesFilled, GlassesRegular)
const TasksNav = bundleIcon(TaskListSquareLtrFilled, TaskListSquareLtrRegular)
const SetupTasksNav = bundleIcon(Wrench20Filled, Wrench20Regular)
const RemediationNav = bundleIcon(ArrowReset20Filled, ArrowReset20Regular)
const ReportsNav = bundleIcon(ChartMultiple20Filled, ChartMultiple20Regular)

const InsiderRiskIcon = () => <ShieldPerson20Regular style={{ fontSize: 20 }} />

// Custom motion: animate on expand, instant on collapse
const NavExpandMotion = createPresenceComponent(() => {
  const keyframes = [
    { opacity: 0, transform: 'translate3D(-100%, 0, 0)' },
    { opacity: 1, transform: 'translate3D(0, 0, 0)' },
  ]
  return {
    enter: {
      keyframes,
      duration: parseInt(motionTokens.durationNormal),
      easing: motionTokens.curveDecelerateMin,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: 0,
    },
  }
})

const useStyles = makeStyles({
  navDrawer: {
    height: '100%',
    borderRight: 'none',
    width: '260px',
    backgroundColor: '#F0F0F0',
  },
})

function LeftRailItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center py-3 cursor-pointer group relative ${active ? 'text-[#0078D4]' : 'text-[#616161] hover:text-[#242424]'}`}>
      {active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#0078D4] rounded-r" />}
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] text-center leading-3 px-1">{label}</span>
    </div>
  )
}

export default function MarparSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const styles = useStyles()
  const [isOpen, setIsOpen] = React.useState(true)

  // Determine selected value based on current route
  const getSelectedValue = (): string => {
    if (location.pathname.includes('/activity-explorer')) return 'activity-explorer'
    if (location.pathname === '/marpar-local-agents' || location.pathname.startsWith('/marpar-local-agents/agents')) return 'ai-observability'
    return 'ai-observability'
  }

  const handleNavItemSelect = (_: React.SyntheticEvent | Event, data: OnNavItemSelectData) => {
    const value = data.value as string
    switch (value) {
      case 'ai-observability':
        navigate('/marpar-local-agents')
        break
      case 'activity-explorer':
        navigate('/marpar-local-agents/activity-explorer')
        break
    }
  }

  return (
    <div className="flex h-full">
      {/* Primary Rail */}
      <div className="w-[72px] bg-[#F0F0F0] border-r border-[#E0E0E0] flex flex-col items-center py-2 overflow-y-auto scrollbar-hide">
        <div className="mb-2">
          <HomeIcon />
          <div className="text-[10px] text-center mt-1 text-[#616161]">Home</div>
        </div>

        <div className="w-8 h-px bg-[#E0E0E0] my-1" />

        <LeftRailItem icon={<SolutionsIcon />} label="Solutions" />
        <LeftRailItem icon={<AgentsIcon />} label="Agents" />
        <LeftRailItem icon={<LearnIcon />} label="Learn" />
        <LeftRailItem icon={<UsageCenterIcon />} label="Usage center (preview)" />
        <LeftRailItem icon={<SettingsIcon />} label="Settings" />

        <div className="w-8 h-px bg-[#E0E0E0] my-1" />

        <LeftRailItem icon={<InsiderRiskIcon />} label="Insider Risk Managem..." />
        <LeftRailItem icon={<DLPIcon />} label="Data Loss Prevention" onClick={() => navigate('/dlp/alerts')} />
        <LeftRailItem icon={<DSPMIcon />} label="Data Security Posture Management" active />
      </div>

      {/* Secondary Navigation — Fluent UI NavDrawer */}
      <FluentProvider theme={webLightTheme}>
        <NavDrawer
          open={isOpen}
          type="inline"
          size="medium"
          selectedValue={getSelectedValue()}
          defaultSelectedCategoryValue=""
          defaultOpenCategories={['discover', 'tasks']}
          onNavItemSelect={handleNavItemSelect}
          surfaceMotion={{ children: (_, props) => <NavExpandMotion {...props} /> }}
          className={styles.navDrawer}
        >
          <NavDrawerHeader>
            <Tooltip content="Toggle navigation" relationship="label">
              <Hamburger onClick={() => setIsOpen(!isOpen)} />
            </Tooltip>
          </NavDrawerHeader>

          <NavDrawerBody>
            <AppItemStatic icon={<DSPMIcon size={20} />}>
              DSPM
            </AppItemStatic>

            <NavItem icon={<PostureNav style={{ fontSize: 20 }} />} value="posture">
              Posture
            </NavItem>
            <NavItem icon={<ObjectivesNav />} value="objectives">
              Objectives
            </NavItem>
            <NavItem icon={<AIObservabilityNav style={{ fontSize: 20 }} />} value="ai-observability">
              AI observability
            </NavItem>

            <NavCategory value="discover">
              <NavCategoryItem icon={<DiscoverNav style={{ fontSize: 20 }} />}>
                Discover
              </NavCategoryItem>
              <NavSubItemGroup>
                <NavSubItem value="apps-agents">
                  Apps and agents
                </NavSubItem>
                <NavSubItem value="activity-explorer">
                  Activity explorer
                </NavSubItem>
                <NavSubItem value="data-risk">
                  Data risk assessments
                </NavSubItem>
                <NavSubItem value="policies">
                  Policies
                </NavSubItem>
              </NavSubItemGroup>
            </NavCategory>

            <NavCategory value="tasks">
              <NavCategoryItem icon={<TasksNav style={{ fontSize: 20 }} />}>
                Tasks and actions
              </NavCategoryItem>
              <NavSubItemGroup>
                <NavSubItem value="setup-tasks">
                  Setup tasks
                </NavSubItem>
                <NavSubItem value="remediation">
                  Remediation actions
                </NavSubItem>
              </NavSubItemGroup>
            </NavCategory>

            <NavItem icon={<ReportsNav />} value="reports">
              Reports
            </NavItem>
          </NavDrawerBody>
        </NavDrawer>
      </FluentProvider>

      {/* Collapsed Rail — icon-only mode (Purview-style) */}
      {!isOpen && (
        <FluentProvider theme={webLightTheme}>
          <div className="w-[48px] bg-[#F0F0F0] flex flex-col items-center py-2 shrink-0 h-full">
            {/* Expand toggle */}
            <Tooltip content="Expand navigation" relationship="label" positioning="after">
              <button
                onClick={() => setIsOpen(true)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#E0E0E0] text-[#616161] hover:text-[#242424] mb-2"
              >
                <Navigation20Regular />
              </button>
            </Tooltip>

            <div className="w-6 h-px bg-[#E0E0E0] my-1" />

            {/* Rail nav items */}
            {([
              { icon: <DataTrendingRegular style={{ fontSize: 20 }} />, label: 'Posture', value: 'posture' },
              { icon: <TargetArrow20Regular />, label: 'Objectives', value: 'objectives' },
              { icon: <SearchSparkleRegular style={{ fontSize: 20 }} />, label: 'AI observability', value: 'ai-observability' },
              { icon: <GlassesRegular style={{ fontSize: 20 }} />, label: 'Discover', value: 'discover' },
              { icon: <TaskListSquareLtrRegular style={{ fontSize: 20 }} />, label: 'Tasks and actions', value: 'tasks' },
              { icon: <ChartMultiple20Regular />, label: 'Reports', value: 'reports' },
            ] as const).map(item => (
              <Tooltip key={item.value} content={item.label} relationship="label" positioning="after">
                <button
                  onClick={() => {
                    if (item.value === 'ai-observability') navigate('/marpar-local-agents')
                    else if (item.value === 'discover' || item.value === 'tasks') setIsOpen(true)
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded my-0.5 ${
                    getSelectedValue() === item.value
                      ? 'bg-[#EFF6FC] text-[#0078D4]'
                      : 'text-[#616161] hover:bg-[#E0E0E0] hover:text-[#242424]'
                  }`}
                >
                  {item.icon}
                </button>
              </Tooltip>
            ))}
          </div>
        </FluentProvider>
      )}
    </div>
  )
}

