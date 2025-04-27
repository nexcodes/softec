import Logo from '@/components/logo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SignInForm } from '../../_components/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function SignInPage() {
  return (
    <div className='container relative flex-col items-center justify-center min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative flex-col hidden h-full p-10 text-white bg-muted lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Logo showText />
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              {`"This platform has transformed the way we report and respond to
              incidents. It's a game-changer for our community."`}
            </p>
            <footer className='text-sm'>Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Sign in to your account
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email below to sign in to your account
            </p>
          </div>
          <SignInForm />
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              {"Don't have an account? "}
              <Link
                href='/auth/sign-up'
                className='font-medium text-primary hover:underline'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
