
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Bell, BarChart3 } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

const MainNavigation: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <ul className="space-y-1">
      <SidebarNavItem 
        to="/dashboard" 
        icon={Home} 
        label="Home"
        isActive={pathname === "/dashboard"}
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
    </ul>
  );
};

export default MainNavigation;
