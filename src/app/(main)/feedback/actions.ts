"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export interface FeedbackActionState {
  status: "success" | "error" | null;
  message?: string;
}

export async function submitFeedback(
  prevState: FeedbackActionState,
  formData: FormData
): Promise<FeedbackActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? undefined;

    const responses: Array<{ question: string; answer: string }> = [];

    for (const [key, value] of formData.entries()) {
      if (!key) continue;

      const question = String(key);
      const answer = String(value).trim();

      if (answer === "") continue; // skip empty fields
      responses.push({ question, answer });
    }

    // Get the user agent
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    await prisma.userContact.create({
      data: {
        userId: userId ?? undefined,
        contactType: "FEEDBACK",
        metaData: { userAgent },
        data: responses,
      },
    });

    return { status: "success", message: "Thanks for your feedback!" };
  } catch (err) {
    console.error("Feedback submit error:", err);
    return {
      status: "error",
      message: "Something went wrong while submitting your feedback.",
    };
  }
}
