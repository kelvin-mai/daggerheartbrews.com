'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, LayoutTemplate } from 'lucide-react';

import type { CardDetails } from '@/lib/types';
import { initialSettings } from '@/lib/constants';
import { CardPreview } from '@/components/card-creation/preview';
import { DisplayContainer } from '@/components/common';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useCardActions } from '@/store';

export const CardClassPreview: React.FC<{ card: CardDetails }> = ({ card }) => {
  const { setCardDetails } = useCardActions();
  const router = useRouter();

  const handleUseAsTemplate = () => {
    const { id: _, ...template } = card;
    setCardDetails(template);
    router.push('/card/create?template=true');
  };

  return (
    <DisplayContainer
      blur
      menu={
        <>
          <DropdownMenuItem asChild>
            <Link href={`/reference/classes/${card.name}`}>
              <BookOpen className='size-4' />
              View Class
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUseAsTemplate}>
            <LayoutTemplate className='size-4' />
            Use as Template
          </DropdownMenuItem>
        </>
      }
    >
      <CardPreview card={card} settings={initialSettings} />
    </DisplayContainer>
  );
};
