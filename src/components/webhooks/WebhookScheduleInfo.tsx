
import React from 'react';
import { WebhookSchedule } from '@/types/webhook';
import { Calendar, Clock } from 'lucide-react';

interface WebhookScheduleInfoProps {
  schedule?: WebhookSchedule;
}

const WebhookScheduleInfo: React.FC<WebhookScheduleInfoProps> = ({ schedule }) => {
  if (!schedule) return null;
  
  switch (schedule.type) {
    case 'once':
      return <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {schedule.date}</span>;
    case 'daily':
      return <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> Daily at {schedule.time}</span>;
    case 'interval':
      return <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> Every {schedule.interval} minutes</span>;
    case 'weekly':
      return <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Weekly on {schedule.days?.join(', ')}</span>;
    case 'monthly':
      return <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Monthly on day {schedule.dayOfMonth}</span>;
    default:
      return null;
  }
};

export default WebhookScheduleInfo;
