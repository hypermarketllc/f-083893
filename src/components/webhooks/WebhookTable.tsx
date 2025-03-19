
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Play, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const WebhookTable: React.FC = () => {
  const { 
    webhooks, 
    setSelectedWebhook, 
    setIsWebhookModalOpen,
    executeWebhook,
    deleteWebhook,
    setIsTestMode
  } = useWebhookContext();

  const handleEdit = (webhook: typeof webhooks[0]) => {
    setSelectedWebhook(webhook);
    setIsWebhookModalOpen(true);
  };

  const handleExecute = async (webhook: typeof webhooks[0]) => {
    setIsTestMode(false);
    await executeWebhook(webhook, false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      deleteWebhook(id);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.length > 0 ? (
            webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell>
                  <div className="font-medium">{webhook.name}</div>
                  <div className="text-xs text-muted-foreground">{webhook.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    webhook.method === 'GET' ? 'default' :
                    webhook.method === 'POST' ? 'destructive' :
                    webhook.method === 'PUT' ? 'warning' :
                    webhook.method === 'DELETE' ? 'outline' : 'secondary'
                  }>
                    {webhook.method}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{webhook.url}</TableCell>
                <TableCell>
                  {webhook.enabled ? (
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" /> Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      <XCircle className="mr-1 h-3 w-3" /> Disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(webhook.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEdit(webhook)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleExecute(webhook)}
                      title="Execute"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(webhook.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No webhooks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
