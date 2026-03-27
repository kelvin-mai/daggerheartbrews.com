'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutTemplate, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import type {
  AdversaryDetails,
  ExportResolution,
  UserAdversary,
} from '@/lib/types';
import {
  useAdversaryActions,
  useAdversaryEffects,
  useAdversaryStore,
} from '@/store';
import { AdversaryPreviewStatblock } from './statblock';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DisplayContainer, SavePreviewButton } from '@/components/common';

const resolutionOptions: { value: ExportResolution; label: string }[] = [
  { value: 1, label: '96 DPI' },
  { value: 2, label: '192 DPI' },
  { value: 3, label: '288 DPI' },
];

export const AdversaryCreationPreview = () => {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const { adversary, resolution } = useAdversaryStore();
  const { setPreviewStatblockRef, setExportStatblockRef, setResolution } =
    useAdversaryActions();
  const { downloadStatblock, saveAdversaryPreview } = useAdversaryEffects();

  const ref = React.useRef<HTMLDivElement>(null);
  const exportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setPreviewStatblockRef(ref);
  }, [ref]);

  React.useEffect(() => {
    setExportStatblockRef(exportRef);
  }, [exportRef]);

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
    <div className='flex flex-col items-center space-y-2'>
      <AdversaryPreviewStatblock
        ref={ref}
        adversary={adversary}
        className='w-full'
      />
      <div
        className='pointer-events-none fixed top-0 left-[-9999px] w-[520px]'
        aria-hidden
      >
        <AdversaryPreviewStatblock ref={exportRef} adversary={adversary} />
      </div>
      <div className='flex w-full gap-2'>
        <Select
          value={String(resolution)}
          onValueChange={(v) => setResolution(Number(v) as ExportResolution)}
        >
          <SelectTrigger className='w-[100px] shrink-0'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {resolutionOptions.map(({ value, label }) => (
              <SelectItem key={value} value={String(value)}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
  userAdversary?: UserAdversary;
};

export const AdversaryDisplayPreview: React.FC<
  AdversaryDisplayPreviewProps
> = ({ adversary, userAdversary }) => {
  const router = useRouter();
  const { setAdversaryDetails } = useAdversaryActions();

  const handleUseAsTemplate = () => {
    const { id: _, ...template } = adversary;
    setAdversaryDetails(template);
    router.push('/adversary/create?template=true');
  };

  return (
    <div className='flex flex-col items-center space-y-2'>
      <DisplayContainer
        menu={
          <DropdownMenuItem onClick={handleUseAsTemplate}>
            <LayoutTemplate className='size-4' />
            Use as Template
          </DropdownMenuItem>
        }
      >
        <AdversaryPreviewStatblock adversary={adversary} />
      </DisplayContainer>
      {userAdversary && (
        <Button className='w-full' asChild>
          <Link href={`/adversary/edit/${userAdversary.id}`}>Edit</Link>
        </Button>
      )}
    </div>
  );
};
