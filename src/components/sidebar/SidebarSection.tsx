
import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  icon, 
  defaultExpanded = false, 
  children 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mt-2">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 rounded-md transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      
      {expanded && (
        <ul className="mt-1 space-y-1 ml-3">
          {children}
        </ul>
      )}
    </div>
  );
};

export default SidebarSection;
