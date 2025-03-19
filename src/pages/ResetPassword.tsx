
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ResetPassword() {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    // Force dark mode on the reset password page
    document.documentElement.classList.add('dark');
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen bg-background">
      <ResetPasswordForm />
    </div>
  );
}
