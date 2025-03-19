
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Menu, WebhookIcon } from 'lucide-react';
import WebhooksSidebar from '@/components/webhooks/WebhooksSidebar';
import { useTheme } from 'next-themes';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function DashboardLayout({
  children,
  sidebarOpen,
  toggleSidebar,
  searchQuery,
  setSearchQuery
}: DashboardLayoutProps) {
  const { signOut } = useAuth();
  const [webhookSidebarOpen, setWebhookSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set dark theme as default and ensure theme is only accessed after mounting
  useEffect(() => {
    setMounted(true);
    setTheme('dark');
  }, [setTheme]);

  const toggleWebhookSidebar = () => {
    setWebhookSidebarOpen(!webhookSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block transition-all duration-200`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={sidebarOpen ? 'hidden' : 'block'}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <DashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          signOut={signOut}
          toggleSidebar={toggleSidebar}
          theme={mounted ? theme : undefined}
          setTheme={setTheme}
        />

        <div className="flex flex-1 relative">
          <div className={`flex-1 overflow-auto transition-all duration-300 ${webhookSidebarOpen ? 'md:mr-80' : ''}`}>
            {children}
          </div>
          
          {/* Webhooks Button (Fixed) */}
          <div className="fixed bottom-4 right-4 md:hidden z-20">
            <Button 
              onClick={toggleWebhookSidebar}
              className="rounded-full h-12 w-12 shadow-lg"
              variant={webhookSidebarOpen ? "outline" : "default"}
            >
              <WebhookIcon className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Webhooks Sidebar - Make it always visible on desktop */}
          <div 
            className={`
              fixed md:static right-0 top-0 z-10
              h-screen md:h-full w-full md:w-80 bg-card border-l border-border
              transition-transform duration-300 ease-in-out shadow-lg md:shadow-none
              ${webhookSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}
          >
            <WebhooksSidebar 
              onClose={() => setWebhookSidebarOpen(false)} 
              visible={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
