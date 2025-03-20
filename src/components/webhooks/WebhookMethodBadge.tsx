
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HttpMethod } from '@/types/webhook';

interface WebhookMethodBadgeProps {
  method: HttpMethod;
}

const WebhookMethodBadge: React.FC<WebhookMethodBadgeProps> = ({ method }) => {
  let color;
  
  switch (method) {
    case 'GET':
      color = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'POST':
      color = 'bg-green-50 text-green-700 border-green-200';
      break;
    case 'PUT':
      color = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'DELETE':
      color = 'bg-red-50 text-red-700 border-red-200';
      break;
    case 'PATCH':
      color = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    default:
      color = 'bg-gray-50 text-gray-700 border-gray-200';
  }
  
  return (
    <Badge variant="outline" className={`font-mono ${color}`}>
      {method}
    </Badge>
  );
};

export default WebhookMethodBadge;
