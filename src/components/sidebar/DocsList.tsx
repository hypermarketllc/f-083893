
import React from 'react';
import { Link } from 'react-router-dom';

const DocsList: React.FC = () => {
  return (
    <>
      <li>
        <Link 
          to="/docs/all" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          All
        </Link>
      </li>
      <li>
        <Link 
          to="/docs/assigned" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          Assigned to me
        </Link>
      </li>
      <li>
        <Link 
          to="/docs/shared" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          Shared
        </Link>
      </li>
      <li>
        <Link 
          to="/docs/private" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          Private
        </Link>
      </li>
    </>
  );
};

export default DocsList;
