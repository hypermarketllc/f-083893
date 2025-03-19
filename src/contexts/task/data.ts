
import { Task } from '@/types/task';

// Initial task data
export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Update contractor agreement',
    description: 'Review and update the terms of our standard contractor agreement template based on legal feedback.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-10',
    assignee: 'john@example.com',
    timeEstimate: '2h',
    tags: ['legal', 'contract']
  },
  {
    id: '2',
    title: 'Create project roadmap',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2023-12-05',
    assignee: 'user@example.com',
    timeEstimate: '4h',
    tags: ['planning', 'strategy']
  },
  {
    id: '3',
    title: 'Finalize project scope',
    status: 'review',
    priority: 'urgent',
    dueDate: '2023-12-03',
    assignee: 'jane@example.com',
    timeEstimate: '3h',
    tags: ['planning']
  },
  {
    id: '4',
    title: 'Design system implementation',
    status: 'done',
    priority: 'high',
    dueDate: '2023-12-01',
    assignee: 'user@example.com',
    timeEstimate: '8h',
    tags: ['design', 'development']
  },
  {
    id: '5',
    title: 'Quarterly report preparation',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-15',
    assignee: 'john@example.com',
    timeEstimate: '6h',
    tags: ['reporting', 'finance']
  }
];
