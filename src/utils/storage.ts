
import { UserSettings } from '@/types/userSettings';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Get user settings from localStorage with better error handling
export const getUserSettings = (userId: string): Partial<UserSettings> => {
  if (!isLocalStorageAvailable() || !userId) {
    return {};
  }

  try {
    const storedSettings = localStorage.getItem(`user_settings_${userId}`);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    return {};
  } catch (error) {
    console.error('Error retrieving user settings from localStorage:', error);
    return {};
  }
};

// Store user settings in localStorage with better error handling
export const storeUserSettings = (userId: string, settings: Partial<UserSettings>): void => {
  if (!isLocalStorageAvailable() || !userId) {
    return;
  }

  try {
    const existingSettings = getUserSettings(userId);
    const updatedSettings = { ...existingSettings, ...settings };
    localStorage.setItem(`user_settings_${userId}`, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Error storing user settings in localStorage:', error);
  }
};

// Update a single user setting with better error handling
export const updateUserSetting = <K extends keyof UserSettings>(
  userId: string, 
  key: K,
  value: UserSettings[K]
): void => {
  if (!isLocalStorageAvailable() || !userId) {
    return;
  }

  try {
    const existingSettings = getUserSettings(userId);
    existingSettings[key] = value;
    storeUserSettings(userId, existingSettings);
  } catch (error) {
    console.error(`Error updating user setting '${key}' in localStorage:`, error);
  }
};

// Get local theme settings regardless of user authentication
export const getLocalThemeSettings = (): Partial<UserSettings> => {
  if (!isLocalStorageAvailable()) {
    return { theme: 'system', accentColor: '#7C3AED', fontScale: 1.0 };
  }

  try {
    const theme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const accentColor = localStorage.getItem('accent-color');
    const fontScale = localStorage.getItem('font-scale');
    
    return {
      theme: theme || 'system',
      accentColor: accentColor || '#7C3AED',
      fontScale: fontScale ? parseFloat(fontScale) : 1.0
    };
  } catch (error) {
    console.error('Error retrieving local theme settings:', error);
    return { theme: 'system', accentColor: '#7C3AED', fontScale: 1.0 };
  }
};

// Store local theme settings regardless of user authentication
export const storeLocalThemeSettings = (settings: Partial<UserSettings>): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    if (settings.theme) localStorage.setItem('theme', settings.theme);
    if (settings.accentColor) localStorage.setItem('accent-color', settings.accentColor);
    if (settings.fontScale !== undefined) localStorage.setItem('font-scale', settings.fontScale.toString());
  } catch (error) {
    console.error('Error storing local theme settings:', error);
  }
};

// Apply theme settings to document
export const applyThemeSettings = (settings: Partial<UserSettings>): void => {
  try {
    const htmlElement = document.documentElement;
    
    // Apply theme
    if (settings.theme) {
      if (settings.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', systemTheme);
      } else {
        htmlElement.setAttribute('data-theme', settings.theme);
      }
    }
    
    // Apply accent color
    if (settings.accentColor) {
      htmlElement.style.setProperty('--accent-color', settings.accentColor);
    }
    
    // Apply font scale
    if (settings.fontScale) {
      htmlElement.style.fontSize = `${settings.fontScale * 100}%`;
    }
  } catch (error) {
    console.error('Error applying theme settings:', error);
  }
};
