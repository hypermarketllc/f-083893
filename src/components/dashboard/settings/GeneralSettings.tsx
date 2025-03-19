
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  siteTitle: z.string().min(2).max(50),
});

export function GeneralSettings() {
  const [siteTitle, setSiteTitle] = useLocalStorage('site-title', 'ClickUp');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteTitle,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSiteTitle(values.siteTitle);
    toast.success('Site settings updated successfully');
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure the general settings for your workspace.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="siteTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Title</FormLabel>
                <FormControl>
                  <Input placeholder="Site title" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name displayed in the sidebar header.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </div>
  );
}
