
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette, Save } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { useThemeSettings } from '@/hooks/useThemeSettings';

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { settings, updateSetting, saveSettings, isChanged, isSaving } = useThemeSettings();
  
  // Ensure theme components only render after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show the correct theme toggle after component has mounted
  const isDarkMode = mounted ? theme === 'dark' : false;
  
  const toggleDarkMode = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    updateSetting('theme', newTheme);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleFontScaleChange = (value: number[]) => {
    updateSetting('fontScale', value[0]);
  };

  const handleAccentColorChange = (color: string) => {
    updateSetting('accentColor', color);
  };

  const handleSaveSettings = async () => {
    const success = await saveSettings();
    
    if (success) {
      toast.success('Appearance settings saved successfully');
    } else {
      toast.error('Failed to save appearance settings');
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks and feels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark theme.
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
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
              value={[settings.fontScale]}
              onValueChange={handleFontScaleChange}
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
              value={settings.accentColor}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: settings.accentColor }}
            />
            <p className="text-sm text-muted-foreground">
              {settings.accentColor}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Changes will apply throughout the application.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          disabled={!isChanged || isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
