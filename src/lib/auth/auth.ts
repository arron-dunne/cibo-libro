import "server-only";

export const runtime = "nodejs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { verify } from "argon2";

const credsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  return verify(hash, password);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await verifyPassword(user.passwordHash, password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; email: string; sessionVersion: number };
        (token as JWT).userId = u.id;
        (token as JWT).email = u.email;
        (token as JWT).sessionVersion = u.sessionVersion;
      }

      // Check current session version from DB to invalidate stale sessions
      if (token.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId },
          select: { sessionVersion: true },
        });

        // kill the session if its not using the most up-to-date session version
        if (!dbUser || dbUser.sessionVersion !== token.sessionVersion) {
          return {}; // empty token, session invalid
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const userId = token.userId;
      if (userId) {
        session.user = {
          id: userId as string,
          email: token.email as string,
          sessionVersion: token.sessionVersion as number,
        };
      }
      return session;
    },
  },

  // pages: { signIn: '/signin' },
});
