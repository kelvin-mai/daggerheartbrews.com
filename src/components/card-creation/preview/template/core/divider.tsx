'use client';

import * as React from 'react';

import type { CardDetails, CardType } from '@/lib/types';
import { cn, getBrightness } from '@/lib/utils';

const imgClasses = (type: CardType): string => {
  switch (type) {
    case 'ancestry':
      return '-top-[10cqw] h-[19.12cqw] object-contain';
    case 'community':
    case 'equipment':
      return '-top-[22.35cqw] h-[23.53cqw]';
    case 'domain':
      return '-top-[4.12cqw] h-[8.82cqw]';
    case 'transformation':
      return '-top-[7.06cqw] h-[8.82cqw]';
    case 'class':
    case 'subclass':
    default:
      return '-top-[4.12cqw] h-[8.82cqw]';
  }
};

const titleClasses = (type: CardType): string => {
  switch (type) {
    case 'ancestry':
      return 'top-[2.94cqw] right-[4.12cqw] tracking-[0.59cqw] text-[3.53cqw]';
    case 'community':
      return '-top-[9.41cqw] right-[9.41cqw] tracking-[0.29cqw] text-[3.53cqw]';
    case 'equipment':
      return '-top-[9.41cqw] left-[10cqw] tracking-[0.29cqw] text-[3.53cqw]';
    case 'transformation':
      return '-top-[5.59cqw] left-[6.47cqw] tracking-[0.29cqw] text-[3.24cqw]';
    case 'domain':
    case 'class':
    case 'subclass':
      return 'left-1/2 -top-[1.76cqw] -translate-x-1/2 font-bold text-[3.53cqw]';
  }
};

type DivederProps = {
  card: CardDetails;
};

export const Divider: React.FC<DivederProps> = ({ card }) => {
  const { type, subtype, domainPrimaryColor, domainSecondaryColor } = card;
  const subtypeText = [
    'ancestry',
    'community',
    'equipment',
    'class',
    'transformation',
  ].includes(type)
    ? type
    : subtype;
  const dividerBadge = ['class', 'subclass', 'domain'].includes(type);
  const background = `linear-gradient(to right, ${domainPrimaryColor}, ${domainSecondaryColor})`;
  console.log('divider', type);
  return (
    <>
      {dividerBadge ? (
        <div
          className='clip-card-divider absolute -top-[3.53cqw] left-1/2 h-[8.82cqw] w-[88.24cqw] -translate-x-1/2'
          style={{ background }}
        />
      ) : null}
      <img
        src={`/assets/card/divider-${type === 'subclass' ? 'class' : type}.webp`}
        className={cn('absolute w-full', imgClasses(type))}
        alt=''
      />
      <div
        className={cn(
          'absolute z-10 uppercase',
          titleClasses(type),
          type === 'domain' &&
            dividerBadge &&
            getBrightness(domainPrimaryColor) < 128
            ? 'text-white'
            : 'text-black',
          ['class', 'subclass'].includes(type) && 'text-[#fef790]',
        )}
      >
        {subtypeText}
      </div>
    </>
  );
};
