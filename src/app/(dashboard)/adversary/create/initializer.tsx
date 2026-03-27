'use client';

import React from 'react';

import type { ExportResolution } from '@/lib/types';
import { initialState, useAdversaryStore } from '@/store/adversary';

type Props = { isTemplate?: boolean; defaultResolution?: ExportResolution };

export const AdversaryCreateInitializer = ({
  isTemplate,
  defaultResolution,
}: Props) => {
  React.useEffect(() => {
    const { adversary } = useAdversaryStore.getState();
    useAdversaryStore.setState({
      ...initialState,
      userAdversary: undefined,
      loading: false,
      resolution: defaultResolution ?? initialState.resolution,
      ...(isTemplate && { adversary }),
    });
  }, [isTemplate]);

  return null;
};
