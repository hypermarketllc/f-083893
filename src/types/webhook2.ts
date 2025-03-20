
// Core type definitions for Webhook2 system

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ExecutionStatus = 'success' | 'error' | null;

// Request components
export interface WebhookHeader {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface WebhookParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface WebhookBody {
  contentType: 'json' | 'form' | 'text';
  content: string;
  type?: 'none' | 'json' | 'form' | 'text'; // Added type property for compatibility
}

// Metadata
export interface WebhookTag {
  id: string;
  name: string;
  color: string;
}

export interface WebhookSchedule {
  type: 'daily' | 'weekly' | 'interval';
  time?: string;
  days?: string[];
  interval?: number;
}

// Main Webhook model
export interface Webhook {
  id: string;
  name: string;
  description: string;
  url: string;
  method: HttpMethod;
  headers: WebhookHeader[];
  params: WebhookParam[];
  body?: WebhookBody;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt: string | null;
  lastExecutionStatus: ExecutionStatus;
  tags?: WebhookTag[];
  schedule?: WebhookSchedule;
  userId?: string;
}

// Logs
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
  duration: number;
  success: boolean;
  error?: string;
}

export interface WebhookTestResponse {
  status: number;
  headers: Record<string, string>;
  body?: string;
  duration: number;
  error?: string;
  success?: boolean;  // Added for compatibility
  responseStatus?: number;  // Added for compatibility
  responseBody?: string;  // Added for compatibility
  responseHeaders?: Record<string, string>;  // Added for compatibility
  webhookId?: string;  // Added for compatibility
  webhookName?: string;  // Added for compatibility
}

export interface WebhookFilters {
  search: string;
  method: HttpMethod | null;
  status: ExecutionStatus;
  tags: string[];
  dateFrom?: string | null;
  dateTo?: string | null;
}

// Incoming webhooks
export interface IncomingWebhook {
  id: string;
  name: string;
  description: string;
  endpointPath: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
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
  requestMethod: string;
  requestBody?: string;
  queryParams?: Record<string, string>;
  responseStatus: number;
  endpointPath: string;
  responseBody?: string;
  isParsed: boolean;
  parsedData?: string;
  success: boolean;
  sourceIp: string;
  contentType: string;
  error?: string;
}
