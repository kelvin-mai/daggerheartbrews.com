'use client';

import * as React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { AdversaryDetails } from '@/lib/types';
import { AdversaryPreviewStatblock } from '@/components/adversary-creation/preview/statblock';
import { ResponsiveDialog } from '@/components/common';
import jsPDF from 'jspdf';
import { toPng } from '@jpinsonneau/html-to-image';

type Item = {
  userAdversaries: {
    id: string;
    userId: string;
    public: boolean | null;
    adversaryPreviewId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  adversaryPreviews: AdversaryDetails | null;
};

export const AdversaryList: React.FC<{ items: Item[] }> = ({ items }) => {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const getSelectedItems = React.useCallback((): Item[] => {
    const anyChecked = Object.values(selected).some(Boolean);
    return anyChecked ? items.filter((row) => selected[row.userAdversaries.id]) : items;
  }, [items, selected]);

  const normalizeRole = (role?: string | null) => (role?.trim().toLowerCase() || 'undefined role');
  const normalizeTier = (tier?: number | null) => (typeof tier === 'number' ? tier : 'undefined tier');

  const exportToPdf = async () => {
    const list = getSelectedItems();
    if (list.length === 0) return;

    // Group by tier then by role (case-insensitive, trimmed)
    const groups = new Map<string | number, Map<string, Item[]>>();
    for (const row of list) {
      const adv = row.adversaryPreviews!;
      const tierKey = normalizeTier((adv as any).tier ?? null);
      const roleKey = normalizeRole((adv as any).role ?? (adv as any).subtype ?? null);
      if (!groups.has(tierKey)) groups.set(tierKey, new Map());
      const roleMap = groups.get(tierKey)!;
      const key = roleKey;
      roleMap.set(key, [...(roleMap.get(key) || []), row]);
    }

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 12;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '800px';
    document.body.appendChild(container);

    const renderAdversaryToPng = async (adv: AdversaryDetails): Promise<{ dataUrl: string; width: number; height: number }> => {
      return new Promise<{ dataUrl: string; width: number; height: number }>(async (resolve, reject) => {
        const rootDiv = document.createElement('div');
        rootDiv.style.background = '#ffffff';
        rootDiv.style.padding = '8px';
        container.appendChild(rootDiv);
        const Comp = () => (
          <div style={{ background: '#ffffff' }}>
            <AdversaryPreviewStatblock adversary={adv} />
          </div>
        );
        const { createRoot } = await import('react-dom/client');
        const root = createRoot(rootDiv);
        root.render(<Comp />);
        await new Promise((r) => setTimeout(r, 150));
        try {
          const dataUrl = await toPng(rootDiv, {
            cacheBust: true,
            includeQueryParams: true,
            pixelRatio: 1,
            backgroundColor: '#ffffff',
          });
          // Measure natural size from the generated PNG
          const img = new window.Image();
          img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            root.unmount();
            container.removeChild(rootDiv);
            resolve({ dataUrl, width, height });
          };
          img.onerror = () => {
            root.unmount();
            container.removeChild(rootDiv);
            reject(new Error('Failed to load rendered PNG'));
          };
          img.src = dataUrl;
        } catch (e) {
          root.unmount();
          container.removeChild(rootDiv);
          reject(e);
        }
      });
    };

    const drawHeader = (title: string, subtitle?: string) => {
      pdf.setFontSize(18);
      pdf.text(title, margin, margin + 6);
      if (subtitle) {
        pdf.setFontSize(12);
        pdf.text(subtitle, margin, margin + 14);
      }
    };

    const headerHeight = 24;
    const contentTop = margin + headerHeight;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - contentTop - margin;

    let firstPage = true;
    for (const [tier, roleMap] of groups) {
      if (!firstPage) pdf.addPage();
      firstPage = false;
      drawHeader(`Tier ${String(tier).toUpperCase()}`);

      let y = contentTop;
      for (const [roleKey, rows] of roleMap) {
        // Role subtitle
        const roleTitle = roleKey === 'undefined role' ? 'Undefined role' : roleKey.replace(/^./, (c) => c.toUpperCase());
        pdf.setFontSize(12);
        pdf.text(roleTitle, margin, y);
        y += 6;

        // Masonry two-column layout with aspect-ratio aware scaling
        const gap = 6; // mm between items/columns
        const columns = 2;
        const colWidth = (usableWidth - gap * (columns - 1)) / columns;
        let colHeights = Array(columns).fill(y) as number[];

        for (const row of rows) {
          const { dataUrl, width, height } = await renderAdversaryToPng(row.adversaryPreviews!);
          // scale preserving aspect ratio to fit column width
          const scale = colWidth / width;
          const drawWidth = colWidth;
          const drawHeight = height * scale;
          // choose the column with the smallest current height
          let targetCol = 0;
          if (colHeights[1] < colHeights[0]) targetCol = 1;
          // page break if needed
          if (colHeights[targetCol] + drawHeight > pageHeight - margin) {
            pdf.addPage();
            drawHeader(`Tier ${String(tier).toUpperCase()}`, roleTitle);
            colHeights = Array(columns).fill(contentTop + 6);
          }
          const x = margin + targetCol * (colWidth + gap);
          const yPos = colHeights[targetCol];
          pdf.addImage(dataUrl, 'PNG', x, yPos, drawWidth, drawHeight);
          colHeights[targetCol] = yPos + drawHeight + gap;
        }

        // advance y to after the tallest column for next role
        y = Math.max(...colHeights) + 2;
        if (y > pageHeight - margin) {
          pdf.addPage();
          drawHeader(`Tier ${String(tier).toUpperCase()}`);
          y = contentTop;
        }
      }
    }

    document.body.removeChild(container);
    pdf.save('adversaries.pdf');
  };

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <div className='text-muted-foreground text-sm'>
          {Object.values(selected).some(Boolean) ? 'Exporting selected adversaries' : 'No selection made — exporting all'}
        </div>
        <Button onClick={exportToPdf}>Export as PDF</Button>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
      {items.map((row) => {
        const adv = row.adversaryPreviews;
        if (!adv) return null;
        return (
          <div key={row.userAdversaries.id} className='flex items-start gap-3 rounded-lg border p-3'>
            <div className='pt-1'>
              <Checkbox checked={!!selected[row.userAdversaries.id]} onCheckedChange={() => toggle(row.userAdversaries.id)} />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {adv.image ? (
                    <NextImage src={adv.image} alt={adv.name || 'Adversary'} width={64} height={64} className='h-16 w-16 rounded object-cover' />
                  ) : (
                    <div className='h-16 w-16 rounded bg-muted' />
                  )}
                  <div>
                    <div className='font-medium'>{adv.name || 'Untitled'}</div>
                    <div className='text-muted-foreground text-xs'>{adv.type}</div>
                  </div>
                </div>
                <ResponsiveDialog label='Preview'>
                  <div className='flex items-center justify-center'>
                    <AdversaryPreviewStatblock adversary={adv} />
                  </div>
                </ResponsiveDialog>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};


