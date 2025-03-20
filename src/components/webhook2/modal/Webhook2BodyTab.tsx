
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { WebhookBody, HttpMethod } from '@/types/webhook2';

interface Webhook2BodyTabProps {
  body: WebhookBody;
  setBody: React.Dispatch<React.SetStateAction<WebhookBody>>;
  method: HttpMethod;
}

export const Webhook2BodyTab: React.FC<Webhook2BodyTabProps> = ({
  body,
  setBody,
  method
}) => {
  // Don't show body tab for GET requests
  if (method === 'GET') {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">
          GET requests do not support request bodies.
        </p>
      </div>
    );
  }

  const handleContentTypeChange = (value: 'json' | 'form' | 'text') => {
    let newContent = body.content;

    // Format content based on the new content type
    if (value === 'json' && body.contentType !== 'json') {
      try {
        // Try to parse as JSON if it's not already
        if (body.content.trim()) {
          // For form data, convert to JSON
          if (body.contentType === 'form') {
            const formData = new URLSearchParams(body.content);
            const jsonObj: Record<string, string> = {};
            
            formData.forEach((value, key) => {
              jsonObj[key] = value;
            });
            
            newContent = JSON.stringify(jsonObj, null, 2);
          } else {
            // If it's plain text, try to parse as JSON or create new JSON
            try {
              const parsed = JSON.parse(body.content);
              newContent = JSON.stringify(parsed, null, 2);
            } catch {
              newContent = JSON.stringify({ data: body.content }, null, 2);
            }
          }
        } else {
          newContent = "{\n  \n}";
        }
      } catch {
        newContent = "{\n  \n}";
      }
    } else if (value === 'form' && body.contentType !== 'form') {
      try {
        if (body.content.trim()) {
          if (body.contentType === 'json') {
            try {
              // Convert JSON to form data
              const jsonObj = JSON.parse(body.content);
              const params = new URLSearchParams();
              
              Object.entries(jsonObj).forEach(([key, value]) => {
                params.append(key, String(value));
              });
              
              newContent = params.toString();
            } catch {
              newContent = '';
            }
          }
        } else {
          newContent = '';
        }
      } catch {
        newContent = '';
      }
    }

    setBody({
      contentType: value,
      content: newContent,
      type: value // For compatibility
    });
  };

  const handleContentChange = (content: string) => {
    setBody({ ...body, content });
  };

  const getPlaceholder = () => {
    switch (body.contentType) {
      case 'json':
        return '{\n  "key": "value"\n}';
      case 'form':
        return 'key1=value1&key2=value2';
      case 'text':
        return 'Plain text content';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Content Type</Label>
        <RadioGroup
          value={body.contentType}
          onValueChange={(value) => handleContentTypeChange(value as 'json' | 'form' | 'text')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json" className="cursor-pointer">JSON</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="form" id="form" />
            <Label htmlFor="form" className="cursor-pointer">Form URL-encoded</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text" className="cursor-pointer">Text</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Request Body</Label>
        <Textarea
          value={body.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={getPlaceholder()}
          className="font-mono text-sm"
          rows={10}
        />
      </div>

      {body.contentType === 'json' && (
        <div className="text-xs text-muted-foreground">
          <p>Tip: Use valid JSON format with double quotes around property names.</p>
        </div>
      )}
    </div>
  );
};
