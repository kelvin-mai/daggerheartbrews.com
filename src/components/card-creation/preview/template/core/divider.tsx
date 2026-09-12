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
      return 'top-[2cqw] left-[72.1cqw] flex h-[5.9cqw] w-[25.3cqw] items-center justify-center text-center tracking-[0.3cqw] text-[4.5cqw]';
    case 'community':
      return '-top-[9.5cqw] left-[66.5cqw] flex h-[5.23cqw] w-[24.6cqw] items-center justify-center text-center tracking-[0.1cqw] text-[4cqw]';
    case 'equipment':
      return '-top-[9.6cqw] left-[9.7cqw] flex h-[5.2cqw] w-[25cqw] items-center justify-center text-center tracking-[0.3cqw] text-[3.8cqw]';
    case 'transformation':
      return '-top-[5.3cqw] left-[5.5cqw] flex h-[3.58cqw] w-[33.65cqw] items-center justify-center text-center tracking-[0.2cqw] text-[3.3cqw]';
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
  const subtypeText =
    type === 'class'
      ? card.name
      : ['ancestry', 'community', 'equipment', 'transformation'].includes(type)
        ? type
        : subtype;
  const dividerBadge = ['class', 'subclass', 'domain'].includes(type);
  const background = `linear-gradient(to right, ${domainPrimaryColor}, ${domainSecondaryColor})`;
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
