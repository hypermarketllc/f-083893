
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
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Copy
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export const IncomingWebhookTable: React.FC = () => {
  const { 
    incomingWebhooks, 
    setSelectedIncomingWebhook, 
    setIsIncomingWebhookModalOpen,
    deleteIncomingWebhook
  } = useWebhookContext();

  const handleEdit = (webhook: typeof incomingWebhooks[0]) => {
    setSelectedIncomingWebhook(webhook);
    setIsIncomingWebhookModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      deleteIncomingWebhook(id);
    }
  };

  const handleCopyEndpoint = (path: string) => {
    // In a real app, this would concatenate the base URL
    const fullUrl = `https://your-app.com/api${path}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomingWebhooks.length > 0 ? (
            incomingWebhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell>
                  <div className="font-medium">{webhook.name}</div>
                  <div className="text-xs text-muted-foreground">{webhook.description}</div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="flex items-center space-x-2">
                    <span className="truncate">{webhook.endpointPath}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleCopyEndpoint(webhook.endpointPath)}
                      title="Copy endpoint URL"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
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
              <TableCell colSpan={5} className="text-center">
                No incoming webhooks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
