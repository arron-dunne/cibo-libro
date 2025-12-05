"use server";

import { headers } from 'next/headers'
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

  // Get the user agent
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  
  // TODO: rate limits, prevent rapid submissions
  // TODO: better error handling
  await prisma.userContact.create({
    data: {
      user: { connect: { id: userId }},
      contactType: "FEEDBACK",
      metaData: { userAgent },
      data: responses,
    },
  });
}
