import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

// Password requirements
const passwordRequirements = [
  { id: 'length', message: 'At least 6 characters long', validator: (pass: string) => pass.length >= 6 },
  { id: 'lowercase', message: 'Contains a lowercase letter', validator: (pass: string) => /[a-z]/.test(pass) },
  { id: 'uppercase', message: 'Contains an uppercase letter', validator: (pass: string) => /[A-Z]/.test(pass) },
  { id: 'number', message: 'Contains a number', validator: (pass: string) => /[0-9]/.test(pass) },
];

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .refine((password) => /[a-z]/.test(password), { message: 'Password must contain a lowercase letter' })
    .refine((password) => /[A-Z]/.test(password), { message: 'Password must contain an uppercase letter' })
    .refine((password) => /[0-9]/.test(password), { message: 'Password must contain a number' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export default function SignupForm() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password, {
        first_name: values.firstName,
        last_name: values.lastName,
      });
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription className="text-gray-100">Sign up to get started with your new account</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        setPasswordValue(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req) => (
                      <div 
                        key={req.id}
                        className="flex items-center text-xs"
                      >
                        {req.validator(passwordValue) ? (
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 mr-1.5 text-gray-300" />
                        )}
                        <span className={req.validator(passwordValue) ? "text-green-700" : "text-gray-500"}>
                          {req.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-center border-t py-4">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-medium hover:underline hover:text-indigo-800 transition-colors">
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
