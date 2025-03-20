
import { useContext } from 'react';
import { AuthContext } from './auth/AuthContext';

// Export the hook that consumers can use to access auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Re-export the AuthProvider
export { AuthProvider } from './auth/AuthProvider';
