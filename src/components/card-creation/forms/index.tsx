'use client';

import * as React from 'react';

import { useCardEffects, useCardStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { BaseForm } from './base';
import { ImageForm } from './image';
import {
  ClassPropertiesForm,
  DomainPropertiesForm,
  EquipmentPropertiesForm,
  SubClassPropertiesForm,
} from './properties';
import { RulesForm } from './rules';

export const CardCreationForms = () => {
  const store = useCardStore();
  const {
    loading,
    card: { type, id: cardId },
  } = store;
  const { loadOptions } = useCardEffects();
  React.useEffect(() => {
    loadOptions();
  }, []);
  if (loading) {
    return <Skeleton className='grow rounded-lg' />;
  }
  return (
    <div className='grow space-y-2'>
      <BaseForm />
      <ImageForm key={cardId ?? 'new'} />
      {type === 'equipment' && <EquipmentPropertiesForm />}
      {type === 'domain' && <DomainPropertiesForm />}
      {type === 'class' && <ClassPropertiesForm />}
      {type === 'subclass' && <SubClassPropertiesForm />}
      <RulesForm />
    </div>
  );
};

export * from './settings';
