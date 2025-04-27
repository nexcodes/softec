import Logo from '@/components/logo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '../../_components/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignUpPage() {
  return (
    <div className='container relative flex-col items-center justify-center min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative flex-col hidden h-full p-10 text-white bg-muted lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-700' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Logo showText />
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Creating an account was seamless. The platform has
              transformed how we manage our projects and collaborate with our
              team. Highly recommended for growing businesses.&rdquo;
            </p>
            <footer className='text-sm'>Maya Rodriguez, Product Manager</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Create an account
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your information below to create your account
            </p>
          </div>
          <SignUpForm />
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              {'Already have an account? '}
              <Link
                href='/auth/sign-in'
                className='font-medium text-primary hover:underline'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
