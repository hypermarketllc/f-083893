
import React from 'react';
import { HttpMethod, WebhookTag } from '@/types/webhook';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TagsManager from '../tags/TagsManager';
import WebhookToggle from '../WebhookToggle';

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
  webhookTags?: string[];
  setWebhookTags?: (tags: string[]) => void;
  availableTags?: WebhookTag[];
  onTagCreate?: (tag: Omit<WebhookTag, 'id'>) => void;
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
  setWebhookEnabled,
  webhookTags = [],
  setWebhookTags = () => {},
  availableTags = [],
  onTagCreate
}) => {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    
    // Basic URL validation/formatting
    if (url && !url.match(/^https?:\/\//)) {
      if (url.startsWith('www.')) {
        url = 'https://' + url;
      } else if (!url.includes('://')) {
        url = 'https://' + url;
      }
    }
    
    setWebhookUrl(url);
  };

  return (
    <div className="space-y-4 py-4 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <Label htmlFor="webhook-name">Name</Label>
        <Input
          id="webhook-name"
          value={webhookName}
          onChange={(e) => setWebhookName(e.target.value)}
          placeholder="Enter webhook name"
          className="transition-all focus-visible:ring-primary/70"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="webhook-description">Description</Label>
        <Textarea
          id="webhook-description"
          value={webhookDescription}
          onChange={(e) => setWebhookDescription(e.target.value)}
          placeholder="Enter webhook description"
          className="transition-all focus-visible:ring-primary/70 min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagsManager
          tags={availableTags}
          selectedTags={webhookTags}
          onTagsChange={setWebhookTags}
          onTagCreate={onTagCreate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <Label htmlFor="webhook-method">Method</Label>
          <Select
            value={webhookMethod}
            onValueChange={(value) => setWebhookMethod(value as HttpMethod)}
          >
            <SelectTrigger id="webhook-method" className="transition-all">
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
            onChange={handleUrlChange}
            placeholder="https://example.com/api/endpoint"
            className="transition-all focus-visible:ring-primary/70"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter the full URL including the protocol (http:// or https://)
          </p>
        </div>
      </div>

      <div className="pt-2 flex items-center space-x-2">
        <WebhookToggle 
          enabled={webhookEnabled}
          onChange={setWebhookEnabled}
        />
      </div>
    </div>
  );
};
