'use client';

import * as React from 'react';
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
import { Switch } from '@/components/ui/switch';
import { SavePreviewButton } from '@/components/common';

export const AdversaryCreationPreview = () => {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const { adversary, userAdversary } = useAdversaryStore();
  const { setPreviewStatblockRef, setUserAdversary } = useAdversaryActions();
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
      <div className='flex w-full items-center justify-between rounded-md border p-3'>
        <label htmlFor='adversary-public' className='text-sm font-medium'>Public Visibility</label>
        <Switch
          id='adversary-public'
          checked={userAdversary?.public ?? true}
          onCheckedChange={(checked) => {
            setUserAdversary({ ...(userAdversary || ({} as UserAdversary)), public: checked });
          }}
        />
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
  const { setAdversaryDetails, setUserAdversary } = useAdversaryActions();
  const router = useRouter();
  const handleClick = () => {
    setAdversaryDetails(adversary);
    setUserAdversary(userAdversary);
    router.push('/adversary/create');
  };
  return (
    <div className='flex flex-col items-center space-y-2'>
      <AdversaryPreviewStatblock adversary={adversary} />
      <Button className='w-full' onClick={handleClick}>
        Edit
      </Button>
    </div>
  );
};
