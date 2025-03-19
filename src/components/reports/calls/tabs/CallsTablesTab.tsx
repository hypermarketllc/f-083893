
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Search, Download } from 'lucide-react';
import FilterSystem from '../../shared/FilterSystem';

interface CallsTablesTabProps {
  dateRange: { from: Date; to: Date };
  searchQuery?: string;
}

interface CallData {
  id: string;
  timestamp: string;
  duration: number;
  agent: string;
  caller: string;
  number: string;
  type: string;
  status: string;
  recording?: string;
}

const CallsTablesTab: React.FC<CallsTablesTabProps> = ({ dateRange, searchQuery }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [visibleColumns, setVisibleColumns] = useState({
    timestamp: true,
    duration: true,
    agent: true,
    caller: true,
    number: true,
    type: true,
    status: true,
    recording: false,
  });

  // Mock data for the table
  const mockData: CallData[] = [
    {
      id: '1',
      timestamp: '2023-10-01 09:23:12',
      duration: 134,
      agent: 'John Doe',
      caller: 'Jane Smith',
      number: '+1 (555) 123-4567',
      type: 'Inbound',
      status: 'Completed',
      recording: 'call-recording-1.mp3',
    },
    {
      id: '2',
      timestamp: '2023-10-01 10:45:33',
      duration: 78,
      agent: 'Mike Johnson',
      caller: 'Robert Brown',
      number: '+1 (555) 987-6543',
      type: 'Outbound',
      status: 'Completed',
    },
    {
      id: '3',
      timestamp: '2023-10-02 11:12:45',
      duration: 245,
      agent: 'Sarah Wilson',
      caller: 'Emily Davis',
      number: '+1 (555) 456-7890',
      type: 'Inbound',
      status: 'Completed',
      recording: 'call-recording-3.mp3',
    },
    {
      id: '4',
      timestamp: '2023-10-02 14:33:21',
      duration: 0,
      agent: 'John Doe',
      caller: 'Mark White',
      number: '+1 (555) 789-0123',
      type: 'Inbound',
      status: 'Missed',
    },
    {
      id: '5',
      timestamp: '2023-10-03 15:17:52',
      duration: 192,
      agent: 'Mike Johnson',
      caller: 'Lisa Green',
      number: '+1 (555) 234-5678',
      type: 'Outbound',
      status: 'Completed',
      recording: 'call-recording-5.mp3',
    },
  ];

  // Save column preferences to localStorage
  useEffect(() => {
    localStorage.setItem('calls-table-columns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Load column preferences from localStorage on first render
  useEffect(() => {
    const savedColumns = localStorage.getItem('calls-table-columns');
    if (savedColumns) {
      try {
        setVisibleColumns(JSON.parse(savedColumns));
      } catch (error) {
        console.error('Error parsing saved columns:', error);
      }
    }
  }, []);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filterConfig = [
    { 
      id: 'call_type', 
      label: 'Call Type', 
      options: [
        { value: 'inbound', label: 'Inbound' },
        { value: 'outbound', label: 'Outbound' },
      ] 
    },
    { 
      id: 'status', 
      label: 'Status', 
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'missed', label: 'Missed' },
        { value: 'busy', label: 'Busy' },
        { value: 'no-answer', label: 'No Answer' },
      ] 
    },
    { 
      id: 'agent', 
      label: 'Agent', 
      options: [
        { value: 'john-doe', label: 'John Doe' },
        { value: 'mike-johnson', label: 'Mike Johnson' },
        { value: 'sarah-wilson', label: 'Sarah Wilson' },
      ] 
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            className="pl-8 w-full"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <FilterSystem 
            filters={filterConfig} 
            onFilterChange={setActiveFilters}
            activeFilters={activeFilters}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Columns <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={visibleColumns.timestamp}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, timestamp: checked }))
                }
              >
                Timestamp
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.duration}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, duration: checked }))
                }
              >
                Duration
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.agent}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, agent: checked }))
                }
              >
                Agent
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.caller}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, caller: checked }))
                }
              >
                Caller
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.number}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, number: checked }))
                }
              >
                Number
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.type}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, type: checked }))
                }
              >
                Type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.status}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, status: checked }))
                }
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.recording}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, recording: checked }))
                }
              >
                Recording
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.timestamp && <TableHead>Timestamp</TableHead>}
              {visibleColumns.duration && <TableHead>Duration</TableHead>}
              {visibleColumns.agent && <TableHead>Agent</TableHead>}
              {visibleColumns.caller && <TableHead>Caller</TableHead>}
              {visibleColumns.number && <TableHead>Number</TableHead>}
              {visibleColumns.type && <TableHead>Type</TableHead>}
              {visibleColumns.status && <TableHead>Status</TableHead>}
              {visibleColumns.recording && <TableHead>Recording</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((call) => (
              <TableRow key={call.id}>
                {visibleColumns.timestamp && <TableCell>{call.timestamp}</TableCell>}
                {visibleColumns.duration && <TableCell>{formatDuration(call.duration)}</TableCell>}
                {visibleColumns.agent && <TableCell>{call.agent}</TableCell>}
                {visibleColumns.caller && <TableCell>{call.caller}</TableCell>}
                {visibleColumns.number && <TableCell>{call.number}</TableCell>}
                {visibleColumns.type && <TableCell>{call.type}</TableCell>}
                {visibleColumns.status && (
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      call.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      call.status === 'Missed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {call.status}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.recording && (
                  <TableCell>
                    {call.recording ? (
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <span className="sr-only">Play recording</span>
                        {call.recording}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CallsTablesTab;
