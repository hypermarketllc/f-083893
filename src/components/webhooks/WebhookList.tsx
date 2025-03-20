
import React, { useState, useEffect } from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { WebhookTable } from './WebhookTable';
import { EmptyLogs } from './EmptyLogs';
import { Skeleton } from '@/components/ui/skeleton';

export const WebhookList: React.FC = () => {
  const { webhooks, isLoading } = useWebhookContext();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Set initial load to false after a short delay to prevent flashing
    if (!isLoading && isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isInitialLoad]);

  if (isLoading || isInitialLoad) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="border rounded-md p-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (webhooks.length === 0) {
    return <EmptyLogs message="No webhooks found. Create your first webhook to get started." />;
  }

  return <WebhookTable />;
};
