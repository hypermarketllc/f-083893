
import { Webhook, WebhookLogEntry, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook';

// Initial mock data
export const mockWebhooks: Webhook[] = [
  {
    id: '1',
    name: 'Get Weather Data',
    description: 'Fetch weather data from OpenWeatherMap API',
    url: 'https://api.openweathermap.org/data/2.5/weather',
    method: 'GET',
    headers: [
      { id: '1', key: 'Accept', value: 'application/json', enabled: true }
    ],
    urlParams: [
      { id: '1', key: 'q', value: 'London', enabled: true },
      { id: '2', key: 'appid', value: 'your-api-key', enabled: true }
    ],
    enabled: true,
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Post User Data',
    description: 'Send user data to external API',
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: [
      { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
      { id: '2', key: 'Authorization', value: 'Bearer token123', enabled: true }
    ],
    urlParams: [],
    body: {
      contentType: 'json',
      content: '{\n  "title": "Test Post",\n  "body": "This is a test post",\n  "userId": 1\n}'
    },
    enabled: true,
    createdAt: '2023-01-02T11:30:00Z',
    updatedAt: '2023-01-02T11:30:00Z'
  }
];

export const mockWebhookLogs: WebhookLogEntry[] = [
  {
    id: '1',
    webhookId: '1',
    webhookName: 'Get Weather Data',
    timestamp: '2023-01-10T14:30:00Z',
    requestUrl: 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=your-api-key',
    requestMethod: 'GET',
    requestHeaders: {
      'Accept': 'application/json'
    },
    responseStatus: 200,
    responseHeaders: {
      'Content-Type': 'application/json'
    },
    responseBody: '{"coord":{"lon":-0.1257,"lat":51.5085},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":289.15,"feels_like":288.51,"temp_min":287.38,"temp_max":290.93,"pressure":1017,"humidity":67},"visibility":10000,"wind":{"speed":5.14,"deg":240},"clouds":{"all":0},"dt":1610289600,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1610266512,"sunset":1610296281},"timezone":0,"id":2643743,"name":"London","cod":200}',
    duration: 320,
    success: true
  },
  {
    id: '2',
    webhookId: '2',
    webhookName: 'Post User Data',
    timestamp: '2023-01-12T09:45:00Z',
    requestUrl: 'https://jsonplaceholder.typicode.com/posts',
    requestMethod: 'POST',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    },
    requestBody: '{\n  "title": "Test Post",\n  "body": "This is a test post",\n  "userId": 1\n}',
    responseStatus: 201,
    responseHeaders: {
      'Content-Type': 'application/json'
    },
    responseBody: '{\n  "title": "Test Post",\n  "body": "This is a test post",\n  "userId": 1,\n  "id": 101\n}',
    duration: 450,
    success: true
  },
  {
    id: '3',
    webhookId: '2',
    webhookName: 'Post User Data',
    timestamp: '2023-01-13T11:20:00Z',
    requestUrl: 'https://jsonplaceholder.typicode.com/posts',
    requestMethod: 'POST',
    requestHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid-token'
    },
    requestBody: '{\n  "title": "Failed Post",\n  "body": "This post will fail",\n  "userId": 1\n}',
    responseStatus: 401,
    responseHeaders: {
      'Content-Type': 'application/json'
    },
    responseBody: '{\n  "error": "Unauthorized"\n}',
    duration: 280,
    success: false,
    error: 'Invalid authentication credentials'
  }
];

export const mockIncomingWebhooks: IncomingWebhook[] = [
  {
    id: '1',
    name: 'Retell Data Receiver',
    description: 'Receive webhook data from Retell API',
    endpointPath: '/webhook/retell',
    createdAt: '2023-01-05T09:30:00Z',
    updatedAt: '2023-01-05T09:30:00Z',
    enabled: true
  },
  {
    id: '2',
    name: 'Stripe Payment Notifications',
    description: 'Receive payment webhook notifications from Stripe',
    endpointPath: '/webhook/stripe',
    createdAt: '2023-01-07T15:45:00Z',
    updatedAt: '2023-01-07T15:45:00Z',
    enabled: true
  }
];

export const mockIncomingWebhookLogs: IncomingWebhookLogEntry[] = [
  {
    id: '1',
    webhookId: '1',
    webhookName: 'Retell Data Receiver',
    timestamp: '2023-01-15T10:20:00Z',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'Retell/1.0',
      'X-Webhook-Signature': '1234567890abcdef'
    },
    requestMethod: 'POST',
    requestBody: '{\n  "event": "call.completed",\n  "call_id": "123456",\n  "timestamp": "2023-01-15T10:19:45Z",\n  "duration": 325,\n  "metadata": {\n    "customer_id": "cust_123",\n    "agent_id": "agent_456"\n  }\n}',
    isParsed: false
  },
  {
    id: '2',
    webhookId: '2',
    webhookName: 'Stripe Payment Notifications',
    timestamp: '2023-01-16T14:35:00Z',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'Stripe/1.0',
      'Stripe-Signature': 'abcdef1234567890'
    },
    requestMethod: 'POST',
    requestBody: '{\n  "id": "evt_123456",\n  "object": "event",\n  "api_version": "2020-08-27",\n  "created": 1673880900,\n  "data": {\n    "object": {\n      "id": "ch_123456",\n      "object": "charge",\n      "amount": 2000,\n      "currency": "usd",\n      "status": "succeeded"\n    }\n  },\n  "type": "charge.succeeded"\n}',
    parsedData: '{\n  "id": "evt_123456",\n  "object": "event",\n  "api_version": "2020-08-27",\n  "created": 1673880900,\n  "data": {\n    "object": {\n      "id": "ch_123456",\n      "object": "charge",\n      "amount": 2000,\n      "currency": "usd",\n      "status": "succeeded"\n    }\n  },\n  "type": "charge.succeeded"\n}',
    isParsed: true
  }
];
