
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ListTodo, Clock } from 'lucide-react';

interface TasksListProps {
  collapsed?: boolean;
}

const TasksList: React.FC<TasksListProps> = ({ collapsed = false }) => {
  return (
    <>
      <li>
        <Link 
          to="/dashboard?tab=tasks" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          <ListTodo className="h-4 w-4" />
          {!collapsed && "All Tasks"}
          {collapsed && <span className="sr-only">All Tasks</span>}
        </Link>
      </li>
      <li>
        <Link 
          to="/dashboard?tab=tasks&filter=completed" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          <CheckSquare className="h-4 w-4" />
          {!collapsed && "Completed"}
          {collapsed && <span className="sr-only">Completed</span>}
        </Link>
      </li>
      <li>
        <Link 
          to="/dashboard?tab=tasks&filter=upcoming" 
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
        >
          <Clock className="h-4 w-4" />
          {!collapsed && "Upcoming"}
          {collapsed && <span className="sr-only">Upcoming</span>}
        </Link>
      </li>
    </>
  );
};

export default TasksList;
