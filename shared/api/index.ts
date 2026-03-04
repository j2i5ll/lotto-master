import type { SyncResponse } from '@shared/types';

const API_BASE = 'https://lotto-api.lott-890.workers.dev';

export async function fetchDrawsSync(since: number): Promise<SyncResponse> {
  const url = `${API_BASE}/api/draws/sync?since=${since}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Sync API failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
