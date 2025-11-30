import { NextResponse } from 'next/server';
import { CosClient } from '@/lib/cosclient';

export async function GET() {
  try {
    const client = new CosClient({ dimension: Number(process.env.COSDATA_DIM || 128) });
    return NextResponse.json({ ok: true, useReal: client.useReal, dimension: client.dimension });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
