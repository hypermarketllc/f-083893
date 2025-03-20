
import { 
  Home, Bell, BarChart3, LayoutGrid, GanttChart,
  DollarSign, PhoneCall, Users, Building2, LineChart, Settings,
  FileText, Book, BookOpen, Bookmark
} from 'lucide-react';

export interface SpaceProps {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

export const SPACES: SpaceProps[] = [
  { id: 'everything', name: 'Everything', color: 'gray', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'development', name: 'Development', color: 'indigo', icon: <GanttChart className="h-4 w-4" /> },
  { id: 'marketing', name: 'Marketing', color: 'yellow', icon: <Bell className="h-4 w-4" /> },
  { id: 'product', name: 'Product', color: 'pink', icon: <Home className="h-4 w-4" /> },
];

export const REPORTS = [
  { id: 'pandl', name: 'P&L', icon: DollarSign },
  { id: 'calls', name: 'Calls', icon: PhoneCall },
  { id: 'leads', name: 'Leads', icon: Users },
  { id: 'agents', name: 'Agents', icon: Users },
  { id: 'pubs', name: 'Pubs', icon: Building2 },
];

export const DOCS = [
  { id: 'guides', name: 'Guides', icon: Book },
  { id: 'api', name: 'API Reference', icon: FileText },
  { id: 'tutorials', name: 'Tutorials', icon: BookOpen },
  { id: 'resources', name: 'Resources', icon: Bookmark },
];
