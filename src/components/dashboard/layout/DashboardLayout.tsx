
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
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

        {children}
      </div>
    </div>
  );
}
