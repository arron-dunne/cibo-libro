"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export async function submitFeedback(formData: FormData) {

  const session = await auth();
  const userId = session?.user?.id ?? undefined;

  const responses: Array<{ question: string; answer: string }> = [];

  for (const [key, value] of formData.entries()) {
    if (!key) continue;

    const question = String(key);
    const answer = String(value).trim();

    if (answer === "") continue; // skip empty fields

    responses.push({
      question,
      answer,
    });
  }

  console.log(responses);
  
  // TODO: better error handling
  const record = await prisma.userContact.create({
    data: {
      userId: userId ?? undefined,
      contactType: "FEEDBACK",
      data: responses,
    },
  });
}
