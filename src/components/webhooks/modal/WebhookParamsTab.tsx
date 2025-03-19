
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { WebhookUrlParam } from '@/types/webhook';
import { Plus, Trash2 } from 'lucide-react';

interface WebhookParamsTabProps {
  webhookUrlParams: WebhookUrlParam[];
  addUrlParam: () => void;
  updateUrlParam: (id: string, field: 'key' | 'value' | 'enabled', value: string | boolean) => void;
  removeUrlParam: (id: string) => void;
}

export const WebhookParamsTab: React.FC<WebhookParamsTabProps> = ({
  webhookUrlParams,
  addUrlParam,
  updateUrlParam,
  removeUrlParam
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">URL Parameters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addUrlParam}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Parameter
        </Button>
      </div>

      {webhookUrlParams.length > 0 ? (
        <div className="space-y-2">
          {webhookUrlParams.map((param) => (
            <div key={param.id} className="flex items-center space-x-2">
              <Switch
                id={`param-enabled-${param.id}`}
                checked={param.enabled}
                onCheckedChange={(checked) => updateUrlParam(param.id, 'enabled', checked)}
              />
              <Input
                placeholder="Key"
                value={param.key}
                onChange={(e) => updateUrlParam(param.id, 'key', e.target.value)}
                className="w-1/3"
              />
              <Input
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateUrlParam(param.id, 'value', e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeUrlParam(param.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No parameters defined yet. Click the button above to add one.
        </div>
      )}
    </div>
  );
};
