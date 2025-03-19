
import { WebhookLogEntry, IncomingWebhookLogEntry } from '@/types/webhook';

export const useWebhookSearch = (
  webhookLogs: WebhookLogEntry[],
  incomingWebhookLogs: IncomingWebhookLogEntry[],
  searchQuery: string
) => {
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
        (log.parsedData && log.parsedData.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.sourceIp && log.sourceIp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.contentType && log.contentType.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : incomingWebhookLogs;

  return {
    filteredWebhookLogs,
    filteredIncomingWebhookLogs
  };
};
