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
import { type CardType, cardTypes } from '@/lib/types/card-creation';
import { useCardStore, useCardActions } from '@/store';

export const BaseForm = () => {
  const { card } = useCardStore();
  const { setCardDetails, setCardTypeDefaults } = useCardActions();
  return (
    <FormContainer title='Basic Details' collapsible defaultOpen>
      <div className='border-t px-4 py-3'>
        <div className='flex gap-2'>
          <div className='w-full space-y-2'>
            <Label htmlFor='type'>Type</Label>
            <Select
              value={card.type}
              onValueChange={(v: CardType) => setCardTypeDefaults(v)}
            >
              <SelectTrigger id='type' className='w-full capitalize'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {cardTypes.map((t) => (
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
            placeholder='Card Name'
            disabled={card.type === 'class'}
            value={card.name}
            onChange={(e) => setCardDetails({ name: e.target.value })}
          />
        </div>
        <CollapsibleContent className='space-y-2 pt-2'>
          <FormInput
            id='artist'
            type='text'
            placeholder='Artist Credit'
            value={card.artist}
            onChange={(e) => setCardDetails({ artist: e.target.value })}
          />
          <FormInput
            id='credits'
            type='credits'
            placeholder='Daggerheart © Darrington Press 2025'
            value={card.credits}
            onChange={(e) => setCardDetails({ credits: e.target.value })}
          />
        </CollapsibleContent>
      </div>
    </FormContainer>
  );
};
