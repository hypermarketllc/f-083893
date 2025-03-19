
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HttpMethod } from '@/types/webhook';

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
    <div className="space-y-4 mt-4">
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

      <div className="space-y-2">
        <Label htmlFor="webhook-url">URL</Label>
        <Input
          id="webhook-url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="Enter webhook URL"
        />
      </div>

      <div className="space-y-2">
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

      <div className="flex items-center space-x-2 pt-2">
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
