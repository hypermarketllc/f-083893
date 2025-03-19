
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  collapsed?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ collapsed = false }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="border-t border-border p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`flex items-center w-full px-2 py-2 rounded-md hover:bg-accent/50 transition-colors ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.email} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="text-sm font-medium">
                  {user?.email ? (
                    <div>{user.email}</div>
                  ) : (
                    <div>User</div>
                  )}
                </div>
              )}
            </div>
            {!collapsed && <User className="h-4 w-4 text-muted-foreground" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate('/dashboard?tab=profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/dashboard?tab=settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
