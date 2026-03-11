export function getHostname(s: string) {
  const url = new URL(s);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  return hostname;
}
