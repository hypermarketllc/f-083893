
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AppearanceSettings from './settings/AppearanceSettings';
import PreferencesSettings from './settings/PreferencesSettings';
import SecuritySettings from './settings/SecuritySettings';

export default function SettingsSection() {
  const { toast } = useToast();
  
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <AppearanceSettings />
      <PreferencesSettings />
      <SecuritySettings />
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  );
}
