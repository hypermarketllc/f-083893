
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WebhookBody } from '@/types/webhook2';

interface Webhook2BodyTabProps {
  body: WebhookBody;
  setBody: React.Dispatch<React.SetStateAction<WebhookBody>>;
  method: string;
}

export const Webhook2BodyTab: React.FC<Webhook2BodyTabProps> = ({
  body,
  setBody,
  method
}) => {
  // Validate JSON
  const validateJson = () => {
    if (body.contentType !== 'json' || !body.content.trim()) {
      return true;
    }
    
    try {
      JSON.parse(body.content);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isValidJson = validateJson();

  // Format JSON
  const formatJson = () => {
    if (body.contentType !== 'json' || !body.content.trim()) {
      return;
    }
    
    try {
      const parsedJson = JSON.parse(body.content);
      setBody({...body, content: JSON.stringify(parsedJson, null, 2)});
    } catch (error) {
      // If it's not valid JSON, don't change anything
    }
  };

  // Show body inputs only for methods that support a body
  const showBody = !['GET', 'HEAD'].includes(method);

  return (
    <div className="space-y-4 py-4">
      {!showBody && (
        <div className="p-4 bg-muted/30 rounded-md text-center">
          <p className="text-muted-foreground">{method} requests don't typically include a body.</p>
        </div>
      )}
      
      {showBody && (
        <>
          <div className="space-y-2">
            <Label>Content Type</Label>
            <RadioGroup 
              value={body.contentType} 
              onValueChange={(value) => setBody({...body, contentType: value as 'json' | 'form' | 'text'})}
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
              {body.contentType === 'json' && (
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
              value={body.content}
              onChange={(e) => setBody({...body, content: e.target.value})}
              placeholder={body.contentType === 'json' ? '{ "key": "value" }' : body.contentType === 'form' ? 'key=value&other=data' : 'Enter body content'}
              className="font-mono h-60"
              style={{ 
                borderColor: body.contentType === 'json' && !isValidJson ? 'var(--destructive)' : undefined 
              }}
            />
            {body.contentType === 'json' && !isValidJson && (
              <p className="text-destructive text-xs">Invalid JSON format</p>
            )}
            <p className="text-xs text-muted-foreground">
              {body.contentType === 'json' 
                ? 'Enter a valid JSON object'
                : body.contentType === 'form'
                ? 'Enter form data in the format key=value&other=data'
                : 'Enter plain text content'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
