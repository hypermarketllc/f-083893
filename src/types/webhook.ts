
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type WebhookScheduleType = 'once' | 'interval' | 'daily' | 'weekly' | 'monthly';

export interface WebhookHeader {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface WebhookUrlParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface WebhookBody {
  contentType: 'json' | 'form' | 'text';
  content: string;
}

export interface WebhookSchedule {
  type: WebhookScheduleType;
  date?: string; // ISO date string for 'once'
  time?: string; // HH:MM for 'once' and 'daily'
  interval?: number; // minutes for 'interval'
  days?: string[]; // days of week for 'weekly'
  dayOfMonth?: number; // day of month for 'monthly'
}

export interface WebhookTag {
  id: string;
  name: string;
  color: string;
}

export interface Webhook {
  id: string;
  name: string;
  description: string;
  url: string;
  method: HttpMethod;
  headers: WebhookHeader[];
  urlParams: WebhookUrlParam[];
  body?: WebhookBody;
  schedule?: WebhookSchedule;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt: string | null;
  lastExecutionStatus: 'success' | 'error' | null;
  tags?: WebhookTag[];
}

export interface WebhookLogEntry {
  id: string;
  webhookId: string;
  webhookName: string;
  timestamp: string;
  requestUrl: string;
  requestMethod: HttpMethod;
  requestHeaders: Record<string, string>;
  requestBody?: string;
  requestQuery?: Record<string, string>;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody?: string;
  duration: number; // in milliseconds
  success: boolean;
  error?: string;
  // Time fields
  requestTime: string;
  responseTime: string | null;
  // Additional properties used in components
  url?: string;
  method?: HttpMethod;
  status?: number; // Alias for responseStatus
  request?: string; // Alias for requestBody 
  response?: string; // Alias for responseBody
  headers?: Record<string, string>; // Alias for requestHeaders
  payload?: string; // Alias for requestBody
  ipAddress?: string;
  queryParams?: Record<string, string>; // Alias for requestQuery
  body?: string; // Alias for responseBody (needed for compatibility)
}

export interface IncomingWebhook {
  id: string;
  name: string;
  description: string;
  endpointPath: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  lastCalledAt: string | null;
  secretKey?: string;
  tags?: WebhookTag[];
}

export interface IncomingWebhookLogEntry {
  id: string;
  webhookId: string;
  webhookName: string;
  timestamp: string;
  requestHeaders: Record<string, string>;
  requestMethod: HttpMethod;
  requestBody?: string;
  requestQuery?: Record<string, string>;
  parsedData?: string;
  isParsed: boolean;
  success: boolean;
  sourceIp?: string;
  contentType?: string;
  error?: string;
  // Additional properties used in components
  responseStatus?: number;
  responseBody?: string;
  responseHeaders?: Record<string, string>;
  method?: HttpMethod;
  ipAddress?: string;
  queryParams?: Record<string, string>;
  status?: number; // Alias for responseStatus
  endpointPath?: string; // Alias for path
  path?: string; // For backward compatibility
  headers?: Record<string, string>; // Alias for requestHeaders
  payload?: string; // Alias for requestBody
  response?: string; // Alias for responseBody
}
