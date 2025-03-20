
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserSettings, mapDbSettingsToUserSettings, mapUserSettingsToDbSettings } from '@/types/userSettings';
import { toast } from 'sonner';
import { getLocalThemeSettings, storeLocalThemeSettings, applyThemeSettings } from '@/utils/storage';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    accentColor: '#7C3AED',
    fontScale: 1.0,
    sidebarCollapsed: false,
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const localSettings = getLocalThemeSettings();
        
        setSettings(prevSettings => ({
          ...prevSettings,
          ...localSettings
        }));
        
        applyThemeSettings(localSettings);
      } catch (error) {
        console.error('Failed to load local settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Load settings from Supabase when user changes
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading user settings:', error);
          setIsLoading(false);
          return;
        }
        
        if (data) {
          const userSettings = mapDbSettingsToUserSettings(data);
          setSettings(prev => ({
            ...prev,
            ...userSettings
          }));
          applyThemeSettings(userSettings);
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserSettings();
  }, [user]);

  // Update a specific setting
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
    
    // Apply the change immediately
    applyThemeSettings({ [key]: value });
    
    // Also save to localStorage immediately for non-authenticated experience
    storeLocalThemeSettings({ [key]: value });
  };

  // Save settings to localStorage and Supabase if user is logged in
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Save to localStorage always
      storeLocalThemeSettings(settings);
      
      // Save to Supabase if user is logged in
      if (user) {
        try {
          // Check if user settings exist
          const { data, error: checkError } = await supabase
            .from('user_settings')
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
              .from('user_settings')
              .update(dbSettings)
              .eq('user_id', user.id);
            
            if (error) {
              console.error('Error updating user settings:', error);
              throw error;
            }
          } else {
            // Insert new settings
            const { error } = await supabase
              .from('user_settings')
              .insert({
                user_id: user.id,
                ...dbSettings
              });
            
            if (error) {
              console.error('Error creating user settings:', error);
              throw error;
            }
          }
        } catch (error) {
          console.error('Failed to save settings to Supabase:', error);
          // Continue the function even if Supabase saving fails
          // since we already saved to localStorage
        }
      }
      
      setIsChanged(false);
      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
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
    isSaving,
    isLoading
  };
};
