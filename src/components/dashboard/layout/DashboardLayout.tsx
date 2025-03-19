
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Force dark theme on first load
  useEffect(() => {
    // First set mounted to true so we can safely show the UI
    setMounted(true);
    
    // Force dark theme as default
    document.documentElement.classList.add('dark');
    setTheme('dark');
  }, [setTheme]);

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
          theme={mounted ? theme : 'dark'} // Default to dark when not mounted
          setTheme={setTheme}
        />

        <div className="flex flex-1 relative">
          <div className="flex-1 overflow-auto transition-all duration-300 pr-80">
            {children}
          </div>
          
          {/* Webhooks Sidebar - Always visible as a fixed panel on the right */}
          <div className="fixed top-14 right-0 w-80 h-[calc(100vh-3.5rem)] border-l border-border bg-card overflow-auto shadow-md">
            <WebhooksSidebar 
              visible={true}
              onClose={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
