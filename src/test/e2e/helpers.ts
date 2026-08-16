export function uniqueEmail(prefix = "pw") {
  const uuid = crypto.randomUUID();
  return `${prefix}+${uuid}@ci.local`;
}

export function uniqueTitle(prefix = "Test Recipe") {
  const uuid = crypto.randomUUID();
  return `${prefix} ${uuid}`;
}
