
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  Webhook, 
  WebhookHeader, 
  WebhookUrlParam, 
  WebhookBody,
  WebhookSchedule,
  WebhookLogEntry,
  IncomingWebhook,
  IncomingWebhookLogEntry 
} from '@/types/webhook';

// Initial mock data
const mockWebhooks: Webhook[] = [
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

const mockWebhookLogs: WebhookLogEntry[] = [
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

const mockIncomingWebhooks: IncomingWebhook[] = [
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

const mockIncomingWebhookLogs: IncomingWebhookLogEntry[] = [
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

// Helper to parse body content based on content type
const parseBodyContent = (body: WebhookBody | undefined) => {
  if (!body) return null;
  
  try {
    switch (body.contentType) {
      case 'json':
        return JSON.parse(body.content);
      case 'form':
        const formData = new FormData();
        const formFields = JSON.parse(body.content);
        Object.entries(formFields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        return formData;
      case 'text':
      default:
        return body.content;
    }
  } catch (error) {
    console.error('Error parsing body content:', error);
    return body.content;
  }
};

interface WebhookContextType {
  webhooks: Webhook[];
  isWebhookModalOpen: boolean;
  setIsWebhookModalOpen: (isOpen: boolean) => void;
  selectedWebhook: Webhook | null;
  setSelectedWebhook: (webhook: Webhook | null) => void;
  editingWebhook: Webhook | null;
  setEditingWebhook: (webhook: Webhook | null) => void;
  isTestMode: boolean;
  setIsTestMode: (isTest: boolean) => void;
  testResponse: any;
  setTestResponse: (response: any) => void;
  isTestLoading: boolean;
  setIsTestLoading: (isLoading: boolean) => void;
  webhookLogs: WebhookLogEntry[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWebhook: (webhook: Webhook) => void;
  handleEditWebhook: (webhook: Webhook) => void;
  handleDeleteWebhook: (id: string) => void;
  executeWebhook: (webhook: Webhook, isTest?: boolean) => Promise<void>;
  clearTestResponse: () => void;
  sendTestRequest: (webhook: Webhook) => void;
  incomingWebhooks: IncomingWebhook[];
  isIncomingWebhookModalOpen: boolean;
  setIsIncomingWebhookModalOpen: (isOpen: boolean) => void;
  selectedIncomingWebhook: IncomingWebhook | null;
  setSelectedIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  editingIncomingWebhook: IncomingWebhook | null;
  setEditingIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  incomingWebhookLogs: IncomingWebhookLogEntry[];
  createIncomingWebhook: (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleEditIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleDeleteIncomingWebhook: (id: string) => void;
}

const WebhookContext = createContext<WebhookContextType | undefined>(undefined);

export const useWebhookContext = () => {
  const context = useContext(WebhookContext);
  if (!context) {
    throw new Error('useWebhookContext must be used within a WebhookProvider');
  }
  return context;
};

interface WebhookProviderProps {
  children: ReactNode;
}

export const WebhookProvider: React.FC<WebhookProviderProps> = ({ children }) => {
  // Outgoing Webhooks State
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogEntry[]>(mockWebhookLogs);
  const [searchQuery, setSearchQuery] = useState('');

  // Incoming Webhooks State
  const [incomingWebhooks, setIncomingWebhooks] = useState<IncomingWebhook[]>(mockIncomingWebhooks);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState<IncomingWebhook | null>(null);
  const [editingIncomingWebhook, setEditingIncomingWebhook] = useState<IncomingWebhook | null>(null);
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState<IncomingWebhookLogEntry[]>(mockIncomingWebhookLogs);

  // Clear test response
  const clearTestResponse = () => {
    setTestResponse(null);
  };

  // Filter webhook logs based on search query
  const filteredWebhookLogs = searchQuery
    ? webhookLogs.filter(log => 
        log.webhookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.requestUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.error && log.error.toLowerCase().includes(searchQuery.toLowerCase())) ||
        String(log.responseStatus).includes(searchQuery)
      )
    : webhookLogs;

  // Filter incoming webhook logs based on search query
  const filteredIncomingWebhookLogs = searchQuery
    ? incomingWebhookLogs.filter(log => 
        log.webhookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.requestBody && log.requestBody.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.parsedData && log.parsedData.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : incomingWebhookLogs;

  // Create a new webhook
  const createWebhook = (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWebhook: Webhook = {
      ...webhook,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setWebhooks([...webhooks, newWebhook]);
    setIsWebhookModalOpen(false);
    toast.success('Webhook created successfully');
  };

  // Update an existing webhook
  const updateWebhook = (webhook: Webhook) => {
    setWebhooks(webhooks.map(w => 
      w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
    ));
    setIsWebhookModalOpen(false);
    setEditingWebhook(null);
    toast.success('Webhook updated successfully');
  };

  // Handle edit webhook (open modal with webhook data)
  const handleEditWebhook = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  // Delete a webhook
  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    if (selectedWebhook?.id === id) {
      setSelectedWebhook(null);
    }
    toast.success('Webhook deleted successfully');
  };

  // Execute webhook (new function)
  const executeWebhook = async (webhook: Webhook, isTest: boolean = false) => {
    setIsTestLoading(true);
    if (isTest) {
      setTestResponse(null);
    }
    
    try {
      // Build URL with params
      let requestUrl = webhook.url;
      if (webhook.urlParams && webhook.urlParams.length > 0) {
        const enabledParams = webhook.urlParams.filter(p => p.enabled);
        if (enabledParams.length > 0) {
          const queryString = enabledParams
            .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
            .join('&');
          requestUrl = `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${queryString}`;
        }
      }
      
      // Build headers
      const headers: Record<string, string> = {};
      if (webhook.headers && webhook.headers.length > 0) {
        webhook.headers.filter(h => h.enabled).forEach(h => {
          headers[h.key] = h.value;
        });
      }
      
      // Parse body content
      const bodyContent = parseBodyContent(webhook.body);
      
      // Simulate a request
      // In a real app, you would make an actual API call
      console.log(`Sending ${webhook.method} request to ${requestUrl}`);
      console.log('Headers:', headers);
      console.log('Body:', bodyContent);
      
      // Simulate API response
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'server': 'MockServer',
          'date': new Date().toUTCString()
        },
        body: JSON.stringify({
          success: true,
          message: 'Webhook test successful',
          timestamp: new Date().toISOString()
        }),
        duration: 152 // milliseconds
      };
      
      // Wait a bit to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a log entry
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: requestUrl,
        requestMethod: webhook.method,
        requestHeaders: headers,
        requestBody: bodyContent ? JSON.stringify(bodyContent) : undefined,
        responseStatus: mockResponse.status,
        responseHeaders: mockResponse.headers,
        responseBody: mockResponse.body,
        duration: mockResponse.duration,
        success: true
      };
      
      // Only add to logs if it's not a test or if we want to log tests
      if (!isTest) {
        setWebhookLogs([logEntry, ...webhookLogs]);
      }
      
      // Set response for display if it's a test
      if (isTest) {
        setTestResponse(mockResponse);
      }
      
      setIsTestLoading(false);
      if (isTest) {
        toast.success('Test request sent successfully');
      }
      
    } catch (error) {
      console.error('Error sending webhook:', error);
      
      // Create error log
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: webhook.url,
        requestMethod: webhook.method,
        requestHeaders: {},
        responseStatus: 500,
        responseHeaders: {},
        duration: 50, // Simulated duration in ms
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Only add to logs if it's not a test or if we want to log tests
      if (!isTest) {
        setWebhookLogs([logEntry, ...webhookLogs]);
      }
      
      if (isTest) {
        setTestResponse({
          status: 500,
          statusText: 'Error',
          headers: {},
          body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
          duration: 50
        });
      }
      
      setIsTestLoading(false);
      if (isTest) {
        toast.error('Error sending test request');
      }
    }
  };

  // Send test webhook request
  const sendTestRequest = async (webhook: Webhook) => {
    await executeWebhook(webhook, true);
  };

  // Create a new incoming webhook
  const createIncomingWebhook = (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newWebhook: IncomingWebhook = {
      ...webhook,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setIncomingWebhooks([...incomingWebhooks, newWebhook]);
    setIsIncomingWebhookModalOpen(false);
    toast.success('Incoming webhook created successfully');
  };

  // Update an existing incoming webhook
  const updateIncomingWebhook = (webhook: IncomingWebhook) => {
    setIncomingWebhooks(incomingWebhooks.map(w => 
      w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
    ));
    setIsIncomingWebhookModalOpen(false);
    setEditingIncomingWebhook(null);
    toast.success('Incoming webhook updated successfully');
  };

  // Handle edit incoming webhook (open modal with webhook data)
  const handleEditIncomingWebhook = (webhook: IncomingWebhook) => {
    setEditingIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };

  // Delete an incoming webhook
  const handleDeleteIncomingWebhook = (id: string) => {
    setIncomingWebhooks(incomingWebhooks.filter(w => w.id !== id));
    if (selectedIncomingWebhook?.id === id) {
      setSelectedIncomingWebhook(null);
    }
    toast.success('Incoming webhook deleted successfully');
  };

  const value = {
    webhooks,
    isWebhookModalOpen,
    setIsWebhookModalOpen,
    selectedWebhook,
    setSelectedWebhook,
    editingWebhook,
    setEditingWebhook,
    isTestMode,
    setIsTestMode,
    testResponse,
    setTestResponse,
    isTestLoading,
    setIsTestLoading,
    webhookLogs: filteredWebhookLogs,
    searchQuery,
    setSearchQuery,
    createWebhook,
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    executeWebhook,
    clearTestResponse,
    sendTestRequest,
    incomingWebhooks,
    isIncomingWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    selectedIncomingWebhook,
    setSelectedIncomingWebhook,
    editingIncomingWebhook,
    setEditingIncomingWebhook,
    incomingWebhookLogs: filteredIncomingWebhookLogs,
    createIncomingWebhook,
    updateIncomingWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook
  };

  return (
    <WebhookContext.Provider value={value}>
      {children}
    </WebhookContext.Provider>
  );
};
