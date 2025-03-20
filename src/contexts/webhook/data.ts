
import { Webhook, WebhookLogEntry, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook';
import { format, subDays, subHours, subMinutes } from 'date-fns';

// Mock webhooks
export const mockWebhooks: Webhook[] = [
  {
    id: 'webhook-1',
    name: 'GitHub Issue Webhook',
    description: 'Sends issues from GitHub to our internal system',
    url: 'https://api.example.com/github/issues',
    method: 'POST',
    headers: [
      { id: 'header-1', key: 'Content-Type', value: 'application/json', enabled: true },
      { id: 'header-2', key: 'Authorization', value: 'Bearer token123', enabled: true }
    ],
    params: [],
    body: {
      contentType: 'json',
      content: '{\n  "repository": "{{repository}}",\n  "issue": "{{issue}}"\n}'
    },
    enabled: true,
    createdAt: subDays(new Date(), 30).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    lastExecutedAt: subDays(new Date(), 1).toISOString(),
    lastExecutionStatus: 'success'
  },
  {
    id: 'webhook-2',
    name: 'Slack Notification',
    description: 'Sends notifications to Slack channel',
    url: 'https://hooks.slack.com/services/ABC123/XYZ789',
    method: 'POST',
    headers: [
      { id: 'header-3', key: 'Content-Type', value: 'application/json', enabled: true }
    ],
    params: [],
    body: {
      contentType: 'json',
      content: '{\n  "text": "{{message}}",\n  "channel": "#general"\n}'
    },
    enabled: true,
    createdAt: subDays(new Date(), 45).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
    lastExecutedAt: subDays(new Date(), 2).toISOString(),
    lastExecutionStatus: 'success'
  },
  {
    id: 'webhook-3',
    name: 'Jira Issue Updater',
    description: 'Updates Jira issues when tasks are completed',
    url: 'https://api.atlassian.com/jira',
    method: 'PUT',
    headers: [
      { id: 'header-4', key: 'Content-Type', value: 'application/json', enabled: true },
      { id: 'header-5', key: 'Authorization', value: 'Basic abc123', enabled: true }
    ],
    params: [
      { id: 'param-1', key: 'issueId', value: '{{issueId}}', enabled: true }
    ],
    body: {
      contentType: 'json',
      content: '{\n  "status": "{{status}}",\n  "comment": "{{comment}}"\n}'
    },
    enabled: false,
    createdAt: subDays(new Date(), 60).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    lastExecutedAt: subDays(new Date(), 3).toISOString(),
    lastExecutionStatus: 'error'
  }
];

// Mock webhook logs
export const mockWebhookLogs: WebhookLogEntry[] = [
  {
    id: 'log-1',
    webhookId: 'webhook-1',
    webhookName: 'GitHub Issue Webhook',
    timestamp: subMinutes(new Date(), 15).toISOString(),
    requestUrl: 'https://api.example.com/github/issues',
    requestMethod: 'POST',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    },
    requestBody: '{\n  "repository": "user/repo",\n  "issue": "Issue #42"\n}',
    responseStatus: 200,
    responseHeaders: {
      'Content-Type': 'application/json'
    },
    responseBody: '{\n  "success": true,\n  "id": "1234"\n}',
    duration: 237,
    success: true
  },
  {
    id: 'log-2',
    webhookId: 'webhook-2',
    webhookName: 'Slack Notification',
    timestamp: subHours(new Date(), 2).toISOString(),
    requestUrl: 'https://hooks.slack.com/services/ABC123/XYZ789',
    requestMethod: 'POST',
    requestHeaders: {
      'Content-Type': 'application/json'
    },
    requestBody: '{\n  "text": "New task assigned",\n  "channel": "#general"\n}',
    responseStatus: 200,
    responseHeaders: {
      'Content-Type': 'text/plain'
    },
    responseBody: 'ok',
    duration: 413,
    success: true
  },
  {
    id: 'log-3',
    webhookId: 'webhook-3',
    webhookName: 'Jira Issue Updater',
    timestamp: subDays(new Date(), 1).toISOString(),
    requestUrl: 'https://api.atlassian.com/jira?issueId=TASK-123',
    requestMethod: 'PUT',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic abc123'
    },
    requestBody: '{\n  "status": "Done",\n  "comment": "Completed by John"\n}',
    responseStatus: 401,
    responseHeaders: {
      'Content-Type': 'application/json'
    },
    responseBody: '{\n  "error": "Unauthorized",\n  "message": "Invalid credentials"\n}',
    duration: 298,
    success: false,
    error: 'Unauthorized: Invalid credentials'
  }
];

