
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Webhook, 
  WebhookLogEntry, 
  IncomingWebhook, 
  IncomingWebhookLogEntry 
} from '@/types/webhook';
import { INITIAL_WEBHOOKS, INITIAL_WEBHOOK_LOGS, INITIAL_INCOMING_WEBHOOKS, INITIAL_INCOMING_WEBHOOK_LOGS } from './data';

interface WebhookContextType {
  // Outgoing webhooks
  webhooks: Webhook[];
  webhookLogs: WebhookLogEntry[];
  selectedWebhook: Webhook | null;
  isWebhookModalOpen: boolean;
  isTestMode: boolean;
  testResponse: {
    status: number;
    headers: Record<string, string>;
    body: string;
    duration: number;
  } | null;
  
  // Actions for outgoing webhooks
  setWebhooks: (webhooks: Webhook[]) => void;
  setWebhookLogs: (logs: WebhookLogEntry[]) => void;
  setSelectedWebhook: (webhook: Webhook | null) => void;
  setIsWebhookModalOpen: (isOpen: boolean) => void;
  setIsTestMode: (isTest: boolean) => void;
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWebhook: (webhook: Webhook) => void;
  deleteWebhook: (id: string) => void;
  executeWebhook: (webhook: Webhook, isTest: boolean) => Promise<void>;
  clearTestResponse: () => void;
  
  // Incoming webhooks
  incomingWebhooks: IncomingWebhook[];
  incomingWebhookLogs: IncomingWebhookLogEntry[];
  selectedIncomingWebhook: IncomingWebhook | null;
  isIncomingWebhookModalOpen: boolean;
  
  // Actions for incoming webhooks
  setIncomingWebhooks: (webhooks: IncomingWebhook[]) => void;
  setIncomingWebhookLogs: (logs: IncomingWebhookLogEntry[]) => void;
  setSelectedIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  setIsIncomingWebhookModalOpen: (isOpen: boolean) => void;
  createIncomingWebhook: (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIncomingWebhook: (webhook: IncomingWebhook) => void;
  deleteIncomingWebhook: (id: string) => void;
  parseIncomingWebhookLog: (log: IncomingWebhookLogEntry) => void;
  
  // Shared
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredWebhookLogs: WebhookLogEntry[];
  filteredIncomingWebhookLogs: IncomingWebhookLogEntry[];
}

const WebhookContext = createContext<WebhookContextType | undefined>(undefined);

export const WebhookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Outgoing webhooks
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogEntry[]>(INITIAL_WEBHOOK_LOGS);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState<{
    status: number;
    headers: Record<string, string>;
    body: string;
    duration: number;
  } | null>(null);
  
