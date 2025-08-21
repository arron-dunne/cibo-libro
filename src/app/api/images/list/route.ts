// app/api/r2/list/route.ts
// export const runtime = 'nodejs';
"use server"

import { NextResponse } from 'next/server';
import { listObjects } from '@/lib/images/r2';

export async function GET(req: Request) {
  console.log('get request')

  const data = await listObjects({ maxKeys: 50 });
  return NextResponse.json(data, { status: 200 });
}
