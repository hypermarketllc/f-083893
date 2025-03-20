
import React from 'react';
import { WebhookSchedule } from '@/types/webhook';
import { Clock } from 'lucide-react';

interface WebhookScheduleInfoProps {
  schedule?: WebhookSchedule;
}

const WebhookScheduleInfo: React.FC<WebhookScheduleInfoProps> = ({ schedule }) => {
  if (!schedule) {
    return <span className="text-xs text-muted-foreground">Manual</span>;
  }

  let scheduleText = '';
  
  switch (schedule.type) {
    case 'daily':
      scheduleText = `Daily at ${schedule.time || '00:00'}`;
      break;
    case 'weekly':
      if (schedule.days && schedule.days.length > 0) {
        scheduleText = `Weekly on ${schedule.days.join(', ')}`;
      } else {
        scheduleText = 'Weekly';
      }
      break;
    case 'interval':
      if (schedule.interval) {
        scheduleText = `Every ${schedule.interval} min`;
      } else {
        scheduleText = 'At intervals';
      }
      break;
    default:
      scheduleText = 'Custom schedule';
  }
  
  return (
    <div className="flex items-center text-xs">
      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
      <span>{scheduleText}</span>
    </div>
  );
};

export default WebhookScheduleInfo;
