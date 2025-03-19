import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Menu, Webhook } from 'lucide-react';
import WebhooksSidebar from '@/components/webhooks/WebhooksSidebar';

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

  const toggleWebhookSidebar = () => {
    setWebhookSidebarOpen(!webhookSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
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
        />

        <div className="flex flex-1 relative">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          
          {/* Webhooks Button (Mobile) */}
          <div className="fixed bottom-4 right-4 md:hidden z-20">
            <Button 
              onClick={toggleWebhookSidebar}
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <Webhook className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Webhooks Sidebar */}
          <div className={`${webhookSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
                          transition-transform duration-300 fixed md:relative right-0 top-0 z-10
                          h-screen w-full md:w-80 md:translate-x-0 bg-card border-l border-border`}>
            <WebhooksSidebar 
              onClose={() => setWebhookSidebarOpen(false)} 
              visible={webhookSidebarOpen} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
