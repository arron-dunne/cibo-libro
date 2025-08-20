// lib/images/constant.ts

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AllowedType = typeof ALLOWED_TYPES[number];
export const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB
export const DEFAULT_TTL_SECONDS = 300; // 5 minutes