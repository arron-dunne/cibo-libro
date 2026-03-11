import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractOpenGraph } from "@/lib/import/opengraph";
import { isSafeUrl } from "@/lib/import/safeUrl";

vi.mock("@/lib/import/safeUrl", () => ({
  isSafeUrl: vi.fn(),
}));

const mockIsSafeUrl = vi.mocked(isSafeUrl);

beforeEach(() => {
  vi.clearAllMocks();
  // Default: treat all URLs as safe
  mockIsSafeUrl.mockResolvedValue(true);
});

describe("extracts OG properties", () => {
  it("extracts title, description and image", async () => {
    const html = `<html><head>
      <meta property="og:title" content="Pasta Recipe" />
      <meta property="og:description" content="A delicious pasta" />
      <meta property="og:image" content="https://example.com/img.jpg" />
    </head></html>`;

    const og = await extractOpenGraph(html);

    expect(og).toEqual({
      title: "Pasta Recipe",
      description: "A delicious pasta",
      image: "https://example.com/img.jpg",
    });
  });

  it("handles meta name attribute as fallback for property", async () => {
    const html = `<head>
      <meta name="og:title" content="Name Title" />
      <meta name="og:description" content="Name Desc" />
      <meta name="og:image" content="https://example.com/img.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.title).toBe("Name Title");
    expect(og.description).toBe("Name Desc");
    expect(og.image).toBe("https://example.com/img.jpg");
  });

  it("falls back to <title> when og:title is absent", async () => {
    const html = `<html><head><title>Page Title</title></head></html>`;

    const og = await extractOpenGraph(html);

    expect(og.title).toBe("Page Title");
  });

  it("prefers og:title over <title>", async () => {
    const html = `<head>
      <title>Page Title</title>
      <meta property="og:title" content="OG Title" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.title).toBe("OG Title");
  });
});

describe("returns undefined for missing or empty tags", () => {
  it("returns all undefined when no OG tags exist", async () => {
    const html = `<html><head></head><body></body></html>`;

    const og = await extractOpenGraph(html);

    expect(og.title).toBeUndefined();
    expect(og.description).toBeUndefined();
    expect(og.image).toBeUndefined();
  });

  it("returns undefined for empty content attributes", async () => {
    const html = `<head>
      <meta property="og:title" content="" />
      <meta property="og:description" content="" />
      <meta property="og:image" content="" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.title).toBeUndefined();
    expect(og.description).toBeUndefined();
    expect(og.image).toBeUndefined();
  });

  it("handles malformed HTML gracefully", async () => {
    const og = await extractOpenGraph("<not valid html at all");

    expect(og.title).toBeUndefined();
    expect(og.description).toBeUndefined();
    expect(og.image).toBeUndefined();
  });
});

describe("description extraction", () => {
  it("extracts a short description", async () => {
    const html = `<head>
      <meta property="og:description" content="Short description" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.description).toBe("Short description");
  });

  it("extracts a long description", async () => {
    const longDesc = "a".repeat(600);
    const html = `<head>
      <meta property="og:description" content="${longDesc}" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.description).toHaveLength(600);
    expect(og.description).toBe(longDesc);
  });
});

describe("image URL safety checking", () => {
  it("includes image when isSafeUrl returns true", async () => {
    mockIsSafeUrl.mockResolvedValue(true);
    const html = `<head>
      <meta property="og:image" content="https://example.com/safe.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.image).toBe("https://example.com/safe.jpg");
    expect(mockIsSafeUrl).toHaveBeenCalledWith("https://example.com/safe.jpg");
  });

  it("drops image when isSafeUrl returns false", async () => {
    mockIsSafeUrl.mockResolvedValue(false);
    const html = `<head>
      <meta property="og:image" content="http://192.168.1.1/evil.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.image).toBeUndefined();
    expect(mockIsSafeUrl).toHaveBeenCalledWith("http://192.168.1.1/evil.jpg");
  });

  it("does not call isSafeUrl when no image is present", async () => {
    const html = `<head>
      <meta property="og:title" content="No Image" />
    </head>`;

    await extractOpenGraph(html);

    expect(mockIsSafeUrl).not.toHaveBeenCalled();
  });

  it("does not include siteName in the result", async () => {
    const html = `<head>
    <meta property="og:site_name" content="Example Site" />
    <meta property="og:title" content="A Title" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og).not.toHaveProperty("siteName");
    expect(og.title).toBe("A Title");
  });
});
