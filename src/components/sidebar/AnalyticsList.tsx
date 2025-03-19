
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, LineChart, PieChart, Activity } from 'lucide-react';

interface AnalyticsListProps {
  collapsed?: boolean;
}

const AnalyticsList: React.FC<AnalyticsListProps> = ({ collapsed = false }) => {
  return (
    <>
      <li>
        <Link 
          to="/dashboard?tab=analytics&view=overview" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          <Activity className="h-4 w-4" />
          {!collapsed && "Overview"}
          {collapsed && <span className="sr-only">Overview</span>}
        </Link>
      </li>
      <li>
        <Link 
          to="/dashboard?tab=analytics&view=performance" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          <LineChart className="h-4 w-4" />
          {!collapsed && "Performance"}
          {collapsed && <span className="sr-only">Performance</span>}
        </Link>
      </li>
      <li>
        <Link 
          to="/dashboard?tab=analytics&view=usage" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          <BarChart className="h-4 w-4" />
          {!collapsed && "Usage"}
          {collapsed && <span className="sr-only">Usage</span>}
        </Link>
      </li>
      <li>
        <Link 
          to="/dashboard?tab=analytics&view=distribution" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          <PieChart className="h-4 w-4" />
          {!collapsed && "Distribution"}
          {collapsed && <span className="sr-only">Distribution</span>}
        </Link>
      </li>
    </>
  );
};

export default AnalyticsList;
