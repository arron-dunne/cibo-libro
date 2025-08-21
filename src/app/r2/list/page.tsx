// app/r2-client-list/page.tsx
'use client';
import { useEffect, useRef, useState } from 'react';

type Obj = { key: string; size: number; lastModified: string | null; etag: string | null };

export default function R2ClientDirectList() {
  const [items, setItems] = useState<Obj[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    (async () => {
      try {
        // 1) ask our API for a short‑lived presigned ListObjectsV2 URL
        const { url } = await fetch('/api/images/sign-list').then(r => r.json());

        // 2) call R2 directly (CORS must allow GET from your origin)
        const xmlText = await fetch(url).then(r => {
          if (!r.ok) throw new Error(`R2 list failed: ${r.status}`);
          return r.text();
        });

        // 3) parse XML → simple JSON
        const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
        const contents = Array.from(doc.getElementsByTagName('Contents'));
        const mapped: Obj[] = contents.map(node => ({
          key: node.getElementsByTagName('Key')[0]?.textContent || '',
          size: Number(node.getElementsByTagName('Size')[0]?.textContent || '0'),
          lastModified: node.getElementsByTagName('LastModified')[0]?.textContent || null,
          etag: node.getElementsByTagName('ETag')[0]?.textContent?.replaceAll('"','') || null,
        }));
        setItems(mapped);
      } catch (e: any) {
        setError(e.message || String(e));
      }
    })();
  }, []);

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Direct R2 List (via presigned URL)</h1>
      <ul className="space-y-1 text-sm font-mono">
        {items.map(o => <li key={o.key}>{o.key} <span className="text-gray-500">({o.size} B)</span></li>)}
        {items.length === 0 && <li className="text-gray-500">No objects.</li>}
      </ul>
    </div>
  );
}
