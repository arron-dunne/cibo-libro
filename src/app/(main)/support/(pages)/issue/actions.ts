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
  issueCategory: z.enum([
    "bug",
    "ui",
    "performance",
    "incorrectData",
    "crash",
    "other",
  ]),
  otherCategoryDetail: z.string().optional(),
  issueDescription: z.string(),
  affectedPages: z.array(z.string()).optional(),
});

export async function submitIssue(
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? undefined;

    const raw = {
      issueCategory: String(formData.get("issueCategory")) ?? "",
      otherCategoryDetail: String(formData.get("otherCategoryDetail")) ?? "",
      issueDescription: String(formData.get("issueDescription")) ?? "",
      affectedPages: formData.getAll("affectedPages"),
    };

    const parsed = FormDataObject.safeParse(raw);

    if (!parsed.success) {
      return { status: "error" };
    }

    const responses: Array<{ question: string; answer: string }> = [];

    const issueCategory = String(formData.get("issueCategory")) ?? "";
    if (issueCategory) {
      responses.push({ question: "issueCategory", answer: issueCategory });
    }

    const otherCategoryDetail = String(formData.get("otherCategoryDetail")) ?? "";
    if (otherCategoryDetail) {
      responses.push({
        question: "otherCategoryDetail",
        answer: otherCategoryDetail,
      });
    }

    const issueDescription = String(formData.get("issueDescription")) ?? "";
    if (issueDescription) {
      responses.push({
        question: "issueDescription",
        answer: issueDescription,
      });
    }

    const affectedPages = formData.getAll("affectedPages");
    if (affectedPages.length > 0) {
      responses.push({
        question: "affectedPages",
        answer: affectedPages.join(", "),
      });
    }

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
    console.log(err);
    return { status: "error" };
  }
}
