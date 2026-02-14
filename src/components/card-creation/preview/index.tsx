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
import { Switch } from '@/components/ui/switch';

type CardPreviewProps = React.ComponentProps<'div'> & {
  card: CardDetails;
  settings: CardSettings;
};

type CardBackPreviewProps = React.ComponentProps<'div'> & {
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
        'aspect-card w-[750px] overflow-hidden',
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
            />
          ) : settings.placeholderImage ? (
            <div className='flex h-[550px] w-full items-center justify-center'>
              <DaggerheartBrewsIcon
                style={{ height: '141px', width: '141px', color: '#737373' }}
              />
            </div>
          ) : null}
        </div>
        <div className='flex-start absolute bottom-20 flex min-h-[440px] w-full flex-col items-center gap-3 bg-white'>
          <Divider card={card} />
          <p
            className={cn(
              'font-eveleth-clean z-20 w-full px-13 pt-9',
              ['ancestry', 'community'].includes(card.type)
                ? 'text-4xl'
                : 'text-center',
            )}
            style={{
              fontSize: ['domain', 'class', 'subclass', 'equipment', 'transformation'].includes(card.type)
                ? '24px' // ~30% larger than ~18px (text-lg)
                : undefined,
            }}
          >
            {card.name}
          </p>
          {['class', 'subclass', 'equipment'].includes(card.type) ? (
            <p
              className='font-semibold capitalize italic'
              style={{ fontSize: '26px' }}
            >
              {card.subtitle}
            </p>
          ) : null}
          <div
            className='z-20 w-full space-y-4 px-13 leading-none text-pretty'
            style={{ fontSize: 26 }}
            dangerouslySetInnerHTML={{ __html: card.text || '' }}
          />
          <Thresholds
            thresholds={card.thresholds}
            thresholdsEnabled={card.thresholdsEnabled}
          />
        </div>
        <div
          className='absolute flex items-end gap-1 italic'
          style={{
            bottom: '18px',
            left: '22px',
            fontSize: '22px',
          }}
        >
          {settings.artist && (
            <>
              <Image
                className='size-8'
                src='/assets/images/quill-icon.png'
                alt='Artist Quill'
                width={31}
                height={31}
              />
              {card.artist}
            </>
          )}
        </div>
        <div
          className='absolute flex items-end gap-1 italic'
          style={{
            bottom: '18px',
            right: '22px',
            fontSize: '18px',
            color: '#110f1c80',
          }}
        >
          {settings.credits && (
            <>
              {card.credits}
              <Image
                className='size-11'
                src='/assets/images/dh-cgl-logo.png'
                alt='Daggerheart Compatible Logo'
                width={44}
                height={44}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const CardBackPreview = React.forwardRef<HTMLDivElement, CardBackPreviewProps>(({
  className,
  card,
  settings,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'aspect-card w-[750px] overflow-hidden',
        settings.border && 'rounded-lg border-2 border-amber-300 shadow',
        className,
      )}
      {...props}
    >
      <div className='relative flex h-full flex-col bg-white text-black'>
        {/* Background Image */}
        <div className='relative h-full w-full'>
          <Image
            src={settings.cardBack === 'custom' ? '/assets/card/dh-card-back-2.png' : '/assets/card/dh-card-back-1.png'}
            alt={`${card.name} card back`}
            fill
            className='object-cover'
          />
          
          {/* Overlay Logo for Custom Card Back */}
          {settings.cardBack === 'custom' && settings.customCardBackLogo && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-[290px] h-[290px] rounded-full overflow-hidden shadow-lg'>
                <img
                  src={settings.customCardBackLogo}
                  alt='Custom back logo'
                  className='h-full w-full object-contain'
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export const CardCreationPreview = () => {
  const router = useRouter();
  const { card, settings, userCard } = useCardStore();
  const { setPreviewRef, setUserCard } = useCardActions();
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
      <div className='flex w-full items-center justify-between rounded-md border p-3'>
        <label htmlFor='card-public' className='text-sm font-medium'>Public Visibility</label>
        <Switch
          id='card-public'
          checked={userCard?.public ?? true}
          onCheckedChange={async (checked) => {
            // Update local store so value is retained on save
            setUserCard({ ...(userCard || ({} as UserCard)), public: checked });
            // If editing existing, persist immediately
            if (userCard?.id) {
              try {
                await fetch('/api/community/cards/visibility', {
                  method: 'PUT',
                  body: JSON.stringify({ public: checked, userCardId: userCard.id }),
                });
              } catch {}
            }
          }}
        />
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
