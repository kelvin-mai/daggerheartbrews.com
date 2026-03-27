'use client';

import React from 'react';

import type { ExportResolution } from '@/lib/types';
import { initialState, useCardStore } from '@/store/card';

type Props = { isTemplate?: boolean; defaultResolution?: ExportResolution };

export const CardCreateInitializer = ({
  isTemplate,
  defaultResolution,
}: Props) => {
  React.useEffect(() => {
    const { domains, classes, settings, card } = useCardStore.getState();
    useCardStore.setState({
      ...initialState,
      userCard: undefined,
      settings: {
        ...settings,
        resolution: defaultResolution ?? settings.resolution,
      },
      domains,
      classes,
      loading: !(domains && classes),
      ...(isTemplate && { card }),
    });
  }, [isTemplate]);

  return null;
};
