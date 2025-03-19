
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Bell, BarChart3, Webhook, Settings } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

const MainNavigation: React.FC = () => {
  const { pathname, search } = useLocation();
  const isSettingsActive = search.includes('tab=settings');

  return (
    <ul className="space-y-1">
      <SidebarNavItem 
        to="/dashboard" 
        icon={Home} 
        label="Home"
        isActive={pathname === "/dashboard" && !search}
      />
      <SidebarNavItem 
        to="/notifications" 
        icon={Bell} 
        label="Notifications"
        isActive={pathname === "/notifications"}
      />
      <SidebarNavItem 
        to="/goals" 
        icon={BarChart3} 
        label="Goals"
        isActive={pathname === "/goals"}
      />
      <SidebarNavItem 
        to="/webhooks" 
        icon={Webhook} 
        label="Webhooks"
        isActive={pathname === "/webhooks" || pathname.startsWith("/webhooks/")}
      />
      <SidebarNavItem 
        to="/dashboard?tab=settings" 
        icon={Settings} 
        label="Settings"
        isActive={isSettingsActive}
      />
    </ul>
  );
};

export default MainNavigation;
