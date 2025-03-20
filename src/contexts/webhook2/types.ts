
// Add isCreating to the Webhook2ContextType
import { Webhook, WebhookLogEntry, WebhookTestResponse, IncomingWebhook, IncomingWebhookLogEntry, WebhookFilters } from '@/types/webhook2';

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
  testResponse: WebhookTestResponse | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: WebhookFilters;
  setFilterOptions: (filters: Partial<WebhookFilters>) => void;
  
  // CRUD operations
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt' | 'lastExecutedAt' | 'lastExecutionStatus'>) => Promise<Webhook | null>;
  updateWebhook: (webhook: Webhook) => Promise<Webhook | null>;
  deleteWebhook: (id: string) => Promise<boolean>;
  
  // Execution operations
  executeWebhook: (id: string) => Promise<WebhookLogEntry | null>;
  sendTestRequest: (webhook: Partial<Webhook>) => Promise<WebhookTestResponse | null>;
  
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
