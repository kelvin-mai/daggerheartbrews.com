import Image from 'next/image';

import { cn } from '@/lib/utils';

export const DCGLCompatibilityBanner: React.FC<React.ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 rounded-lg border bg-white p-4',
        className,
      )}
      {...props}
    >
      <div className='flex items-center justify-center'>
        <Image
          src='/assets/images/dh-cgl-full.png'
          height={150}
          width={500}
          alt='Daggerheart CGL Logo'
        />
      </div>
      <p>
        The materials and references within this application are limited to
        those included in the <em>Daggerheart</em> System Reference Document
        (SRD) and all creations are intended to be comptible with the
        Daggerheart TTRPG system. Users are responsible for ensuring that any
        content they create complies with the terms of the{' '}
        <a
          href='https://darringtonpress.com/license/'
          target='_blank'
          rel='noopener noreferrer'
          className='underline underline-offset-4'
        >
          <em>Darrington Press Community Gaming License</em>
        </a>
        . If you intend to distribute content created using this application,
        please consult the license to ensure compliance with its terms. This
        application is not affiliated with, endorsed by, or sponsored by
        Darrington Press.
      </p>
    </div>
  );
};
