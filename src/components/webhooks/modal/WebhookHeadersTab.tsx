
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { WebhookHeader } from '@/types/webhook';
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Headers</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addHeader}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Header
        </Button>
      </div>

      {webhookHeaders.length > 0 ? (
        <div className="space-y-2">
          {webhookHeaders.map((header) => (
            <div key={header.id} className="flex items-center space-x-2">
              <Switch
                id={`header-enabled-${header.id}`}
                checked={header.enabled}
                onCheckedChange={(checked) => updateHeader(header.id, 'enabled', checked)}
              />
              <Input
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                className="w-1/3"
              />
              <Input
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeHeader(header.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No headers defined yet. Click the button above to add one.
        </div>
      )}
    </div>
  );
};
