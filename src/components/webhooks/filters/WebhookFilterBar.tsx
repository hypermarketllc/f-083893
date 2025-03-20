import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Check, 
  ChevronsUpDown, 
  Filter, 
  Save, 
  Tags, 
  Trash2, 
  X,
  Calendar as CalendarIcon,
  GripVertical
} from 'lucide-react';
import { WebhookTag } from '@/types/webhook';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateRange } from 'react-day-picker';

export interface WebhookFilters {
  search: string;
  method: string | null;
  status: 'success' | 'error' | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  tags: string[];
}

export interface WebhookFilterBarProps {
  onFilterChange: (filters: WebhookFilters) => void;
  tags?: WebhookTag[];
  showMethodFilter?: boolean;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
  showTagFilter?: boolean;
}

export const WebhookFilterBar: React.FC<WebhookFilterBarProps> = ({
  onFilterChange,
  tags = [],
  showMethodFilter = true,
  showStatusFilter = true,
  showDateFilter = true,
  showTagFilter = true
}) => {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleMethodChange = (value: string | null) => {
    setMethod(value);
  };

  const handleStatusChange = (value: 'success' | 'error' | null) => {
    setStatus(value);
  };

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId) ? prevTags.filter((id) => id !== tagId) : [...prevTags, tagId]
    );
  };

  const applyFilters = () => {
    const filters = {
      search: search,
      method: method,
      status: status,
      dateFrom: dateRange?.from || null,
      dateTo: dateRange?.to || null,
      tags: selectedTags,
    };
    onFilterChange(filters);
    setIsPopoverOpen(false);
  };

  const clearFilters = () => {
    setSearch('');
    setMethod(null);
    setStatus(null);
    setDateRange(undefined);
    setSelectedTags([]);
    onFilterChange({
      search: '',
      method: null,
      status: null,
      dateFrom: null,
      dateTo: null,
      tags: [],
    });
    setIsPopoverOpen(false);
  };

  const hasFilters = search || method || status || dateRange?.from || selectedTags.length > 0;

  return (
    <div className="flex items-center justify-between space-x-2">
      <Input
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
        className="max-w-md"
      />
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 md:w-96 p-4 space-y-4" align="end">
          <ScrollArea className="max-h-80">
            {showMethodFilter && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Method</h4>
                <Select value={method || undefined} onValueChange={handleMethodChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {showStatusFilter && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status</h4>
                <Select value={status || undefined} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {showDateFilter && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Date Range</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={
                        "w-full justify-start text-left font-normal" +
                        (dateRange?.from ? "pl-3.5" : "text-muted-foreground")
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          `${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`
                        ) : (
                          dateRange.from?.toLocaleDateString()
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {showTagFilter && tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                      {tag.name}
                      {selectedTags.includes(tag.id) && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
          <Separator />
          <div className="flex justify-between">
            <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!hasFilters}>
              Clear
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
