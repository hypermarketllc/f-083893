
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
        <p className="mb-2">
          You are logged in as: <span className="font-medium">{user?.email}</span>
        </p>
        <p>User ID: {user?.id}</p>
      </div>
    </div>
  );
}
