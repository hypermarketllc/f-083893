
import { Webhook, HttpMethod, IncomingWebhook } from '@/types/webhook2';

// Type guard to check if a value is a valid HttpMethod
export function isHttpMethod(value: string): value is HttpMethod {
  return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(value as HttpMethod);
}

// Type guard to check if an object is a Webhook
export function isWebhook(obj: any): obj is Webhook {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.url === 'string' &&
    isHttpMethod(obj.method)
  );
}

// Type guard to check if an object is an IncomingWebhook
export function isIncomingWebhook(obj: any): obj is IncomingWebhook {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.endpointPath === 'string'
  );
}
