
import React, { createContext, useContext } from 'react';
import { Webhook2ContextType } from './types';
import { useWebhookState } from './hooks/useWebhookState';
import { useWebhookOperations } from './hooks/useWebhookOperations';
import { useWebhookCrud } from './hooks/useWebhookCrud';
import { useWebhookDataSync } from './hooks/useWebhookDataSync';
import { mockIncomingWebhooks, mockIncomingWebhookLogs } from './data';
import { useAuth } from '@/hooks/auth';

const Webhook2Context = createContext<Webhook2ContextType | undefined>(undefined);

export const Webhook2Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  
  // Initialize state management
  const {
    webhooks, setWebhooks,
    webhookLogs, setWebhookLogs,
    incomingWebhooks, setIncomingWebhooks,
    incomingWebhookLogs, setIncomingWebhookLogs,
    isLoading, setIsLoading,
    isTestLoading, setIsTestLoading,
    error, setError,
    selectedWebhook, setSelectedWebhook,
    selectedIncomingWebhook, setSelectedIncomingWebhook,
    isWebhookModalOpen, setIsWebhookModalOpen,
    isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen,
    isTestMode, setIsTestMode,
    testResponse, setTestResponse,
    searchQuery, setSearchQuery,
    filterOptions, setFilterOptions
  } = useWebhookState({
    initialIncomingWebhooks: mockIncomingWebhooks,
    initialIncomingWebhookLogs: mockIncomingWebhookLogs
  });
  
  // Initialize webhook operations
  const { 
    executeWebhook, 
    clearTestResponse, 
    sendTestRequest 
  } = useWebhookOperations({
    webhooks,
    setWebhooks,
    webhookLogs,
    setWebhookLogs,
    selectedWebhook,
    setSelectedWebhook,
    setTestResponse,
    setIsTestLoading
  });
  
  // Initialize webhook CRUD operations
  const {
    createWebhook,
    updateWebhook,
    deleteWebhook,
    createIncomingWebhook,
    updateIncomingWebhook,
    deleteIncomingWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook,
    fetchWebhooks
  } = useWebhookCrud({
    webhooks,
    setWebhooks,
    selectedWebhook,
    setSelectedWebhook,
    incomingWebhooks,
    setIncomingWebhooks,
    selectedIncomingWebhook,
    setSelectedIncomingWebhook,
    setIsWebhookModalOpen,
    setIsIncomingWebhookModalOpen,
    setIsLoading,
    setIsTestMode
  });
  
  // Initialize webhook data sync
  const {
    refreshWebhookLogs
  } = useWebhookDataSync({
    webhooks,
    setWebhookLogs,
    setIsLoading,
    setError
  });
  
  // Load webhooks on component mount
  React.useEffect(() => {
    fetchWebhooks();
  }, [session]);

  // Load webhook logs on component mount
  React.useEffect(() => {
    if (webhooks.length > 0) {
      refreshWebhookLogs();
    }
  }, [webhooks.length]);

  return (
    <Webhook2Context.Provider
      value={{
        webhooks,
        webhookLogs,
        incomingWebhooks,
        incomingWebhookLogs,
        isLoading,
        isTestLoading,
        error,
        selectedWebhook,
        setSelectedWebhook,
        selectedIncomingWebhook,
        setSelectedIncomingWebhook,
        isWebhookModalOpen,
        setIsWebhookModalOpen,
        isIncomingWebhookModalOpen,
        setIsIncomingWebhookModalOpen,
        isTestMode,
        setIsTestMode,
        testResponse,
        searchQuery,
        setSearchQuery,
        filterOptions,
        setFilterOptions,
        createWebhook,
        updateWebhook,
        deleteWebhook,
        executeWebhook,
        sendTestRequest,
        createIncomingWebhook,
        updateIncomingWebhook,
        deleteIncomingWebhook,
        handleEditWebhook,
        handleDeleteWebhook,
        handleEditIncomingWebhook,
        handleDeleteIncomingWebhook,
        clearTestResponse,
        refreshWebhooks: fetchWebhooks,
        refreshWebhookLogs
      }}
    >
      {children}
    </Webhook2Context.Provider>
  );
};

export const useWebhook2Context = () => {
  const context = useContext(Webhook2Context);
  if (context === undefined) {
    throw new Error('useWebhook2Context must be used within a Webhook2Provider');
  }
  return context;
};
