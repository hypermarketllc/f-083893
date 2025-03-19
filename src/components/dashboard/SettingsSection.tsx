
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Bell, Globe, Shield, Palette } from 'lucide-react';

export default function SettingsSection() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [notifications, setNotifications] = useState(true);
  const [fontScale, setFontScale] = useState([1]);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [accentColor, setAccentColor] = useState("#7C3AED");
  const [downloadFolder, setDownloadFolder] = useState("Downloads");
  
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the application looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme.
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="font-scale">Font Size</Label>
            <div className="flex items-center gap-4">
              <p className="text-sm">A</p>
              <Slider
                id="font-scale"
                min={0.8}
                max={1.4}
                step={0.1}
                value={fontScale}
                onValueChange={setFontScale}
              />
              <p className="text-lg">A</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Adjust the size of text throughout the application.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex items-center gap-4">
              <Input
                id="accent-color"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <p className="text-sm text-muted-foreground">
                {accentColor}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Configure general application settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language-select">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <Label htmlFor="notifications">Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable or disable application notifications.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto Save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes as you work.
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="download-folder">Download Location</Label>
            <Input
              id="download-folder"
              value={downloadFolder}
              onChange={(e) => setDownloadFolder(e.target.value)}
              placeholder="Downloads folder"
            />
          </div>
        </CardContent>
      </Card>
      
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
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  );
}
