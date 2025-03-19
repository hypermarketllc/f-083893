
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface WebhookBodyTabProps {
  webhookBody: string;
  setWebhookBody: (body: string) => void;
  webhookContentType: 'json' | 'form' | 'text';
  setWebhookContentType: (contentType: 'json' | 'form' | 'text') => void;
}

export const WebhookBodyTab: React.FC<WebhookBodyTabProps> = ({
  webhookBody,
  setWebhookBody,
  webhookContentType,
  setWebhookContentType
}) => {
  // Validate JSON
  const validateJson = () => {
    if (webhookContentType !== 'json' || !webhookBody.trim()) {
      return true;
    }
    
    try {
      JSON.parse(webhookBody);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isValidJson = validateJson();

  // Format JSON
  const formatJson = () => {
    if (webhookContentType !== 'json' || !webhookBody.trim()) {
      return;
    }
    
    try {
      const parsedJson = JSON.parse(webhookBody);
      setWebhookBody(JSON.stringify(parsedJson, null, 2));
    } catch (error) {
      // If it's not valid JSON, don't change anything
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Content Type</Label>
        <RadioGroup 
          value={webhookContentType} 
          onValueChange={(value) => setWebhookContentType(value as 'json' | 'form' | 'text')}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json">JSON</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="form" id="form" />
            <Label htmlFor="form">Form Data</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text">Plain Text</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="webhook-body">Body</Label>
          {webhookContentType === 'json' && (
            <button
              type="button"
              onClick={formatJson}
              className="text-xs text-primary hover:underline"
            >
              Format JSON
            </button>
          )}
        </div>
        <Textarea
          id="webhook-body"
          value={webhookBody}
          onChange={(e) => setWebhookBody(e.target.value)}
          placeholder={webhookContentType === 'json' ? '{ "key": "value" }' : webhookContentType === 'form' ? 'key=value&other=data' : 'Enter body content'}
          className="font-mono h-60"
          style={{ 
            borderColor: webhookContentType === 'json' && !isValidJson ? 'var(--destructive)' : undefined 
          }}
        />
        {webhookContentType === 'json' && !isValidJson && (
          <p className="text-destructive text-xs">Invalid JSON format</p>
        )}
        <p className="text-xs text-muted-foreground">
          {webhookContentType === 'json' 
            ? 'Enter a valid JSON object'
            : webhookContentType === 'form'
            ? 'Enter form data in the format key=value&other=data'
            : 'Enter plain text content'}
        </p>
      </div>
    </div>
  );
};
