import * as React from 'react';
import { OauthButton } from './oauth-button';
import { Discord } from '../icons/discord';
import { Reddit } from '../icons/reddit';
import { Google } from '../icons/google';

type AuthFormContainerProps = React.PropsWithChildren & {
  title: string;
  description: string;
};

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className='min-w-96 space-y-4'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          {description}
        </p>
      </div>
      {children}
      <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
        <span className='bg-background text-muted-foreground relative z-10 px-2'>
          Or continue with
        </span>
      </div>
      <div className='grid gap-2'>
        <OauthButton
          provider='google'
          className='bg-[#4285F4] text-white hover:bg-[#4285F4]/80'
        >
          <Google className='fill-white' />
          Google
        </OauthButton>
        <OauthButton
          provider='discord'
          className='bg-[#5865F2] text-white hover:bg-[#5865F2]/80'
        >
          <Discord className='fill-white' /> Discord
        </OauthButton>
        <OauthButton
          provider='reddit'
          className='bg-[#FF4500] text-white hover:bg-[#FF4500]/80'
        >
          <Reddit className='fill-white' />
          Reddit
        </OauthButton>
      </div>
    </div>
  );
};
