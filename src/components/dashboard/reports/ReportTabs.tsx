
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, PhoneCall, Users, Building2 } from 'lucide-react';

interface ReportTabsProps {
  activeReport: string;
  onChangeReport: (value: string) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ activeReport, onChangeReport }) => {
  return (
    <TabsList className="mb-4">
      <TabsTrigger 
        value="pandl" 
        className="flex items-center gap-2"
        onClick={() => onChangeReport('pandl')}
      >
        <DollarSign className="h-4 w-4" />
        P&L
      </TabsTrigger>
      <TabsTrigger 
        value="calls" 
        className="flex items-center gap-2"
        onClick={() => onChangeReport('calls')}
      >
        <PhoneCall className="h-4 w-4" />
        Calls
      </TabsTrigger>
      <TabsTrigger 
        value="leads" 
        className="flex items-center gap-2"
        onClick={() => onChangeReport('leads')}
      >
        <Users className="h-4 w-4" />
        Leads
      </TabsTrigger>
      <TabsTrigger 
        value="agents" 
        className="flex items-center gap-2"
        onClick={() => onChangeReport('agents')}
      >
        <Users className="h-4 w-4" />
        Agents
      </TabsTrigger>
      <TabsTrigger 
        value="pubs" 
        className="flex items-center gap-2"
        onClick={() => onChangeReport('pubs')}
      >
        <Building2 className="h-4 w-4" />
        Pubs
      </TabsTrigger>
    </TabsList>
  );
};

export default ReportTabs;
