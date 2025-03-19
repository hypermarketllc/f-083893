
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive = false 
}) => {
  return (
    <li>
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive 
            ? "bg-accent text-accent-foreground" 
            : "hover:bg-accent/50"
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    </li>
  );
};

export default SidebarNavItem;
