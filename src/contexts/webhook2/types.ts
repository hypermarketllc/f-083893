
// Add isCreating to the Webhook2ContextType
import { Webhook, WebhookLogEntry, WebhookTestResponse, IncomingWebhook, IncomingWebhookLogEntry, WebhookFilters } from '@/types/webhook2';

// Define missing UseWebhookOperationsParams interface
export interface UseWebhookOperationsParams {
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
  webhookLogs: WebhookLogEntry[];
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLogEntry[]>>;
  selectedWebhook: Webhook | null;
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>;
  setTestResponse: React.Dispatch<React.SetStateAction<WebhookLogEntry | null>>;
  setIsTestLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Webhook2ContextType {
  // State
  webhooks: Webhook[];
  webhookLogs: WebhookLogEntry[];
  incomingWebhooks: IncomingWebhook[];
  incomingWebhookLogs: IncomingWebhookLogEntry[];
  isLoading: boolean;
  isTestLoading: boolean;
  error: Error | null;
  selectedWebhook: Webhook | null;
  setSelectedWebhook: (webhook: Webhook | null) => void;
  selectedIncomingWebhook: IncomingWebhook | null;
  setSelectedIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  isWebhookModalOpen: boolean;
  setIsWebhookModalOpen: (isOpen: boolean) => void;
  isIncomingWebhookModalOpen: boolean;
  setIsIncomingWebhookModalOpen: (isOpen: boolean) => void;
  isTestMode: boolean;
  setIsTestMode: (isTestMode: boolean) => void;
  testResponse: WebhookLogEntry | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: WebhookFilters;
  setFilterOptions: (filters: Partial<WebhookFilters>) => void;
  
  // CRUD operations
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt' | 'lastExecutedAt' | 'lastExecutionStatus'>) => Promise<Webhook | null>;
  updateWebhook: (webhook: Webhook) => Promise<Webhook | null>;
  deleteWebhook: (id: string) => Promise<boolean>;
  
  // Execution operations
  executeWebhook: (webhook: Webhook) => Promise<WebhookLogEntry | null>;
  sendTestRequest: (webhook: Webhook) => Promise<WebhookTestResponse | null>;
  
  // Incoming webhook operations
  createIncomingWebhook: (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt' | 'lastCalledAt'>) => Promise<IncomingWebhook | null>;
  updateIncomingWebhook: (webhook: IncomingWebhook) => Promise<IncomingWebhook | null>;
  deleteIncomingWebhook: (id: string) => Promise<boolean>;
  
  // UI handlers
  handleEditWebhook: (webhook: Webhook) => void;
  handleDeleteWebhook: (webhook: Webhook) => Promise<void>;
  handleEditIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleDeleteIncomingWebhook: (webhook: IncomingWebhook) => Promise<void>;
  clearTestResponse: () => void;
  
  // Refresh functions
  refreshWebhooks: () => Promise<void>;
  refreshWebhookLogs: () => Promise<void>;
  
  // Loading state
  isCreating: boolean;
}
