import dns from "node:dns/promises";
import ipaddr from "ipaddr.js";

// Check URL is safe to fetch to prevent from SSRF attacks
export async function isSafeUrl(inputUrl: URL | string): Promise<boolean> {
  // Cast to URL object if given a string input
  const url = typeof inputUrl === "string" ? new URL(inputUrl) : inputUrl;

  // Only allow HTTP(S) protocol
  if (url.protocol != "http:" && url.protocol != "https:") {
    return false;
  }

  // Only allow ports 80 (HTTP) and 443 (HTTPS)
  if (url.port && url.port != "80" && url.port != "443") {
    return false;
  }

  try {
    // Resolve domain name to IP
    const addresses = await dns.lookup(url.hostname, { all: true, family: 4 });

    if (addresses.length < 1) {
      return false;
    }

    // Check each IP returned from DNS resolution
    for (const { address } of addresses) {
      if (ipaddr.parse(address).range() !== "unicast") {
        return false;
      }
    }
  } catch {
    return false;
  }

  // Only return true if all checks pass
  return true;
}
