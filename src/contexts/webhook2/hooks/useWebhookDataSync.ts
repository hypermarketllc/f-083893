
import { useEffect } from 'react';
import { WebhookLogEntry } from '@/types/webhook2';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { mapDbLogToWebhookLog } from '@/utils/mappers';
import { WebhookStateHookProps } from './useWebhookState';
import { v4 as uuidv4 } from 'uuid';

export interface WebhookDataSyncHookProps extends WebhookStateHookProps {
  webhooks: Array<{ id: string, name: string }>;
  setWebhookLogs: React.Dispatch<React.SetStateAction<WebhookLogEntry[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

export const useWebhookDataSync = ({
  webhooks,
  setWebhookLogs,
  setIsLoading,
  setError
}: WebhookDataSyncHookProps) => {

  const { user } = useAuth();

  // Create mock logs for non-authenticated state
  const createMockLogs = () => {
    if (webhooks.length === 0) return [];
    
    const mockLogs: WebhookLogEntry[] = [];
    const statuses = [200, 201, 400, 500];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    
    // Create 5 mock logs
    for (let i = 0; i < 5; i++) {
      const webhook = webhooks[Math.floor(Math.random() * webhooks.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const method = methods[Math.floor(Math.random() * methods.length)];
      const success = status < 300;
      const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString();
      
      mockLogs.push({
        id: `log-${uuidv4()}`,
        webhookId: webhook.id,
        webhookName: webhook.name,
        timestamp,
        requestUrl: `https://example.com/api/test/${i}`,
        requestMethod: method,
        requestHeaders: { 'Content-Type': 'application/json' },
        requestBody: JSON.stringify({ test: true }),
        responseStatus: status,
        responseHeaders: { 'Content-Type': 'application/json' },
        responseBody: JSON.stringify({ result: success ? 'success' : 'error' }),
        duration: Math.floor(Math.random() * 1000),
        success,
        error: success ? undefined : 'Mock error message',
        requestTime: timestamp,
        responseTime: new Date(new Date(timestamp).getTime() + Math.floor(Math.random() * 1000)).toISOString(),
        body: JSON.stringify({ result: success ? 'success' : 'error' }),
        requestQuery: {}
      });
    }
    
    return mockLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  // Fetch webhook logs
  const fetchWebhookLogs = async () => {
    try {
      setIsLoading(true);
      
      // If user is not logged in, use mock data
      if (!user) {
        const mockLogs = createMockLogs();
        setWebhookLogs(mockLogs);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error refreshing webhook logs:', error);
        toast.error(`Failed to refresh webhook logs: ${error.message}`);
        setError(new Error(`Error refreshing webhook logs: ${error.message}`));
        setIsLoading(false);
        return;
      }
      
      // Create a map of webhook IDs to names
      const webhookNames = new Map<string, string>();
      webhooks.forEach(webhook => {
        webhookNames.set(webhook.id, webhook.name);
      });
      
      // Convert DB logs to frontend models
      const mappedLogs = data?.map(log => 
        mapDbLogToWebhookLog(log, webhookNames.get(log.webhook_id))
      ) || [];
      
      setWebhookLogs(mappedLogs);
      setError(null);
    } catch (err) {
      console.error('Error refreshing webhook logs:', err);
      toast.error('Failed to refresh webhook logs');
      setError(err instanceof Error ? err : new Error('Failed to load webhook logs'));
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscriptions only if user is authenticated
  useEffect(() => {
    if (!user) return;

    // Subscribe to webhook changes
    const webhooksSubscription = supabase
      .channel('webhooks-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'webhooks' 
      }, () => {
        // Refresh webhooks on any change
        console.log('Webhook table changed, refreshing data...');
        // fetchWebhooks() would be called here, but it's passed as a prop
      })
      .subscribe();

    // Subscribe to webhook log changes
    const logsSubscription = supabase
      .channel('webhook-logs-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'webhook_logs' 
      }, () => {
        // Refresh logs on any new log
        console.log('Webhook logs changed, refreshing data...');
        fetchWebhookLogs();
      })
      .subscribe();

    return () => {
      webhooksSubscription.unsubscribe();
      logsSubscription.unsubscribe();
    };
  }, [user]);

  return {
    refreshWebhookLogs: fetchWebhookLogs
  };
};
