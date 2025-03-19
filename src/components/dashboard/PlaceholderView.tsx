
import React from 'react';
import { Calendar, GanttChart } from 'lucide-react';

interface PlaceholderViewProps {
  type: 'calendar' | 'gantt';
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ type }) => {
  const Icon = type === 'calendar' ? Calendar : GanttChart;
  const title = type === 'calendar' ? 'Calendar View' : 'Gantt View';
  
  return (
    <div className="flex items-center justify-center h-96 border rounded-md">
      <div className="text-center">
        <Icon className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-2 font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {title} is coming soon
        </p>
      </div>
    </div>
  );
};

export default PlaceholderView;
