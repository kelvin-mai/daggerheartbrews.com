import { Fragment } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

type CardThresholdsProps = {
  thresholds: [number, number, number];
  asText?: boolean;
};

export const CardThresholds: React.FC<CardThresholdsProps> = ({
  thresholds,
  asText,
}) => {
  const labels = ['minor', 'major', 'severe'];
  return asText ? (
    <p className='text-pretty text-card-content'>
      {thresholds.map((t, i) => (
        <Fragment key={`threshold-${i}`}>
          <span className='font-bold capitalize'>
            {labels[i]} (Mark {i + 1})
          </span>{' '}
          {i > 0 ? t : null}
          {` ${i < 2 ? ' | ' : ''}`}
        </Fragment>
      ))}
    </p>
  ) : (
    <div className='text-eveleth-clean relative mb-3 ml-1 flex items-center justify-start rounded-lg bg-black'>
      {thresholds.map((t, i) => (
        <Fragment key={`threshold-${i}`}>
          {i > 0 ? (
            <div className='relative -left-1 flex items-center justify-center'>
              <div className='absolute left-1/2 top-1/2 h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 transform'>
                <Image
                  src='/assets/card/damage-block.png'
                  height={44}
                  width={44}
                  alt='damage-block'
                />
              </div>
              <div className='z-10 flex w-[44px] items-center justify-center text-card-title-sm font-bold'>
                {t}
              </div>
            </div>
          ) : null}
          <div className={cn('relative pr-2', i === 0 && 'pl-2')}>
            <span className='text-card-credits font-bold uppercase text-white'>
              {labels[i]}
            </span>
            <span className='absolute left-1 top-8 text-nowrap text-[10px] text-black'>
              Mark {i + 1} HP
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
