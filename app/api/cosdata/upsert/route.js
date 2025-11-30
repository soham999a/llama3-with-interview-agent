import { NextResponse } from 'next/server';
import { CosClient, textToDeterministicEmbedding } from '@/lib/cosclient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, text } = body;
    if (!id || !text) return NextResponse.json({ error: 'id and text required' }, { status: 400 });

    const client = new CosClient();
    const vector = textToDeterministicEmbedding(text, client.dimension);
    await client.upsertVector(id, text, vector);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
