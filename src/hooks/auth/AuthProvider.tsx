
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from './AuthContext';
import { UserProfile, AuthContextType } from './types';
import { handleAuthError } from './authErrorHandler';
import { storeUserSettings, getUserSettings, updateUserSetting } from '@/utils/storage';
import { mapDbSettingsToUserSettings } from '@/types/userSettings';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthStateChange = async (currentSession: Session | null) => {
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
      
      try {
        // Load user settings from Supabase if available
        const { data: userSettings, error } = await supabase
          .from('user_settings' as any)
          .select('*')
          .eq('user_id', id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching user settings:", error);
        } else if (userSettings) {
          // Apply settings from the database
          if (userSettings.accent_color) {
            userData.accentColor = userSettings.accent_color;
            document.documentElement.style.setProperty('--accent-color', userSettings.accent_color);
          }
          
          // Apply theme
          if (userSettings.theme) {
            const htmlElement = document.documentElement;
            htmlElement.setAttribute('data-theme', userSettings.theme);
            localStorage.setItem('theme', userSettings.theme);
          }
          
          // Apply font scale
          if (userSettings.font_scale) {
            document.documentElement.style.fontSize = `${userSettings.font_scale * 100}%`;
            localStorage.setItem('font-scale', userSettings.font_scale.toString());
          }
        } else {
          // Fallback to localStorage settings
          const settings = getUserSettings(id);
          if (settings.accentColor) {
            userData.accentColor = settings.accentColor;
            document.documentElement.style.setProperty('--accent-color', settings.accentColor);
          }
        }
      } catch (error) {
        console.error("Error processing user settings:", error);
        
        // Fallback to localStorage settings
        const settings = getUserSettings(id);
        if (settings.accentColor) {
          userData.accentColor = settings.accentColor;
          document.documentElement.style.setProperty('--accent-color', settings.accentColor);
        }
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
      // Disable email verification for faster debugging
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
      // Disable email verification for faster debugging
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
      
      navigate('/dashboard');
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
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

      // Prepare data for Supabase user update
      let metadataUpdate = {};
      if (userData.firstName !== undefined) metadataUpdate = { ...metadataUpdate, first_name: userData.firstName };
      if (userData.lastName !== undefined) metadataUpdate = { ...metadataUpdate, last_name: userData.lastName };
      if (userData.company !== undefined) metadataUpdate = { ...metadataUpdate, company: userData.company };
      if (userData.role !== undefined) metadataUpdate = { ...metadataUpdate, role: userData.role };
      if (userData.title !== undefined) metadataUpdate = { ...metadataUpdate, title: userData.title };
      if (userData.avatarUrl !== undefined) metadataUpdate = { ...metadataUpdate, avatar_url: userData.avatarUrl };

      // Update user settings in Supabase if we have accent color
      if (userData.accentColor) {
        try {
          // Check if user settings exist
          const { data: existingSettings, error: checkError } = await supabase
            .from('user_settings' as any)
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (checkError) {
            console.error("Error checking user settings:", checkError);
          }
          
          if (existingSettings) {
            // Update existing settings
            const { error } = await supabase
              .from('user_settings' as any)
              .update({ accent_color: userData.accentColor })
              .eq('user_id', user.id);
            
            if (error) {
              console.error("Error updating user settings:", error);
            }
          } else {
            // Create new settings
            const { error } = await supabase
              .from('user_settings' as any)
              .insert({ user_id: user.id, accent_color: userData.accentColor });
            
            if (error) {
              console.error("Error creating user settings:", error);
            }
          }
          
          // Apply accent color
          document.documentElement.style.setProperty('--accent-color', userData.accentColor);
          
          // Also save to localStorage as backup
          updateUserSetting(user.id, 'accentColor', userData.accentColor);
        } catch (error) {
          console.error("Error saving accent color:", error);
        }
      }

      // Update Supabase user data if we have metadata changes
      if (Object.keys(metadataUpdate).length > 0) {
        const { error } = await supabase.auth.updateUser({
          data: metadataUpdate
        });

        if (error) {
          handleAuthError(error, "Profile update", toast);
          return;
        }
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
