'use client';

import React from 'react';

import { initialState, useAdversaryStore } from '@/store/adversary';

type Props = { isTemplate?: boolean };

export const AdversaryCreateInitializer = ({ isTemplate }: Props) => {
  React.useEffect(() => {
    const { adversary } = useAdversaryStore.getState();
    useAdversaryStore.setState({
      ...initialState,
      userAdversary: undefined,
      loading: false,
      ...(isTemplate && { adversary }),
    });
  }, [isTemplate]);

  return null;
};
