
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { SPACES } from './SidebarConstants';

const SpacesList: React.FC = () => {
  return (
    <>
      {SPACES.map((space) => (
        <li key={space.id}>
          <Link 
            to={`/spaces/${space.id}`} 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            {space.icon === 'grid' ? (
              <LayoutGrid className="h-5 w-5" />
            ) : (
              <div className={`flex items-center justify-center h-6 w-6 rounded text-white bg-${space.color}-500`}>
                {space.icon}
              </div>
            )}
            {space.name}
          </Link>
        </li>
      ))}
    </>
  );
};

export default SpacesList;
