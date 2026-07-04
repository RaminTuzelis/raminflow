import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import type { UserRole } from "@/types/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        const currentUser = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!currentUser) {
          console.log("Auth user not found");
          return null;
        }

        if (!currentUser.isActive) {
          console.log("Auth user is inactive");
          return null;
        }

        const passwordIsValid = await argon2.verify(
          currentUser.passwordHash,
          password,
        );

        if (!passwordIsValid) {
          console.log("Auth invalid password");
          return null;
        }

        if (currentUser.mustChangePassword) {
          console.log("Auth user must change password");
          return null;
        }

        return {
          id: String(currentUser.id),
          email: currentUser.email,
          name: currentUser.name,
          role: currentUser.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
});
