
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { IncomingWebhook } from '@/types/webhook';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle,
  Check, 
  Clock, 
  Copy, 
  Edit, 
  Trash2, 
  X 
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface IncomingWebhookTableProps {
  compact?: boolean;
}

export const IncomingWebhookTable: React.FC<IncomingWebhookTableProps> = ({ compact = false }) => {
  const { 
    incomingWebhooks, 
    selectedIncomingWebhook, 
    setSelectedIncomingWebhook,
    handleEditIncomingWebhook,
    handleDeleteIncomingWebhook,
  } = useWebhookContext();

  const copyEndpointUrl = (path: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/api/webhooks/incoming/${path}`;
    navigator.clipboard.writeText(url);
    toast.success('Webhook URL copied to clipboard');
  };

  return (
    <div className="space-y-4">
      {incomingWebhooks.map((webhook) => (
        <Card 
          key={webhook.id}
          className={`${selectedIncomingWebhook?.id === webhook.id ? 'border-primary' : ''} transition-all hover:border-primary cursor-pointer`}
          onClick={() => setSelectedIncomingWebhook(webhook)}
        >
          <CardHeader className={`${compact ? 'py-3' : ''}`}>
            <div className="flex justify-between">
              <div>
                <CardTitle className={`${compact ? 'text-base' : ''}`}>{webhook.name}</CardTitle>
                <CardDescription className={`${compact ? 'text-xs' : ''} truncate max-w-xs`}>
                  {`/api/webhooks/incoming/${webhook.endpointPath}`}
                </CardDescription>
              </div>
              <Badge className={webhook.enabled ? "bg-green-500 hover:bg-green-600" : "bg-muted"}>
                {webhook.enabled ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              </Badge>
            </div>
          </CardHeader>
          {(!compact || selectedIncomingWebhook?.id === webhook.id) && (
            <CardContent>
              {webhook.description && (
                <p className="text-sm text-muted-foreground mb-2">{webhook.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> 
                  Created {format(new Date(webhook.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              
              {selectedIncomingWebhook?.id === webhook.id && (
                <div className="flex justify-between items-center mt-4">
                  <Button size="sm" variant="outline" onClick={() => copyEndpointUrl(webhook.endpointPath)}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy URL
                  </Button>

                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditIncomingWebhook(webhook)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteIncomingWebhook(webhook.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
      
      {incomingWebhooks.length === 0 && (
        <div className="text-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">No incoming webhooks found</h3>
          <p className="text-muted-foreground mt-1">Create a new incoming webhook to get started</p>
        </div>
      )}
    </div>
  );
};
