
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Globe } from 'lucide-react';

export default function PreferencesSettings() {
  const [language, setLanguage] = useState("english");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [downloadFolder, setDownloadFolder] = useState("Downloads");

  return (
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
  );
}
