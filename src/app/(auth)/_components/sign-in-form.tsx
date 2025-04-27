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

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Signed In successfully!');
      router.push(DEFAULT_LOGIN_REDIRECT);
    });
  }

  const handleGoogleSignIn = () => {
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
      <div className='grid gap-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='••••••••'
                      type='password'
                      autoComplete='current-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              Sign in
            </Button>
          </form>
        </Form>

        <div className='relative'>
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
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className='w-full'
          >
            <GoogleIcon className='mt-0.5' />
            Sign In with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
