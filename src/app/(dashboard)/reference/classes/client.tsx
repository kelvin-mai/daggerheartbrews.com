'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import type { CardDetails } from '@/lib/types';
import { CardPreview } from '@/components/card-creation/preview';
import { Button } from '@/components/ui/button';
import { useCardActions } from '@/store';
import { initialSettings } from '@/lib/constants';

export const CardClassPreview: React.FC<{ card: CardDetails }> = ({ card }) => {
  const { setCardDetails } = useCardActions();
  const router = useRouter();
  const handleClick = () => {
    setCardDetails(card);
    router.push('/card/create');
  };
  return (
    <div className='flex flex-col items-center space-y-2'>
      <div className='flex justify-center overflow-hidden h-[472px]'>
        <div className='scale-[0.45] origin-top'>
          <CardPreview card={card} settings={initialSettings} />
        </div>
      </div>
      <div className='flex w-full gap-2'>
        <Button className='grow hover:cursor-pointer' asChild>
          <Link href={`/reference/classes/${card.name}`}>View Class</Link>
        </Button>
        <Button
          variant='secondary'
          className='grow hover:cursor-pointer'
          onClick={handleClick}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};
