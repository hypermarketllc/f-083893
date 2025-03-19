
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Session, User, AuthError } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      setUser({
        id,
        email,
      });
      console.log(`User authenticated: ${email}`);
    } else {
      setUser(null);
      console.log("No authenticated user");
    }
  };

  // Handle auth errors with consistent messaging
  const handleAuthError = (error: AuthError | null, action: string): void => {
    if (!error) return;
    
    console.error(`Auth error during ${action}:`, error);
    
    const errorMessages: Record<string, string> = {
      // Sign in errors
      'Invalid login credentials': 'Invalid email or password. Please try again.',
      'Email not confirmed': 'Please check your email and follow the confirmation link before signing in.',
      
      // Sign up errors
      'User already registered': 'An account with this email already exists. Try signing in instead.',
      'Password should be at least 6 characters': 'Please use a password with at least 6 characters.',
      
      // General errors
      'Request failed': 'Connection error. Please check your internet and try again.',
    };
    
    const message = errorMessages[error.message] || `Authentication failed: ${error.message}`;
    
    toast({
      variant: "destructive",
      title: `${action} Failed`,
      description: message,
    });
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

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        handleAuthError(error, "Sign in");
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
        handleAuthError(error, "Sign up");
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
        handleAuthError(error, "Sign out");
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
        handleAuthError(error, "Password reset");
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
        handleAuthError(error, "Password update");
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

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
