
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
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody?: string;
  duration: number; // in milliseconds
  success: boolean;
  error?: string;
}

export interface IncomingWebhook {
  id: string;
  name: string;
  description: string;
  endpointPath: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
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
}
