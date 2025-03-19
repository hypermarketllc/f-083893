
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

// Components
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { TaskProvider } from '@/contexts/TaskContext';

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <TaskProvider>
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
            userEmail={user?.email}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            signOut={signOut}
            toggleSidebar={toggleSidebar}
          />

          <DashboardContent searchQuery={searchQuery} />
        </div>
      </div>
    </TaskProvider>
  );
}
