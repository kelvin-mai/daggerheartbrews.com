import type { AdversaryDetails, UserAdversary } from '@/lib/types';

export type AdversaryState = {
  loading: boolean;
  userAdversary?: UserAdversary;
  adversary: AdversaryDetails;
  previewStatblock?: React.RefObject<HTMLDivElement | null>;
};

export type AdversaryActions = {
  setLoading(loading: boolean): void;
  setAdversaryDetails(details: Partial<AdversaryDetails>): void;
  setUserAdversary(userAdversary: UserAdversary): void;
  setPreviewStatblockRef(ref: React.RefObject<HTMLDivElement | null>): void;
};

export type AdversaryEffects = {
  downloadStatblock(): void;
  saveAdversaryPreview(): Promise<void>;
};

export type AdversaryStore = AdversaryState & {
  actions: AdversaryActions;
  effects: AdversaryEffects;
};
