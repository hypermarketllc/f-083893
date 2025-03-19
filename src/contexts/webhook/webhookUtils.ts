
import { WebhookBody } from '@/types/webhook';

// Helper to parse body content based on content type
export const parseBodyContent = (body: WebhookBody | undefined) => {
  if (!body) return null;
  
  try {
    switch (body.contentType) {
      case 'json':
        return JSON.parse(body.content);
      case 'form':
        const formData = new FormData();
        const formFields = JSON.parse(body.content);
        Object.entries(formFields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        return formData;
      case 'text':
      default:
        return body.content;
    }
  } catch (error) {
    console.error('Error parsing body content:', error);
    return body.content;
  }
};
