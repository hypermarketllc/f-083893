
import React from 'react';
import { FolderX, RefreshCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No data found",
  message = "There is no data to display at this time.",
  actionLabel = "Create New",
  onAction,
  showRefresh = false,
  onRefresh,
  icon = <FolderX className="h-12 w-12 text-muted-foreground" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border rounded-md bg-muted/30">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {message}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {onAction && (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        {showRefresh && onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};
