
import { Webhook, WebhookHeader, WebhookUrlParam, WebhookBody, WebhookSchedule, WebhookLogEntry, IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook';

export interface WebhookContextType {
  webhooks: Webhook[];
  isWebhookModalOpen: boolean;
  setIsWebhookModalOpen: (isOpen: boolean) => void;
  selectedWebhook: Webhook | null;
  setSelectedWebhook: (webhook: Webhook | null) => void;
  editingWebhook: Webhook | null;
  setEditingWebhook: (webhook: Webhook | null) => void;
  isTestMode: boolean;
  setIsTestMode: (isTest: boolean) => void;
  testResponse: any;
  setTestResponse: (response: any) => void;
  isTestLoading: boolean;
  setIsTestLoading: (isLoading: boolean) => void;
  webhookLogs: WebhookLogEntry[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWebhook: (webhook: Webhook) => void;
  handleEditWebhook: (webhook: Webhook) => void;
  handleDeleteWebhook: (id: string) => void;
  executeWebhook: (webhook: Webhook, isTest?: boolean) => Promise<void>;
  clearTestResponse: () => void;
  sendTestRequest: (webhook: Webhook) => void;
  incomingWebhooks: IncomingWebhook[];
  isIncomingWebhookModalOpen: boolean;
  setIsIncomingWebhookModalOpen: (isOpen: boolean) => void;
  selectedIncomingWebhook: IncomingWebhook | null;
  setSelectedIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  editingIncomingWebhook: IncomingWebhook | null;
  setEditingIncomingWebhook: (webhook: IncomingWebhook | null) => void;
  incomingWebhookLogs: IncomingWebhookLogEntry[];
  createIncomingWebhook: (webhook: Omit<IncomingWebhook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleEditIncomingWebhook: (webhook: IncomingWebhook) => void;
  handleDeleteIncomingWebhook: (id: string) => void;
}
