
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontScale: number;
  sidebarCollapsed?: boolean;
  emailNotifications?: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
}

export interface DbUserSettings {
  user_id: string;
  theme: string;
  accent_color: string;
  font_scale: number;
  sidebar_collapsed?: boolean;
  email_notifications?: boolean;
  marketing_emails?: boolean;
  security_alerts?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const mapDbSettingsToUserSettings = (dbSettings: any): UserSettings => {
  if (!dbSettings) return null as unknown as UserSettings;
  
  return {
    theme: dbSettings.theme as 'light' | 'dark' | 'system',
    accentColor: dbSettings.accent_color || '#7C3AED',
    fontScale: dbSettings.font_scale || 1.0,
    sidebarCollapsed: dbSettings.sidebar_collapsed,
    emailNotifications: dbSettings.email_notifications,
    marketingEmails: dbSettings.marketing_emails,
    securityAlerts: dbSettings.security_alerts
  };
};

export const mapUserSettingsToDbSettings = (settings: Partial<UserSettings>): Partial<DbUserSettings> => {
  const dbSettings: Partial<DbUserSettings> = {};
  
  if (settings.theme !== undefined) dbSettings.theme = settings.theme;
  if (settings.accentColor !== undefined) dbSettings.accent_color = settings.accentColor;
  if (settings.fontScale !== undefined) dbSettings.font_scale = settings.fontScale;
  if (settings.sidebarCollapsed !== undefined) dbSettings.sidebar_collapsed = settings.sidebarCollapsed;
  if (settings.emailNotifications !== undefined) dbSettings.email_notifications = settings.emailNotifications;
  if (settings.marketingEmails !== undefined) dbSettings.marketing_emails = settings.marketingEmails;
  if (settings.securityAlerts !== undefined) dbSettings.security_alerts = settings.securityAlerts;
  
  return dbSettings;
};
