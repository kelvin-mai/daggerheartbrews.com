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
import { CardBackForm } from './card-back';

export const CardCreationForms = () => {
  const store = useCardStore();
  const {
    loading,
    card: { type },
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
      <ImageForm />
      {type === 'equipment' && <EquipmentPropertiesForm />}
      {type === 'domain' && <DomainPropertiesForm />}
      {type === 'class' && <ClassPropertiesForm />}
      {type === 'subclass' && <SubClassPropertiesForm />}
      <RulesForm />
      <CardBackForm />
    </div>
  );
};

export * from './settings';
