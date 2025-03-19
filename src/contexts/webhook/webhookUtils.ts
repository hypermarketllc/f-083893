
import { WebhookBody, WebhookLogEntry, IncomingWebhookLogEntry } from '@/types/webhook';

// Parse webhook body content based on content type
export const parseBodyContent = (body?: WebhookBody): string | object | undefined => {
  if (!body) return undefined;
  
  try {
    switch (body.contentType) {
      case 'json':
        return JSON.parse(body.content);
      case 'form':
        // Convert form data to URLSearchParams format
        const formData = new URLSearchParams();
        const formValues = JSON.parse(body.content);
        Object.entries(formValues).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        return formData.toString();
      case 'text':
      default:
        return body.content;
    }
  } catch (error) {
    console.error('Error parsing webhook body content:', error);
    return body.content; // Return as-is if parsing fails
  }
};

// Function to validate webhook URL
export const validateWebhookUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to generate a sample webhook response for testing
export const generateSampleResponse = (status: number = 200) => {
  return {
    status,
    headers: {
      'content-type': 'application/json',
      'x-response-time': '120ms'
    },
    body: JSON.stringify({
      success: status >= 200 && status < 300,
      message: status >= 200 && status < 300 ? 'Success' : 'Error',
      timestamp: new Date().toISOString(),
      data: {
        id: crypto.randomUUID(),
        sample: 'This is a sample response'
      }
    }),
    duration: Math.floor(Math.random() * 300) + 50 // Random duration between 50-350ms
  };
};

// Utility function to ensure webhook log entries have all required fields
export const ensureLogEntryFields = (logEntry: Partial<WebhookLogEntry>): WebhookLogEntry => {
  return {
    id: logEntry.id || 'placeholder-id',
    webhookId: logEntry.webhookId || 'placeholder-webhook-id',
    webhookName: logEntry.webhookName || 'Unnamed Webhook',
    timestamp: logEntry.timestamp || new Date().toISOString(),
    requestUrl: logEntry.requestUrl || 'https://example.com/api',
    requestMethod: logEntry.requestMethod || 'GET',
    requestHeaders: logEntry.requestHeaders || {},
    requestBody: logEntry.requestBody || undefined,
    responseStatus: logEntry.responseStatus || 200,
    responseHeaders: logEntry.responseHeaders || {},
    responseBody: logEntry.responseBody || undefined,
    duration: logEntry.duration || 0,
    success: logEntry.success ?? true,
    error: logEntry.error,
    // Add fallbacks for missing properties used in components
    url: logEntry.url || logEntry.requestUrl || 'https://example.com/api',
    method: logEntry.method || logEntry.requestMethod || 'GET'
  };
};

// Utility function to ensure incoming webhook log entries have all required fields
export const ensureIncomingLogEntryFields = (logEntry: Partial<IncomingWebhookLogEntry>): IncomingWebhookLogEntry => {
  return {
    id: logEntry.id || 'placeholder-id',
    webhookId: logEntry.webhookId || 'placeholder-webhook-id',
    webhookName: logEntry.webhookName || 'Unnamed Webhook',
    timestamp: logEntry.timestamp || new Date().toISOString(),
    requestHeaders: logEntry.requestHeaders || {},
    requestMethod: logEntry.requestMethod || 'POST',
    requestBody: logEntry.requestBody || undefined,
    requestQuery: logEntry.requestQuery || {},
    parsedData: logEntry.parsedData || undefined,
    isParsed: logEntry.isParsed ?? false,
    success: logEntry.success ?? true,
    sourceIp: logEntry.sourceIp || '127.0.0.1',
    contentType: logEntry.contentType || 'application/json',
    error: logEntry.error,
    // Add fallbacks for missing properties used in components
    responseStatus: logEntry.responseStatus || 200,
    responseBody: logEntry.responseBody || undefined,
    responseHeaders: logEntry.responseHeaders || {},
    method: logEntry.method || logEntry.requestMethod || 'POST',
    ipAddress: logEntry.ipAddress || logEntry.sourceIp || '127.0.0.1',
    queryParams: logEntry.queryParams || logEntry.requestQuery || {}
  };
};
