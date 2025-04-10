
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, ChevronLeft, ChevronRight, CheckSquare, BarChart3 } from 'lucide-react';

import SidebarHeader from './sidebar/SidebarHeader';
import MainNavigation from './sidebar/MainNavigation';
import SidebarSection from './sidebar/SidebarSection';
import SpacesList from './sidebar/SpacesList';
import ReportsList from './sidebar/ReportsList';
import DocsList from './sidebar/DocsList';
import TasksList from './sidebar/TasksList';
import AnalyticsList from './sidebar/AnalyticsList';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const { pathname } = useLocation();
  const [spacesExpanded, setSpacesExpanded] = useState(true);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [dashboardsExpanded, setDashboardsExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', newState.toString());
  };

  return (
    <div className={`h-screen border-r border-border bg-card flex flex-col relative ${collapsed ? 'w-16' : 'w-64'} transition-all duration-200`}>
      <SidebarHeader collapsed={collapsed} />

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <MainNavigation collapsed={collapsed} />

        <SidebarSection 
          title="Tasks" 
          icon={<CheckSquare className="h-4 w-4" />}
          defaultExpanded={tasksExpanded}
          collapsed={collapsed}
        >
          <TasksList collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection 
          title="Analytics" 
          icon={<BarChart3 className="h-4 w-4" />}
          defaultExpanded={analyticsExpanded}
          collapsed={collapsed}
        >
          <AnalyticsList collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection 
          title="Spaces" 
          defaultExpanded={spacesExpanded}
          collapsed={collapsed}
        >
          <SpacesList collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection 
          title="Reports" 
          icon={<LineChart className="h-4 w-4" />}
          defaultExpanded={reportsExpanded}
          collapsed={collapsed}
        >
          <ReportsList collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection 
          title="Dashboards" 
          defaultExpanded={dashboardsExpanded}
          collapsed={collapsed}
        >
          <div className="text-sm text-muted-foreground py-2">
            {!collapsed && "Dashboard content will be added soon"}
          </div>
        </SidebarSection>

        <SidebarSection 
          title="Docs" 
          defaultExpanded={docsExpanded}
          collapsed={collapsed}
        >
          <DocsList collapsed={collapsed} />
        </SidebarSection>
      </nav>

      <div className="mt-auto mb-4 flex justify-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full border border-border shadow-sm hover:bg-accent"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-primary" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-primary" />
          )}
          <span className="sr-only">
            {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </span>
        </Button>
      </div>
    </div>
  );
}
