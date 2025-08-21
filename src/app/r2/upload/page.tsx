'use client';

import { useState, useRef } from 'react';

type SignResponse = {
  method: 'PUT';
  url: string;
  key: string;
  expiresIn: number;
  requiredHeaders: Record<string, string>; // e.g. { 'Content-Type': 'image/jpeg' }
  maxBytes: number;
};

export default function UploadImagePage() {
  const [status, setStatus] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setStatus('');
    setError('');
    setKey('');

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1) Ask server to sign (validates type & size)
      const signRes = await fetch('/api/images/sign-upload', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contentType: file.type,
          size: file.size,
          // Optional: recipeId or any context to namespace the key
          // recipeId: 'abc123'
        }),
      });

      if (!signRes.ok) {
        const txt = await signRes.text();
        throw new Error(`Sign failed: ${signRes.status} ${txt}`);
      }
      const { method, url, key, requiredHeaders, maxBytes } = (await signRes.json()) as SignResponse;

      if (file.size > maxBytes) {
        throw new Error(`File too large. Limit is ${Math.round(maxBytes / 1024 / 1024)} MB`);
      }

      setStatus('Uploading to R2…');

      // 2) Upload directly to R2 (PUT)
      const putRes = await fetch(url, {
        method,
        headers: requiredHeaders, // must include the signed Content-Type
        body: file,
      });

      if (!putRes.ok) {
        const txt = await putRes.text();
        throw new Error(`Upload failed: ${putRes.status} ${txt}`);
      }

      setKey(key);
      setStatus('✅ Uploaded!');
      // Optionally clear the file input
      if (inputRef.current) inputRef.current.value = '';
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setStatus('');
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-3">Upload an image to R2 (direct)</h1>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onPick}
        className="block mb-3"
      />

      {status && <p className="text-sm text-gray-700 mb-2">{status}</p>}
      {error && <p className="text-sm text-red-600 mb-2">Error: {error}</p>}

      {key && (
        <div className="mt-3 text-sm">
          <div className="mb-2">
            <span className="font-medium">Object key:</span>{' '}
            <code className="px-1 py-0.5 bg-gray-100 rounded">{key}</code>
          </div>

          {/* If you have a signed-get route, you can show a preview button */}
          {/* <Preview keyStr={key} /> */}
        </div>
      )}
    </div>
  );
}
