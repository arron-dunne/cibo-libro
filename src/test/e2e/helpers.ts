// test/e2e/helpers.ts
export function uniqueEmail(prefix = "pw") {
  const ts = Date.now();
  return `${prefix}+${ts}@ci.local`;
}

export function uniqueTitle(prefix = "Test Recipe") {
  const ts = Date.now();
  return `${prefix} ${ts}`;
}
