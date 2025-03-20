
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WebhookTag } from '@/types/webhook';
import { Plus, X, Check, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TagsManagerProps {
  tags: WebhookTag[];
  selectedTags: string[];
  onTagsChange: (selectedTags: string[]) => void;
  onTagCreate?: (tag: Omit<WebhookTag, 'id'>) => void;
  readOnly?: boolean;
}

const PRESET_COLORS = [
  '#ff6b6b', // Red
  '#ff922b', // Orange
  '#ffd43b', // Yellow
  '#69db7c', // Green
  '#4dabf7', // Blue
  '#9775fa', // Purple
  '#f783ac', // Pink
  '#a9e34b', // Lime
  '#66d9e8', // Cyan
  '#e599f7', // Violet
];

export const TagsManager: React.FC<TagsManagerProps> = ({
  tags,
  selectedTags,
  onTagsChange,
  onTagCreate,
  readOnly = false
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const handleTagToggle = (tagId: string) => {
    const updatedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(updatedTags);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim() || !onTagCreate) return;
    
    onTagCreate({
      name: newTagName.trim(),
      color: newTagColor
    });
    
    setNewTagName('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:shadow-sm ${selectedTags.includes(tag.id) ? '' : 'hover:bg-muted/50'} animate-in fade-in`}
            onClick={() => !readOnly && handleTagToggle(tag.id)}
          >
            <div 
              className="w-2 h-2 rounded-full mr-1.5" 
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
          </Badge>
        ))}
        
        {!readOnly && onTagCreate && (
          <Popover open={isCreating} onOpenChange={setIsCreating}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 gap-1 text-xs hover:bg-muted/50"
              >
                <Plus className="h-3 w-3" />
                New Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3" align="start">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Create New Tag</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full cursor-pointer border" 
                    style={{ backgroundColor: newTagColor }}
                  />
                  <div className="flex gap-1 flex-wrap">
                    {PRESET_COLORS.map(color => (
                      <div 
                        key={color}
                        className={`w-4 h-4 rounded-full cursor-pointer transition-all hover:scale-110 ${newTagColor === color ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button 
                    size="sm" 
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                    className="h-8 px-2"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default TagsManager;
