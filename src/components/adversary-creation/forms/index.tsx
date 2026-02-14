'use client';

import { useAdversaryStore } from '@/store';
import { BaseForm } from './base';
import { AdversaryStatsForm } from './adversary-stats';
import { EnvironmentStatsForm } from './environment-stats';
import { RulesForm } from './rules';
import { AdversaryImageForm } from './image';

export const AdversaryCreationForms = () => {
  const {
    adversary: { type },
  } = useAdversaryStore();
  return (
    <div className='space-y-2'>
      <BaseForm />
      <AdversaryImageForm />
      {type === 'adversary' && <AdversaryStatsForm />}
      {type === 'environment' && <EnvironmentStatsForm />}
      <RulesForm />
    </div>
  );
};
