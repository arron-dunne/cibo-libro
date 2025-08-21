// app/r2/page.tsx
"use server"

// export const runtime = 'nodejs';
// export const dynamic = 'force-dynamic';

import { listObjects, signDownload } from '@/lib/images/r2';

export default async function R2ListPage() {
  const { objects, isTruncated, nextContinuationToken } = await listObjects({ maxKeys: 50 });

  // For demonstration: build a short-lived signed URL per object (private bucket).
  // Avoid doing this for thousands of keys; paginate instead.
  const rows = await Promise.all(objects.map(async (o) => ({
    ...o,
    signedUrl: await signDownload({ key: o.key, ttlSeconds: 120 }),
  })));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">R2 Objects</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th className="py-2 pr-4">Key</th>
              <th className="py-2 pr-4">Size</th>
              <th className="py-2 pr-4">Last Modified</th>
              <th className="py-2 pr-4">Signed URL (120s)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.key} className="border-b">
                <td className="py-2 pr-4 font-mono">{row.key}</td>
                <td className="py-2 pr-4">{row.size.toLocaleString()} B</td>
                <td className="py-2 pr-4">{row.lastModified ?? '—'}</td>
                <td className="py-2 pr-4">
                  <a href={row.signedUrl} className="text-blue-500 underline" target="_blank" rel="noreferrer">
                    Open
                  </a>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-gray-500">No objects found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isTruncated && (
        <p className="mt-4 text-sm text-gray-600">
          More available… next token: <span className="font-mono">{nextContinuationToken}</span>
        </p>
      )}
    </div>
  );
}
