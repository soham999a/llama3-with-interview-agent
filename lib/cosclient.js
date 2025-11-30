import crypto from 'crypto';

class MockCosClient {
  constructor(dimension = 128) {
    this.dimension = dimension;
    this.vectors = []; // {id, text, vector}
  }

  _normalize(v) {
    const len = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    if (len === 0) return v;
    return v.map(x => x / len);
  }

  async upsertVector(id, text, vector) {
    if (!vector) throw new Error('Mock client requires a vector');
    const normalized = this._normalize(vector);
    const idx = this.vectors.findIndex(it => it.id === id);
    const item = { id, text, vector: normalized };
    if (idx !== -1) this.vectors[idx] = item;
    else this.vectors.push(item);
    return { ok: true };
  }

  async searchVector(queryVector, topK = 5) {
    const qn = this._normalize(queryVector);
    const scored = this.vectors.map(it => ({
      id: it.id,
      text: it.text,
      score: it.vector.reduce((s, v, i) => s + v * qn[i], 0)
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  async list() { return this.vectors; }
}

export function textToDeterministicEmbedding(text, dimension = 128) {
  const h = crypto.createHash('sha256').update(text).digest();
  const vector = new Array(dimension).fill(0).map((_, i) => {
    const b = h[i % h.length];
    return (b / 255) * 2 - 1;
  });
  return vector;
}

export class CosClient {
  constructor(options = {}) {
    this.dimension = options.dimension || 128;
    this.useReal = false;
    this.realClient = null;

    if (process.env.COSDATA_HOST) {
      try {
        // Try to dynamically require the optional cosdata-sdk at runtime so
        // bundlers (webpack/next) won't attempt to statically resolve this
        // dependency during build when it's not installed.
        // eslint-disable-next-line no-eval
        const req = eval('require');
        const { createClient } = req('cosdata-sdk');
        this.realClient = createClient({ host: process.env.COSDATA_HOST, username: process.env.COSDATA_USERNAME || 'admin', password: process.env.COSDATA_PASSWORD || 'admin' });
        this.useReal = true;
      } catch (err) {
        // fallback to mock
        console.warn('COSDATA_HOST set but cosdata-sdk not available — using mock client');
        this.useReal = false;
      }
    }

    if (!this.useReal) this.mock = new MockCosClient(this.dimension);
  }

  async upsertVector(id, text, vector) {
    if (!vector) vector = textToDeterministicEmbedding(text, this.dimension);
    if (this.useReal) {
      throw new Error('Real Cosdata upsert not implemented in cosclient wrapper — install cosdata-sdk and extend this function');
    }
    return this.mock.upsertVector(id, text, vector);
  }

  async search(queryTextOrVector, topK = 5) {
    let vector = queryTextOrVector;
    if (!Array.isArray(queryTextOrVector)) vector = textToDeterministicEmbedding(queryTextOrVector, this.dimension);
    if (this.useReal) throw new Error('Real Cosdata search not implemented in cosclient wrapper');
    return this.mock.searchVector(vector, topK);
  }

  async list() { if (this.useReal) throw new Error('Not implemented'); return this.mock.list(); }
}
