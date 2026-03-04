import type { Env } from './types';
import { handleSync, handleLatest, handleHealth } from './api/draws';
import { crawlLatestDraw } from './cron/crawl';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    let response: Response;

    switch (pathname) {
      case '/api/draws/sync':
        response = await handleSync(request, env);
        break;
      case '/api/draws/latest':
        response = await handleLatest(env);
        break;
      case '/api/health':
        response = await handleHealth(env);
        break;
      default:
        response = Response.json({ error: 'Not found' }, { status: 404 });
    }

    // CORS 헤더 추가
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders())) {
      headers.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },

  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    await crawlLatestDraw(env.DB);
  },
} satisfies ExportedHandler<Env>;

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
