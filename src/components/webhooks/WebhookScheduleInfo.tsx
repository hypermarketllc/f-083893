
import React from 'react';
import { WebhookSchedule } from '@/types/webhook';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarDays, Repeat } from 'lucide-react';

interface WebhookScheduleInfoProps {
  schedule?: WebhookSchedule;
}

const WebhookScheduleInfo: React.FC<WebhookScheduleInfoProps> = ({ schedule }) => {
  if (!schedule) {
    return (
      <span className="text-xs text-muted-foreground">No schedule</span>
    );
  }

  let content;
  let icon;

  switch (schedule.type) {
    case 'daily':
      content = `Daily at ${schedule.time || '00:00'}`;
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case 'weekly':
      const days = schedule.days ? schedule.days.join(', ') : 'weekdays';
      content = `Weekly on ${days}`;
      icon = <CalendarDays className="h-3 w-3 mr-1" />;
      break;
    case 'interval':
      content = `Every ${schedule.interval || 30} minutes`;
      icon = <Repeat className="h-3 w-3 mr-1" />;
      break;
    default:
      content = 'Custom schedule';
      icon = <Clock className="h-3 w-3 mr-1" />;
  }

  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
      {icon}
      {content}
    </Badge>
  );
};

export default WebhookScheduleInfo;
