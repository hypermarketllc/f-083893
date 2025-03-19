
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task } from '@/types/task';

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onTaskClick }) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Time Est.</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onTaskClick(task)}
              >
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'todo' ? 'bg-gray-100' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'low' ? 'bg-gray-100' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ''
                  }`}>
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">
                        {task.assignee[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.split('@')[0]}</span>
                  </div>
                </TableCell>
                <TableCell>{task.timeEstimate}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskListView;
