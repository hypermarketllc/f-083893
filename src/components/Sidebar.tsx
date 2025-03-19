
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, ChevronLeft, ChevronRight, Checkbox, BarChart3 } from 'lucide-react';

import SidebarHeader from './sidebar/SidebarHeader';
import MainNavigation from './sidebar/MainNavigation';
import SidebarSection from './sidebar/SidebarSection';
import SpacesList from './sidebar/SpacesList';
import ReportsList from './sidebar/ReportsList';
import DocsList from './sidebar/DocsList';
import UserProfile from './sidebar/UserProfile';
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

  // Check if sidebar collapse state is saved in localStorage
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
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-16 h-6 w-6 bg-background border rounded-full shadow-sm z-10 text-muted-foreground hidden md:flex"
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Logo */}
      <SidebarHeader collapsed={collapsed} />

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <MainNavigation collapsed={collapsed} />

        {/* Tasks Section */}
        <SidebarSection 
          title="Tasks" 
          icon={<Checkbox className="h-4 w-4" />}
          defaultExpanded={tasksExpanded}
          collapsed={collapsed}
        >
          <TasksList collapsed={collapsed} />
        </SidebarSection>

        {/* Analytics Section */}
        <SidebarSection 
          title="Analytics" 
          icon={<BarChart3 className="h-4 w-4" />}
          defaultExpanded={analyticsExpanded}
          collapsed={collapsed}
        >
          <AnalyticsList collapsed={collapsed} />
        </SidebarSection>

        {/* Spaces */}
        <SidebarSection 
          title="Spaces" 
          defaultExpanded={spacesExpanded}
          collapsed={collapsed}
        >
          <SpacesList collapsed={collapsed} />
        </SidebarSection>

        {/* Reports Section */}
        <SidebarSection 
          title="Reports" 
          icon={<LineChart className="h-4 w-4" />}
          defaultExpanded={reportsExpanded}
          collapsed={collapsed}
        >
          <ReportsList collapsed={collapsed} />
        </SidebarSection>

        {/* Dashboards */}
        <SidebarSection 
          title="Dashboards" 
          defaultExpanded={dashboardsExpanded}
          collapsed={collapsed}
        >
          <div className="text-sm text-muted-foreground py-2">
            {!collapsed && "Dashboard content will be added soon"}
          </div>
        </SidebarSection>

        {/* Docs */}
        <SidebarSection 
          title="Docs" 
          defaultExpanded={docsExpanded}
          collapsed={collapsed}
        >
          <DocsList collapsed={collapsed} />
        </SidebarSection>
      </nav>

      {/* User Profile */}
      <UserProfile collapsed={collapsed} />
    </div>
  );
}
