'use client';

import { CustomSelect } from '@/components/common';
import { FormInput, FormContainer } from '@/components/common/form';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { useAdversaryActions, useAdversaryStore } from '@/store';

export const EnvironmentStatsForm = () => {
  const {
    adversary: { subtype, potential },
  } = useAdversaryStore();
  const { setAdversaryDetails } = useAdversaryActions();
  return (
    <FormContainer title='Environment Statistics' collapsible defaultOpen>
      <div className='space-y-2'>
        <Label htmlFor='subtype'>Type</Label>
        <CustomSelect
          id='subtype'
          placeholder='Type'
          options={[
            {
              category: 'Types',
              options: ['exploration', 'social', 'traversal', 'event'],
            },
          ]}
          value={subtype ?? ''}
          onChange={(v) => setAdversaryDetails({ subtype: v })}
        />
      </div>
      <CollapsibleContent className='space-y-2 pt-2'>
        <FormInput
          id='adversaries'
          label='Potential Adversaries'
          placeholder='Any'
          value={potential ?? ''}
          onChange={(e) => setAdversaryDetails({ potential: e.target.value })}
        />
      </CollapsibleContent>
    </FormContainer>
  );
};
