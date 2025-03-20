
import { UserProfile } from './types';
import { mapDbSettingsToUserSettings } from '@/types/userSettings';
import { supabase } from '@/integrations/supabase/client';

// Helper function to load user settings from Supabase
export const loadUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching user settings:", error);
      return null;
    }
    
    if (data) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error("Error processing user settings:", error);
    return null;
  }
};

// Helper function to update user profile with settings
export const applyUserSettings = (userData: UserProfile, dbSettings: any) => {
  if (dbSettings) {
    // Apply settings from the database
    if (dbSettings.accent_color) {
      userData.accentColor = dbSettings.accent_color;
      document.documentElement.style.setProperty('--accent-color', dbSettings.accent_color);
    }
    
    // Apply theme
    if (dbSettings.theme) {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute('data-theme', dbSettings.theme);
      localStorage.setItem('theme', dbSettings.theme);
    }
    
    // Apply font scale
    if (dbSettings.font_scale) {
      document.documentElement.style.fontSize = `${dbSettings.font_scale * 100}%`;
      localStorage.setItem('font-scale', dbSettings.font_scale.toString());
    }
  }
  
  return userData;
};

// Helper function to save user settings to Supabase
export const saveUserSettings = async (userId: string, settingsData: Partial<Record<string, any>>) => {
  try {
    // Check if user settings exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking user settings:", checkError);
      return false;
    }
    
    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('user_settings')
        .update(settingsData)
        .eq('user_id', userId);
      
      if (error) {
        console.error("Error updating user settings:", error);
        return false;
      }
    } else {
      // Create new settings
      const { error } = await supabase
        .from('user_settings')
        .insert({ 
          user_id: userId, 
          ...settingsData 
        });
      
      if (error) {
        console.error("Error creating user settings:", error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error saving user settings:", error);
    return false;
  }
};
