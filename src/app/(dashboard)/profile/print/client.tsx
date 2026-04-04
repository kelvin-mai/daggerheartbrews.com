'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Download, Layers } from 'lucide-react';

import type { CardSettings } from '@/lib/types';
import { captureElementAsDataUrl } from '@/lib/utils/images';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CardPreview } from '@/components/card-creation/preview';

import type { PrintableCard } from './page';
import { PdfDocument } from './pdf-document';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className='bg-muted h-[700px] animate-pulse rounded-lg' />
    ),
  },
);

const defaultSettings: CardSettings = {
  border: true,
  boldRulesText: true,
  artist: true,
  credits: true,
  placeholderImage: true,
  resolution: 1,
};

type Props = {
  cards: PrintableCard[];
};

export const PrintSheetClient: React.FC<Props> = ({ cards }) => {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(cards.map((c) => c.userCard.id)),
  );
  const [cutLines, setCutLines] = React.useState(true);
  const [settings, setSettings] = React.useState<CardSettings>(defaultSettings);
  const [cardImages, setCardImages] = React.useState<string[]>([]);
  const [capturing, setCapturing] = React.useState(false);

  const captureRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  const selectedCards = cards.filter((c) => selectedIds.has(c.userCard.id));

  // Re-capture images whenever selection or settings change
  React.useEffect(() => {
    if (selectedCards.length === 0) {
      setCardImages([]);
      return;
    }
    let cancelled = false;
    setCapturing(true);
    (async () => {
      const images: string[] = [];
      for (const card of selectedCards) {
        if (cancelled) return;
        const el = captureRefs.current.get(card.userCard.id);
        if (!el) continue;
        images.push(await captureElementAsDataUrl(el));
      }
      if (!cancelled) {
        setCardImages(images);
        setCapturing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, settings]);

  if (cards.length === 0) {
    return (
      <div className='flex flex-col items-center gap-3 py-12 text-center'>
        <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
          <Layers className='text-muted-foreground size-6' />
        </div>
        <div>
          <p className='font-medium'>No cards to print</p>
          <p className='text-muted-foreground text-sm'>
            Create your own cards or bookmark cards from the community to print
            them
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild size='sm'>
            <Link href='/card/create'>Create Card</Link>
          </Button>
          <Button asChild size='sm' variant='outline'>
            <Link href='/community/cards'>Browse Cards</Link>
          </Button>
        </div>
      </div>
    );
  }

  const toggleCard = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const ownIds = new Set(
    cards.filter((c) => c.source === 'own').map((c) => c.userCard.id),
  );
  const bookmarkIds = new Set(
    cards.filter((c) => c.source === 'bookmarked').map((c) => c.userCard.id),
  );

  const handleDownload = async () => {
    const { pdf } = await import('@react-pdf/renderer');
    const blob = await pdf(
      <PdfDocument images={cardImages} cutLines={cutLines} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cards.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='space-y-6'>
      {/* Settings + actions */}
      <div className='bg-card space-y-4 rounded-lg border p-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex flex-wrap gap-2'>
            {ownIds.size > 0 && (
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  setSelectedIds((prev) => new Set([...prev, ...ownIds]))
                }
              >
                Select My Cards
              </Button>
            )}
            {bookmarkIds.size > 0 && (
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  setSelectedIds((prev) => new Set([...prev, ...bookmarkIds]))
                }
              >
                Select Bookmarks
              </Button>
            )}
            <Button
              size='sm'
              variant='ghost'
              onClick={() => setSelectedIds(new Set())}
            >
              Deselect All
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>
              {selectedIds.size} card{selectedIds.size !== 1 ? 's' : ''}{' '}
              selected
            </Badge>
            <Button
              size='sm'
              disabled={capturing || cardImages.length === 0}
              onClick={handleDownload}
            >
              <Download className='size-4' />
              {capturing ? 'Generating…' : 'Download PDF'}
            </Button>
          </div>
        </div>
        <div className='flex flex-wrap gap-6 text-sm'>
          <label
            htmlFor='switch-cut-lines'
            className='flex cursor-pointer items-center gap-2'
          >
            <Switch
              id='switch-cut-lines'
              checked={cutLines}
              onCheckedChange={setCutLines}
            />
            <span>Cut lines</span>
          </label>
          <label
            htmlFor='switch-border'
            className='flex cursor-pointer items-center gap-2'
          >
            <Switch
              id='switch-border'
              checked={settings.border}
              onCheckedChange={(v) => setSettings((s) => ({ ...s, border: v }))}
            />
            <span>Card border</span>
          </label>
          <label
            htmlFor='switch-artist'
            className='flex cursor-pointer items-center gap-2'
          >
            <Switch
              id='switch-artist'
              checked={settings.artist}
              onCheckedChange={(v) => setSettings((s) => ({ ...s, artist: v }))}
            />
            <span>Artist name</span>
          </label>
          <label
            htmlFor='switch-credits'
            className='flex cursor-pointer items-center gap-2'
          >
            <Switch
              id='switch-credits'
              checked={settings.credits}
              onCheckedChange={(v) =>
                setSettings((s) => ({ ...s, credits: v }))
              }
            />
            <span>Credits</span>
          </label>
        </div>
      </div>

      {/* Card selection thumbnails */}
      <div className='grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
        {cards.map((card) => {
          const selected = selectedIds.has(card.userCard.id);
          return (
            <button
              key={card.userCard.id}
              type='button'
              onClick={() => toggleCard(card.userCard.id)}
              className={cn(
                'relative cursor-pointer overflow-hidden rounded-lg ring-2 transition-opacity',
                selected
                  ? 'opacity-100 ring-amber-400'
                  : 'opacity-40 ring-transparent',
              )}
            >
              <CardPreview card={card.cardPreview} settings={settings} />
            </button>
          );
        })}
      </div>

      {/* Hidden capture container — kept in viewport so Next.js lazy images load */}
      <div
        aria-hidden
        className='pointer-events-none fixed top-0 left-0 z-[-9999] opacity-0'
      >
        {selectedCards.map((card) => (
          <div
            key={card.userCard.id}
            ref={(el) => {
              if (el) captureRefs.current.set(card.userCard.id, el);
              else captureRefs.current.delete(card.userCard.id);
            }}
            style={{ width: '240px', height: '336px', overflow: 'hidden' }}
          >
            <CardPreview card={card.cardPreview} settings={settings} />
          </div>
        ))}
      </div>

      {/* PDF preview */}
      {capturing && (
        <div className='bg-muted flex h-[700px] items-center justify-center rounded-lg'>
          <p className='text-muted-foreground text-sm'>Generating preview…</p>
        </div>
      )}
      {!capturing && cardImages.length > 0 && (
        <PDFViewer width='100%' height={700} showToolbar={false}>
          <PdfDocument images={cardImages} cutLines={cutLines} />
        </PDFViewer>
      )}
    </div>
  );
};
