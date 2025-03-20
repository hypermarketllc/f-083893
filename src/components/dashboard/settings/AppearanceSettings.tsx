
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

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [fontScale, setFontScale] = useState([1]);
  const [accentColor, setAccentColor] = useState("#7C3AED");
  const [isChanged, setIsChanged] = useState(false);
  
  // Ensure theme is only accessed after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Load saved accent color
    const savedAccentColor = localStorage.getItem('accent-color');
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
      applyAccentColor(savedAccentColor);
    }
    
    // Load saved font scale
    const savedFontScale = localStorage.getItem('font-scale');
    if (savedFontScale) {
      const scale = parseFloat(savedFontScale);
      setFontScale([scale]);
      document.documentElement.style.fontSize = `${scale * 100}%`;
    }
  }, []);

  // Only show the correct theme toggle after component has mounted
  const isDarkMode = mounted ? theme === 'dark' : true; // Default to true for dark mode
  
  const toggleDarkMode = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleFontScaleChange = (value: number[]) => {
    setFontScale(value);
    document.documentElement.style.fontSize = `${value[0] * 100}%`;
    setIsChanged(true);
  };

  const applyAccentColor = useCallback((color: string) => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Update CSS variables for primary color
    document.documentElement.style.setProperty('--primary', `${r} ${g}% ${b}%`);
    document.documentElement.style.setProperty('--ring', `${r} ${g}% ${b}%`);
    document.documentElement.style.setProperty('--sidebar-primary', `${r} ${g}% ${b}%`);
    
    // Also update CSS for accent (lighter variant)
    document.documentElement.style.setProperty('--accent', `${r} ${g}% 97%`);
    document.documentElement.style.setProperty('--accent-foreground', `${r} ${g}% ${b}%`);
  }, []);

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    applyAccentColor(color);
    setIsChanged(true);
  };

  const saveSettings = async () => {
    // Save font scale to local storage
    localStorage.setItem('font-scale', fontScale[0].toString());
    
    // Save accent color to local storage
    localStorage.setItem('accent-color', accentColor);
    
    // Save to user profile if logged in
    if (user && updateProfile) {
      try {
        await updateProfile({
          accentColor
        });
      } catch (error) {
        console.error('Error saving settings to profile:', error);
      }
    }
    
    toast.success('Settings saved successfully');
    setIsChanged(false);
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
              value={fontScale}
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
              value={accentColor}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              className="w-12 h-8 p-1"
            />
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-sm text-muted-foreground">
              {accentColor}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Changes will apply throughout the application.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={saveSettings} 
          disabled={!isChanged}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
