
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Menu, Settings, LogOut, User, HelpCircle, Moon, Sun } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  userEmail: string | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  signOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userEmail, 
  searchQuery, 
  setSearchQuery,
  signOut 
}) => {
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  const getInitials = () => {
    if (!userEmail) return 'U';
    return userEmail.charAt(0).toUpperCase();
  };

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications at this time.",
    });
    setHasNotifications(false);
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile Settings",
      description: "Profile settings will be available soon.",
    });
  };
  
  const handleHelpClick = () => {
    toast({
      title: "Help & Support",
      description: "Our support team is here to help you.",
    });
  };
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setActiveTheme(theme);
    toast({
      title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      description: `The application is now using the ${theme} theme.`,
    });
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                {/* Mobile sidebar content will go here */}
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Navigation</h2>
                  <nav className="space-y-2">
                    {/* Add mobile navigation items here */}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
                    <AvatarImage src="" alt={userEmail || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userEmail?.split('@')[0]}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleHelpClick}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      {activeTheme === 'light' ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : activeTheme === 'dark' ? (
                        <Moon className="mr-2 h-4 w-4" />
                      ) : (
                        <div className="mr-2 h-4 w-4 relative">
                          <Sun className="absolute inset-0 transition-opacity opacity-100 dark:opacity-0" />
                          <Moon className="absolute inset-0 transition-opacity opacity-0 dark:opacity-100" />
                        </div>
                      )}
                      <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                          <div className="mr-2 h-4 w-4 relative">
                            <Sun className="absolute inset-0 transition-opacity opacity-100 dark:opacity-0" />
                            <Moon className="absolute inset-0 transition-opacity opacity-0 dark:opacity-100" />
                          </div>
                          <span>System</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold leading-none">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Welcome back!</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block group">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-[180px] lg:w-[280px] pl-8 pr-4 py-2 h-9 focus:w-[220px] lg:focus:w-[320px] transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Badge className="absolute right-2 top-1.5 text-xs bg-primary/90 hover:bg-primary/80">
                  {searchQuery}
                </Badge>
              )}
            </div>
            
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNotificationsClick}
                    className="relative"
                  >
                    <Bell className="h-5 w-5" />
                    {hasNotifications && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="hidden sm:block">
              <Button variant="outline" size="sm" onClick={signOut} className="h-9">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
