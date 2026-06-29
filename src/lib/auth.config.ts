import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config — no Prisma imports here
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as any).role }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    },
    authorized({ auth }) {
      return !!auth?.user
    },
  },
  providers: [],
}
