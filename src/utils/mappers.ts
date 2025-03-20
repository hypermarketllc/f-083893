
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
import { isHttpMethod } from "./webhookTypeGuards";

// Helper function to safely convert any type to Json
export const toJson = <T>(value: T): Json => {
  return value as unknown as Json;
};

// Helper function to safely convert Json to a typed value
export const fromJson = <T>(json: Json | null): T => {
  if (json === null) return null as unknown as T;
  
  try {
    // Handle cases where the json is already the right type
    return json as unknown as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null as unknown as T;
  }
};

// Helper function to convert snake_case database fields to camelCase models
export const mapDbWebhookToWebhook = (dbWebhook: any): Webhook => {
  if (!dbWebhook) return null as unknown as Webhook;
  
  try {
    // Ensure body is properly formatted
    const body = fromJson<WebhookBody>(dbWebhook.body);
    const formattedBody: WebhookBody = body ? {
      contentType: body.contentType || 'json',
      content: body.content || ''
    } : { contentType: 'json', content: '' };
    
    // Ensure method is a valid HttpMethod
    const method = dbWebhook.method;
    const validMethod: HttpMethod = isHttpMethod(method) 
      ? method 
      : 'GET'; // Default to GET if invalid
    
    return {
      id: dbWebhook.id,
      name: dbWebhook.name,
      description: dbWebhook.description || '',
      url: dbWebhook.url,
      method: validMethod,
      headers: fromJson<WebhookHeader[]>(dbWebhook.headers) || [],
      params: fromJson<WebhookParam[]>(dbWebhook.params) || [],
      body: formattedBody,
      enabled: dbWebhook.enabled,
      createdAt: dbWebhook.created_at,
      updatedAt: dbWebhook.updated_at,
      lastExecutedAt: dbWebhook.last_executed_at,
      lastExecutionStatus: dbWebhook.last_execution_status as ExecutionStatus,
      tags: fromJson<WebhookTag[]>(dbWebhook.tags) || [],
      userId: dbWebhook.user_id,
    };
  } catch (error) {
    console.error('Error mapping DB webhook to webhook:', error, dbWebhook);
    throw error;
  }
};

// Helper function to convert from model to database format
export const mapWebhookToDbWebhook = (webhook: Webhook): any => {
  if (!webhook) return null;
  
  try {
    // Ensure body is correctly formatted before converting to JSON
    const body: WebhookBody = webhook.body || { contentType: 'json', content: '' };
    
    return {
      id: webhook.id,
      name: webhook.name,
      description: webhook.description,
      url: webhook.url,
      method: webhook.method,
      headers: toJson<WebhookHeader[]>(webhook.headers || []),
      params: toJson<WebhookParam[]>(webhook.params || []),
      body: toJson<WebhookBody>(body),
      enabled: webhook.enabled,
      tags: toJson<WebhookTag[]>(webhook.tags || []),
      last_executed_at: webhook.lastExecutedAt,
      last_execution_status: webhook.lastExecutionStatus,
      user_id: webhook.userId
    };
  } catch (error) {
    console.error('Error mapping webhook to DB webhook:', error, webhook);
    throw error;
  }
};

// Helper function to convert webhook log entries from database format
export const mapDbLogToWebhookLog = (dbLog: any, webhookName?: string): WebhookLogEntry => {
  if (!dbLog) return null as unknown as WebhookLogEntry;
  
  try {
    // Ensure method is a valid HttpMethod
    const method = dbLog.request_method;
    const validMethod: HttpMethod = isHttpMethod(method) 
      ? method 
      : 'GET'; // Default to GET if invalid
    
    return {
      id: dbLog.id,
      webhookId: dbLog.webhook_id,
      webhookName: webhookName || 'Unknown Webhook',
      timestamp: dbLog.timestamp,
      requestUrl: dbLog.request_url,
      requestMethod: validMethod,
      requestHeaders: fromJson<Record<string, string>>(dbLog.request_headers) || {},
      requestBody: dbLog.request_body,
      responseStatus: dbLog.response_status,
      responseHeaders: fromJson<Record<string, string>>(dbLog.response_headers) || {},
      responseBody: dbLog.response_body,
      duration: dbLog.duration,
      success: dbLog.success,
      error: dbLog.error,
    };
  } catch (error) {
    console.error('Error mapping DB log to webhook log:', error, dbLog);
    throw error;
  }
};
