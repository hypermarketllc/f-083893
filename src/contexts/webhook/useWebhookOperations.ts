
import { Webhook, WebhookLogEntry, IncomingWebhook } from '@/types/webhook';
import { useCreateWebhook } from './operations/useCreateWebhook';
import { useUpdateWebhook } from './operations/useUpdateWebhook';
import { useExecuteWebhook } from './operations/useExecuteWebhook';
import { useIncomingWebhookOperations } from './operations/useIncomingWebhookOperations';

export function useWebhookOperations(
  webhooks: Webhook[],
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>,
  webhookLogs: WebhookLogEntry[],
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLogEntry[]>>,
  selectedWebhook: Webhook | null,
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setIsWebhookModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>,
  setTestResponse: React.Dispatch<React.SetStateAction<any>>,
  setIsTestLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { createWebhook } = useCreateWebhook(
    webhooks,
    setWebhooks,
    setIsWebhookModalOpen
  );

  const { 
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook
  } = useUpdateWebhook(
    setWebhooks,
    setSelectedWebhook,
    setIsWebhookModalOpen,
    setEditingWebhook
  );

  const {
    executeWebhook,
    clearTestResponse,
    sendTestRequest
  } = useExecuteWebhook(
    webhookLogs,
    setWebhookLogs,
    setTestResponse,
    setIsTestLoading
  );

  return {
    createWebhook,
    updateWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    executeWebhook,
    clearTestResponse,
    sendTestRequest
  };
}

export { useIncomingWebhookOperations };
