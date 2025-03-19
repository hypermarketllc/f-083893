
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Filter, ListChecks, Layout, Calendar, GanttChart } from 'lucide-react';
import TaskListView from './TaskListView';
import TaskBoardView from './TaskBoardView';
import PlaceholderView from './PlaceholderView';
import TaskFilterSidebar from './TaskFilterSidebar';
import { Task } from '@/types/task';

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
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Filter className="h-4 w-4" />
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
          <PlaceholderView type="calendar" />
        )}
        
        {activeView === "gantt" && (
          <PlaceholderView type="gantt" />
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
