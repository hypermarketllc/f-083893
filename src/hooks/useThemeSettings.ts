
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserSettings, mapDbSettingsToUserSettings, mapUserSettingsToDbSettings } from '@/types/userSettings';

export const useThemeSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    accentColor: '#7C3AED',
    fontScale: 1.0
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
      const storedAccentColor = localStorage.getItem('accent-color');
      const storedFontScale = localStorage.getItem('font-scale');
      
      const newSettings: UserSettings = {
        theme: storedTheme || 'system',
        accentColor: storedAccentColor || '#7C3AED',
        fontScale: storedFontScale ? parseFloat(storedFontScale) : 1.0
      };
      
      setSettings(newSettings);
      applySettings(newSettings);
    };
    
    loadSettings();
  }, []);

  // Load settings from Supabase when user changes
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return;
      
      try {
        // Using any type since we need to access user_settings which isn't in the generated types
        const { data, error } = await supabase
          .from('user_settings' as any)
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading user settings:', error);
          return;
        }
        
        if (data) {
          const userSettings = mapDbSettingsToUserSettings(data);
          setSettings(userSettings);
          applySettings(userSettings);
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
      }
    };
    
    loadUserSettings();
  }, [user]);

  // Apply theme settings to document
  const applySettings = (settingsToApply: UserSettings) => {
    // Apply theme
    const htmlElement = document.documentElement;
    if (settingsToApply.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      htmlElement.setAttribute('data-theme', systemTheme);
    } else {
      htmlElement.setAttribute('data-theme', settingsToApply.theme);
    }
    
    // Apply accent color
    htmlElement.style.setProperty('--accent-color', settingsToApply.accentColor);
    
    // Apply font scale
    htmlElement.style.fontSize = `${settingsToApply.fontScale * 100}%`;
  };

  // Update a specific setting
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
    
    // Also apply the change immediately
    applySettings({ ...settings, [key]: value });
  };

  // Save settings to localStorage and Supabase if user is logged in
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Save to localStorage
      localStorage.setItem('theme', settings.theme);
      localStorage.setItem('accent-color', settings.accentColor);
      localStorage.setItem('font-scale', settings.fontScale.toString());
      
      // Save to Supabase if user is logged in
      if (user) {
        // Check if user settings exist
        const { data, error: checkError } = await supabase
          .from('user_settings' as any)
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (checkError) {
          console.error('Error checking user settings:', checkError);
          throw checkError;
        }
        
        // Map settings to DB format
        const dbSettings = mapUserSettingsToDbSettings(settings);
        
        if (data) {
          // Update existing settings
          const { error } = await supabase
            .from('user_settings' as any)
            .update(dbSettings)
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error updating user settings:', error);
            throw error;
          }
        } else {
          // Insert new settings
          const { error } = await supabase
            .from('user_settings' as any)
            .insert({
              user_id: user.id,
              ...dbSettings
            });
          
          if (error) {
            console.error('Error creating user settings:', error);
            throw error;
          }
        }
      }
      
      setIsChanged(false);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    updateSetting,
    saveSettings,
    isChanged,
    isSaving
  };
};
