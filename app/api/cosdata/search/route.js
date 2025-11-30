import { NextResponse } from 'next/server';
import { CosClient } from '@/lib/cosclient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, topK = 5 } = body;
    if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 });

    const client = new CosClient();
    const results = await client.search(query, topK);
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
