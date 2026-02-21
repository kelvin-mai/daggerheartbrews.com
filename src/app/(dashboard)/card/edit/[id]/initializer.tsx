'use client';

import React from 'react';

import type { CardDetails, UserCard } from '@/lib/types';
import { useCardActions } from '@/store/card';

type Props = { card: CardDetails; userCard: UserCard };

export const CardEditInitializer: React.FC<Props> = ({ card, userCard }) => {
  const { setCardDetails, setUserCard } = useCardActions();

  React.useEffect(() => {
    setCardDetails(card);
    setUserCard(userCard);
  }, []);

  return null;
};
