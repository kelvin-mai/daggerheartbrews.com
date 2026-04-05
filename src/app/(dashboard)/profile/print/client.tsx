'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bookmark,
  Download,
  ImageIcon,
  Layers,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';

import type { CardDetails, CardSettings } from '@/lib/types';
import { captureElementAsDataUrl } from '@/lib/utils/images';
import { useMounted } from '@/hooks/use-mounted';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { CardPreview } from '@/components/card-creation/preview';
import {
  CollapsibleSectionTrigger,
  ResponsiveDialog,
} from '@/components/common';

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

type PdfPreviewProps = {
  images: string[];
  cutLines: boolean;
};

const PdfPreview = React.memo<PdfPreviewProps>(function PdfPreview({
  images,
  cutLines,
}) {
  return (
    <PDFViewer width='100%' height={700} showToolbar={false}>
      <PdfDocument images={images} cutLines={cutLines} />
    </PDFViewer>
  );
});

const defaultSettings: CardSettings = {
  border: true,
  boldRulesText: true,
  artist: true,
  credits: true,
  placeholderImage: true,
  resolution: 1,
};

type PrintCardListItemProps = {
  card: PrintableCard;
  selected: boolean;
  onToggle: () => void;
  settings: CardSettings;
};

const PrintCardListItem: React.FC<PrintCardListItemProps> = ({
  card,
  selected,
  onToggle,
  settings,
}) => {
  const { cardPreview, userCard } = card;

  return (
    <div className='group bg-background hover:bg-accent/30 flex items-center gap-3 rounded-lg border p-3 transition-colors'>
      <Checkbox
        id={`card-${userCard.id}`}
        checked={selected}
        onCheckedChange={onToggle}
        className='shrink-0'
      />
      <label
        htmlFor={`card-${userCard.id}`}
        className='flex min-w-0 flex-1 cursor-pointer items-center gap-3'
      >
        <div className='bg-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md'>
          {cardPreview.image ? (
            <Image
              src={cardPreview.image}
              alt={cardPreview.name ?? 'Card'}
              className='size-10 object-cover'
              width={40}
              height={40}
            />
          ) : (
            <ImageIcon className='text-muted-foreground size-5' />
          )}
        </div>
        <div className='min-w-0 flex-1'>
          <p className='truncate font-medium'>
            {cardPreview.name || 'Untitled'}
          </p>
          <p className='text-muted-foreground text-sm capitalize'>
            {cardPreview.type}
          </p>
        </div>
      </label>
      <ResponsiveDialog label='Preview' variant='ghost' size='sm'>
        <div className='flex items-center justify-center'>
          <CardPreview card={cardPreview as CardDetails} settings={settings} />
        </div>
      </ResponsiveDialog>
    </div>
  );
};

type Props = {
  cards: PrintableCard[];
};

