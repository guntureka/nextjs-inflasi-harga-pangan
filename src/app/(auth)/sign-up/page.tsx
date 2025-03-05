import { SignUpForm } from '@/components/auth/sign-up-form';
import { LinkButton } from '@/components/ui/link-button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function SignInPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='relative hidden bg-muted lg:block'>
        <Image
          src='/bg.jpg'
          alt='Image'
          width={1000}
          height={1000}
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='relative flex flex-1 items-center justify-center'>
          <div className='absolute left-0 top-0'>
            <LinkButton href='/'>
              <ArrowLeft />
            </LinkButton>
          </div>
          <div className='w-full max-w-xs'>{<SignUpForm />}</div>
        </div>
      </div>
    </div>
  );
}
