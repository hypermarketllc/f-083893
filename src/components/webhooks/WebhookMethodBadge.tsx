
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WebhookMethodBadgeProps {
  method: string;
}

const WebhookMethodBadge: React.FC<WebhookMethodBadgeProps> = ({ method }) => {
  switch (method) {
    case 'GET':
      return <Badge>{method}</Badge>;
    case 'POST':
      return <Badge variant="secondary">{method}</Badge>;
    case 'PUT':
      return <Badge variant="destructive">{method}</Badge>;
    case 'DELETE':
      return <Badge variant="outline">{method}</Badge>;
    case 'PATCH':
      return <Badge className="bg-amber-500 hover:bg-amber-600">{method}</Badge>;
    default:
      return <Badge>{method}</Badge>;
  }
};

export default WebhookMethodBadge;
