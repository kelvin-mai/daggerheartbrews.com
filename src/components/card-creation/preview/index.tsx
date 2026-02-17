'use client';

import * as React from 'react';
import Image from 'next/image';
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
        'aspect-card w-[340px] overflow-hidden',
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
            <div className='flex h-[250px] w-full items-center justify-center'>
              <DaggerheartBrewsIcon
                style={{ height: '64px', width: '64px', color: '#737373' }}
              />
            </div>
          ) : null}
        </div>
        <div className='flex-start absolute bottom-9 flex min-h-[200px] w-full flex-col items-center gap-1.5 bg-white'>
          <Divider card={card} />
          <p
            className={cn(
              'font-eveleth-clean z-20 w-full px-6 pt-4',
              ['ancestry', 'community'].includes(card.type)
                ? 'text-2xl'
                : 'text-center text-base',
            )}
          >
            {card.name}
          </p>
          {['class', 'subclass', 'equipment'].includes(card.type) ? (
            <p
              className='font-semibold capitalize italic'
              style={{ fontSize: '12px' }}
            >
              {card.subtitle}
            </p>
          ) : null}
          <div
            className='z-20 w-full space-y-2 px-6 leading-none text-pretty'
            style={{ fontSize: 12 }}
            dangerouslySetInnerHTML={{ __html: card.text || '' }}
          />
          <Thresholds
            thresholds={card.thresholds}
            thresholdsEnabled={card.thresholdsEnabled}
          />
        </div>
        <div
          className='absolute flex items-end gap-0.5 italic'
          style={{
            bottom: '8px',
            left: '10px',
            fontSize: '10px',
          }}
        >
          {settings.artist && (
            <>
              <Image
                className='size-3.5'
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
          className='absolute flex items-end gap-0.5 italic'
          style={{
            bottom: '8px',
            right: '10px',
            fontSize: '8px',
            color: '#110f1c80',
          }}
        >
          {settings.credits && (
            <>
              {card.credits}
              <Image
                className='size-5'
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
    <div className='flex flex-col items-center space-y-2'>
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
  const { setCardDetails, setUserCard } = useCardActions();
  const router = useRouter();
  const handleClick = () => {
    setUserCard(userCard);
    setCardDetails(card);
    router.push('/card/create');
  };
  return (
    <div className='flex flex-col items-center space-y-2'>
      <CardPreview card={card} settings={settings} />
      <Button className='w-full' onClick={handleClick}>
        Edit
      </Button>
    </div>
  );
};