  // Incoming webhooks
  const [incomingWebhooks, setIncomingWebhooks] = useState<IncomingWebhook[]>(INITIAL_INCOMING_WEBHOOKS);
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState<IncomingWebhookLogEntry[]>(INITIAL_INCOMING_WEBHOOK_LOGS);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState<IncomingWebhook | null>(null);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);

  // Shared
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWebhookLogs, setFilteredWebhookLogs] = useState<WebhookLogEntry[]>(webhookLogs);
  const [filteredIncomingWebhookLogs, setFilteredIncomingWebhookLogs] = useState<IncomingWebhookLogEntry[]>(incomingWebhookLogs);

  // Filter logs when search query or logs change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWebhookLogs(webhookLogs);
      setFilteredIncomingWebhookLogs(incomingWebhookLogs);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Filter outgoing webhook logs
    const filteredOutgoing = webhookLogs.filter(log => 
      log.webhookName.toLowerCase().includes(query) ||
      log.requestUrl.toLowerCase().includes(query) ||
      log.requestMethod.toLowerCase().includes(query) ||
      (log.requestBody && log.requestBody.toLowerCase().includes(query)) ||
      (log.responseBody && log.responseBody.toLowerCase().includes(query)) ||
      (log.error && log.error.toLowerCase().includes(query))
    );
    setFilteredWebhookLogs(filteredOutgoing);
    
    // Filter incoming webhook logs
    const filteredIncoming = incomingWebhookLogs.filter(log => 
      log.webhookName.toLowerCase().includes(query) ||
      log.requestMethod.toLowerCase().includes(query) ||
      (log.requestBody && log.requestBody.toLowerCase().includes(query)) ||
      (log.parsedData && log.parsedData.toLowerCase().includes(query))
    );
    setFilteredIncomingWebhookLogs(filteredIncoming);
  }, [searchQuery, webhookLogs, incomingWebhookLogs]);
  
  // Create a new outgoing webhook
  const createWebhook = (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWebhook: Webhook = {
      ...webhook,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setWebhooks([...webhooks, newWebhook]);
    toast.success(`Webhook "${newWebhook.name}" created successfully`);
  };
  
  // Update an existing outgoing webhook
  const updateWebhook = (webhook: Webhook) => {
    const updatedWebhooks = webhooks.map(w => 
      w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
    );
    
    setWebhooks(updatedWebhooks);
    toast.success(`Webhook "${webhook.name}" updated successfully`);
  };
  
  // Delete an outgoing webhook
  const deleteWebhook = (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return;
    
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast.success(`Webhook "${webhook.name}" deleted successfully`);
  };
  
  // Execute an outgoing webhook
  const executeWebhook = async (webhook: Webhook, isTest: boolean) => {
    const startTime = Date.now();
    
    // Prepare URL with parameters
    let url = webhook.url;
    const enabledParams = webhook.urlParams.filter(param => param.enabled);
    if (enabledParams.length > 0) {
      const paramString = enabledParams
        .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
        .join('&');
      url += (url.includes('?') ? '&' : '?') + paramString;
    }
    
    // Prepare headers
    const headers: Record<string, string> = {};
    webhook.headers
      .filter(header => header.enabled)
      .forEach(header => {
        headers[header.key] = header.value;
      });
    
    // Prepare body based on content type
    let body: string | FormData | undefined;
    if (webhook.body) {
      if (webhook.body.contentType === 'json') {
        headers['Content-Type'] = 'application/json';
        body = webhook.body.content;
      } else if (webhook.body.contentType === 'form') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        body = webhook.body.content;
      } else {
        headers['Content-Type'] = 'text/plain';
        body = webhook.body.content;
      }
    }
    
    try {
      // Execute the request
      const response = await fetch(url, {
        method: webhook.method,
        headers,
        body,
      });
      
      const responseBody = await response.text();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      const duration = Date.now() - startTime;
      
      if (isTest) {
        // Store test response for display
        setTestResponse({
          status: response.status,
          headers: responseHeaders,
          body: responseBody,
          duration
        });
      } else {
        // Log the request
        const log: WebhookLogEntry = {
          id: crypto.randomUUID(),
          webhookId: webhook.id,
          webhookName: webhook.name,
          timestamp: new Date().toISOString(),
          requestUrl: url,
          requestMethod: webhook.method,
          requestHeaders: headers,
          requestBody: body,
          responseStatus: response.status,
          responseHeaders: responseHeaders,
          responseBody: responseBody,
          duration,
          success: response.ok
        };
        
        setWebhookLogs([log, ...webhookLogs]);
        
        if (response.ok) {
          toast.success(`Webhook "${webhook.name}" executed successfully`);
        } else {
          toast.error(`Webhook "${webhook.name}" failed with status ${response.status}`);
        }
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (isTest) {
        setTestResponse({
          status: 0,
          headers: {},
          body: `Error: ${errorMessage}`,
          duration
        });
      } else {
        // Log the error
        const log: WebhookLogEntry = {
          id: crypto.randomUUID(),
          webhookId: webhook.id,
          webhookName: webhook.name,
          timestamp: new Date().toISOString(),
          requestUrl: url,
          requestMethod: webhook.method,
          requestHeaders: headers,
          requestBody: body,
          responseStatus: 0,
          responseHeaders: {},
          responseBody: undefined,
          duration,
          success: false,
          error: errorMessage
        };
        
        setWebhookLogs([log, ...webhookLogs]);
        toast.error(`Webhook "${webhook.name}" failed: ${errorMessage}`);
      }
    }
  };
  
  // Clear test response
  const clearTestResponse = () => {
    setTestResponse(null);
  };
  
  // Create a new incoming webhook
  const createIncomingWebhook = (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWebhook: IncomingWebhook = {
      ...webhook,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setIncomingWebhooks([...incomingWebhooks, newWebhook]);
    toast.success(`Incoming webhook "${newWebhook.name}" created successfully`);
  };
  
  // Update an existing incoming webhook
  const updateIncomingWebhook = (webhook: IncomingWebhook) => {
    const updatedWebhooks = incomingWebhooks.map(w => 
      w.id === webhook.id ? { ...webhook, updatedAt: new Date().toISOString() } : w
    );
    
    setIncomingWebhooks(updatedWebhooks);
    toast.success(`Incoming webhook "${webhook.name}" updated successfully`);
  };
  
  // Delete an incoming webhook
  const deleteIncomingWebhook = (id: string) => {
    const webhook = incomingWebhooks.find(w => w.id === id);
    if (!webhook) return;
    
    setIncomingWebhooks(incomingWebhooks.filter(w => w.id !== id));
    toast.success(`Incoming webhook "${webhook.name}" deleted successfully`);
  };
  
  // Parse an incoming webhook log
  const parseIncomingWebhookLog = (log: IncomingWebhookLogEntry) => {
    try {
      let parsedData: string;
      
      if (log.requestBody) {
        // Try to parse as JSON
        try {
          const parsed = JSON.parse(log.requestBody);
          parsedData = JSON.stringify(parsed, null, 2);
        } catch {
          // If not JSON, use as is
          parsedData = log.requestBody;
        }
      } else if (log.requestQuery && Object.keys(log.requestQuery).length > 0) {
        // Use query parameters
        parsedData = JSON.stringify(log.requestQuery, null, 2);
      } else {
        parsedData = "No data to parse";
      }
      
      // Update the log with parsed data
      const updatedLogs = incomingWebhookLogs.map(l => 
        l.id === log.id ? { ...l, parsedData, isParsed: true } : l
      );
      
      setIncomingWebhookLogs(updatedLogs);
      toast.success("Data parsed successfully");
    } catch (error) {
      toast.error("Failed to parse data");
    }
  };

  const value = {
    // Outgoing webhooks
    webhooks,
    webhookLogs,
    selectedWebhook,
    isWebhookModalOpen,
    isTestMode,
    testResponse,
    
    // Actions for outgoing webhooks
    setWebhooks,
    setWebhookLogs,
    setSelectedWebhook,
    setIsWebhookModalOpen,
    setIsTestMode,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    executeWebhook,
    clearTestResponse,
    
    // Incoming webhooks
    incomingWebhooks,
    incomingWebhookLogs,
    selectedIncomingWebhook,
    isIncomingWebhookModalOpen,
    
    // Actions for incoming webhooks
    setIncomingWebhooks,
    setIncomingWebhookLogs,
    setSelectedIncomingWebhook,
    setIsIncomingWebhookModalOpen,
    createIncomingWebhook,
    updateIncomingWebhook,
    deleteIncomingWebhook,
    parseIncomingWebhookLog,
    
    // Shared
    searchQuery,
    setSearchQuery,
    filteredWebhookLogs,
    filteredIncomingWebhookLogs
  };

  return <WebhookContext.Provider value={value}>{children}</WebhookContext.Provider>;
};

export const useWebhookContext = (): WebhookContextType => {
  const context = useContext(WebhookContext);
  if (context === undefined) {
    throw new Error('useWebhookContext must be used within a WebhookProvider');
  }
  return context;
};
