
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, ListChecks, Layout, Calendar, GanttChart } from 'lucide-react';
import TaskListView from './TaskListView';
import TaskBoardView from './TaskBoardView';
import TaskCalendarView from './TaskCalendarView';
import TaskGanttView from './TaskGanttView';
import TaskFilterSidebar from './TaskFilterSidebar';
import { Task } from '@/types/task';
import { useTaskContext } from '@/contexts/TaskContext';

interface TasksSectionProps {
  activeView: string;
  setActiveView: (view: string) => void;
  filteredTasks: Task[];
  handleTaskClick: (task: Task) => void;
  handleCreateTask: (status?: Task['status']) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  activeView,
  setActiveView,
  filteredTasks,
  handleTaskClick,
  handleCreateTask
}) => {
  const { isFiltersOpen, setIsFiltersOpen, areFiltersActive } = useTaskContext();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex border rounded-md overflow-hidden">
              <Button
                variant={activeView === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setActiveView("list")}
              >
                <ListChecks className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={activeView === "board" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setActiveView("board")}
              >
                <Layout className="h-4 w-4 mr-1" />
                Board
              </Button>
              <Button
                variant={activeView === "calendar" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setActiveView("calendar")}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Calendar
              </Button>
              <Button
                variant={activeView === "gantt" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setActiveView("gantt")}
              >
                <GanttChart className="h-4 w-4 mr-1" />
                Gantt
              </Button>
            </div>
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="relative">
                  <Filter className="h-4 w-4" />
                  {areFiltersActive && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      •
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <TaskFilterSidebar />
            </Sheet>
            <Button size="sm" onClick={() => handleCreateTask()}>
              <Plus className="h-4 w-4 mr-1" />
              New Task
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeView === "list" && (
          <TaskListView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        )}
        
        {activeView === "board" && (
          <TaskBoardView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            handleCreateTask={handleCreateTask}
          />
        )}
        
        {activeView === "calendar" && (
          <TaskCalendarView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        )}
        
        {activeView === "gantt" && (
          <TaskGanttView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
