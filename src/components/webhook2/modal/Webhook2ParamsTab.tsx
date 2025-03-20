
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { WebhookParam } from '@/types/webhook2';

interface Webhook2ParamsTabProps {
  params: WebhookParam[];
  setParams: React.Dispatch<React.SetStateAction<WebhookParam[]>>;
}

export const Webhook2ParamsTab: React.FC<Webhook2ParamsTabProps> = ({
  params,
  setParams
}) => {
  const addParam = () => {
    setParams([...params, { id: uuidv4(), key: '', value: '', enabled: true }]);
  };

  const updateParam = (id: string, field: keyof Omit<WebhookParam, 'id'>, value: string | boolean) => {
    setParams(params.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeParam = (id: string) => {
    setParams(params.filter(param => param.id !== id));
  };

  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">URL Parameters</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addParam}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Parameter
        </Button>
      </div>

      {params.length > 0 ? (
        <div className="space-y-3">
          {params.map((param) => (
            <div key={param.id} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  value={param.key}
                  onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                  placeholder="Parameter name"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={param.value}
                  onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                  placeholder="Parameter value"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={param.enabled}
                  onCheckedChange={(checked) => updateParam(param.id, 'enabled', checked)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeParam(param.id)}
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
            onClick={addParam}
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
