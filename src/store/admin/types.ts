import type { SyncableUser } from '@/actions/broadcast';

export type SyncRow = SyncableUser & {
  status: 'pending' | 'success' | 'error';
  error: string | null;
};

export type AudienceSyncState = {
  syncing: boolean;
  cancelling: boolean;
  cancelled: boolean;
  rows: SyncRow[] | null;
  progress: number;
  total: number;
  error: string | null;
  retrying: Set<string>;
  page: number;
};

export type AudienceSyncActions = {
  setPage(page: number): void;
  cancel(): void;
};

export type AudienceSyncEffects = {
  startSync(): Promise<void>;
  retryContact(email: string, name: string): Promise<void>;
  exportCsv(): void;
};

export type AudienceSyncStore = AudienceSyncState & {
  actions: AudienceSyncActions;
  effects: AudienceSyncEffects;
};
