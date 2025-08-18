import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { z } from "zod";

const credsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter is optional when using only Credentials + JWT,
  // but you can keep it since we already have Prisma models.
  adapter: PrismaAdapter(prisma),

  // ✅ Required for Credentials in v5
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        console.log('raw:', raw);
        const { email, password } = credsSchema.parse(raw ?? {});
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await argon2.verify(user.passwordHash, password);
        return ok ? { id: user.id, email: user.email } : null;
      },
    }),
  ],

  callbacks: {
    // Put user info into the JWT on first sign-in
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.email = (user as any).email;
      }
      return token;
    },
    // Expose it on the session object
    async session({ session, token }) {
      if (token?.userId) {
        session.user = {
          ...(session.user || {}),
          id: token.userId as string,
          email: (token.email as string) ?? session.user?.email ?? null,
        } as any;
      }
      return session;
    },
  },

  pages: { signIn: "/signin" },
});
