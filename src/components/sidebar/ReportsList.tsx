
import React from 'react';
import { Link } from 'react-router-dom';
import { REPORTS } from './SidebarConstants';

const ReportsList: React.FC = () => {
  return (
    <>
      {REPORTS.map((report) => (
        <li key={report.id}>
          <Link 
            to={`/reports/${report.id}`} 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            <report.icon className="h-4 w-4" />
            {report.name}
          </Link>
        </li>
      ))}
    </>
  );
};

export default ReportsList;
