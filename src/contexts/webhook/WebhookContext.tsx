
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  // State for outgoing webhooks and logs
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [webhookLogs, setWebhookLogs] = useState(mockWebhookLogs);
  
  // State for incoming webhooks and logs
  const [incomingWebhooks, setIncomingWebhooks] = useState(mockIncomingWebhooks);
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState(mockIncomingWebhookLogs);
  
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
