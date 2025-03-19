
import React from 'react';
import { WebhookUrlParam } from '@/types/webhook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
    <div className="space-y-4 py-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">URL Parameters</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addUrlParam}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Parameter
        </Button>
      </div>

      {webhookUrlParams.length > 0 ? (
        <div className="space-y-3">
          {webhookUrlParams.map((param) => (
            <div key={param.id} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  value={param.key}
                  onChange={(e) => updateUrlParam(param.id, 'key', e.target.value)}
                  placeholder="Parameter name"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={param.value}
                  onChange={(e) => updateUrlParam(param.id, 'value', e.target.value)}
                  placeholder="Parameter value"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={param.enabled}
                  onCheckedChange={(checked) => updateUrlParam(param.id, 'enabled', checked)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUrlParam(param.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border rounded-md bg-muted/40">
          <p className="text-muted-foreground">No URL parameters yet</p>
          <Button 
            type="button" 
            variant="link" 
            onClick={addUrlParam}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add your first parameter
          </Button>
        </div>
      )}
    </div>
  );
};
