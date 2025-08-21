// app/api/images/sign-get/route.ts
"use server";

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { signGet } from "@/lib/images/r2";
// import { prisma } from "@/lib/db"; // if you want to authz that key belongs to user

const Body = z.object({
  key: z.string().min(3).max(512),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const { key } = body;

  // OPTIONAL defense-in-depth: verify the key belongs to the current user or a public recipe.
  // Example (pseudo):
  // const recipe = await prisma.recipe.findFirst({ where: { imageKey: key } });
  // if (!recipe) return new NextResponse("Not found", { status: 404 });
  // if (recipe.ownerId !== session.user.id && !recipe.isPublic) {
  //   return new NextResponse("Forbidden", { status: 403 });
  // }

  const { url, expiresIn } = await signGet({ key: key });

  return NextResponse.json({
    url,
    expiresIn: expiresIn,
  });
}
