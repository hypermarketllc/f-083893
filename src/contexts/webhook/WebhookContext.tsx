
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
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState(mockWebhookLogs);
  const [searchQuery, setSearchQuery] = useState('');

  // Incoming Webhooks State
  const [incomingWebhooks, setIncomingWebhooks] = useState(mockIncomingWebhooks);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState(null);
  const [editingIncomingWebhook, setEditingIncomingWebhook] = useState(null);
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState(mockIncomingWebhookLogs);

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

  // Get webhook operations
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

  // Get incoming webhook operations
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
