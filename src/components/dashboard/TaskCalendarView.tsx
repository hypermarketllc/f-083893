
import React, { useState } from 'react';
import { format, isToday, isSameMonth, isWithinInterval, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TaskCalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Function to get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() && 
             taskDate.getMonth() === date.getMonth() && 
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  // Function to highlight dates with tasks
  const isDayWithTasks = (date: Date): boolean => {
    return tasks.some(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() && 
             taskDate.getMonth() === date.getMonth() && 
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  // Get all days in current month that have tasks
  const daysWithTasks = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  }).filter(date => isDayWithTasks(date));

  // Custom day renderer for calendar
  const renderDay = (day: Date) => {
    const tasksForDay = getTasksForDate(day);
    const hasTasks = tasksForDay.length > 0;
    
    return (
      <div className="relative w-full h-full">
        <div className={cn(
          "w-full h-full flex items-center justify-center",
          isToday(day) && "bg-primary text-primary-foreground rounded-full",
          !isToday(day) && hasTasks && "font-semibold"
        )}>
          {day.getDate()}
          {hasTasks && (
            <div className="absolute bottom-1 w-full flex justify-center">
              <div className="h-1 w-1 bg-primary rounded-full" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={new Date()}
          onMonthChange={setCurrentMonth}
          className="rounded-md border flex-1 max-w-3xl"
          components={{
            Day: ({ date, ...props }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <div {...props} className="w-full h-full flex items-center justify-center cursor-pointer">
                    {renderDay(date)}
                  </div>
                </PopoverTrigger>
                {getTasksForDate(date).length > 0 && (
                  <PopoverContent className="w-72 p-0" align="center">
                    <div className="p-4">
                      <div className="font-medium mb-2">
                        {format(date, 'PPP')}
                      </div>
                      <div className="space-y-2">
                        {getTasksForDate(date).map(task => (
                          <Card 
                            key={task.id} 
                            className="cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => onTaskClick(task)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{task.title}</div>
                                <Badge
                                  className={cn(
                                    task.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                    'bg-red-100 text-red-800'
                                  )}
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {task.timeEstimate}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            )
          }}
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-4">Upcoming Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysWithTasks.slice(0, 6).map(day => (
            <Card key={day.toString()} className="overflow-hidden">
              <div className="bg-primary p-2 text-primary-foreground font-medium">
                {format(day, 'EEEE, MMMM d')}
              </div>
              <CardContent className="p-0">
                <div className="divide-y">
                  {getTasksForDate(day).map(task => (
                    <div 
                      key={task.id} 
                      className="p-3 hover:bg-accent/50 cursor-pointer"
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{task.title}</div>
                        <Badge
                          className={cn(
                            task.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                            task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      {task.status !== 'done' && (
                        <div className="text-sm mt-1">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs",
                            task.status === 'todo' ? 'bg-gray-100' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          )}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCalendarView;
