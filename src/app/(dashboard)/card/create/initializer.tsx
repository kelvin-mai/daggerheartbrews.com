'use client';

import React from 'react';

import { initialState, useCardStore } from '@/store/card';

export const CardCreateInitializer = () => {
  React.useEffect(() => {
    const { domains, classes, settings } = useCardStore.getState();
    useCardStore.setState({
      ...initialState,
      userCard: undefined,
      settings,
      domains,
      classes,
      loading: !(domains && classes),
    });
  }, []);

  return null;
};
