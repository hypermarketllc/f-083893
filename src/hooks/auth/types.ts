
import { Session, User, AuthError } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: string;
};

export type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile?: (data: Partial<UserProfile>) => Promise<void>;
};
