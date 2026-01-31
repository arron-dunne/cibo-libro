import { describe, test, expect, vi, beforeEach } from "vitest";
import dns from "node:dns/promises";
import { isSafeUrl } from "@/lib/validation/safeUrl";

vi.mock("node:dns/promises", () => {
  return {
    default: {
      lookup: vi.fn()
    }
  }
});

const mockLookup = vi.mocked(dns.lookup);

beforeEach(() => {
  vi.clearAllMocks();
});


describe("allows valid public URLs", () => {
  test.each([
    "https://example.com",
    "http://bbc.co.uk",
    "https://sub.domain.com",
  ])("allows %s", async (input) => {
    mockLookup.mockResolvedValue([
      { address: "93.184.216.34", family: 4 },
    ] as any);

    const url = new URL(input);
    const result = await isSafeUrl(url);

    expect(result).toBe(true);
  });
});


describe("blocks illegal protocols", () => {
  test.each([
    "file:///etc/passwd",
    "ftp://example.com",
    "data:text/plain,hello",
  ])("blocks %s", async (input) => {
    const url = new URL(input);
    const result = await isSafeUrl(url);

    expect(result).toBe(false);
    expect(mockLookup).not.toHaveBeenCalled();
  });
});


describe("blocks illegal ports", () => {
  test.each([
    "http://example.com:22",
    "https://example.com:8080",
    "http://example.com:3000",
  ])("blocks %s", async (input) => {
    const url = new URL(input);
    const result = await isSafeUrl(url);

    expect(result).toBe(false);
    expect(mockLookup).not.toHaveBeenCalled();
  });
});


describe("blocks private and reserved IP ranges", () => {
  test.each([
    "127.0.0.1", // loopback
    "10.0.0.1", // private
    "192.168.1.1", // private
    "172.16.0.1", // private
    "169.254.169.254", // link-local / metadata
    "0.0.0.0", // unspecified
  ])("blocks %s", async (ip) => {
    mockLookup.mockResolvedValue([
      { address: ip, family: 4 },
    ] as any);

    const url = new URL("http://example.com");
    const result = await isSafeUrl(url);

    expect(result).toBe(false);
  });
});


describe("blocks mixed DNS results", () => {
  test("blocks when one IP is private and one is public", async () => {
    mockLookup.mockResolvedValue([
      { address: "93.184.216.34", family: 4 }, // public
      { address: "127.0.0.1", family: 4 },     // private
    ] as any);

    const url = new URL("https://example.com");
    const result = await isSafeUrl(url);

    expect(result).toBe(false);
  });
});

describe("handles DNS failures safely", () => {
  test("blocks when DNS lookup throws", async () => {
    mockLookup.mockRejectedValue(new Error("DNS failure"));

    const url = new URL("https://example.com");
    const result = await isSafeUrl(url);

    expect(result).toBe(false);
  });

  test("blocks when DNS returns no addresses", async () => {
    mockLookup.mockResolvedValue([] as any);

    const url = new URL("https://example.com");
    const result = await isSafeUrl(url);

    expect(result).toBe(false);
  });
});
q

