export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { signDownload } from '@/lib/images/r2';

export async function POST(req: NextRequest) {
  const { key } = (await req.json()) as { key?: string };
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

  const { url, expiresIn } = await signDownload({ key, ttlSeconds: 300 });
  return NextResponse.json({ url, expiresIn }, { headers: { 'Cache-Control': 'no-store' } });
}
