
import { 
  Home, Bell, BarChart3, LayoutGrid, GanttChart,
  DollarSign, PhoneCall, Users, Building2, LineChart, Settings,
  FileText, Book, BookOpen, Bookmark
} from 'lucide-react';

export interface SpaceProps {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const SPACES: SpaceProps[] = [
  { id: 'everything', name: 'Everything', color: 'gray', icon: 'grid' },
  { id: 'development', name: 'Development', color: 'indigo', icon: 'D' },
  { id: 'marketing', name: 'Marketing', color: 'yellow', icon: 'M' },
  { id: 'product', name: 'Product', color: 'pink', icon: 'P' },
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
