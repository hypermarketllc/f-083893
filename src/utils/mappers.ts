
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

// Helper function to convert snake_case database fields to camelCase models
export const mapDbWebhookToWebhook = (dbWebhook: any): Webhook => {
  return {
    id: dbWebhook.id,
    name: dbWebhook.name,
    description: dbWebhook.description || '',
    url: dbWebhook.url,
    method: dbWebhook.method as HttpMethod,
    headers: Array.isArray(dbWebhook.headers) ? dbWebhook.headers : [],
    params: Array.isArray(dbWebhook.params) ? dbWebhook.params : [],
    body: dbWebhook.body as WebhookBody,
    enabled: dbWebhook.enabled,
    createdAt: dbWebhook.created_at,
    updatedAt: dbWebhook.updated_at,
    lastExecutedAt: dbWebhook.last_executed_at,
    lastExecutionStatus: dbWebhook.last_execution_status as ExecutionStatus,
    tags: Array.isArray(dbWebhook.tags) ? dbWebhook.tags : [],
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
    headers: webhook.headers as Json,
    params: webhook.params as Json,
    body: webhook.body as Json,
    enabled: webhook.enabled,
    tags: webhook.tags as Json,
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
    requestHeaders: dbLog.request_headers || {},
    requestBody: dbLog.request_body,
    responseStatus: dbLog.response_status,
    responseHeaders: dbLog.response_headers || {},
    responseBody: dbLog.response_body,
    duration: dbLog.duration,
    success: dbLog.success,
    error: dbLog.error,
  };
};
