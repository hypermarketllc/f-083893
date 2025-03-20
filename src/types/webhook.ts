
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ExecutionStatus = 'success' | 'error' | null;

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
}

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
  // Add missing properties
  requestTime: string;
  responseTime: string | null;
  url?: string;
  method?: HttpMethod;
  requestQuery?: Record<string, string>;
  ipAddress?: string;
  body?: string;
}

export interface WebhookTestResponse {
  status: number;
  headers: Record<string, string>;
  body?: string;
  duration: number;
  error?: string;
}

export interface WebhookFilters {
  search: string;
  method: HttpMethod | null;
  status: 'success' | 'error' | null;
  tags: string[];
  dateFrom?: string | null;
  dateTo?: string | null;
}

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
  isParsed: boolean;
  parsedData?: string;
  success: boolean;
  sourceIp: string;
  contentType: string;
  error?: string;
  // Add missing properties
  responseStatus?: number;
  endpointPath?: string;
  responseBody?: string;
  method?: string;
  requestQuery?: Record<string, string>;
  queryParams?: Record<string, string>;
  ipAddress?: string;
}
