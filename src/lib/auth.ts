// src/lib/auth.ts
import 'server-only';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

async function verifyPassword(hash: string, password: string): Promise<boolean> {
  const { verify } = await import('argon2');
  return verify(hash, password);
}

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
      async authorize(raw) {
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
        (token as JWT).userId = u.id;
        if (u.email !== undefined) (token as JWT).email = u.email;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const userId = typeof token.userId === 'string' ? token.userId : undefined;
      if (userId) {
        session.user = {
          ...(session.user ?? { name: null, email: null }),
          id: userId,
          email: token.email ?? session.user?.email ?? null,
        };
      }
      return session;
    },
  },

  pages: { signIn: '/signin' },
});
