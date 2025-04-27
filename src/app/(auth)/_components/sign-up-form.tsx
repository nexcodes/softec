'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import GoogleIcon from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: 'name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Account created successfully!');
      router.push(DEFAULT_LOGIN_REDIRECT);
    });
  }

  const handleGoogleSignUp = () => {
    startTransition(async () => {
      const { error } = await authClient.signIn.social({ provider: 'google' });
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Signed In via Google successfully!');
      router.push(DEFAULT_LOGIN_REDIRECT);
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground/80'>Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground/80'>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='name@example.com'
                    type='email'
                    autoComplete='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground/80'>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground/80'>
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isPending} className='w-full'>
            Create account
          </Button>
        </form>
      </Form>

      <div className='relative my-4'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='px-2 bg-background text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>

      <div>
        <Button
          variant='outline'
          onClick={handleGoogleSignUp}
          disabled={isPending}
          className='w-full'
        >
          <GoogleIcon className='mt-px' />
          Sign In with Google
        </Button>
      </div>
    </div>
  );
}
