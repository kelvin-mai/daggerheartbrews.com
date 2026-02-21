'use client';

import React from 'react';

import type { AdversaryDetails, UserAdversary } from '@/lib/types';
import { useAdversaryActions } from '@/store';

type Props = { adversary: AdversaryDetails; userAdversary: UserAdversary };

export const AdversaryEditInitializer: React.FC<Props> = ({
  adversary,
  userAdversary,
}) => {
  const { setAdversaryDetails, setUserAdversary } = useAdversaryActions();

  React.useEffect(() => {
    setAdversaryDetails(adversary);
    setUserAdversary(userAdversary);
  }, []);

  return null;
};
