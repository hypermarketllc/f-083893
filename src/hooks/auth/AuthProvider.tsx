
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from './AuthContext';
import { UserProfile, AuthContextType } from './types';
import { handleAuthError } from './authErrorHandler';
import { storeUserSettings, getUserSettings, updateUserSetting } from '@/utils/storage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthStateChange = (currentSession: Session | null) => {
    console.log("Auth state updated, session:", currentSession ? "exists" : "null");
    
    setSession(currentSession);
    
    if (currentSession?.user) {
      const { id, email } = currentSession.user;
      const userData: UserProfile = {
        id,
        email,
        firstName: currentSession.user.user_metadata?.first_name,
        lastName: currentSession.user.user_metadata?.last_name,
        company: currentSession.user.user_metadata?.company,
        role: currentSession.user.user_metadata?.role,
        title: currentSession.user.user_metadata?.title,
        avatarUrl: currentSession.user.user_metadata?.avatar_url
      };
      
      // Load user settings from localStorage
      const settings = getUserSettings(id);
      if (settings.accentColor) {
        userData.accentColor = settings.accentColor;
        // Apply accent color
        document.documentElement.style.setProperty('--accent-color', settings.accentColor);
      }
      
      setUser(userData);
      console.log(`User authenticated: ${email}`);
    } else {
      setUser(null);
      console.log("No authenticated user");
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth event:", event);
        handleAuthStateChange(currentSession);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        handleAuthStateChange(currentSession);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // Use the appropriate auth options based on "Remember Me" setting
      const options = rememberMe 
        ? { 
            shouldCreateUser: false,
            storeSession: true, // Explicitly store the session
            redirectTo: window.location.origin + '/dashboard'
          }
        : {
            shouldCreateUser: false,
            storeSession: false, // Don't persist the session
            redirectTo: window.location.origin + '/dashboard'
          };
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        handleAuthError(error, "Sign in", toast);
        return;
      }
      
      navigate('/dashboard');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) {
        handleAuthError(error, "Sign up", toast);
        return;
      }
      
      if (data.user && !data.session) {
        toast({
          title: "Account created",
          description: "Please check your email for a confirmation link.",
        });
      } else {
        navigate('/dashboard');
        toast({
          title: "Account created",
          description: "Your account has been created and you're now signed in.",
        });
      }
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleAuthError(error, "Sign out", toast);
        return;
      }
      
      navigate('/login');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        handleAuthError(error, "Password reset", toast);
        return;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        handleAuthError(error, "Password update", toast);
        return;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Unexpected error during password update:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const updateProfile = async (userData: Partial<UserProfile>) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "You must be logged in to update your profile.",
        });
        return;
      }

      // Handle accent color separately
      if (userData.accentColor) {
        // Save accent color to localStorage
        updateUserSetting(user.id, 'accentColor', userData.accentColor);
        
        // Apply accent color
        document.documentElement.style.setProperty('--accent-color', userData.accentColor);
        
        // Remove from supabase update data
        const { accentColor, ...restData } = userData;
        userData = restData;
      }

      // Update supabase user data
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          company: userData.company,
          role: userData.role,
          title: userData.title,
          avatar_url: userData.avatarUrl
        }
      });

      if (error) {
        handleAuthError(error, "Profile update", toast);
        return;
      }

      // Update local user state
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, ...userData };
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Unexpected error during profile update:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
