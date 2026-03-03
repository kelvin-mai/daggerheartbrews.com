'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { useAdversaryActions, useAdversaryStore } from '@/store';
import { FormContainer, FormInput } from '@/components/common/form';
import { CollapsibleContent } from '@/components/ui/collapsible';
import {
  CustomSelect,
  RichTextEditor,
  useRichTextEditor,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import type { AdversaryFeature } from '@/lib/types';
import { exampleFeatures } from '@/lib/constants/reference/srd';
import { capitalize, cn } from '@/lib/utils';

export const AssistedFeatureText = ({
  feature,
  onChange,
}: {
  feature: AdversaryFeature;
  onChange: (v: AdversaryFeature) => void;
}) => {
  return (
    <div className='space-y-2 pt-2'>
      <div className='flex items-end gap-2'>
        <FormInput
          id='feature-name'
          label='Feature Name'
          className='grow'
          placeholder='Feature name'
          value={feature.name}
          onChange={(e) => onChange({ ...feature, name: e.target.value })}
        />
        <div className='grow space-y-2'>
          <Label id='feature-type'>Action Type</Label>
          <CustomSelect
            id='feature-type'
            placeholder='Action Type'
            options={[
              {
                category: 'Action Type',
                options: ['passive', 'action', 'reaction'],
              },
            ]}
            value={feature.type}
            onChange={(v) => onChange({ ...feature, type: v })}
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='feature-description'>Feature Description</Label>
        <Textarea
          id='feature-description'
          value={feature.description}
          placeholder='Feature description'
          onChange={(e) =>
            onChange({ ...feature, description: e.target.value })
          }
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='feature-flavor'>Feature Flavor Text</Label>
        <Textarea
          id='feature-flavor'
          value={feature.flavor}
          placeholder='Feature description'
          onChange={(e) => onChange({ ...feature, flavor: e.target.value })}
        />
      </div>
    </div>
  );
};

export const RulesForm = () => {
  const {
    adversary: { text },
  } = useAdversaryStore();
  const initialFeature: AdversaryFeature = {
    name: '',
    type: '',
    description: '',
  };
  const { setAdversaryDetails } = useAdversaryActions();
  const [open, setOpen] = React.useState(false);
  const [feature, setFeature] = React.useState('');
  const [custom, setCustom] = React.useState<AdversaryFeature>(initialFeature);

  const editor = useRichTextEditor({
    defaultValue: text,
    onChange: (v) => setAdversaryDetails({ text: v }),
  });

  const handleSelect = (v: string) => {
    setOpen(false);
    setFeature(v);
  };

  const handleClick = () => {
    const feat =
      feature === 'custom'
        ? custom
        : exampleFeatures.find((f) => f.name === feature);
    if (editor && feat) {
      const section = `<p><strong><em>${capitalize(feat.name)} - ${capitalize(feat.type)}: </em></strong> ${feat.description}</p>${
        feat.flavor ? `<p><em>${feat.flavor}</em></p>` : ''
      }`;
      editor
        .chain()
        .focus()
        .insertContent('<p></p>')
        .insertContent(section)
        .run();
      setCustom(initialFeature);
    }
  };

  return (
    <FormContainer title='Features Text' collapsible defaultOpen>
      <div className='border-t px-4 py-3'>
        {editor && <RichTextEditor editor={editor} />}
        <CollapsibleContent>
          <div className='flex items-end gap-2 pt-2'>
            <div className='grow space-y-2'>
              <Label htmlFor='feature-assistance'>
                Feature Text Assistance
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id='feature-assistance'
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between bg-white font-normal'
                  >
                    {feature ? (
                      <span className='capitalize'>{feature}</span>
                    ) : (
                      <span className='text-muted-foreground'>
                        Select Features
                      </span>
                    )}
                    <ChevronDown className='text-muted-foreground size-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='min-w-[var(--radix-popover-trigger-width)] p-0'
                  align='start'
                >
                  <Command>
                    <CommandInput placeholder='Search features' />
                    <CommandEmpty>
                      <div className='text-center'>
                        <p className='text-muted-foreground text-sm'>
                          None found.
                        </p>
                      </div>
                    </CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem value='custom' onSelect={handleSelect}>
                          <span className='font-bold capitalize'>custom</span>
                          <Check
                            className={cn(
                              'ml-auto size-4',
                              feature === 'custom'
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup heading='SRD Examples'>
                        {exampleFeatures.map((feat) => (
                          <CommandItem
                            key={feat.name}
                            value={feat.name}
                            onSelect={handleSelect}
                          >
                            <div className='flex items-center'>
                              <div>
                                <p className='font-bold'>{feat.name}</p>
                                <p className='text-muted-foreground text-sm'>
                                  <span className='capitalize'>
                                    {feat.type}
                                  </span>{' '}
                                  - {feat.description}
                                </p>
                              </div>
                              <Check
                                className={cn(
                                  'ml-auto size-4',
                                  feature === feat.name
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button variant='ghost' onClick={handleClick}>
              Add Feature
            </Button>
          </div>
          {feature === 'custom' && (
            <AssistedFeatureText feature={custom} onChange={setCustom} />
          )}
        </CollapsibleContent>
      </div>
    </FormContainer>
  );
};
