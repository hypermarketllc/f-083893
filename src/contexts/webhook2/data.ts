
import { 
  Webhook, 
  WebhookLogEntry, 
  IncomingWebhook, 
  IncomingWebhookLogEntry 
} from '@/types/webhook2';
import { v4 as uuidv4 } from 'uuid';

// Mock webhooks
export const mockWebhooks: Webhook[] = [
  {
    id: 'webhook-1',
    name: 'Daily Sales Report',
    description: 'Sends daily sales data to the analytics service',
    url: 'https://api.example.com/analytics/sales',
    method: 'POST',
    headers: [
      { id: 'header-1', key: 'Content-Type', value: 'application/json', enabled: true },
      { id: 'header-2', key: 'Authorization', value: 'Bearer token123', enabled: true }
    ],
    params: [
      { id: 'param-1', key: 'source', value: 'dashboard', enabled: true }
    ],
    body: {
      contentType: 'json',
      content: JSON.stringify({ type: 'sales', format: 'daily' }, null, 2)
    },
    enabled: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastExecutedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastExecutionStatus: 'success',
    tags: [
      { id: 'tag-1', name: 'Production', color: '#69db7c' },
      { id: 'tag-4', name: 'Important', color: '#ff6b6b' }
    ],
    schedule: {
      type: 'daily',
      time: '08:00'
    }
  },
  {
    id: 'webhook-2',
    name: 'Slack Notification',
    description: 'Sends alerts to Slack when errors occur',
    url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
    method: 'POST',
    headers: [
      { id: 'header-3', key: 'Content-Type', value: 'application/json', enabled: true }
    ],
    params: [],
    body: {
      contentType: 'json',
      content: JSON.stringify({ text: 'An error has occurred!' }, null, 2)
    },
    enabled: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastExecutedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastExecutionStatus: 'error',
    tags: [
      { id: 'tag-2', name: 'Development', color: '#4dabf7' }
    ]
  },
  {
    id: 'webhook-3',
    name: 'User Sync',
    description: 'Synchronizes user data with CRM',
    url: 'https://api.crm.example.com/users/sync',
    method: 'PUT',
    headers: [
      { id: 'header-4', key: 'Content-Type', value: 'application/json', enabled: true },
      { id: 'header-5', key: 'X-API-Key', value: 'api_key_789', enabled: true }
    ],
    params: [
      { id: 'param-2', key: 'full', value: 'true', enabled: false }
    ],
    body: {
      contentType: 'json',
      content: JSON.stringify({ action: 'sync', target: 'users' }, null, 2)
    },
    enabled: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastExecutedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastExecutionStatus: 'success',
    tags: [
      { id: 'tag-3', name: 'Testing', color: '#ff922b' }
    ]
  }
];

// Generate mock webhook logs
export const generateMockWebhookLogs = (): WebhookLogEntry[] => {
  const logs: WebhookLogEntry[] = [];
  
  mockWebhooks.forEach(webhook => {
    // Generate 1-5 logs per webhook
    const logCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < logCount; i++) {
      const isSuccess = Math.random() > 0.3;
      const timestamp = new Date(Date.now() - i * Math.random() * 24 * 60 * 60 * 1000).toISOString();
      const duration = Math.floor(Math.random() * 2000) + 100;
      
      logs.push({
        id: `log-${uuidv4()}`,
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp,
        requestUrl: webhook.url,
        requestMethod: webhook.method,
        requestHeaders: webhook.headers.reduce((acc, h) => {
          if (h.enabled) acc[h.key] = h.value;
          return acc;
        }, {} as Record<string, string>),
        requestBody: webhook.body?.content,
        responseStatus: isSuccess ? 200 : (Math.random() > 0.5 ? 400 : 500),
        responseHeaders: {
          'content-type': 'application/json',
          'server': 'nginx',
          'cache-control': 'no-cache'
        },
        responseBody: isSuccess 
          ? JSON.stringify({ success: true, message: "Operation completed" })
          : JSON.stringify({ error: "Something went wrong" }),
        duration,
        success: isSuccess,
        error: isSuccess ? undefined : "API returned an error response"
      });
    }
  });
  
  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Mock webhook logs
export const mockWebhookLogs: WebhookLogEntry[] = generateMockWebhookLogs();

// Mock incoming webhooks
export const mockIncomingWebhooks: IncomingWebhook[] = [
  {
    id: 'incoming-webhook-1',
    name: 'GitHub Events',
    description: 'Receives webhook events from GitHub',
    endpointPath: '/github',
    enabled: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastCalledAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    secretKey: 'gh_secret_123',
    tags: [
      { id: 'tag-1', name: 'Production', color: '#69db7c' },
      { id: 'tag-4', name: 'Important', color: '#ff6b6b' }
    ]
  },
  {
    id: 'incoming-webhook-2',
    name: 'Stripe Payments',
    description: 'Receives payment events from Stripe',
    endpointPath: '/stripe',
    enabled: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastCalledAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    secretKey: 'stripe_secret_456',
    tags: [
      { id: 'tag-3', name: 'Testing', color: '#ff922b' }
    ]
  },
  {
    id: 'incoming-webhook-3',
    name: 'Custom Integration',
    description: 'Endpoint for partner API integration',
    endpointPath: '/partner-api',
    enabled: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastCalledAt: null,
    secretKey: 'partner_secret_789',
    tags: [
      { id: 'tag-2', name: 'Development', color: '#4dabf7' }
    ]
  }
];

// Generate mock incoming webhook logs
export const generateMockIncomingWebhookLogs = (): IncomingWebhookLogEntry[] => {
  const logs: IncomingWebhookLogEntry[] = [];
  
  mockIncomingWebhooks.forEach(webhook => {
    // Only generate logs for enabled webhooks with lastCalledAt
    if (webhook.enabled && webhook.lastCalledAt) {
      // Generate 1-7 logs per webhook
      const logCount = Math.floor(Math.random() * 7) + 1;
      
      for (let i = 0; i < logCount; i++) {
        const isSuccess = Math.random() > 0.2;
        const timestamp = new Date(Date.now() - i * Math.random() * 24 * 60 * 60 * 1000).toISOString();
        
        logs.push({
          id: `incoming-log-${uuidv4()}`,
          webhookId: webhook.id,
          webhookName: webhook.name,
          timestamp,
          requestHeaders: {
            'content-type': 'application/json',
            'user-agent': 'Mozilla/5.0',
            'x-request-id': `req-${uuidv4().substring(0, 8)}`
          },
          requestMethod: 'POST',
          requestBody: JSON.stringify({ event: 'update', payload: { id: '123', status: 'completed' } }),
          queryParams: i % 2 === 0 ? { source: 'api' } : {},
          responseStatus: isSuccess ? 200 : 400,
          endpointPath: webhook.endpointPath,
          responseBody: isSuccess 
            ? JSON.stringify({ received: true })
            : JSON.stringify({ error: "Invalid payload" }),
          isParsed: isSuccess,
          parsedData: isSuccess ? JSON.stringify({ id: '123', status: 'completed' }) : undefined,
          success: isSuccess,
          sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
          contentType: 'application/json',
          error: isSuccess ? undefined : "Failed to process webhook payload"
        });
      }
    }
  });
  
  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Mock incoming webhook logs
export const mockIncomingWebhookLogs: IncomingWebhookLogEntry[] = generateMockIncomingWebhookLogs();
