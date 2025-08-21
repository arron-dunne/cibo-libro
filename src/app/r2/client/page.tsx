// app/r2/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type ImageItem = { key: string; size: number; lastModified: string | null; etag: string | null };
type ApiData = { objects: ImageItem[]; isTruncated: boolean; nextContinuationToken: string | null };

export default function R2ClientListPage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false); // avoid StrictMode double-fetch spam in dev

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const ac = new AbortController();
    fetch('/api/images/list', { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => !ac.signal.aborted && setError(e.message));

    return () => ac.abort();
  }, []);

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">R2 Objects</h1>
      <ul className="space-y-2">
        {data.objects.map((o) => (
          <li key={o.key} className="font-mono text-sm">
            {o.key} <span className="text-gray-500">({o.size} B)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
