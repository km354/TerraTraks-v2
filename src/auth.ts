/**
 * NextAuth Configuration for App Router
 * 
 * This file configures NextAuth v5 for use with the App Router
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { googleOAuth, auth } from "./lib/env";

export const { handlers, signIn, signOut, auth: getServerSession } = NextAuth({
  providers: [
    Google({
      clientId: googleOAuth.clientId || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: googleOAuth.clientSecret || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: auth.secret || process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

// Export auth handlers for API routes
export const { GET, POST } = handlers;

