
import { Webhook, WebhookLogEntry, WebhookTestResponse, WebhookFilters, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook2';

export interface Webhook2ContextType {
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
  setIsTestMode: (isTest: boolean) => void;
  testResponse: WebhookLogEntry | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: WebhookFilters;
  setFilterOptions: (filters: Partial<WebhookFilters>) => void;
  createWebhook: (webhookData: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Webhook | null>;
  updateWebhook: (webhook: Webhook) => Promise<Webhook | null>;
  deleteWebhook: (id: string) => Promise<void>;
  executeWebhook: (webhook: Webhook, isTest?: boolean) => Promise<WebhookTestResponse | null>;
  sendTestRequest: (webhook: Webhook) => Promise<WebhookTestResponse | null>;
  createIncomingWebhook: (webhookData: Partial<IncomingWebhook>) => Promise<IncomingWebhook | null>;
  updateIncomingWebhook: (webhook: IncomingWebhook) => Promise<IncomingWebhook | null>;
  deleteIncomingWebhook: (id: string) => Promise<void>;
  handleEditWebhook: (webhook: Webhook) => void;
  handleDeleteWebhook: (id: string) => void;
  handleEditIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleDeleteIncomingWebhook: (id: string) => void;
  clearTestResponse: () => void;
  refreshWebhooks: () => Promise<void>;
  refreshWebhookLogs: () => Promise<void>;
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
