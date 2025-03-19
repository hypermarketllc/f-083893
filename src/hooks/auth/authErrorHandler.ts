
import { AuthError } from '@supabase/supabase-js';
import { toast as toastFn } from '@/hooks/use-toast';

// Define the ToastType based on the actual toast function signature
type ToastType = typeof toastFn;

export const handleAuthError = (
  error: AuthError | null, 
  action: string, 
  toast: ToastType
): void => {
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
