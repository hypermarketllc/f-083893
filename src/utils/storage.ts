
import { UserSettings } from '@/types/userSettings';

// Get user settings from localStorage
export const getUserSettings = (userId: string): Partial<UserSettings> => {
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

// Store user settings in localStorage
export const storeUserSettings = (userId: string, settings: Partial<UserSettings>): void => {
  try {
    const existingSettings = getUserSettings(userId);
    const updatedSettings = { ...existingSettings, ...settings };
    localStorage.setItem(`user_settings_${userId}`, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Error storing user settings in localStorage:', error);
  }
};

// Update a single user setting
export const updateUserSetting = <K extends keyof UserSettings>(
  userId: string, 
  key: K,
  value: UserSettings[K]
): void => {
  try {
    const existingSettings = getUserSettings(userId);
    existingSettings[key] = value;
    storeUserSettings(userId, existingSettings);
  } catch (error) {
    console.error(`Error updating user setting '${key}' in localStorage:`, error);
  }
};
