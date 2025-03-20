import { useUserSettings } from './useUserSettings';

export const useThemeSettings = () => {
  console.warn('useThemeSettings is deprecated. Please use useUserSettings instead.');
  return useUserSettings();
};
