'use client';

import React from 'react';

import { initialState, useCardStore } from '@/store/card';

type Props = { isTemplate?: boolean };

export const CardCreateInitializer = ({ isTemplate }: Props) => {
  React.useEffect(() => {
    const { domains, classes, settings, card } = useCardStore.getState();
    useCardStore.setState({
      ...initialState,
      userCard: undefined,
      settings,
      domains,
      classes,
      loading: !(domains && classes),
      ...(isTemplate && { card }),
    });
  }, [isTemplate]);

  return null;
};
