// src/lib/auth.ts
// Server-only: this file must never be imported by client components or middleware directly.
import 'server-only';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Module augmentation to avoid `any` in callbacks
// ─────────────────────────────────────────────────────────────────────────────
import type { DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: (DefaultSession['user'] & {
      id: string;
      email: string | null;
    }) | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    email?: string | null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────
const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Helper to verify password on the server without bundling argon2 into edge/client
async function verifyPassword(hash: string, password: string): Promise<boolean> {
  const { verify } = await import('argon2');
  return verify(hash, password);
}

// ─────────────────────────────────────────────────────────────────────────────
// NextAuth configuration
// ─────────────────────────────────────────────────────────────────────────────
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw): Promise<{ id: string; email: string | null } | null> {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await verifyPassword(user.passwordHash, password);
        return ok ? { id: user.id, email: user.email } : null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; email?: string | null };
        token.userId = u.id;
        if (u.email !== undefined) token.email = u.email;
      }
      return token as JWT;
    },

    async session({ session, token }) {
      if (token?.userId) {
        session.user = {
          ...(session.user ?? { name: null, email: null }),
          id: token.userId,
          email: token.email ?? session.user?.email ?? null,
        };
      }
      // If no token.userId, leave session.user as-is (do not assign null) to satisfy NextAuth types
      return session;
    },
  },

  pages: { signIn: '/signin' },
});
