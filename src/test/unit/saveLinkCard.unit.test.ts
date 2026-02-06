/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recipe: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/uniqueSlug", () => ({
  uniqueRecipeSlug: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { saveLinkCard } from "@/app/(main)/import/link/actions";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { uniqueRecipeSlug } from "@/lib/uniqueSlug";
import { redirect } from "next/navigation";

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(prisma.recipe.create);
const mockUniqueSlug = vi.mocked(uniqueRecipeSlug);
const mockRedirect = vi.mocked(redirect);

function createFormData(data: {
  url: string;
  title: string;
  imageUrl?: string;
  description?: string;
  tags?: string[];
}): FormData {
  const fd = new FormData();
  fd.append("url", data.url);
  fd.append("title", data.title);
  if (data.imageUrl) fd.append("imageUrl", data.imageUrl);
  if (data.description) fd.append("description", data.description);
  data.tags?.forEach((t) => fd.append("tags", t));
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUniqueSlug.mockResolvedValue("test-slug");
  mockCreate.mockResolvedValue({ id: "recipe-1" } as any);
});


describe("authentication", () => {
  test("throws when session is null", async () => {
    mockAuth.mockResolvedValue(null as any);
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow("must be signed in");
  });

  test("throws when session has no user", async () => {
    mockAuth.mockResolvedValue({ expires: "2099-01-01" } as any);
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow("must be signed in");
  });

  test("throws when session.user has no id", async () => {
    mockAuth.mockResolvedValue({ user: { email: "test@example.com" } } as any);
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow("must be signed in");
  });

  test("proceeds when session has valid user.id", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalled();
  });
});


describe("URL validation", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
  });

  test("accepts valid HTTPS URL", async () => {
    const fd = createFormData({ url: "https://example.com/recipe", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalled();
  });

  test("accepts valid HTTP URL", async () => {
    const fd = createFormData({ url: "http://example.com/recipe", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalled();
  });

  test("rejects invalid URL", async () => {
    const fd = createFormData({ url: "not-a-url", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });

  test("rejects missing URL", async () => {
    const fd = new FormData();
    fd.append("title", "Test");

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });

  test("rejects empty URL string", async () => {
    const fd = createFormData({ url: "", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });
});


describe("title validation", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
  });

  test("accepts valid title", async () => {
    const fd = createFormData({ url: "https://example.com", title: "My Recipe" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ title: "My Recipe" }),
      })
    );
  });

  test("rejects empty title", async () => {
    const fd = createFormData({ url: "https://example.com", title: "" });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });

  test("rejects missing title", async () => {
    const fd = new FormData();
    fd.append("url", "https://example.com");

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });
});


describe("optional fields", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
  });

  test("accepts missing imageUrl", async () => {
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ imageExternalUrl: undefined }),
      })
    );
  });

  test("accepts valid imageUrl", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      imageUrl: "https://example.com/image.jpg",
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ imageExternalUrl: "https://example.com/image.jpg" }),
      })
    );
  });

  test("rejects invalid imageUrl", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      imageUrl: "not-a-url",
    });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });

  test("accepts missing description", async () => {
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ description: "" }),
      })
    );
  });

  test("accepts description up to 10000 chars", async () => {
    const longDesc = "a".repeat(10000);
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      description: longDesc,
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ description: longDesc }),
      })
    );
  });

  test("rejects description over 10000 chars", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      description: "a".repeat(10001),
    });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });
});


describe("tags validation", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
  });

  test("accepts empty tags array", async () => {
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tags: [] }),
      })
    );
  });

  test("accepts single valid tag", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: ["dinner"],
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tags: ["dinner"] }),
      })
    );
  });

  test("accepts multiple valid tags", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: ["dinner", "quick", "easy"],
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tags: ["dinner", "quick", "easy"] }),
      })
    );
  });

  test("accepts tag with 1 char", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: ["x"],
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalled();
  });

  test("accepts tag with 48 chars", async () => {
    const longTag = "a".repeat(48);
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: [longTag],
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tags: [longTag] }),
      })
    );
  });

  test("rejects tag over 48 chars", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: ["a".repeat(49)],
    });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });

  test("filters out empty string tags", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: [""],
    });

    await saveLinkCard(fd);

    // Empty tags are filtered out by .filter(Boolean) before validation
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tags: [] }),
      })
    );
  });

  test("rejects whitespace-only tag", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: ["   "],
    });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });
});


describe("successful save", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
  });

  test("creates recipe with type EXTERNAL_LINK", async () => {
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: "EXTERNAL_LINK" }),
      })
    );
  });

  test("sets status to PUBLISHED", async () => {
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PUBLISHED" }),
      })
    );
  });

  test("sets isPublic to false", async () => {
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isPublic: false }),
      })
    );
  });

  test("maps url to sourceUrl", async () => {
    const fd = createFormData({ url: "https://example.com/recipe", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sourceUrl: "https://example.com/recipe" }),
      })
    );
  });

  test("maps imageUrl to imageExternalUrl", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      imageUrl: "https://example.com/image.png",
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ imageExternalUrl: "https://example.com/image.png" }),
      })
    );
  });

  test("calls uniqueRecipeSlug with title", async () => {
    const fd = createFormData({ url: "https://example.com", title: "My Great Recipe" });

    await saveLinkCard(fd);

    expect(mockUniqueSlug).toHaveBeenCalledWith("My Great Recipe");
  });

  test("uses slug from uniqueRecipeSlug", async () => {
    mockUniqueSlug.mockResolvedValue("my-great-recipe");
    const fd = createFormData({ url: "https://example.com", title: "My Great Recipe" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ slug: "my-great-recipe" }),
      })
    );
  });

  test("sets ownerId from session", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } } as any);
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ ownerId: "user-123" }),
      })
    );
  });

  test("redirects to /all on success", async () => {
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await saveLinkCard(fd);

    expect(mockRedirect).toHaveBeenCalledWith("/all");
  });
});


describe("error handling", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
  });

  test("throws user-friendly error when database create fails", async () => {
    mockCreate.mockRejectedValue(new Error("DB connection failed"));
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow("Failed to save Link Card");
  });

  test("throws when slug generation fails", async () => {
    mockUniqueSlug.mockRejectedValue(new Error("Slug generation failed"));
    const fd = createFormData({ url: "https://example.com", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow();
  });
});
