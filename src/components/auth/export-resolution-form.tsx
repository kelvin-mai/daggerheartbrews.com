'use client';

import * as React from 'react';
import { toast } from 'sonner';

import type { ExportResolution } from '@/lib/types';
import { updateExportResolution } from '@/actions/profile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ExportResolutionFormProps = {
  defaultExportResolution: ExportResolution;
};

const resolutionOptions: { value: ExportResolution; label: string }[] = [
  { value: 1, label: '96 DPI' },
  { value: 2, label: '192 DPI' },
  { value: 3, label: '288 DPI' },
];

export const ExportResolutionForm: React.FC<ExportResolutionFormProps> = ({
  defaultExportResolution,
}) => {
  const [value, setValue] = React.useState(defaultExportResolution);
  const [pending, startTransition] = React.useTransition();

  const handleChange = (v: string) => {
    const resolution = Number(v) as ExportResolution;
    setValue(resolution);
    startTransition(async () => {
      const result = await updateExportResolution(resolution);
      if (result.success) {
        toast.success('Default export resolution updated.');
      } else {
        setValue(value);
        toast.error(result.error ?? 'Failed to update preference.');
      }
    });
  };

  return (
    <div className='flex items-center justify-between gap-4'>
      <div>
        <p className='text-sm font-medium'>Default export resolution</p>
        <p className='text-muted-foreground text-sm'>
          Resolution used when exporting cards and adversaries as PNG.
        </p>
      </div>
      <Select
        value={String(value)}
        onValueChange={handleChange}
        disabled={pending}
      >
        <SelectTrigger className='w-[110px]'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {resolutionOptions.map(({ value: v, label }) => (
            <SelectItem key={v} value={String(v)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
