import { NextResponse } from 'next/server';
import { CosClient } from '@/lib/cosclient';

export async function GET() {
  try {
    const client = new CosClient();
    const items = await client.list();
    return NextResponse.json({ ok: true, items });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
