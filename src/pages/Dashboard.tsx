import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, BarChart3, Home, Settings, CreditCard, 
  ListChecks, Calendar, Layout, GanttChart, Box, Plus,
  Clock, FileText, MessageSquare, Filter, Search
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import ProfileSection from '@/components/dashboard/ProfileSection';
import AnalyticsSection from '@/components/dashboard/AnalyticsSection';
import SettingsSection from '@/components/dashboard/SettingsSection';
import Sidebar from '@/components/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignee: string;
  timeEstimate: string;
  tags: string[];
}

const TASKS: Task[] = [
  {
    id: '1',
    title: 'Update contractor agreement',
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

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeView, setActiveView] = useState("list");
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={user?.email || 'User'} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tasks..."
                    className="w-[200px] lg:w-[300px] pl-8"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid grid-cols-4 w-full max-w-lg">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span className="hidden sm:inline">Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {user?.email?.split('@')[0] || 'User'}!</CardTitle>
                  <CardDescription>
                    This is your project management dashboard. Navigate through the tabs to access different sections.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("tasks")}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                          <ListChecks className="h-5 w-5 text-indigo-500" />
                          Tasks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Manage your tasks and team's workload</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("analytics")}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-emerald-500" />
                          Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">View project statistics and team performance</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("settings")}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                          <Settings className="h-5 w-5 text-blue-500" />
                          Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Customize application preferences</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Recent Tasks</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Assignee</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tasks.slice(0, 5).map((task) => (
                            <TableRow key={task.id}>
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
                                  'bg-red-100 text-red-800'
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("tasks")}>
                    View All Tasks
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
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
                        <SheetContent>
                          <div className="space-y-4 py-4">
                            <h3 className="text-lg font-medium">Filter Tasks</h3>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="todo" className="rounded" />
                                  <label htmlFor="todo">To Do</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="in_progress" className="rounded" />
                                  <label htmlFor="in_progress">In Progress</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="review" className="rounded" />
                                  <label htmlFor="review">Review</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="done" className="rounded" />
                                  <label htmlFor="done">Done</label>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Priority</Label>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="urgent" className="rounded" />
                                  <label htmlFor="urgent">Urgent</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="high" className="rounded" />
                                  <label htmlFor="high">High</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="medium" className="rounded" />
                                  <label htmlFor="medium">Medium</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="low" className="rounded" />
                                  <label htmlFor="low">Low</label>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Assignee</Label>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="me" className="rounded" />
                                  <label htmlFor="me">Assigned to me</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="unassigned" className="rounded" />
                                  <label htmlFor="unassigned">Unassigned</label>
                                </div>
                              </div>
                            </div>
                            <Button className="w-full">Apply Filters</Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New Task
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeView === "list" && (
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
                              <TableRow key={task.id}>
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
                  )}
                  
                  {activeView === "board" && (
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
                              className="bg-white p-3 rounded-md border shadow-sm"
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
                          <Button variant="ghost" className="w-full text-xs">
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
                              className="bg-white p-3 rounded-md border shadow-sm"
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
                          <Button variant="ghost" className="w-full text-xs">
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
                              className="bg-white p-3 rounded-md border shadow-sm"
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
                          <Button variant="ghost" className="w-full text-xs">
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
                              className="bg-white p-3 rounded-md border shadow-sm"
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
                          <Button variant="ghost" className="w-full text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Task
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeView === "calendar" && (
                    <div className="flex items-center justify-center h-96 border rounded-md">
                      <div className="text-center">
                        <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-2 font-medium">Calendar View</h3>
                        <p className="text-sm text-muted-foreground">
                          Calendar view is coming soon
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {activeView === "gantt" && (
                    <div className="flex items-center justify-center h-96 border rounded-md">
                      <div className="text-center">
                        <GanttChart className="mx-auto h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-2 font-medium">Gantt View</h3>
                        <p className="text-sm text-muted-foreground">
                          Gantt view is coming soon
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsSection />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
