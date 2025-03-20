
import { Json } from "@/integrations/supabase/types";
import { 
  Webhook, 
  WebhookLogEntry, 
  WebhookHeader, 
  WebhookParam, 
  WebhookBody,
  WebhookTag,
  HttpMethod, 
  ExecutionStatus 
} from "@/types/webhook2";

// Helper function to safely convert any type to Json
export const toJson = <T>(value: T): Json => {
  return value as unknown as Json;
};

// Helper function to safely convert Json to a typed value
export const fromJson = <T>(json: Json | null): T => {
  return (json ?? null) as unknown as T;
};

// Helper function to convert snake_case database fields to camelCase models
export const mapDbWebhookToWebhook = (dbWebhook: any): Webhook => {
  return {
    id: dbWebhook.id,
    name: dbWebhook.name,
    description: dbWebhook.description || '',
    url: dbWebhook.url,
    method: dbWebhook.method as HttpMethod,
    headers: fromJson<WebhookHeader[]>(dbWebhook.headers) || [],
    params: fromJson<WebhookParam[]>(dbWebhook.params) || [],
    body: fromJson<WebhookBody>(dbWebhook.body),
    enabled: dbWebhook.enabled,
    createdAt: dbWebhook.created_at,
    updatedAt: dbWebhook.updated_at,
    lastExecutedAt: dbWebhook.last_executed_at,
    lastExecutionStatus: dbWebhook.last_execution_status as ExecutionStatus,
    tags: fromJson<WebhookTag[]>(dbWebhook.tags) || [],
    userId: dbWebhook.user_id,
  };
};

// Helper function to convert from model to database format
export const mapWebhookToDbWebhook = (webhook: Webhook): any => {
  return {
    id: webhook.id,
    name: webhook.name,
    description: webhook.description,
    url: webhook.url,
    method: webhook.method,
    headers: toJson<WebhookHeader[]>(webhook.headers),
    params: toJson<WebhookParam[]>(webhook.params),
    body: toJson<WebhookBody>(webhook.body),
    enabled: webhook.enabled,
    tags: toJson<WebhookTag[]>(webhook.tags),
    last_executed_at: webhook.lastExecutedAt,
    last_execution_status: webhook.lastExecutionStatus,
    user_id: webhook.userId
  };
};

// Helper function to convert webhook log entries from database format
export const mapDbLogToWebhookLog = (dbLog: any, webhookName?: string): WebhookLogEntry => {
  return {
    id: dbLog.id,
    webhookId: dbLog.webhook_id,
    webhookName: webhookName || 'Unknown Webhook',
    timestamp: dbLog.timestamp,
    requestUrl: dbLog.request_url,
    requestMethod: dbLog.request_method as HttpMethod,
    requestHeaders: fromJson<Record<string, string>>(dbLog.request_headers) || {},
    requestBody: dbLog.request_body,
    responseStatus: dbLog.response_status,
    responseHeaders: fromJson<Record<string, string>>(dbLog.response_headers) || {},
    responseBody: dbLog.response_body,
    duration: dbLog.duration,
    success: dbLog.success,
    error: dbLog.error,
  };
};
