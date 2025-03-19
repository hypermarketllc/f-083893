
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
  Eye,
  ExternalLink,
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

  const copyEndpointUrl = (path: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const url = getFullEndpointUrl(path);
    navigator.clipboard.writeText(url);
    toast.success('Webhook URL copied to clipboard');
  };

  const getFullEndpointUrl = (path: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/webhooks/incoming/${path}`;
  };

  const viewWebhookDetails = (webhook: IncomingWebhook) => {
    setSelectedIncomingWebhook(webhook);
  };

  return (
    <div className="space-y-4">
      {incomingWebhooks.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">No incoming webhooks found</h3>
          <p className="text-muted-foreground mt-1">Create a new incoming webhook to get started</p>
        </div>
      ) : (
        incomingWebhooks.map((webhook) => (
          <Card 
            key={webhook.id}
            className={`${selectedIncomingWebhook?.id === webhook.id ? 'border-primary' : ''} transition-all hover:border-primary cursor-pointer`}
            onClick={() => viewWebhookDetails(webhook)}
          >
            <CardHeader className={`${compact ? 'py-3' : ''}`}>
              <div className="flex justify-between">
                <div className="w-full">
                  <CardTitle className={`${compact ? 'text-base' : ''}`}>{webhook.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-2 w-full group">
                    <div className="relative w-full p-2 bg-background rounded border flex items-center justify-between overflow-hidden">
                      <code className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground font-mono block truncate pr-8`}>
                        {getFullEndpointUrl(webhook.endpointPath)}
                      </code>
                      <div className="absolute right-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6" 
                          onClick={(e) => copyEndpointUrl(webhook.endpointPath, e)}
                          title="Copy webhook URL"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className={webhook.enabled ? "bg-green-500 hover:bg-green-600" : "bg-destructive"}>
                  {webhook.enabled ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </Badge>
              </div>
            </CardHeader>
            
            {(!compact || selectedIncomingWebhook?.id === webhook.id) && (
              <CardContent className={compact ? 'py-3' : ''}>
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
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      copyEndpointUrl(webhook.endpointPath, e);
                    }}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy URL
                    </Button>

                    <div className="space-x-2">
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleEditIncomingWebhook(webhook);
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIncomingWebhook(webhook.id);
                      }}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
