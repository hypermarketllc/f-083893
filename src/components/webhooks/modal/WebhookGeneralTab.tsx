
import React from 'react';
import { HttpMethod } from '@/types/webhook';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface WebhookGeneralTabProps {
  webhookName: string;
  setWebhookName: (name: string) => void;
  webhookDescription: string;
  setWebhookDescription: (description: string) => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  webhookMethod: HttpMethod;
  setWebhookMethod: (method: HttpMethod) => void;
  webhookEnabled: boolean;
  setWebhookEnabled: (enabled: boolean) => void;
}

export const WebhookGeneralTab: React.FC<WebhookGeneralTabProps> = ({
  webhookName,
  setWebhookName,
  webhookDescription,
  setWebhookDescription,
  webhookUrl,
  setWebhookUrl,
  webhookMethod,
  setWebhookMethod,
  webhookEnabled,
  setWebhookEnabled
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-name">Name</Label>
        <Input
          id="webhook-name"
          value={webhookName}
          onChange={(e) => setWebhookName(e.target.value)}
          placeholder="Enter webhook name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="webhook-description">Description</Label>
        <Textarea
          id="webhook-description"
          value={webhookDescription}
          onChange={(e) => setWebhookDescription(e.target.value)}
          placeholder="Enter webhook description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <Label htmlFor="webhook-method">Method</Label>
          <Select
            value={webhookMethod}
            onValueChange={(value) => setWebhookMethod(value as HttpMethod)}
          >
            <SelectTrigger id="webhook-method">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-4">
          <Label htmlFor="webhook-url">URL</Label>
          <Input
            id="webhook-url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://example.com/api/endpoint"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center space-x-2">
        <Switch
          id="webhook-enabled"
          checked={webhookEnabled}
          onCheckedChange={setWebhookEnabled}
        />
        <Label htmlFor="webhook-enabled">Enabled</Label>
      </div>
    </div>
  );
};
