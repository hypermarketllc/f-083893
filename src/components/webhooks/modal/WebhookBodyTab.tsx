
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code } from 'lucide-react';

interface WebhookBodyTabProps {
  webhookBody: string;
  setWebhookBody: (body: string) => void;
  webhookContentType: 'json' | 'form' | 'text';
  setWebhookContentType: (contentType: 'json' | 'form' | 'text') => void;
}

export const WebhookBodyTab: React.FC<WebhookBodyTabProps> = ({
  webhookBody = '',  // Default empty string if undefined
  setWebhookBody,
  webhookContentType = 'json',  // Default to JSON if undefined
  setWebhookContentType
}) => {
  // Safe setters with validation
  const handleSetBody = (body: string) => {
    setWebhookBody(body || '');
  };

  const handleSetContentType = (contentType: string) => {
    setWebhookContentType((contentType as 'json' | 'form' | 'text') || 'json');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-content-type">Content Type</Label>
        <Select
          value={webhookContentType}
          onValueChange={handleSetContentType}
        >
          <SelectTrigger id="webhook-content-type">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">application/json</SelectItem>
            <SelectItem value="form">application/x-www-form-urlencoded</SelectItem>
            <SelectItem value="text">text/plain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="webhook-body">Body</Label>
          <Code className="h-4 w-4 text-muted-foreground" />
        </div>
        <Textarea
          id="webhook-body"
          value={webhookBody}
          onChange={(e) => handleSetBody(e.target.value)}
          placeholder={
            webhookContentType === 'json'
              ? '{\n  "key": "value"\n}'
              : webhookContentType === 'form'
              ? 'key1=value1&key2=value2'
              : 'Enter plain text body'
          }
          className="font-mono text-sm min-h-[200px]"
        />
      </div>
    </div>
  );
};
