"use client";

import { useState } from "react";

export default function ImageUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [objectKey, setObjectKey] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl(null);
    setObjectKey(null);
    setStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("Requesting upload slot...");
    const sign = await fetch("/api/images/sign-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, size: file.size }),
    }).then(r => {
      if (!r.ok) throw new Error("Failed to sign upload");
      return r.json();
    });

    // Build form for the R2 presigned POST
    const fd = new FormData();
    Object.entries(sign.fields as Record<string, string>).forEach(([k, v]) => fd.append(k, v));
    fd.append("file", file);

    setStatus("Uploading to R2...");
    const uploadRes = await fetch(sign.url, { method: "POST", body: fd });
    if (!uploadRes.ok) {
      setStatus("Upload failed");
      return;
    }

    setObjectKey(sign.key as string);

    // Get a short-lived viewing URL to confirm it worked
    setStatus("Fetching view URL...");
    const view = await fetch("/api/images/sign-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: sign.key }),
    }).then(r => r.json());

    setPreviewUrl(view.url ?? null);
    setStatus("Done ✔");
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Image Upload Demo</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="file" accept="image/*" onChange={handleChange} />
        <button
          type="submit"
          className="px-4 py-2 bg-orange-600 text-white rounded-md disabled:opacity-50"
          disabled={!file}
        >
          Upload
        </button>
      </form>

      {status && <p className="text-sm text-gray-600">{status}</p>}

      {objectKey && (
        <p className="text-xs break-all">
          <span className="font-medium">Object key:</span> {objectKey}
        </p>
      )}

      {previewUrl && (
        <div className="mt-2">
          <img src={previewUrl} alt="Uploaded preview" className="rounded-md max-h-72" />
          <p className="text-xs text-gray-500">This signed URL will expire shortly.</p>
        </div>
      )}
    </div>
  );
}
