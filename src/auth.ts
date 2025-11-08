/**
 * NextAuth Configuration for App Router
 * 
 * This file configures NextAuth v5 for use with the App Router and Prisma
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { googleOAuth, auth } from "./lib/env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: googleOAuth.clientId || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: googleOAuth.clientSecret || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: auth.secret || process.env.AUTH_SECRET,
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
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

