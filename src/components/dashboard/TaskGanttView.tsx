
import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, differenceInDays } from 'date-fns';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaskGanttViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskGanttView: React.FC<TaskGanttViewProps> = ({ tasks, onTaskClick }) => {
  const [currentStartDate, setCurrentStartDate] = useState(startOfWeek(new Date()));
  const daysToShow = 14; // Two weeks

  // Generate array of dates for the columns
  const dateColumns = Array.from({ length: daysToShow }, (_, i) => 
    addDays(currentStartDate, i)
  );

  // Navigate to previous/next week
  const previousPeriod = () => setCurrentStartDate(addDays(currentStartDate, -daysToShow));
  const nextPeriod = () => setCurrentStartDate(addDays(currentStartDate, daysToShow));

  // Calculate position and width for task bars
  const calculateTaskBar = (task: Task) => {
    const taskDate = new Date(task.dueDate);
    // Default task duration in days (estimated from timeEstimate)
    let duration = 1;
    
    // Extract duration from timeEstimate (assumed format like "2h", "1d", etc.)
    if (task.timeEstimate) {
      const match = task.timeEstimate.match(/(\d+)([hd])/);
      if (match) {
        const [_, value, unit] = match;
        duration = unit === 'h' ? Math.max(1, Math.ceil(parseInt(value) / 8)) : parseInt(value);
      }
    }
    
    // Calculate start date (for simplicity, we'll use dueDate - duration)
    const startDate = addDays(taskDate, -duration + 1);
    
    // Calculate position relative to current view
    const startDayDiff = Math.max(0, differenceInDays(startDate, currentStartDate));
    const endDayDiff = Math.min(daysToShow - 1, differenceInDays(taskDate, currentStartDate));
    
    // Ensure task is visible in current view
    if (endDayDiff < 0 || startDayDiff >= daysToShow) {
      return null;
    }
    
    // Calculate width based on visible portion
    const visibleStartDay = Math.max(0, startDayDiff);
    const visibleEndDay = Math.max(0, endDayDiff);
    const width = ((visibleEndDay - visibleStartDay) + 1) * 100;
    
    return {
      left: `${visibleStartDay * 100 / daysToShow}%`,
      width: `${width / daysToShow}%`,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">
            Gantt Chart: {format(currentStartDate, 'MMM d, yyyy')} - {format(addDays(currentStartDate, daysToShow - 1), 'MMM d, yyyy')}
          </h3>
          <p className="text-sm text-muted-foreground">
            Visualize task timelines and dependencies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousPeriod}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextPeriod}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-auto">
        <CardContent className="p-0">
          <div className="min-w-[800px]">
            {/* Header with dates */}
            <div className="flex border-b">
              <div className="w-48 min-w-48 p-2 border-r bg-muted/50 font-medium">
                Task
              </div>
              <div className="flex-1 grid grid-cols-14">
                {dateColumns.map((date, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "p-2 text-center border-r text-xs font-medium",
                      format(date, 'iii') === 'Sat' || format(date, 'iii') === 'Sun' 
                        ? "bg-muted/30" 
                        : "bg-muted/10"
                    )}
                  >
                    <div>{format(date, 'E')}</div>
                    <div>{format(date, 'd')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task rows */}
            <div>
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks available in the selected date range
                </div>
              ) : (
                tasks.map(task => {
                  const taskBar = calculateTaskBar(task);
                  
                  return (
                    <div key={task.id} className="flex border-b hover:bg-accent/50">
                      <div 
                        className="w-48 min-w-48 p-2 border-r cursor-pointer"
                        onClick={() => onTaskClick(task)}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={cn(
                              "text-xs",
                              task.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                              task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                              task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            )}
                          >
                            {task.priority}
                          </Badge>
                          {task.timeEstimate && (
                            <div className="text-xs flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.timeEstimate}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Gantt bar area */}
                      <div className="flex-1 grid grid-cols-14 relative min-h-[60px]">
                        {taskBar && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "absolute top-2 h-8 rounded-md cursor-pointer",
                                    task.status === 'todo' ? 'bg-gray-200 border-gray-300' :
                                    task.status === 'in_progress' ? 'bg-blue-200 border-blue-300' :
                                    task.status === 'review' ? 'bg-yellow-200 border-yellow-300' :
                                    'bg-green-200 border-green-300',
                                  )}
                                  style={{
                                    left: taskBar.left,
                                    width: taskBar.width,
                                  }}
                                  onClick={() => onTaskClick(task)}
                                >
                                  <div className="px-2 py-1 text-xs truncate">
                                    {task.title}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1 p-1">
                                  <div className="font-medium">{task.title}</div>
                                  <div className="text-xs">Status: {task.status.replace('_', ' ')}</div>
                                  <div className="text-xs">Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</div>
                                  {task.timeEstimate && (
                                    <div className="text-xs">Estimate: {task.timeEstimate}</div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {/* Grid columns */}
                        {dateColumns.map((_, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              "border-r",
                              index % 2 === 0 ? "bg-muted/5" : "bg-white"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Task Legend */}
      <div className="flex items-center justify-center gap-4 pt-2 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
          <span>To Do</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-200 rounded-sm"></div>
          <span>Review</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
          <span>Done</span>
        </div>
      </div>
    </div>
  );
};

export default TaskGanttView;
