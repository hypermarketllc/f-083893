
/**
 * Helper functions for storing data in localStorage
 */

// Store a value in localStorage
export const storeValue = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

// Get a value from localStorage
export const getValue = <T>(key: string, defaultValue: T): T => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Check if a key exists in localStorage
export const hasKey = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

// Remove a value from localStorage
export const removeValue = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Clear all values from localStorage
export const clearAll = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Settings-specific storage
type UserSettings = {
  accentColor?: string;
  theme?: 'light' | 'dark' | 'system';
  sidebarCollapsed?: boolean;
};

// Store user settings
export const storeUserSettings = (userId: string, settings: UserSettings): void => {
  storeValue(`user_settings_${userId}`, settings);
};

// Get user settings
export const getUserSettings = (userId: string): UserSettings => {
  return getValue<UserSettings>(`user_settings_${userId}`, {});
};

// Update a specific user setting
export const updateUserSetting = <K extends keyof UserSettings>(
  userId: string, 
  key: K, 
  value: UserSettings[K]
): void => {
  const settings = getUserSettings(userId);
  settings[key] = value;
  storeUserSettings(userId, settings);
};
