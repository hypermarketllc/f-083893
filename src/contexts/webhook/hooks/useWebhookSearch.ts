
import { WebhookLogEntry, IncomingWebhookLogEntry } from '@/types/webhook';
import { useMemo } from 'react';

export const useWebhookSearch = (
  webhookLogs: WebhookLogEntry[],
  incomingWebhookLogs: IncomingWebhookLogEntry[],
  searchQuery: string
) => {
  const filteredWebhookLogs = useMemo(() => {
    if (!searchQuery.trim()) return webhookLogs;
    
    const query = searchQuery.toLowerCase();
    return webhookLogs.filter(log => {
      return (
        (log.webhookName && log.webhookName.toLowerCase().includes(query)) ||
        (log.requestUrl && log.requestUrl.toLowerCase().includes(query)) ||
        (log.responseStatus && log.responseStatus.toString().includes(query)) ||
        (log.error && log.error.toLowerCase().includes(query))
      );
    });
  }, [webhookLogs, searchQuery]);

  const filteredIncomingWebhookLogs = useMemo(() => {
    if (!searchQuery.trim()) return incomingWebhookLogs;
    
    const query = searchQuery.toLowerCase();
    return incomingWebhookLogs.filter(log => {
      return (
        (log.webhookName && log.webhookName.toLowerCase().includes(query)) ||
        (log.requestMethod && log.requestMethod.toLowerCase().includes(query)) ||
        (log.sourceIp && log.sourceIp.toLowerCase().includes(query)) ||
        (log.contentType && log.contentType.toLowerCase().includes(query)) ||
        (log.error && log.error.toLowerCase().includes(query))
      );
    });
  }, [incomingWebhookLogs, searchQuery]);

  return {
    filteredWebhookLogs,
    filteredIncomingWebhookLogs
  };
};
