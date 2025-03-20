
import { useState } from 'react';
import { Webhook, WebhookLogEntry, IncomingWebhook, IncomingWebhookLogEntry, WebhookFilters } from '@/types/webhook2';

export interface WebhookStateHookProps {
  initialWebhooks?: Webhook[];
  initialWebhookLogs?: WebhookLogEntry[];
  initialIncomingWebhooks?: IncomingWebhook[];
  initialIncomingWebhookLogs?: IncomingWebhookLogEntry[];
}

export const useWebhookState = ({
  initialWebhooks = [],
  initialWebhookLogs = [],
  initialIncomingWebhooks = [],
  initialIncomingWebhookLogs = []
}: WebhookStateHookProps) => {
  // Main data state
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogEntry[]>(initialWebhookLogs);
  const [incomingWebhooks, setIncomingWebhooks] = useState<IncomingWebhook[]>(initialIncomingWebhooks);
  const [incomingWebhookLogs, setIncomingWebhookLogs] = useState<IncomingWebhookLogEntry[]>(initialIncomingWebhookLogs);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Selection states
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedIncomingWebhook, setSelectedIncomingWebhook] = useState<IncomingWebhook | null>(null);

  // UI states
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isIncomingWebhookModalOpen, setIsIncomingWebhookModalOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResponse, setTestResponse] = useState<WebhookLogEntry | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<WebhookFilters>({
    search: '',
    method: null,
    status: null,
    tags: []
  });

  const handleFilterOptionsChange = (filters: Partial<WebhookFilters>) => {
    setFilterOptions(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
  };

  return {
    // Data
    webhooks, 
    setWebhooks,
    webhookLogs, 
    setWebhookLogs,
    incomingWebhooks, 
    setIncomingWebhooks,
    incomingWebhookLogs, 
    setIncomingWebhookLogs,
    
    // Loading/error states
    isLoading, 
    setIsLoading,
    isTestLoading, 
    setIsTestLoading,
    error, 
    setError,
    
    // Selection
    selectedWebhook, 
    setSelectedWebhook,
    selectedIncomingWebhook, 
    setSelectedIncomingWebhook,
    
    // UI states
    isWebhookModalOpen, 
    setIsWebhookModalOpen,
    isIncomingWebhookModalOpen, 
    setIsIncomingWebhookModalOpen,
    isTestMode, 
    setIsTestMode,
    testResponse, 
    setTestResponse,
    
    // Filters
    searchQuery, 
    setSearchQuery,
    filterOptions,
    setFilterOptions: handleFilterOptionsChange
  };
};
