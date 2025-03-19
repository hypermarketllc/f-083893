
import React from 'react';
import { Link } from 'react-router-dom';
import { SPACES } from './SidebarConstants';

interface SpacesListProps {
  collapsed?: boolean;
}

const SpacesList: React.FC<SpacesListProps> = ({ collapsed = false }) => {
  return (
    <>
      {SPACES.map((space) => (
        <li key={space.id}>
          <Link 
            to={`/spaces/${space.id}`} 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            <div className="h-4 w-4 flex items-center justify-center">{space.icon}</div>
            {!collapsed && space.name}
            {collapsed && <span className="sr-only">{space.name}</span>}
          </Link>
        </li>
      ))}
    </>
  );
};

export default SpacesList;
