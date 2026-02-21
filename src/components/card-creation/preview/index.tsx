'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type { CardDetails, CardSettings, UserCard } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCardActions, useCardEffects, useCardStore } from '@/store/card';
import { DaggerheartBrewsIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SavePreviewButton } from '@/components/common';
import {
  Banner,
  Divider,
  Equipment,
  Evasion,
  Stress,
  Thresholds,
} from './template/core';
import { SettingsForm } from '../forms';

type CardPreviewProps = React.ComponentProps<'div'> & {
  card: CardDetails;
  settings: CardSettings;
};

export const CardPreview: React.FC<CardPreviewProps> = ({
  className,
  card,
  settings,
  ...props
}) => {
  return (
    <div
      className={cn(
        'aspect-card [container-type:inline-size] w-full overflow-hidden',
        settings.border && 'rounded-lg border-2 border-amber-300 shadow',
        className,
      )}
      {...props}
    >
      <div className='relative flex h-full flex-col bg-white text-black'>
        {['domain', 'class', 'subclass'].includes(card.type) && (
          <Banner {...card} />
        )}
        {card.type === 'domain' && <Stress stress={card.stress} />}
        {card.type === 'class' && <Evasion evasion={card.evasion} />}
        {card.type === 'equipment' && <Equipment />}
        <div className='overflow-hidden'>
          {card.image ? (
            <img
              className='object-center-top -z-10 w-full object-cover'
              src={card.image}
              alt='Card artwork'
            />
          ) : settings.placeholderImage ? (
            <div className='flex h-[73.53cqw] w-full items-center justify-center'>
              <DaggerheartBrewsIcon className='size-[18.82cqw] text-[#737373]' />
            </div>
          ) : null}
        </div>
        <div className='flex-start absolute bottom-[10.59cqw] flex min-h-[58.82cqw] w-full flex-col items-center gap-[1.76cqw] bg-white'>
          <Divider card={card} />
          <p
            className={cn(
              'font-eveleth-clean z-20 w-full px-[7.06cqw] pt-[4.71cqw]',
              ['ancestry', 'community'].includes(card.type)
                ? 'text-[7.06cqw]'
                : 'text-center text-[4.71cqw]',
            )}
          >
            {card.name}
          </p>
          {['class', 'subclass', 'equipment'].includes(card.type) ? (
            <p className='text-[3.53cqw] font-semibold capitalize italic'>
              {card.subtitle}
            </p>
          ) : null}
          <div
            className='z-20 w-full space-y-[2.35cqw] px-[7.06cqw] text-[3.53cqw] leading-none text-pretty'
            dangerouslySetInnerHTML={{ __html: card.text || '' }}
          />
          <Thresholds
            thresholds={card.thresholds}
            thresholdsEnabled={card.thresholdsEnabled}
          />
        </div>
        <div className='absolute bottom-[2.35cqw] left-[2.94cqw] flex items-end gap-[0.59cqw] text-[2.94cqw] italic'>
          {settings.artist && (
            <>
              <Image
                className='size-[4.12cqw]'
                src='/assets/images/quill-icon.png'
                alt='Artist Quill'
                width={14}
                height={14}
              />
              {card.artist}
            </>
          )}
        </div>
        <div
          className='absolute right-[2.94cqw] bottom-[2.35cqw] flex items-end gap-[0.59cqw] text-[2.35cqw] italic'
          style={{ color: '#110f1c80' }}
        >
          {settings.credits && (
            <>
              {card.credits}
              <Image
                className='size-[5.88cqw]'
                src='/assets/images/dh-cgl-logo.png'
                alt='Daggerheart Compatible Logo'
                width={20}
                height={20}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const CardCreationPreview = () => {
  const router = useRouter();
  const { card, settings } = useCardStore();
  const { setPreviewRef } = useCardActions();
  const { downloadImage, saveCardPreview } = useCardEffects();
  const [pending, setPending] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setPreviewRef(ref);
  }, [ref]);

  const handleClick = async () => {
    setPending(true);
    try {
      await saveCardPreview();
      router.refresh();
      router.push('/profile/homebrew');
    } catch (e) {
      toast.error(
        (e as unknown as Error)?.message || 'Something went wrong. Try again.',
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className='flex w-[340px] flex-col items-center space-y-2'>
      <CardPreview ref={ref} card={card} settings={settings} />
      <div className='flex w-full gap-2'>
        <Button className='grow' onClick={downloadImage}>
          Export as PNG
        </Button>
        <SavePreviewButton
          variant='secondary'
          className='grow'
          onClick={handleClick}
          disabled={pending}
        >
          {pending && <Loader2 className='animate-spin' />}
          Save
        </SavePreviewButton>
      </div>
      <SettingsForm />
    </div>
  );
};

export const CardDisplayPreview: React.FC<
  CardPreviewProps & { userCard?: UserCard }
> = ({ card, userCard, settings }) => {
  return (
    <div className='flex flex-col items-center space-y-2'>
      <CardPreview card={card} settings={settings} />
      {userCard && (
        <Button className='w-full' asChild>
          <Link href={`/card/edit/${userCard.id}`}>Edit</Link>
        </Button>
      )}
    </div>
  );
};
