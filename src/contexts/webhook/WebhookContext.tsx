
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
import { mockWebhooks, mockWebhookLogs, mockIncomingWebhooks, mockIncomingWebhookLogs } from './data';

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

  // Send test webhook request
  const sendTestRequest = async (webhook: Webhook) => {
    setIsTestLoading(true);
    setTestResponse(null);
    
    try {
      // Build URL with params
      let url = webhook.url;
      if (webhook.urlParams && webhook.urlParams.length > 0) {
        const enabledParams = webhook.urlParams.filter(p => p.enabled);
        if (enabledParams.length > 0) {
          const queryString = enabledParams
            .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
            .join('&');
          url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
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
      console.log(`Sending ${webhook.method} request to ${url}`);
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
        data: {
          success: true,
          message: 'Webhook test successful',
          timestamp: new Date().toISOString()
        }
      };
      
      // Wait a bit to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a log entry
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: url,
        requestMethod: webhook.method,
        requestHeaders: headers,
        requestBody: bodyContent ? JSON.stringify(bodyContent) : undefined,
        responseStatus: mockResponse.status,
        responseHeaders: mockResponse.headers,
        responseBody: JSON.stringify(mockResponse.data),
        duration: 152, // Simulated duration in ms
        success: true
      };
      
      // Add to logs
      setWebhookLogs([logEntry, ...webhookLogs]);
      
      // Set response for display
      setTestResponse(mockResponse);
      setIsTestLoading(false);
      toast.success('Test request sent successfully');
      
    } catch (error) {
      console.error('Error sending test webhook:', error);
      
      // Create error log
      const logEntry: WebhookLogEntry = {
        id: uuidv4(),
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestUrl: url,
        requestMethod: webhook.method,
        requestHeaders: {},
        responseStatus: 500,
        responseHeaders: {},
        duration: 50, // Simulated duration in ms
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // Add to logs
      setWebhookLogs([logEntry, ...webhookLogs]);
      
      setTestResponse({
        status: 500,
        statusText: 'Error',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      setIsTestLoading(false);
      toast.error('Error sending test request');
    }
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
