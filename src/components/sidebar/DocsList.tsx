
import React from 'react';
import { Link } from 'react-router-dom';
import { DOCS } from './SidebarConstants';

interface DocsListProps {
  collapsed?: boolean;
}

const DocsList: React.FC<DocsListProps> = ({ collapsed = false }) => {
  return (
    <>
      {DOCS.map((doc) => (
        <li key={doc.id}>
          <Link 
            to={`/docs/${doc.id}`} 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            <doc.icon className="h-4 w-4" />
            {!collapsed && doc.name}
            {collapsed && <span className="sr-only">{doc.name}</span>}
          </Link>
        </li>
      ))}
    </>
  );
};

export default DocsList;
