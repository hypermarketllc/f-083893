
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { WebhookContextType } from './types';
import { 
  mockWebhooks, 
  mockWebhookLogs, 
  mockIncomingWebhooks, 
  mockIncomingWebhookLogs 
} from './data';
import { 
  useWebhookOperations, 
  useIncomingWebhookOperations 
} from './useWebhookOperations';
import { useWebhookSearch } from './hooks/useWebhookSearch';
import { useWebhookUIState } from './hooks/useWebhookUIState';
import { toast } from 'sonner';

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
  // Load saved webhooks from localStorage or use mocks
  const loadSavedWebhooks = () => {
    try {
      const saved = localStorage.getItem('webhooks');
      return saved ? JSON.parse(saved) : mockWebhooks;
    } catch (error) {
      console.error('Error loading webhooks:', error);
      return mockWebhooks;
    }
  };
  
  const loadSavedWebhookLogs = () => {
    try {
      const saved = localStorage.getItem('webhookLogs');
      return saved ? JSON.parse(saved) : mockWebhookLogs;
    } catch (error) {
      console.error('Error loading webhook logs:', error);
      return mockWebhookLogs;
    }
  };
  
  const loadSavedIncomingWebhooks = () => {
    try {
      const saved = localStorage.getItem('incomingWebhooks');
      return saved ? JSON.parse(saved) : mockIncomingWebhooks;
    } catch (error) {
      console.error('Error loading incoming webhooks:', error);
      return mockIncomingWebhooks;
    }
  };
  
  const loadSavedIncomingWebhookLogs = () => {
    try {
      const saved = localStorage.getItem('incomingWebhookLogs');
      return saved ? JSON.parse(saved) : mockIncomingWebhookLogs;
    } catch (error) {
      console.error('Error loading incoming webhook logs:', error);
      return mockIncomingWebhookLogs;
    }
  };
  
  // State for outgoing webhooks and logs
  const [webhooks, setWebhooks] = useState(loadSavedWebhooks());
  const [webhookLogs, setWebhookLogs] = useState(loadSavedWebhookLogs());
  
  // State for incoming webhooks and logs
  const [incomingWebhooks, setIncomingWebhooks] = useState(loadSavedIncomingWebhooks());
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState(loadSavedIncomingWebhookLogs());
  
  // Save webhooks to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('webhooks', JSON.stringify(webhooks));
    } catch (error) {
      console.error('Error saving webhooks:', error);
    }
  }, [webhooks]);
  
  // Save webhook logs to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('webhookLogs', JSON.stringify(webhookLogs));
    } catch (error) {
      console.error('Error saving webhook logs:', error);
    }
  }, [webhookLogs]);
  
  // Save incoming webhooks to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('incomingWebhooks', JSON.stringify(incomingWebhooks));
    } catch (error) {
      console.error('Error saving incoming webhooks:', error);
    }
  }, [incomingWebhooks]);
  
  // Save incoming webhook logs to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('incomingWebhookLogs', JSON.stringify(incomingWebhookLogs));
    } catch (error) {
      console.error('Error saving incoming webhook logs:', error);
    }
  }, [incomingWebhookLogs]);
  
  // UI state from custom hook
  const {
    isWebhookModalOpen,
    setIsWebhookModalOpen,
    isIncomingWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    selectedWebhook,
    setSelectedWebhook,
    selectedIncomingWebhook,
    setSelectedIncomingWebhook,
    editingWebhook,
    setEditingWebhook,
    editingIncomingWebhook,
    setEditingIncomingWebhook,
    isTestMode,
    setIsTestMode,
    testResponse,
    setTestResponse,
    isTestLoading,
    setIsTestLoading,
    searchQuery,
    setSearchQuery
  } = useWebhookUIState();

  // Search functionality
  const { filteredWebhookLogs, filteredIncomingWebhookLogs } = useWebhookSearch(
    webhookLogs,
    incomingWebhookLogs,
    searchQuery
  );

  // Webhook operations
  const {
    createWebhook,
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    executeWebhook,
    clearTestResponse,
    sendTestRequest
  } = useWebhookOperations(
    webhooks,
    setWebhooks,
    webhookLogs,
    setWebhookLogs,
    selectedWebhook,
    setSelectedWebhook,
    setIsWebhookModalOpen,
    setEditingWebhook,
    setTestResponse,
    setIsTestLoading
  );

  // Incoming webhook operations
  const {
    createIncomingWebhook,
    updateIncomingWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook
  } = useIncomingWebhookOperations(
    incomingWebhooks,
    setIncomingWebhooks,
    selectedIncomingWebhook,
    setSelectedIncomingWebhook,
    setIsIncomingWebhookModalOpen,
    setEditingIncomingWebhook
  );

  // Simulate incoming webhooks receiving data
  useEffect(() => {
    const simulateIncomingRequests = () => {
      // Only process active incoming webhooks
      const activeIncomingWebhooks = incomingWebhooks.filter(webhook => webhook.enabled);
      
      if (activeIncomingWebhooks.length === 0) return;
      
      // Randomly select an active webhook to receive a request
      const randomIndex = Math.floor(Math.random() * activeIncomingWebhooks.length);
      const webhook = activeIncomingWebhooks[randomIndex];
      
      // Create a new log entry for this incoming webhook
      const newLog = {
        id: `incoming-log-${Date.now()}`,
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp: new Date().toISOString(),
        requestHeaders: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'X-Request-ID': `req-${Math.random().toString(36).substring(2, 10)}`
        },
        requestMethod: 'POST',
        requestBody: JSON.stringify({
          event: 'data_update',
          timestamp: new Date().toISOString(),
          data: {
            id: Math.floor(Math.random() * 1000),
            status: 'active',
            value: Math.round(Math.random() * 100) / 10
          }
        }),
        isParsed: true,
        parsedData: JSON.stringify({ 
          event: 'data_update',
          parsedValue: Math.round(Math.random() * 100) / 10
        }),
        success: true,
        sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        contentType: 'application/json'
      };
      
      // Update the webhook's lastCalledAt field
      const updatedWebhooks = incomingWebhooks.map(w => 
        w.id === webhook.id 
          ? { ...w, lastCalledAt: new Date().toISOString() }
          : w
      );
      
      // Add the new log
      setIncomingWebhookLogs(prevLogs => [newLog, ...prevLogs]);
      
      // Update the webhooks
      setIncomingWebhooks(updatedWebhooks);
      
      // Show a notification if it's a selected webhook
      if (selectedIncomingWebhook?.id === webhook.id) {
        toast.info(`Incoming webhook "${webhook.name}" received a request`, {
          description: 'Check the logs for details'
        });
      }
    };
    
    // Set interval to simulate incoming requests randomly every 20-60 seconds
    const interval = setInterval(() => {
      // 20% chance of receiving a request each interval
      if (Math.random() < 0.2) {
        simulateIncomingRequests();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [incomingWebhooks, selectedIncomingWebhook]);

  const value: WebhookContextType = {
    // Outgoing webhooks
    webhooks,
    webhookLogs: filteredWebhookLogs,
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
    
    // Incoming webhooks
    incomingWebhooks,
    incomingWebhookLogs: filteredIncomingWebhookLogs,
    isIncomingWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    selectedIncomingWebhook,
    setSelectedIncomingWebhook,
    editingIncomingWebhook,
    setEditingIncomingWebhook,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Operations
    createWebhook,
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    executeWebhook,
    clearTestResponse,
    sendTestRequest,
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
