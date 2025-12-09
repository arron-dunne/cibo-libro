"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import z from "zod";

export interface FormActionState {
  status: "success" | "error" | null;
  message?: string;
}

const FormDataObject = z.object({
  issueCatgory: z.enum(["bug", "ui", "performance", "incorrectData", "crash", "other"]),
  otherCategoryDetail: z.string().optional(),
  issueDescription: z.string(),
})

export async function submitIssue(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? undefined;

    const raw = {
      issueCategory: String(formData.get("issueCategory")) ?? "",
      otherCategoryDetail: String(formData.get("otherCategoryDetail")) ?? "",
      issueDescription: String(formData.get("issueDescription")) ?? "",
      affectedPages: formData.get("affectedPages")
    }

    const responses: Array<{ question: string; answer: string }> = [];

    const issueCategory = String(formData.get("issueCategory")) ?? "";
    if (issueCategory) { responses.push({ question: "issueCategory", answer: issueCategory })}
    
    const otherCategoryDetail = String(formData.get("issueCategory")) ?? "";
    if (issueCategory) { responses.push({ question: "issueCategory", answer: issueCategory })}



    // for (const [key, value] of formData.entries()) {
    //   if (!key) continue;

    //   const question = String(key);
    //   const answer = String(value).trim();

    //   if (answer === "") continue; // skip empty fields
    //   responses.push({ question, answer });
    // }

    // Get the user agent
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    await prisma.userContact.create({
      data: {
        userId: userId ?? undefined,
        contactType: "BUG",
        metaData: { userAgent },
        data: responses,
      },
    });
    return { status: "success" };
  
  } catch (err) {
    console.error("Issue submit error:", err);
    return { status: "error" };
  }
}
