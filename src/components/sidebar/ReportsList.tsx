
import React from 'react';
import { Link } from 'react-router-dom';
import { REPORTS } from './SidebarConstants';

interface ReportsListProps {
  collapsed?: boolean;
}

const ReportsList: React.FC<ReportsListProps> = ({ collapsed = false }) => {
  return (
    <>
      {REPORTS.map((report) => (
        <li key={report.id}>
          <Link 
            to={`/reports/${report.id}`} 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            <report.icon className="h-4 w-4" />
            {!collapsed && report.name}
            {collapsed && <span className="sr-only">{report.name}</span>}
          </Link>
        </li>
      ))}
    </>
  );
};

export default ReportsList;
