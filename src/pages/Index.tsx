
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    // Force dark mode on this page
    document.documentElement.classList.add('dark');
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
          Welcome to Your Application
        </h1>
        
        <p className="text-xl mb-8 text-muted-foreground">
          A powerful platform for managing your tasks, webhooks and more
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
            <Link to="/login">
              Sign In
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link to="/signup">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-20 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
