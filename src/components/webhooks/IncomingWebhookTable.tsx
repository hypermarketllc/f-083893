
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhook } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Copy, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { EmptyLogs } from './logs/EmptyLogs';

interface IncomingWebhookTableProps {
  compact?: boolean;
}

export const IncomingWebhookTable: React.FC<IncomingWebhookTableProps> = ({ compact }) => {
  const { 
    incomingWebhooks, 
    handleEditIncomingWebhook, 
    handleDeleteIncomingWebhook,
    setSelectedIncomingWebhook,
    selectedIncomingWebhook,
  } = useWebhookContext();
  
  const [copied, setCopied] = React.useState<string | null>(null);

  const baseUrl = window.location.origin;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const handleRowClick = (webhook: IncomingWebhook) => {
    setSelectedIncomingWebhook(webhook);
  };

  const copyToClipboard = (id: string, path: string) => {
    const fullUrl = `${baseUrl}/api/webhooks/${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(id);
    toast.success('Webhook URL copied to clipboard');
    
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  if (incomingWebhooks.length === 0) {
    return (
      <EmptyLogs message="No incoming webhooks found" />
    );
  }

  return (
    <div className={`border rounded-md ${compact ? 'overflow-hidden' : ''}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Endpoint URL</TableHead>
            {!compact && <TableHead className="hidden lg:table-cell">Created</TableHead>}
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomingWebhooks.map((webhook) => (
            <TableRow 
              key={webhook.id}
              onClick={() => handleRowClick(webhook)}
              className={`cursor-pointer hover:bg-muted ${selectedIncomingWebhook?.id === webhook.id ? 'bg-muted/50' : ''}`}
            >
              <TableCell className="font-medium">
                {webhook.name}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[300px]">
                    {baseUrl}/api/webhooks/{webhook.endpointPath}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(webhook.id, webhook.endpointPath);
                    }}
                  >
                    {copied === webhook.id ? (
                      <CheckCheck className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </TableCell>
              {!compact && (
                <TableCell className="hidden lg:table-cell">
                  {formatDate(webhook.createdAt)}
                </TableCell>
              )}
              <TableCell>
                <Badge variant={webhook.enabled ? 'outline' : 'secondary'}>
                  {webhook.enabled ? 'Active' : 'Disabled'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditIncomingWebhook(webhook);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteIncomingWebhook(webhook.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
