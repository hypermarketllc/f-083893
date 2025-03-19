
import React from 'react';
import { WebhookHeader } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';

interface WebhookHeadersTabProps {
  webhookHeaders: WebhookHeader[];
  addHeader: () => void;
  updateHeader: (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => void;
  removeHeader: (id: string) => void;
}

export const WebhookHeadersTab: React.FC<WebhookHeadersTabProps> = ({
  webhookHeaders,
  addHeader,
  updateHeader,
  removeHeader
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Headers</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addHeader}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Header
        </Button>
      </div>

      {webhookHeaders.length > 0 ? (
        <div className="space-y-3">
          {webhookHeaders.map((header) => (
            <div key={header.id} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  value={header.key}
                  onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                  placeholder="Header name"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={header.value}
                  onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                  placeholder="Header value"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={header.enabled}
                  onCheckedChange={(checked) => updateHeader(header.id, 'enabled', checked)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHeader(header.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border rounded-md bg-muted/40">
          <p className="text-muted-foreground">No headers yet</p>
          <Button 
            type="button" 
            variant="link" 
            onClick={addHeader}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add your first header
          </Button>
        </div>
      )}
    </div>
  );
};
