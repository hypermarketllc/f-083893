
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { useWebhook2Context } from '@/contexts/webhook2/Webhook2Context';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  showRefresh?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  showRefresh = false
}) => {
  const { refreshWebhooks } = useWebhook2Context();

  const handleRefresh = () => {
    refreshWebhooks();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border border-dashed">
      <div className="w-16 h-16 mb-4 text-muted-foreground flex items-center justify-center">
        {icon || <Plus className="h-10 w-10" />}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        {message}
      </p>
      <div className="flex gap-2">
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        {showRefresh && (
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};
