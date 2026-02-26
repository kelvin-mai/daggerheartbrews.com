'use client';

import { CollapsibleContent } from '@/components/ui/collapsible';
import { useCardActions, useCardStore } from '@/store';
import { FormCheckbox } from '@/components/common/form/form-checkbox';
import { FormContainer } from '@/components/common/form';

export const SettingsForm = () => {
  const { settings } = useCardStore();
  const { setSettings } = useCardActions();
  return (
    <FormContainer className='w-full' title='Settings' collapsible>
      <CollapsibleContent className='border-t px-4 py-3'>
        <div className='grid grid-cols-2 gap-2'>
          <FormCheckbox
            id='show-border'
            label='Show border?'
            checked={settings.border}
            onCheckedChange={(e) => {
              if (e !== 'indeterminate') {
                setSettings({ border: e });
              }
            }}
          />
          <FormCheckbox
            id='show-artist'
            label='Show artist?'
            checked={settings.artist}
            onCheckedChange={(e) => {
              if (e !== 'indeterminate') {
                setSettings({ artist: e });
              }
            }}
          />
          <FormCheckbox
            id='show-credits'
            label='Show credits?'
            checked={settings.credits}
            onCheckedChange={(e) => {
              if (e !== 'indeterminate') {
                setSettings({ credits: e });
              }
            }}
          />
          <FormCheckbox
            id='show-placeholder'
            label='Placeholder image?'
            checked={settings.placeholderImage}
            onCheckedChange={(e) => {
              if (e !== 'indeterminate') {
                setSettings({ placeholderImage: e });
              }
            }}
          />
        </div>
      </CollapsibleContent>
    </FormContainer>
  );
};
