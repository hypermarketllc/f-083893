
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WebhookTag, HttpMethod, WebhookFilters } from '@/types/webhook';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, FilterX, Check } from 'lucide-react';

interface WebhookFilterBarProps {
  onFilterChange: (filters: Partial<WebhookFilters>) => void;
  tags?: WebhookTag[];
  showMethodFilter?: boolean;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
}

export const WebhookFilterBar: React.FC<WebhookFilterBarProps> = ({ 
  onFilterChange,
  tags = [],
  showMethodFilter = true,
  showStatusFilter = true,
  showDateFilter = false
}) => {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState<HttpMethod | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const applyFilters = () => {
    onFilterChange({
      search,
      method,
      status,
      tags: selectedTags
    });
  };

  const resetFilters = () => {
    setSearch('');
    setMethod(null);
    setStatus(null);
    setSelectedTags([]);
    
    onFilterChange({
      search: '',
      method: null,
      status: null,
      tags: []
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ 
      search: e.target.value,
      method,
      status,
      tags: selectedTags
    });
  };

  const handleMethodChange = (value: string) => {
    const newMethod = value === '' ? null : value as HttpMethod;
    setMethod(newMethod);
    onFilterChange({ 
      search,
      method: newMethod,
      status,
      tags: selectedTags
    });
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === '' ? null : value as 'success' | 'error';
    setStatus(newStatus);
    onFilterChange({ 
      search,
      method,
      status: newStatus,
      tags: selectedTags
    });
  };

  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
      
    setSelectedTags(newTags);
    onFilterChange({ 
      search,
      method,
      status,
      tags: newTags
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search webhooks..."
            className="pl-8"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        {showMethodFilter && (
          <Select value={method || ''} onValueChange={handleMethodChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Methods</SelectItem>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {showStatusFilter && (
          <Select value={status || ''} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {(search || method || status || selectedTags.length > 0) && (
          <Button variant="outline" size="icon" onClick={resetFilters}>
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.id)}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full mr-1" 
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
              {selectedTags.includes(tag.id) && <Check className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
