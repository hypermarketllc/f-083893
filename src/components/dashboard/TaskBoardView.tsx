
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskBoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  handleCreateTask: (status?: Task['status']) => void;
}

const TaskBoardView: React.FC<TaskBoardViewProps> = ({ 
  tasks, 
  onTaskClick, 
  handleCreateTask 
}) => {
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">To Do</h3>
            <span className="bg-gray-200 text-xs px-2 py-0.5 rounded-full">
              {getTasksByStatus('todo').length}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
          {getTasksByStatus('todo').map((task) => (
            <div 
              key={task.id}
              className="bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onTaskClick(task)}
            >
              <h4 className="font-medium text-sm mb-2">{task.title}</h4>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'low' ? 'bg-gray-100' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ''
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.timeEstimate}
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="ghost" 
            className="w-full text-xs"
            onClick={() => handleCreateTask('todo')}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-blue-50 p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-blue-700">In Progress</h3>
            <span className="bg-blue-200 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {getTasksByStatus('in_progress').length}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
          {getTasksByStatus('in_progress').map((task) => (
            <div 
              key={task.id}
              className="bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onTaskClick(task)}
            >
              <h4 className="font-medium text-sm mb-2">{task.title}</h4>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'low' ? 'bg-gray-100' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ''
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.timeEstimate}
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="ghost" 
            className="w-full text-xs"
            onClick={() => handleCreateTask('in_progress')}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-yellow-50 p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-yellow-700">Review</h3>
            <span className="bg-yellow-200 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
              {getTasksByStatus('review').length}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
          {getTasksByStatus('review').map((task) => (
            <div 
              key={task.id}
              className="bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onTaskClick(task)}
            >
              <h4 className="font-medium text-sm mb-2">{task.title}</h4>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'low' ? 'bg-gray-100' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ''
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.timeEstimate}
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="ghost" 
            className="w-full text-xs"
            onClick={() => handleCreateTask('review')}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-green-50 p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-green-700">Done</h3>
            <span className="bg-green-200 text-green-700 text-xs px-2 py-0.5 rounded-full">
              {getTasksByStatus('done').length}
            </span>
          </div>
        </div>
        <div className="p-3 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
          {getTasksByStatus('done').map((task) => (
            <div 
              key={task.id}
              className="bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onTaskClick(task)}
            >
              <h4 className="font-medium text-sm mb-2">{task.title}</h4>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'low' ? 'bg-gray-100' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ''
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.timeEstimate}
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="ghost" 
            className="w-full text-xs"
            onClick={() => handleCreateTask('done')}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskBoardView;
