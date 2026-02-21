'use client';

import React from 'react';

import { initialState, useAdversaryStore } from '@/store/adversary';

export const AdversaryCreateInitializer = () => {
  React.useEffect(() => {
    useAdversaryStore.setState({
      ...initialState,
      userAdversary: undefined,
      loading: false,
    });
  }, []);

  return null;
};
