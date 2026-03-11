/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, vi, beforeEach } from "vitest";

// ----------------- Mocks ---------------------
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

// ----------------- Helpers ---------------------
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
  mockAuth.mockResolvedValue({ user: { id: "user-1" } } as any);
  mockUniqueSlug.mockResolvedValue("test-slug");
  mockCreate.mockResolvedValue({ id: "recipe-1" } as any);
});

// ----------------- Tests ---------------------
describe("saveLinkCard integration - success flow", () => {
  test("saves a minimal link card", async () => {
    const fd = createFormData({
      url: "https://example.com/recipe",
      title: "Simple Recipe",
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        ownerId: "user-1",
        type: "EXTERNAL_LINK",
        title: "Simple Recipe",
        description: "",
        sourceUrl: "https://example.com/recipe",
        imageExternalUrl: undefined,
        tags: [],
        slug: "test-slug",
        status: "PUBLISHED",
        isPublic: false,
      },
    });
    expect(mockRedirect).toHaveBeenCalledWith("/all");
  });

  test("saves a fully populated link card", async () => {
    mockUniqueSlug.mockResolvedValue("chicken-soup");
    const fd = createFormData({
      url: "https://recipes.example.com/soup",
      title: "Chicken Soup",
      imageUrl: "https://cdn.example.com/soup.jpg",
      description: "A delicious family recipe passed down for generations.",
      tags: ["dinner", "chicken", "soup"],
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        ownerId: "user-1",
        type: "EXTERNAL_LINK",
        title: "Chicken Soup",
        description: "A delicious family recipe passed down for generations.",
        sourceUrl: "https://recipes.example.com/soup",
        imageExternalUrl: "https://cdn.example.com/soup.jpg",
        tags: ["dinner", "chicken", "soup"],
        slug: "chicken-soup",
        status: "PUBLISHED",
        isPublic: false,
      },
    });
  });

  test("trims whitespace from tags", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      tags: ["  trimmed  ", "  spaces  "],
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: ["trimmed", "spaces"],
        }),
      }),
    );
  });

  test("handles FormData with multiple tags appended separately", async () => {
    const fd = new FormData();
    fd.append("url", "https://example.com");
    fd.append("title", "Test");
    fd.append("tags", "tag1");
    fd.append("tags", "tag2");
    fd.append("tags", "tag3");

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: ["tag1", "tag2", "tag3"],
        }),
      }),
    );
  });
});

describe("saveLinkCard integration - validation errors", () => {
  test("rejects when URL and title are both invalid", async () => {
    const fd = createFormData({ url: "bad", title: "" });

    await expect(saveLinkCard(fd)).rejects.toThrow();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("rejects when URL is not a valid URL format", async () => {
    const fd = createFormData({ url: "not-a-valid-url", title: "Test" });

    await expect(saveLinkCard(fd)).rejects.toThrow();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("rejects when title is empty", async () => {
    const fd = createFormData({ url: "https://example.com", title: "" });

    await expect(saveLinkCard(fd)).rejects.toThrow();
    expect(mockCreate).not.toHaveBeenCalled();
  });
});

describe("saveLinkCard integration - edge cases", () => {
  test("handles URL with query parameters and fragments", async () => {
    const fd = createFormData({
      url: "https://example.com/recipe?id=123&source=app#ingredients",
      title: "Test",
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sourceUrl: "https://example.com/recipe?id=123&source=app#ingredients",
        }),
      }),
    );
  });

  test("handles international characters in title", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Crème Brûlée aux Fraises",
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Crème Brûlée aux Fraises",
        }),
      }),
    );
  });

  test("handles emoji in description", async () => {
    const fd = createFormData({
      url: "https://example.com",
      title: "Test",
      description: "This recipe is 🔥 fire!",
    });

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          description: "This recipe is 🔥 fire!",
        }),
      }),
    );
  });

  test("filters out empty tag entries from FormData", async () => {
    const fd = new FormData();
    fd.append("url", "https://example.com");
    fd.append("title", "Test");
    fd.append("tags", "valid");
    fd.append("tags", "");
    fd.append("tags", "also-valid");

    await saveLinkCard(fd);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: ["valid", "also-valid"],
        }),
      }),
    );
  });
});
