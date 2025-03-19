
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  collapsed?: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  to,
  icon: Icon,
  label,
  isActive = false,
  collapsed = false
}) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'hover:bg-accent/50 text-foreground'
        } transition-colors`}
      >
        <Icon className="h-4 w-4" />
        {!collapsed && label}
        {collapsed && <span className="sr-only">{label}</span>}
      </Link>
    </li>
  );
};

export default SidebarNavItem;
