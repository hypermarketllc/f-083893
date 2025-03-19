
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';

export default function SecuritySettings() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Configure security settings for your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
          <Switch
            id="two-factor"
            checked={twoFactorAuth}
            onCheckedChange={setTwoFactorAuth}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Session Management</p>
          <Button variant="outline" className="w-full justify-start">
            View Active Sessions
          </Button>
          <p className="text-sm text-muted-foreground">
            View and manage devices where you're currently logged in.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
