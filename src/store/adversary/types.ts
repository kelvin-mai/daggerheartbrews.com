import type {
  AdversaryDetails,
  ExportResolution,
  UserAdversary,
} from '@/lib/types';

export type AdversaryState = {
  loading: boolean;
  userAdversary?: UserAdversary;
  adversary: AdversaryDetails;
  resolution: ExportResolution;
  previewStatblock?: React.RefObject<HTMLDivElement | null>;
  exportStatblock?: React.RefObject<HTMLDivElement | null>;
};

export type AdversaryActions = {
  setLoading(loading: boolean): void;
  setAdversaryDetails(details: Partial<AdversaryDetails>): void;
  setUserAdversary(userAdversary: UserAdversary): void;
  setPreviewStatblockRef(ref: React.RefObject<HTMLDivElement | null>): void;
  setExportStatblockRef(ref: React.RefObject<HTMLDivElement | null>): void;
  setResolution(resolution: ExportResolution): void;
};

export type AdversaryEffects = {
  downloadStatblock(): void;
  saveAdversaryPreview(): Promise<void>;
};

export type AdversaryStore = AdversaryState & {
  actions: AdversaryActions;
  effects: AdversaryEffects;
};
