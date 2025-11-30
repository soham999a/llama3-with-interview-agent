"use client";
import { useState } from 'react';

export default function CosdataPanel() {
  const [query, setQuery] = useState('Explain event loop in node.js');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [upsertText, setUpsertText] = useState('What is React and how does it work?');

  async function doUpsert() {
    setStatus('upserting');
    const id = 'client-' + Date.now();
    const res = await fetch('/api/cosdata/upsert', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, text: upsertText }) });
    const body = await res.json();
    setStatus(body.ok ? 'upserted' : 'error');
  }

  async function doSearch() {
    setStatus('searching');
    const res = await fetch('/api/cosdata/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, topK: 5 }) });
    const body = await res.json();
    if (body.ok) setResults(body.results);
    else console.error(body.error);
    setStatus(body.ok ? 'done' : 'error');
  }

  async function loadAll() {
    setStatus('loading');
    const res = await fetch('/api/cosdata/list');
    const body = await res.json();
    if (body.ok) setResults(body.items.map(i => ({ id: i.id, text: i.text, score: 1 })));
    setStatus('done');
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm max-w-2xl w-full">
      <h3 className="text-lg font-semibold mb-3">Semantic helper (Cosdata demo)</h3>
      <div className="mb-2">
        <label className="block text-sm text-gray-600 mb-1">Upsert text into store</label>
        <div className="flex gap-2">
          <input className="flex-1 input" value={upsertText} onChange={(e) => setUpsertText(e.target.value)} />
          <button className="btn" onClick={doUpsert}>Upsert</button>
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm text-gray-600 mb-1">Query for similar items</label>
        <div className="flex gap-2">
          <input className="flex-1 input" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn" onClick={doSearch}>Search</button>
          <button className="btn" onClick={loadAll}>List</button>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-500 mb-2">Status: {status}</div>
        <ul className="space-y-2">
          {results.length === 0 ? <li className="text-gray-400">No results</li> : results.map((r, i) => (
            <li key={i} className="p-2 border rounded bg-gray-50">
              <div className="text-sm text-gray-700 font-medium">{r.id}</div>
              <div className="text-sm text-gray-600">{r.text}</div>
              <div className="text-xs text-gray-500">score: {typeof r.score === 'number' ? r.score.toFixed(3) : r.score}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
