import { getSyncableUsers, syncContact } from '@/actions/broadcast';
import type { ZustandGet, ZustandSet } from '../types';
import type {
  AudienceSyncEffects,
  AudienceSyncState,
  AudienceSyncStore,
  SyncRow,
} from './types';

const DELAY_MS = 500;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const createEffects = (
  set: ZustandSet<AudienceSyncState>,
  get: ZustandGet<AudienceSyncStore>,
): AudienceSyncEffects => ({
  startSync: async () => {
    set({
      syncing: true,
      cancelling: false,
      cancelled: false,
      rows: null,
      error: null,
      progress: 0,
      total: 0,
      page: 0,
    });

    const { data: usersData, error } = await getSyncableUsers();
    if (error || !usersData) {
      set({ syncing: false, error: error ?? 'Failed to fetch users' });
      return;
    }

    const initial: SyncRow[] = usersData.map((u) => ({
      ...u,
      status: 'pending',
      error: null,
    }));
    set({ rows: initial, total: initial.length });

    type Acc = { rows: SyncRow[]; aborted: boolean };

    const { aborted } = await initial.reduce<Promise<Acc>>(
      async (accP, _, i): Promise<Acc> => {
        const { rows, aborted } = await accP;
        if (aborted || get().cancelling) return { rows, aborted: true };

        const result = await syncContact(rows[i].email, rows[i].name);
        const updated = rows.map((r, j) =>
          j === i
            ? {
                ...r,
                status: (result.success
                  ? 'success'
                  : 'error') as SyncRow['status'],
                error: result.error,
              }
            : r,
        );
        set({ rows: updated, progress: i + 1 });

        if (i < rows.length - 1) await sleep(DELAY_MS);
        return { rows: updated, aborted: false };
      },
      Promise.resolve({ rows: initial, aborted: false }),
    );

    set(
      aborted
        ? { syncing: false, cancelling: false, cancelled: true }
        : { syncing: false },
    );
  },

  retryContact: async (email, name) => {
    set((state) => ({ retrying: new Set(state.retrying).add(email) }));
    const result = await syncContact(email, name);
    set((state) => {
      const retrying = new Set(state.retrying);
      retrying.delete(email);
      return {
        retrying,
        rows: state.rows
          ? state.rows.map((r) =>
              r.email === email
                ? {
                    ...r,
                    status: result.success ? 'success' : 'error',
                    error: result.error,
                  }
                : r,
            )
          : null,
      };
    });
  },

  exportCsv: () => {
    const { rows } = get();
    if (!rows) return;
    const lines = [
      'email,name,status,error',
      ...rows.map(
        (r) =>
          `${r.email},${r.name},${r.status},${r.error ? `"${r.error.replace(/"/g, '""')}"` : ''}`,
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audience-sync-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
});
