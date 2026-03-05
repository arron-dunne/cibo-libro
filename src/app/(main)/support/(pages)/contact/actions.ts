"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export interface ContactActionState {
  status: "success" | "error" | null;
}

export async function submitContact(
  prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? undefined;

    const responses: Array<{ question: string; answer: string }> = [];

    for (const [key, value] of formData.entries()) {
      if (!key) continue;
      const answer = String(value).trim();
      if (answer === "") continue;
      responses.push({ question: String(key), answer });
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    await prisma.userContact.create({
      data: {
        userId: userId ?? undefined,
        contactType: "GENERAL",
        metaData: { userAgent },
        data: responses,
      },
    });

    return { status: "success" };
  } catch (err) {
    console.error("Contact submit error:", err);
    return { status: "error" };
  }
}
