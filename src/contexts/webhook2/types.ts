
import { 
  Webhook, 
  WebhookHeader, 
  WebhookParam, 
  WebhookBody, 
  WebhookSchedule, 
  WebhookLogEntry, 
  IncomingWebhook, 
  IncomingWebhookLogEntry, 
  WebhookTestResponse,
  WebhookFilters
} from '@/types/webhook2';

export interface Webhook2ContextType {
  // State
  webhooks: Webhook[];
  isLoading: boolean;
  error: Error | null;
  webhookLogs: WebhookLogEntry[];
  incomingWebhooks: IncomingWebhook[];
  incomingWebhookLogs: IncomingWebhookLogEntry[];
  
  // Modal Controls
  isWebhookModalOpen: boolean;
  setIsWebhookModalOpen: (isOpen: boolean) => void;
  isIncomingWebhookModalOpen: boolean;
  setIsIncomingWebhookModalOpen: (isOpen: boolean) => void;
  
  // Selected Items
  selectedWebhook: Webhook | null;
  setSelectedWebhook: (webhook: Webhook | null) => void;
  selectedIncomingWebhook: IncomingWebhook | null;
  setSelectedIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  
  // Test Mode
  isTestMode: boolean;
  setIsTestMode: (isTest: boolean) => void;
  isTestLoading: boolean;
  testResponse: WebhookLogEntry | null;
  
  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: WebhookFilters;
  setFilterOptions: (filters: Partial<WebhookFilters>) => void;
  
  // CRUD Operations
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Webhook | null>;
  updateWebhook: (webhook: Webhook) => Promise<Webhook | null>;
  deleteWebhook: (id: string) => Promise<void>;
  executeWebhook: (webhook: Webhook, isTest?: boolean) => Promise<WebhookTestResponse | null>;
  
  createIncomingWebhook: (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => Promise<IncomingWebhook | null>;
  updateIncomingWebhook: (webhook: IncomingWebhook) => Promise<IncomingWebhook | null>;
  deleteIncomingWebhook: (id: string) => Promise<void>;
  
  // UI Operations
  handleEditWebhook: (webhook: Webhook) => void;
  handleDeleteWebhook: (id: string) => void;
  handleEditIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleDeleteIncomingWebhook: (id: string) => void;
  clearTestResponse: () => void;
  sendTestRequest: (webhook: Webhook) => Promise<WebhookTestResponse | null>;
  
  // Utility Methods
  refreshWebhooks: () => void;
  refreshWebhookLogs: () => void;
}

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
