
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Upload, X, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/auth';

interface ProfileImageUploadProps {
  onImageUpload?: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ onImageUpload }) => {
  const { user, updateProfile } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>(user?.avatarUrl || '');
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (png or jpg)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const url = e.target?.result as string;
        setImageUrl(url);
        
        // In a real app, we would upload to storage here
        // For now, we'll just update the user profile with the data URL
        if (onImageUpload) onImageUpload(url);
        
        // Update user profile
        if (updateProfile) {
          try {
            await updateProfile({ avatarUrl: url });
            toast.success('Profile image updated');
          } catch (error) {
            toast.error('Failed to update profile image');
            console.error('Error updating profile:', error);
          }
        } else {
          toast.success('Profile image updated');
        }
        
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setImageUrl('');
    if (onImageUpload) onImageUpload('');
    
    // Update user profile
    if (updateProfile) {
      try {
        await updateProfile({ avatarUrl: '' });
        toast.success('Profile image removed');
      } catch (error) {
        toast.error('Failed to remove profile image');
        console.error('Error updating profile:', error);
      }
    } else {
      toast.success('Profile image removed');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar className="h-32 w-32 border-4 border-background shadow-md transition-all hover:shadow-lg cursor-pointer bg-gradient-to-br from-muted/50 to-background">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/70 to-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div 
          className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-opacity ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-8 w-8 text-white" />
        </div>
        
        {imageUrl && (
          <Button
            variant="destructive"
            size="icon"
            className={`absolute -top-2 -right-2 h-8 w-8 rounded-full transition-opacity ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="gap-2 bg-gradient-to-r from-background to-muted/30 hover:from-muted/50 hover:to-muted/50 transition-all" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileImageUpload;
