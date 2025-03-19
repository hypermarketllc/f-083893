
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, BarChart3, Settings, ListChecks } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  children: React.ReactNode;
}

export default function TabNavigation({ activeTab, setActiveTab, children }: TabNavigationProps) {
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="p-6">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid grid-cols-5 w-full max-w-xl">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      {children}
    </Tabs>
  );
}
