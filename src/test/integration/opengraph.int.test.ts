import { describe, it, expect } from "vitest";
import { extractOpenGraph } from "@/lib/import/opengraph";

describe("extractOpenGraph image URLs (integration)", () => {
  it("allows public IP", async () => {
    const html = `<head>
      <meta property="og:title" content="Recipe" />
      <meta property="og:image" content="http://example.com/photo.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.title).toBe("Recipe");
    expect(og.image).toBe("http://example.com/photo.jpg");
  });

  it("drops image pointing to a private IP", async () => {
    const html = `<head>
      <meta property="og:title" content="Recipe" />
      <meta property="og:image" content="http://192.168.1.1/photo.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.title).toBe("Recipe");
    expect(og.image).toBeUndefined();
  });

  it("drops image pointing to localhost", async () => {
    const html = `<head>
      <meta property="og:image" content="http://localhost/img.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.image).toBeUndefined();
  });

  it("drops image pointing to loopback IP", async () => {
    const html = `<head>
      <meta property="og:image" content="http://127.0.0.1/img.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.image).toBeUndefined();
  });

  it("drops image with non-http protocol", async () => {
    const html = `<head>
      <meta property="og:image" content="ftp://example.com/img.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.image).toBeUndefined();
  });

  it("drops image with dangerous port", async () => {
    const html = `<head>
      <meta property="og:image" content="https://example.com:8080/img.jpg" />
    </head>`;

    const og = await extractOpenGraph(html);

    expect(og.image).toBeUndefined();
  });
});
