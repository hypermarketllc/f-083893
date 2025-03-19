import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Bell, BarChart3, LayoutGrid, FileText, 
  ChevronDown, ChevronRight, PlusCircle, GanttChart,
  DollarSign, PhoneCall, Users, Building2, LineChart, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface SpaceProps {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const SPACES: SpaceProps[] = [
  { id: 'everything', name: 'Everything', color: 'gray', icon: 'grid' },
  { id: 'development', name: 'Development', color: 'indigo', icon: 'D' },
  { id: 'marketing', name: 'Marketing', color: 'yellow', icon: 'M' },
  { id: 'product', name: 'Product', color: 'pink', icon: 'P' },
];

const REPORTS = [
  { id: 'pandl', name: 'P&L', icon: DollarSign },
  { id: 'calls', name: 'Calls', icon: PhoneCall },
  { id: 'leads', name: 'Leads', icon: Users },
  { id: 'agents', name: 'Agents', icon: Users },
  { id: 'pubs', name: 'Pubs', icon: Building2 },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [spacesExpanded, setSpacesExpanded] = useState(true);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [dashboardsExpanded, setDashboardsExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);

  return (
    <div className="h-screen border-r border-border bg-card w-64 flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-purple-500">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="white" strokeWidth="2" fill="none">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
        <span className="font-bold text-xl">ClickUp</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/dashboard" 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/dashboard" 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent/50"
              )}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/notifications" 
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <Bell className="h-5 w-5" />
              Notifications
            </Link>
          </li>
          <li>
            <Link 
              to="/goals" 
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              Goals
            </Link>
          </li>
        </ul>

        {/* Spaces */}
        <div className="mt-6">
          <button 
            onClick={() => setSpacesExpanded(!spacesExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 rounded-md transition-colors"
          >
            <span>Spaces</span>
            {spacesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {spacesExpanded && (
            <ul className="mt-1 space-y-1">
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
            </ul>
          )}
        </div>

        {/* Reports Section */}
        <div className="mt-2">
          <button 
            onClick={() => setReportsExpanded(!reportsExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Reports
            </span>
            {reportsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {reportsExpanded && (
            <ul className="mt-1 space-y-1 ml-3">
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
            </ul>
          )}
        </div>

        {/* Dashboards */}
        <div className="mt-2">
          <button 
            onClick={() => setDashboardsExpanded(!dashboardsExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 rounded-md transition-colors"
          >
            <span>Dashboards</span>
            {dashboardsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Docs */}
        <div className="mt-2">
          <button 
            onClick={() => setDocsExpanded(!docsExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-accent/50 rounded-md transition-colors"
          >
            <span>Docs</span>
            {docsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {docsExpanded && (
            <ul className="mt-1 space-y-1 ml-3">
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
            </ul>
          )}
        </div>
      </nav>

      {/* User Profile - Removed email display */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

