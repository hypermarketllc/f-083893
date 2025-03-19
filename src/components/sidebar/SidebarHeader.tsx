
import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarHeaderProps {
  collapsed?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed = false }) => {
  return (
    <div className="flex items-center h-16 px-4 border-b border-border">
      <Link to="/" className="flex items-center">
        {collapsed ? (
          <span className="text-xl font-semibold text-primary">L</span>
        ) : (
          <span className="text-xl font-semibold">
            <span className="text-primary">Lovable</span> Dashboard
          </span>
        )}
      </Link>
    </div>
  );
};

export default SidebarHeader;
