import type { Env } from '../types';
import { getDrawsSince, getLatestDraw, getLatestRound } from '../db/queries';

export async function handleSync(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url);
  const since = parseInt(url.searchParams.get('since') ?? '0', 10);

  if (isNaN(since) || since < 0) {
    return Response.json({ error: 'Invalid since parameter' }, { status: 400 });
  }

  const [draws, latestRound] = await Promise.all([
    getDrawsSince(env.DB, since),
    getLatestRound(env.DB),
  ]);

  return Response.json({ draws, latestRound });
}

export async function handleLatest(env: Env): Promise<Response> {
  const draw = await getLatestDraw(env.DB);

  if (!draw) {
    return Response.json({ error: 'No draws found' }, { status: 404 });
  }

  return Response.json(draw);
}

export async function handleHealth(env: Env): Promise<Response> {
  const latestRound = await getLatestRound(env.DB);
  return Response.json({ status: 'ok', latestRound });
}
