
import React from 'react';
import { useWebhookContext } from '@/contexts/webhook/WebhookContext';
import { Webhook } from '@/types/webhook';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
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
  Calendar, 
  Check, 
  Clock, 
  Edit, 
  ExternalLink,
  Eye, 
  Play,
  Trash2, 
  X,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface WebhookTableProps {
  compact?: boolean;
}

export const WebhookTable: React.FC<WebhookTableProps> = ({ compact = false }) => {
  const { 
    webhooks, 
    selectedWebhook, 
    setSelectedWebhook,
    handleEditWebhook,
    handleDeleteWebhook,
    isTestMode,
    setIsTestMode,
    sendTestRequest 
  } = useWebhookContext();

  const getScheduleInfo = (webhook: Webhook) => {
    if (!webhook.schedule) return null;
    
    switch (webhook.schedule.type) {
      case 'once':
        return <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {webhook.schedule.date}</span>;
      case 'daily':
        return <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> Daily at {webhook.schedule.time}</span>;
      case 'interval':
        return <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> Every {webhook.schedule.interval} minutes</span>;
      case 'weekly':
        return <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Weekly on {webhook.schedule.days?.join(', ')}</span>;
      case 'monthly':
        return <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Monthly on day {webhook.schedule.dayOfMonth}</span>;
      default:
        return null;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return <Badge>{method}</Badge>;
      case 'POST':
        return <Badge variant="secondary">{method}</Badge>;
      case 'PUT':
        return <Badge variant="destructive">{method}</Badge>;
      case 'DELETE':
        return <Badge variant="outline">{method}</Badge>;
      case 'PATCH':
        return <Badge className="bg-amber-500 hover:bg-amber-600">{method}</Badge>;
      default:
        return <Badge>{method}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => (
        <Card 
          key={webhook.id}
          className={`${selectedWebhook?.id === webhook.id ? 'border-primary' : ''} transition-all hover:border-primary cursor-pointer`}
          onClick={() => setSelectedWebhook(webhook)}
        >
          <CardHeader className={`${compact ? 'py-3' : ''}`}>
            <div className="flex justify-between">
              <div className="flex items-start space-x-2">
                {getMethodBadge(webhook.method)}
                <div>
                  <CardTitle className={`${compact ? 'text-base' : ''}`}>{webhook.name}</CardTitle>
                  <CardDescription className={`${compact ? 'text-xs' : ''} truncate max-w-xs md:max-w-md`}>
                    {webhook.url}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={webhook.enabled ? "default" : "outline"}>
                {webhook.enabled ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              </Badge>
            </div>
          </CardHeader>
          {(!compact || selectedWebhook?.id === webhook.id) && (
            <CardContent>
              {webhook.description && (
                <p className="text-sm text-muted-foreground mb-2">{webhook.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                {webhook.schedule && getScheduleInfo(webhook)}
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> 
                  Updated {format(new Date(webhook.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>
              
              {selectedWebhook?.id === webhook.id && (
                <div className="flex justify-between items-center mt-4">
                  <ToggleGroup type="single" value={isTestMode ? "test" : "live"}>
                    <ToggleGroupItem value="live" aria-label="Live Mode" onClick={() => setIsTestMode(false)}>
                      Live
                    </ToggleGroupItem>
                    <ToggleGroupItem value="test" aria-label="Test Mode" onClick={() => setIsTestMode(true)}>
                      Test
                    </ToggleGroupItem>
                  </ToggleGroup>

                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditWebhook(webhook)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteWebhook(webhook.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    {isTestMode && (
                      <Button size="sm" onClick={() => sendTestRequest(webhook)}>
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
      
      {webhooks.length === 0 && (
        <div className="text-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">No webhooks found</h3>
          <p className="text-muted-foreground mt-1">Create a new webhook to get started</p>
        </div>
      )}
    </div>
  );
};
