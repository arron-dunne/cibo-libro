// lib/images/compress.ts
export type CompressOpts = {
  maxWidth: number;          // e.g. 1600
  maxHeight: number;         // e.g. 1600
  maxBytes: number;          // e.g. 3 * 1024 * 1024
  preferWebP?: boolean;      // default true
  initialQuality?: number;   // 0..1, default 0.82
  minQuality?: number;       // 0..1, default 0.6
};

type Orientation = 1|2|3|4|5|6|7|8;

export async function compressImageFile(input: File, opts: CompressOpts): Promise<File> {
  const {
    maxWidth, maxHeight, maxBytes,
    preferWebP = true,
    initialQuality = 0.82,
    minQuality = 0.6,
  } = opts;

  // 1) Decode to ImageBitmap (fast) or HTMLImageElement fallback
  const arrayBuf = await input.arrayBuffer();
  const blob = new Blob([arrayBuf], { type: input.type });
  const orientation = await readExifOrientation(arrayBuf).catch(() => 1 as Orientation);

  const imageBitmap = await createImageBitmap(blob).catch(async () => {
    const img = await loadImage(blob);
    return await createImageBitmap(img);
  });

  // 2) Compute target size
  const { width: sw, height: sh } = imageBitmap;
  const scale = Math.min(1, maxWidth / sw, maxHeight / sh);
  const tw = Math.max(1, Math.round(sw * scale));
  const th = Math.max(1, Math.round(sh * scale));

  // 3) Draw with orientation fix
  const { canvas, ctx } = getCanvas(tw, th);
  applyOrientation(ctx, orientation, tw, th);
  // After transform, draw source into transformed space
  const [dx, dy, dw, dh] = drawRectForOrientation(orientation, tw, th);
  ctx.drawImage(imageBitmap as ImageBitmap, dx, dy, dw, dh);

  // Determine format
  const hasAlpha = await detectsAlpha(canvas);
  let mime = preferWebP ? "image/webp" : "image/jpeg";
  if (!supportsType(mime)) mime = "image/jpeg";
  if (!supportsType("image/webp") && preferWebP) mime = "image/jpeg";
  if (hasAlpha && mime === "image/jpeg") mime = supportsType("image/webp") ? "image/webp" : "image/jpeg";

  // 4) Encode with quality shim to meet maxBytes (binary-ish search)
  let qLow = minQuality, qHigh = initialQuality, bestBlob: Blob | null = null;
  for (let i = 0; i < 6; i++) { // 6 iterations is plenty
    const qTry = i === 0 ? qHigh : (qLow + qHigh) / 2;
    const b = await encode(canvas, mime, qTry);
    if (b.size <= maxBytes) { bestBlob = b; qLow = qTry; } else { qHigh = qTry; }
    if (Math.abs(qHigh - qLow) < 0.02) break;
  }
  if (!bestBlob) {
    // Last resort at minQuality
    bestBlob = await encode(canvas, mime, qLow);
  }

  const ext = mime.endsWith("webp") ? "webp" : "jpg";
  const outName = renameWithExt(input.name, ext);
  return new File([bestBlob], outName, { type: mime, lastModified: Date.now() });
}

// Helpers
function supportsType(type: string) {
  const c = document.createElement("canvas");
  return !!c.toDataURL(type).startsWith(`data:${type}`);
}

async function encode(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return await new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("toBlob failed")), type, quality)
  );
}

function getCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: true })!;
  return { canvas, ctx };
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

/** Minimal EXIF orientation reader (little-endian only; fine for most phones) */
async function readExifOrientation(arrayBuf: ArrayBuffer): Promise<Orientation> {
  const dv = new DataView(arrayBuf);
  if (dv.getUint16(0, false) !== 0xFFD8) return 1;
  let offset = 2;
  while (offset < dv.byteLength) {
    if (dv.getUint16(offset + 2, false) !== 0x4578 /*Ex*/ ) {
      if (dv.getUint16(offset, false) === 0xFFE1) { break; }
    }
    offset += 2 + dv.getUint16(offset + 2, false);
    if (offset >= dv.byteLength) return 1;
    if (dv.getUint16(offset, false) === 0xFFE1) break;
  }
  const exifStart = offset + 4;
  const tiff = exifStart + 6;
  const little = dv.getUint16(tiff, false) === 0x4949;
  const firstIFD = dv.getUint32(tiff + 4, little);
  if (firstIFD < 0x00000008) return 1;
  const entries = dv.getUint16(tiff + firstIFD, little);
  for (let i = 0; i < entries; i++) {
    const entry = tiff + firstIFD + 2 + i * 12;
    const tag = dv.getUint16(entry, little);
    if (tag === 0x0112) { // Orientation
      return dv.getUint16(entry + 8, little) as Orientation;
    }
  }
  return 1;
}

// Apply canvas transform for EXIF orientation
function applyOrientation(ctx: CanvasRenderingContext2D, o: Orientation, w: number, h: number) {
  switch (o) {
    case 2: ctx.translate(w, 0); ctx.scale(-1, 1); break;
    case 3: ctx.translate(w, h); ctx.rotate(Math.PI); break;
    case 4: ctx.translate(0, h); ctx.scale(1, -1); break;
    case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break;
    case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -h); break;
    case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(w, -h); ctx.scale(-1, 1); break;
    case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-w, 0); break;
    default: break;
  }
}

function drawRectForOrientation(o: Orientation, w: number, h: number): [number, number, number, number] {
  // When we rotated the canvas, the drawing rect changes; for 90° rotations swap w/h
  if ([5,6,7,8].includes(o)) {
    return [0, 0, h, w];
  }
  return [0, 0, w, h];
}

async function detectsAlpha(canvas: HTMLCanvasElement): Promise<boolean> {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, Math.min(10, width), Math.min(10, height)).data;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
  return false;
}

function renameWithExt(name: string, ext: "jpg"|"webp") {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  return `${base}.${ext}`;
}
