
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WebhookContextType } from './types';
import { 
  mockWebhooks, 
  mockWebhookLogs, 
  mockIncomingWebhooks, 
  mockIncomingWebhookLogs 
} from './mockData';
import { 
  useWebhookOperations, 
  useIncomingWebhookOperations 
} from './useWebhookOperations';
import { useWebhookSearch } from './hooks/useWebhookSearch';

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
  // State for outgoing webhooks
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [webhookLogs, setWebhookLogs] = useState(mockWebhookLogs);
  
  // State for incoming webhooks
  const [incomingWebhooks, setIncomingWebhooks] = useState(mockIncomingWebhooks);
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState(mockIncomingWebhookLogs);
  
  // UI state
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState(null);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [editingIncomingWebhook, setEditingIncomingWebhook] = useState(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
