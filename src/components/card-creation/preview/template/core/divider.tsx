'use client';

import * as React from 'react';

import type { CardDetails, CardType } from '@/lib/types';
import { cn, getBrightness } from '@/lib/utils';

const imgStyle = (type: CardType): React.CSSProperties => {
  switch (type) {
    case 'ancestry':
      return { top: '-75px', height: '143px', objectFit: 'contain' };
    case 'community':
      return { top: '-167px', height: '176px' };
    case 'equipment':
      return { top: '-167px', height: '176px' };
    case 'domain':
      return { top: '-31px', height: '66px' };
    case 'transformation':
      return { top: '-53px', height: '66px' };
    case 'class':
    case 'subclass':
    default:
      return { top: '-31px', height: '66px' };
  }
};

const titleStyle = (type: CardType): React.CSSProperties => {
  switch (type) {
    case 'ancestry':
      return {
        top: '14px',
        right: '34px',
        letterSpacing: '4px',
        fontSize: '28px',
      };
    case 'community':
      return {
        right: '85px',
        top: '-70px',
        letterSpacing: '2px',
        fontSize: '22px',
      };
    case 'equipment':
      return {
        left: '97px',
        top: '-70px',
        letterSpacing: '2px',
        fontSize: '22px',
      };
    case 'transformation':
      return {
        top: '-47px',
        left: '56px',
        letterSpacing: '2px',
        fontSize: '22px',
      };
    case 'domain':
    case 'class':
    case 'subclass':
      return {
        left: '50%',
        top: '-17px',
        transform: 'translateX(-50%)',
        fontWeight: 700,
        fontSize: '23px',
      };
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
          className={cn('clip-card-divider absolute')}
          style={{
            background,
            left: '50%',
            top: '-26px',
            height: '66px',
            width: '660px',
            transform: 'translateX(-50%)',
          }}
        />
      ) : null}
      <img
        src={`/assets/card/divider-${type === 'subclass' ? 'class' : type}.webp`}
        className='absolute w-full'
        style={imgStyle(type)}
      />
      <div
        className={cn(
          'absolute z-10 tracking-[1px] uppercase',
          type === 'domain' &&
            dividerBadge &&
            getBrightness(domainPrimaryColor) < 128
            ? 'text-white'
            : 'text-black',
          ['class', 'subclass'].includes(type) && 'text-[#fef790]',
        )}
        style={titleStyle(type)}
      >
        {subtypeText}
      </div>
    </>
  );
};
