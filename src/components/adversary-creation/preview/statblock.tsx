import * as React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { AdversaryDetails } from '@/lib/types';

type AdversaryPreviewStatblockProps = React.ComponentProps<'div'> & {
  adversary: AdversaryDetails;
};

export const AdversaryPreviewStatblock = React.forwardRef<
  HTMLDivElement,
  AdversaryPreviewStatblockProps
>(({ className, adversary, ...props }, ref) => {
  const {
    name,
    type,
    subtype,
    tier,
    description,
    subDescription,
    experience,
    difficulty,
    thresholds,
    hp,
    stress,
    weapon,
    attack,
    distance,
    damageAmount,
    damageType,
    potential,
    text,
    image,
  } = adversary;
  const formatThresholds = (n: number) => (n === 0 ? 'None' : n);
  return (
    <div
      ref={ref}
      className={cn(
        'space-y-1 rounded-md border p-4 text-black',
        type === 'adversary' && 'border-[#bcab84] bg-[#f4f0e5]',
        type === 'environment' && 'border-[#aaa8a9] bg-[#ededed]',
        className,
      )}
      {...props}
    >
      <h3 className='font-eveleth-clean text-2xl'>{name}</h3>
      <p className='text-base font-bold capitalize'>
        <em>
          Tier {tier} {subtype}
        </em>
      </p>
      <p>
        <em>{description}</em>
      </p>
      <p>
        <strong>
          {type === 'adversary' ? 'Motives & Tactics' : 'Impulses'}:{' '}
        </strong>
        {subDescription}
      </p>
      <div
        className={cn(
          'border-t border-b bg-white p-4',
          type === 'adversary' && 'border-[#bcab84]',
          type === 'environment' && 'border-[#aaa8a9]',
        )}
      >
        {type === 'adversary' ? (
          <>
            <p>
              <strong>Difficulty: </strong>
              {difficulty} | <strong>Thresholds: </strong>
              {thresholds ? formatThresholds(thresholds[0]) : null} /{' '}
              {thresholds ? formatThresholds(thresholds[1]) : null} |{' '}
              <strong>HP: </strong>
              {hp} | <strong>Stress: </strong>
              {stress}
            </p>
            <p className='capitalize'>
              <strong>ATK: </strong>
              {attack} | <strong>{weapon}: </strong>
              {distance} | {damageAmount} ({damageType})
            </p>
            {experience ? (
              <>
                <Separator className='my-2' />
                <p>
                  <strong>Experience:</strong> {experience}
                </p>
              </>
            ) : null}
          </>
        ) : (
          <>
            <p>
              <strong>Difficulty: </strong>
              {difficulty}
            </p>
            <p className='capitalize'>
              <strong>Potential Adversaries: </strong>
              {potential || 'any'}
            </p>
          </>
        )}
      </div>
      <h3 className='font-eveleth-clean text-xl'>Features</h3>
      <div
        className='space-y-1 text-sm [&_ol]:ml-4 [&_p]:pl-4 [&_p:has(strong)]:-indent-4 [&_ul]:ml-4'
        dangerouslySetInnerHTML={{ __html: text || '' }}
      />
      
      {/* Adversary Image Display */}
      {image && (
        <div className='mt-4 flex flex-col items-center'>
          <h3 className='font-eveleth-clean text-xl mb-2'>Image</h3>
          <div className='w-[500px] h-[500px] overflow-hidden rounded-md border flex items-center justify-center'>
            <Image
              src={image}
              alt={`${name} image`}
              width={500}
              height={500}
              className='w-full h-full object-contain'
            />
          </div>
        </div>
      )}
    </div>
  );
});
