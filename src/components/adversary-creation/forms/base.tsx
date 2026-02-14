'use client';

import { FormInput, FormContainer } from '@/components/common/form';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdversaryActions, useAdversaryStore } from '@/store';

export const BaseForm = () => {
  const {
    adversary: { name, type, tier, difficulty, description, subDescription },
  } = useAdversaryStore();
  const { setAdversaryDetails } = useAdversaryActions();
  return (
    <FormContainer title='Basic Details' collapsible defaultOpen>
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <div className='w-full space-y-2'>
            <Label htmlFor='type'>Type</Label>
            <Select
              value={type ?? ''}
              onValueChange={(v) => setAdversaryDetails({ type: v })}
            >
              <SelectTrigger id='type' className='w-full capitalize'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {['adversary', 'environment'].map((t) => (
                    <SelectItem key={t} value={t} className='capitalize'>
                      {t}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <FormInput
            className='w-full'
            id='name'
            type='text'
            placeholder='Adversary Name'
            value={name ?? ''}
            onChange={(e) => setAdversaryDetails({ name: e.target.value })}
          />
        </div>
        <div className='flex gap-2'>
          <FormInput
            id='difficulty'
            className='grow'
            placeholder='Difficulty'
            value={difficulty ?? ''}
            onChange={(e) =>
              setAdversaryDetails({ difficulty: e.target.value })
            }
          />
          <div className='grow space-y-2'>
            <Label htmlFor='tier'>Tier</Label>
            <Select
              value={tier ? String(tier) : ''}
              onValueChange={(v) => setAdversaryDetails({ tier: Number(v) })}
            >
              <SelectTrigger id='tier' className='w-full capitalize'>
                <SelectValue placeholder='Tier' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {[1, 2, 3, 4].map((t) => (
                    <SelectItem key={t} value={String(t)}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <CollapsibleContent className='space-y-2 pt-2'>
        <FormInput
          id='description'
          label='Short Description'
          type='text'
          placeholder='Short Description'
          value={description ?? ''}
          onChange={(e) => setAdversaryDetails({ description: e.target.value })}
        />
        <FormInput
          id='sub-description'
          label={type === 'adversary' ? 'Motives & Tactics' : 'Impulses'}
          type='text'
          placeholder={type === 'adversary' ? 'Motives & Tactics' : 'Impulses'}
          value={subDescription ?? ''}
          onChange={(e) =>
            setAdversaryDetails({ subDescription: e.target.value })
          }
        />
      </CollapsibleContent>
    </FormContainer>
  );
};
