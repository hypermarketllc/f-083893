
import { WebhookLogEntry, IncomingWebhookLogEntry } from '@/types/webhook';

/**
 * Ensures all required fields exist in the webhook log entry.
 * This helps prevent errors when displaying log entries in the UI.
 */
export const ensureLogEntryFields = (log: WebhookLogEntry): WebhookLogEntry => {
  if (!log) {
    // Create an empty placeholder log if nothing is provided
    return {
      id: 'placeholder-id',
      webhookId: 'placeholder-webhook-id',
      webhookName: 'Unknown Webhook',
      timestamp: new Date().toISOString(),
      requestUrl: 'https://example.com',
      requestMethod: 'GET',
      requestHeaders: {},
      responseStatus: 404,
      responseHeaders: {},
      duration: 0,
      success: false,
      error: 'No log data available',
      // Provide default values for optional fields
      requestTime: new Date().toISOString(),
      responseTime: null,
      body: '{}',
      requestBody: '{}'
    };
  }

  // Ensure all required fields exist and provide defaults for optional fields
  return {
    ...log,
    id: log.id || 'placeholder-id',
    webhookId: log.webhookId || 'placeholder-webhook-id',
    webhookName: log.webhookName || 'Unknown Webhook',
    timestamp: log.timestamp || new Date().toISOString(),
    requestUrl: log.requestUrl || log.url || 'https://example.com',
    requestMethod: log.requestMethod || log.method || 'GET',
    requestHeaders: log.requestHeaders || {},
    requestBody: log.requestBody || '{}',
    responseStatus: log.responseStatus || 0,
    responseHeaders: log.responseHeaders || {},
    responseBody: log.responseBody || '{}',
    duration: log.duration || 0,
    success: log.success !== undefined ? log.success : false,
    error: log.error || undefined,
    // Provide defaults for optional fields
    requestTime: log.requestTime || log.timestamp || new Date().toISOString(),
    responseTime: log.responseTime || null,
    body: log.responseBody || '{}',
    requestQuery: log.requestQuery || {}
  };
};

/**
 * Ensures all required fields exist in the incoming webhook log entry.
 * This helps prevent errors when displaying log entries in the UI.
 */
export const ensureIncomingLogEntryFields = (log: IncomingWebhookLogEntry): IncomingWebhookLogEntry => {
  if (!log) {
    // Create an empty placeholder log if nothing is provided
    return {
      id: 'placeholder-id',
      webhookId: 'placeholder-webhook-id',
      webhookName: 'Unknown Webhook',
      timestamp: new Date().toISOString(),
      requestHeaders: {},
      requestMethod: 'GET',
      isParsed: false,
      success: false,
      sourceIp: 'unknown',
      contentType: 'application/json',
      error: 'No log data available',
      // Default values for optional fields
      responseStatus: 404,
      endpointPath: '/webhook',
      requestBody: '{}',
      responseBody: '{}'
    };
  }

  // Ensure all required fields exist and provide defaults for optional fields
  return {
    ...log,
    id: log.id || 'placeholder-id',
    webhookId: log.webhookId || 'placeholder-webhook-id',
    webhookName: log.webhookName || 'Unknown Webhook',
    timestamp: log.timestamp || new Date().toISOString(),
    requestHeaders: log.requestHeaders || {},
    requestMethod: log.requestMethod || log.method || 'GET',
    requestBody: log.requestBody || '{}',
    requestQuery: log.requestQuery || log.queryParams || {},
    parsedData: log.parsedData || undefined,
    isParsed: log.isParsed !== undefined ? log.isParsed : false,
    success: log.success !== undefined ? log.success : false,
    sourceIp: log.sourceIp || log.ipAddress || 'Unknown',
    contentType: log.contentType || 'application/json',
    error: log.error || undefined,
    // Default values for optional fields
    responseStatus: log.responseStatus || 200,
    endpointPath: log.endpointPath || '/webhook',
    responseBody: log.responseBody || '{}'
  };
};
