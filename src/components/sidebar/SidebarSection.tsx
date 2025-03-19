
import React, { useState, ReactNode, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  icon?: ReactNode;
  collapsed?: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
  icon,
  collapsed = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Reset expansion state when sidebar is collapsed
  useEffect(() => {
    if (collapsed) {
      setIsExpanded(false);
    } else {
      setIsExpanded(defaultExpanded);
    }
  }, [collapsed, defaultExpanded]);

  const toggleExpanded = () => {
    if (!collapsed) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="py-2">
      <div
        className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {!collapsed && <span>{title}</span>}
          {collapsed && <span className="sr-only">{title}</span>}
        </div>
        {!collapsed && (
          <span className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded && !collapsed ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="pl-2 mt-1">{children}</div>
      </div>
    </div>
  );
};

export default SidebarSection;
