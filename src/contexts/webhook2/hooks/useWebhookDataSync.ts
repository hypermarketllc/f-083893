
import { useEffect } from 'react';
import { WebhookLogEntry } from '@/types/webhook2';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { mapDbLogToWebhookLog } from '@/utils/mappers';
import { WebhookStateHookProps } from './useWebhookState';

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

  const { session } = useAuth();

  // Fetch webhook logs
  const fetchWebhookLogs = async () => {
    try {
      setIsLoading(true);
      
      if (!session) {
        setWebhookLogs([]);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) {
        throw new Error(`Error refreshing webhook logs: ${error.message}`);
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

  // Set up real-time subscriptions
  useEffect(() => {
    if (!session) return;

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
  }, [session]);

  return {
    refreshWebhookLogs: fetchWebhookLogs
  };
};
