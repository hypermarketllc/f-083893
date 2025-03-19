
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, ListTodo, LineChart, WebhookIcon, FileText, Settings } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export default function TabNavigation({ activeTab, setActiveTab, children }: TabNavigationProps) {
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL to reflect the tab
    if (value !== 'overview') {
      window.history.pushState(null, '', `/${value}`);
    } else {
      window.history.pushState(null, '', '/dashboard');
    }
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange} 
      className="w-full"
    >
      <div className="border-b px-6 pt-3 pb-0 sticky top-0 bg-background z-10">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full mb-0">
          <TabsTrigger value="overview" className="gap-2 h-10">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2 h-10">
            <ListTodo className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2 h-10">
            <WebhookIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 h-10">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2 h-10">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 h-10">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="p-0">
        {children}
      </div>
    </Tabs>
  );
}
