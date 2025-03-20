
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

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
  lastExecutionStatus: 'success' | 'error' | null;
  tags: WebhookTag[];
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
}