export const PrintSheetClient: React.FC<Props> = ({ cards }) => {
  const mounted = useMounted();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(cards.map((c) => c.userCard.id)),
  );
  const [cutLines, setCutLines] = React.useState(true);
  const [settings, setSettings] = React.useState<CardSettings>(defaultSettings);
  const [capturing, setCapturing] = React.useState(false);
  const [pdfSnapshot, setPdfSnapshot] = React.useState<{
    images: string[];
    cutLines: boolean;
  } | null>(null);

  const captureRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  const ownCards = cards.filter((c) => c.source === 'own');
  const bookmarkedCards = cards.filter((c) => c.source === 'bookmarked');
  const selectedCards = cards.filter((c) => selectedIds.has(c.userCard.id));

  const toggleCard = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGeneratePdf = async () => {
    if (selectedCards.length === 0) return;
    setCapturing(true);
    const images: string[] = [];
    for (const card of selectedCards) {
      const el = captureRefs.current.get(card.userCard.id);
      if (!el) continue;
      images.push(await captureElementAsDataUrl(el));
    }
    setPdfSnapshot({ images, cutLines });
    setCapturing(false);
  };

  const handleDownload = async () => {
    const { pdf } = await import('@react-pdf/renderer');
    const blob = await pdf(
      <PdfDocument
        images={pdfSnapshot?.images ?? []}
        cutLines={pdfSnapshot?.cutLines ?? true}
      />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cards.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className='space-y-4'>
      {/* Action bar */}
      <div className='bg-card flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4'>
        <Badge variant='secondary'>
          {selectedIds.size} card{selectedIds.size !== 1 ? 's' : ''} selected
        </Badge>
        <div className='flex items-center gap-2'>
          {selectedIds.size === 0 ? (
            <p className='text-muted-foreground text-sm'>
              Select cards below to generate a PDF
            </p>
          ) : (
            <Button size='sm' disabled={capturing} onClick={handleGeneratePdf}>
              {capturing && <Loader2 className='size-4 animate-spin' />}
              {capturing
                ? 'Generating…'
                : pdfSnapshot
                  ? 'Regenerate PDF'
                  : 'Generate PDF'}
            </Button>
          )}
          {pdfSnapshot && !capturing && (
            <Button size='sm' variant='outline' onClick={handleDownload}>
              <Download className='size-4' />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Print Settings */}
      <Collapsible
        defaultOpen
        className='bg-card group/collapsible rounded-lg border'
      >
        <CollapsibleSectionTrigger>
          <div className='bg-primary/10 text-primary dark:bg-sidebar dark:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md'>
            <SlidersHorizontal className='size-4' />
          </div>
          <Label className='font-eveleth-clean text-sm'>Print Settings</Label>
        </CollapsibleSectionTrigger>
        <CollapsibleContent>
          <div className='flex flex-wrap gap-6 border-t px-4 py-3 text-sm'>
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
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, border: v }))
                }
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
                onCheckedChange={(v) =>
                  setSettings((s) => ({ ...s, artist: v }))
                }
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
        </CollapsibleContent>
      </Collapsible>

      {/* PDF preview — only shown after generation */}
      {(pdfSnapshot || capturing) && (
        <>
          {capturing && (
            <div className='bg-muted flex h-[700px] items-center justify-center rounded-lg'>
              <p className='text-muted-foreground text-sm'>
                Generating preview…
              </p>
            </div>
          )}
          {mounted && !capturing && pdfSnapshot && (
            <PdfPreview
              images={pdfSnapshot.images}
              cutLines={pdfSnapshot.cutLines}
            />
          )}
        </>
      )}

      {/* Card selection — two columns on large screens */}
      <div className='grid gap-4 lg:grid-cols-2'>
        {ownCards.length > 0 && (
          <Collapsible
            defaultOpen
            className='bg-card group/collapsible rounded-lg border'
          >
            <CollapsibleSectionTrigger>
              <div className='bg-primary/10 text-primary dark:bg-sidebar dark:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md'>
                <Layers className='size-4' />
              </div>
              <Label className='font-eveleth-clean text-sm'>My Cards</Label>
              <Badge variant='secondary' className='ml-1'>
                {ownCards.length}
              </Badge>
            </CollapsibleSectionTrigger>
            <CollapsibleContent>
              <div className='border-t px-4 py-3'>
                <div className='space-y-3'>
                  {ownCards.map((card) => (
                    <PrintCardListItem
                      key={card.userCard.id}
                      card={card}
                      selected={selectedIds.has(card.userCard.id)}
                      onToggle={() => toggleCard(card.userCard.id)}
                      settings={settings}
                    />
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Bookmarks */}
        {bookmarkedCards.length > 0 && (
          <Collapsible
            defaultOpen
            className='bg-card group/collapsible rounded-lg border'
          >
            <CollapsibleSectionTrigger>
              <div className='bg-primary/10 text-primary dark:bg-sidebar dark:text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md'>
                <Bookmark className='size-4' />
              </div>
              <Label className='font-eveleth-clean text-sm'>Bookmarks</Label>
              <Badge variant='secondary' className='ml-1'>
                {bookmarkedCards.length}
              </Badge>
            </CollapsibleSectionTrigger>
            <CollapsibleContent>
              <div className='border-t px-4 py-3'>
                <div className='space-y-3'>
                  {bookmarkedCards.map((card) => (
                    <PrintCardListItem
                      key={card.userCard.id}
                      card={card}
                      selected={selectedIds.has(card.userCard.id)}
                      onToggle={() => toggleCard(card.userCard.id)}
                      settings={settings}
                    />
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Hidden capture container */}
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
    </div>
  );
};
