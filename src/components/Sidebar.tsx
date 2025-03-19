
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart } from 'lucide-react';

import SidebarHeader from './sidebar/SidebarHeader';
import MainNavigation from './sidebar/MainNavigation';
import SidebarSection from './sidebar/SidebarSection';
import SpacesList from './sidebar/SpacesList';
import ReportsList from './sidebar/ReportsList';
import DocsList from './sidebar/DocsList';
import UserProfile from './sidebar/UserProfile';

export default function Sidebar() {
  const { pathname } = useLocation();
  const [spacesExpanded, setSpacesExpanded] = useState(true);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [dashboardsExpanded, setDashboardsExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);

  return (
    <div className="h-screen border-r border-border bg-card w-64 flex flex-col">
      {/* Logo */}
      <SidebarHeader />

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <MainNavigation />

        {/* Spaces */}
        <SidebarSection 
          title="Spaces" 
          defaultExpanded={spacesExpanded}
        >
          <SpacesList />
        </SidebarSection>

        {/* Reports Section */}
        <SidebarSection 
          title="Reports" 
          icon={<LineChart className="h-4 w-4" />}
          defaultExpanded={reportsExpanded}
        >
          <ReportsList />
        </SidebarSection>

        {/* Dashboards */}
        <SidebarSection 
          title="Dashboards" 
          defaultExpanded={dashboardsExpanded}
        >
          <div className="text-sm text-muted-foreground py-2">
            Dashboard content will be added soon
          </div>
        </SidebarSection>

        {/* Docs */}
        <SidebarSection 
          title="Docs" 
          defaultExpanded={docsExpanded}
        >
          <DocsList />
        </SidebarSection>
      </nav>

      {/* User Profile */}
      <UserProfile />
    </div>
  );
}
