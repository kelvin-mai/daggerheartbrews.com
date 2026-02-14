'use client';

import * as React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Check, ChevronDown, Paintbrush, UploadIcon, X } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { useCardComputed, useCardStore } from '@/store';
import { cn, fileToBase64 } from '@/lib/utils';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

type DomainSelectProps = {
  id: string;
  label: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  color?: string;
  onColorChange: (value: string) => void;
  onIconChange: (value?: string) => void;
  existingIcon?: string;
};

export const DomainSelect: React.FC<DomainSelectProps> = ({
  id,
  label,
  className,
  value,
  onChange,
  color,
  onColorChange,
  onIconChange,
  existingIcon,
}) => {
  const [open, setOpen] = React.useState(false);
  const { domains } = useCardStore();
  const { domainColor } = useCardComputed();
  const domainOptions = domains!
    .reduce((acc: string[], curr) => {
      if (!acc.includes(curr.source)) {
        return [...acc, curr.source];
      }
      return acc;
    }, [])
    .map((source) => ({
      category: source,
      options: domains!.filter((d) => d.source === source).map((d) => d.name),
    }));
  const handleSelect = (v: string) => {
    setOpen(false);
    if (onChange) {
      onChange(v);
    }
  };
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between bg-white font-normal'
          >
            {value ? (
              <div className='flex items-center gap-2'>
                <div
                  className='size-3 rounded-full'
                  style={{
                    background: value === 'custom' ? color : domainColor(value),
                  }}
                />
                <span className='capitalize'>{value}</span>
              </div>
            ) : (
              <span className='text-muted-foreground'>Select Domain</span>
            )}
            <ChevronDown className='text-muted-foreground size-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='min-w-[var(--radix-popover-trigger-width)] p-0'
          align='start'
        >
          <Command>
            <CommandInput placeholder={`Search domains...`} />
            <CommandEmpty>
              <div className='text-center'>
                <p className='text-muted-foreground text-sm'>None found.</p>
              </div>
            </CommandEmpty>
            <CommandList>
              <CommandGroup heading='Custom'>
                <CommandItem
                  value='custom'
                  className='capitalize'
                  onSelect={handleSelect}
                >
                  <div className='flex items-center gap-2'>
                    <div
                      className='size-3 rounded-full'
                      style={{ background: color }}
                    />
                    <span>custom</span>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto size-4',
                      value === 'custom' ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              </CommandGroup>
              {domainOptions.map((option) => (
                <CommandGroup key={option.category} heading={option.category}>
                  {option.options.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      className='capitalize'
                      onSelect={handleSelect}
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className='size-3 rounded-full'
                          style={{ background: domainColor(option) }}
                        />
                        <span>{option}</span>
                      </div>
                      <Check
                        className={cn(
                          'ml-auto size-4',
                          value === option ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value === 'custom' && (
        <div className='flex gap-2'>
          <CustomDomainLogo onChange={onIconChange} existingLogo={existingIcon} />
          <CustomDomainColor color={color} setColor={onColorChange} />
        </div>
      )}
    </div>
  );
};

const CustomDomainLogo: React.FC<{ 
  onChange: (v?: string) => void;
  existingLogo?: string;
}> = ({
  onChange,
  existingLogo,
}) => {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({ accept: 'image/*' });
  const [file] = files;
  const [existingLogoPreview, setExistingLogoPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (onChange && file?.preview) {
      fileToBase64(file.file as File).then((data) => onChange(data));
    }
  }, [file]);

  // Load existing logo when editing a card
  React.useEffect(() => {
    if (existingLogo && !file) {
      setExistingLogoPreview(existingLogo);
    } else if (!existingLogo || file) {
      setExistingLogoPreview(null);
    }
  }, [existingLogo, file]);
  return (
    <>
      {file ? (
        <div className='dark:bg-input/30 flex grow items-center justify-between gap-2 rounded-md border bg-white p-2'>
          <div className='flex items-center gap-4 overflow-hidden'>
            <div className='bg-accent aspect-square shrink-0 rounded'>
              <img
                className='size-10 rounded-[inherit] object-cover'
                src={file.preview}
                alt={file.file.name}
              />
            </div>
            <div>
              <p className='truncate text-sm font-medium'>{file.file.name}</p>
              <p className='text-muted-foreground text-sm'>
                {formatBytes(file.file.size)}
              </p>
            </div>
          </div>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => removeFile(file.id)}
            aria-label='Remove file'
          >
            <X aria-hidden='true' />
          </Button>
        </div>
      ) : existingLogoPreview ? (
        <div className='dark:bg-input/30 flex grow items-center justify-between gap-2 rounded-md border bg-white p-2'>
          <div className='flex items-center gap-4 overflow-hidden'>
            <div className='bg-accent aspect-square shrink-0 rounded'>
              <img
                className='size-10 rounded-[inherit] object-cover'
                src={existingLogoPreview}
                alt='Existing logo'
              />
            </div>
            <div>
              <p className='truncate text-sm font-medium'>Existing logo</p>
              <p className='text-muted-foreground text-sm'>
                Previously uploaded
              </p>
            </div>
          </div>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => {
              onChange(undefined);
              setExistingLogoPreview(null);
            }}
            aria-label='Remove existing logo'
          >
            <X aria-hidden='true' />
          </Button>
        </div>
      ) : (
        <Button
          variant='outline'
          className='h-14 grow bg-white'
          onClick={openFileDialog}
        >
          <UploadIcon className='size-3' />
          Add Logo
        </Button>
      )}
      <input
        {...getInputProps()}
        className='sr-only'
        aria-label='Upload image file'
        tabIndex={-1}
      />
    </>
  );
};

type CustomDomainColorProps = {
  color?: string;
  setColor: (color: string) => void;
};

export const CustomDomainColor: React.FC<CustomDomainColorProps> = ({
  color,
  setColor,
}) => {
  const presets = [
    '#E2E2E2',
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
    '#09203f',
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='h-14 grow bg-white'>
          {color ? (
            <div className='size-4 rounded' style={{ background: color }} />
          ) : (
            <Paintbrush className='size-4' />
          )}
          Choose Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 min-w-[var(--radix-popover-trigger-width)]'>
        <Tabs>
          <TabsList defaultValue='picker'>
            <TabsTrigger value='picker'>Picker</TabsTrigger>
            <TabsTrigger value='preset'>Presets</TabsTrigger>
          </TabsList>
          <TabsContent value='picker' className='flex justify-center'>
            <HexColorPicker color={color || '#000000'} onChange={setColor} />
          </TabsContent>
          <TabsContent
            value='preset'
            className='flex flex-wrap justify-center gap-2'
          >
            {presets.map((p) => (
              <div
                key={p}
                style={{ background: p }}
                className='size-6 rounded'
                onClick={() => setColor(p)}
              />
            ))}
          </TabsContent>
        </Tabs>
        <Input
          className='my-2'
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </PopoverContent>
    </Popover>
  );
};
