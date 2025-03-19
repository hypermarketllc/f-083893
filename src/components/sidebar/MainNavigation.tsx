
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Bell, BarChart3, Webhook, Settings } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

interface MainNavigationProps {
  collapsed?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ collapsed = false }) => {
  const { pathname, search } = useLocation();
  const isSettingsActive = search.includes('tab=settings');

  return (
    <ul className="space-y-1">
      <SidebarNavItem 
        to="/dashboard" 
        icon={Home} 
        label="Home"
        isActive={pathname === "/dashboard" && !search}
        collapsed={collapsed}
      />
      <SidebarNavItem 
        to="/notifications" 
        icon={Bell} 
        label="Notifications"
        isActive={pathname === "/notifications"}
        collapsed={collapsed}
      />
      <SidebarNavItem 
        to="/goals" 
        icon={BarChart3} 
        label="Goals"
        isActive={pathname === "/goals"}
        collapsed={collapsed}
      />
      <SidebarNavItem 
        to="/webhooks" 
        icon={Webhook} 
        label="Webhooks"
        isActive={pathname === "/webhooks" || pathname.startsWith("/webhooks/")}
        collapsed={collapsed}
      />
      <SidebarNavItem 
        to="/dashboard?tab=settings" 
        icon={Settings} 
        label="Settings"
        isActive={isSettingsActive}
        collapsed={collapsed}
      />
    </ul>
  );
};

export default MainNavigation;
