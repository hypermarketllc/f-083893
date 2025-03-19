
import { WebhookBody } from '@/types/webhook';

// Parse webhook body content based on content type
export const parseBodyContent = (body?: WebhookBody): string | object | undefined => {
  if (!body) return undefined;
  
  try {
    switch (body.contentType) {
      case 'json':
        return JSON.parse(body.content);
      case 'form':
        // Convert form data to URLSearchParams format
        const formData = new URLSearchParams();
        const formValues = JSON.parse(body.content);
        Object.entries(formValues).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        return formData.toString();
      case 'text':
      default:
        return body.content;
    }
  } catch (error) {
    console.error('Error parsing webhook body content:', error);
    return body.content; // Return as-is if parsing fails
  }
};

// Function to validate webhook URL
export const validateWebhookUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to generate a sample webhook response for testing
export const generateSampleResponse = (status: number = 200) => {
  return {
    status,
    headers: {
      'content-type': 'application/json',
      'x-response-time': '120ms'
    },
    body: JSON.stringify({
      success: status >= 200 && status < 300,
      message: status >= 200 && status < 300 ? 'Success' : 'Error',
      timestamp: new Date().toISOString(),
      data: {
        id: crypto.randomUUID(),
        sample: 'This is a sample response'
      }
    }),
    duration: Math.floor(Math.random() * 300) + 50 // Random duration between 50-350ms
  };
};
