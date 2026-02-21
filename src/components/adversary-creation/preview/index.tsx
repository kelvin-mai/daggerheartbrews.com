'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type { AdversaryDetails, UserAdversary } from '@/lib/types';
import {
  useAdversaryActions,
  useAdversaryEffects,
  useAdversaryStore,
} from '@/store';
import { AdversaryPreviewStatblock } from './statblock';
import { Button } from '@/components/ui/button';
import { SavePreviewButton } from '@/components/common';

export const AdversaryCreationPreview = () => {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const { adversary } = useAdversaryStore();
  const { setPreviewStatblockRef } = useAdversaryActions();
  const { downloadStatblock, saveAdversaryPreview } = useAdversaryEffects();

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setPreviewStatblockRef(ref);
  }, [ref]);

  const handleClick = async () => {
    setPending(true);
    try {
      await saveAdversaryPreview();
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
    <div className='flex grow flex-col items-center space-y-2'>
      <AdversaryPreviewStatblock
        ref={ref}
        adversary={adversary}
        className='w-full'
      />
      <div className='flex w-full gap-2'>
        <Button className='grow' onClick={downloadStatblock}>
          Export Statblock as PNG
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
    </div>
  );
};

type AdversaryDisplayPreviewProps = {
  adversary: AdversaryDetails;
  userAdversary: UserAdversary;
};

export const AdversaryDisplayPreview: React.FC<
  AdversaryDisplayPreviewProps
> = ({ adversary, userAdversary }) => {
  return (
    <div className='flex flex-col items-center space-y-2'>
      <AdversaryPreviewStatblock adversary={adversary} />
      <Button className='w-full' asChild>
        <Link href={`/adversary/edit/${userAdversary.id}`}>Edit</Link>
      </Button>
    </div>
  );
};