// Mock incoming webhooks
export const mockIncomingWebhooks: IncomingWebhook[] = [
  {
    id: 'incoming-webhook-1',
    name: 'GitHub Webhook',
    description: 'Receives events from GitHub',
    endpointPath: '/github',
    createdAt: subDays(new Date(), 20).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
    enabled: true,
    lastCalledAt: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'incoming-webhook-2',
    name: 'Stripe Payment Webhook',
    description: 'Processes payment events from Stripe',
    endpointPath: '/stripe/payments',
    createdAt: subDays(new Date(), 35).toISOString(),
    updatedAt: subDays(new Date(), 4).toISOString(),
    enabled: true,
    lastCalledAt: subHours(new Date(), 5).toISOString()
  },
  {
    id: 'incoming-webhook-3',
    name: 'Mailchimp Webhook',
    description: 'Handles email subscription events',
    endpointPath: '/mailchimp/events',
    createdAt: subDays(new Date(), 55).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    enabled: false,
    lastCalledAt: subDays(new Date(), 10).toISOString()
  }
];

// Mock incoming webhook logs
export const mockIncomingWebhookLogs: IncomingWebhookLogEntry[] = [
  {
    id: 'incoming-log-1',
    webhookId: 'incoming-webhook-1',
    webhookName: 'GitHub Webhook',
    timestamp: subHours(new Date(), 3).toISOString(),
    requestHeaders: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'push',
      'X-GitHub-Delivery': 'a123b456c789d'
    },
    requestMethod: 'POST',
    requestBody: '{\n  "ref": "refs/heads/main",\n  "repository": {\n    "full_name": "user/repo"\n  }\n}',
    isParsed: true,
    parsedData: '{\n  "event": "push",\n  "repo": "user/repo",\n  "branch": "main"\n}',
    success: true,
    sourceIp: '140.82.115.241',
    contentType: 'application/json'
  },
  {
    id: 'incoming-log-2',
    webhookId: 'incoming-webhook-2',
    webhookName: 'Stripe Payment Webhook',
    timestamp: subHours(new Date(), 6).toISOString(),
    requestHeaders: {
      'Content-Type': 'application/json',
      'Stripe-Signature': 'whsec_abc123def456'
    },
    requestMethod: 'POST',
    requestBody: '{\n  "type": "payment_intent.succeeded",\n  "data": {\n    "object": {\n      "id": "pi_12345",\n      "amount": 2000\n    }\n  }\n}',
    isParsed: true,
    parsedData: '{\n  "eventType": "payment_intent.succeeded",\n  "paymentId": "pi_12345",\n  "amount": 20.00\n}',
    success: true,
    sourceIp: '54.187.174.169',
    contentType: 'application/json'
  },
  {
    id: 'incoming-log-3',
    webhookId: 'incoming-webhook-3',
    webhookName: 'Mailchimp Webhook',
    timestamp: subDays(new Date(), 2).toISOString(),
    requestHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestMethod: 'POST',
    requestBody: 'type=unsubscribe&email=user%40example.com&reason=manually',
    isParsed: false,
    success: false,
    sourceIp: '205.201.132.98',
    contentType: 'application/x-www-form-urlencoded',
    error: 'Failed to parse form data: Invalid format'
  }
];
