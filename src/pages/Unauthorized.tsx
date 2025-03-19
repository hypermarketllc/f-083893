
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        You don't have permission to access this page. Please sign in with an account that has the required permissions.
      </p>
      <div className="flex space-x-4">
        <Link to="/login">
          <Button>Sign In</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
