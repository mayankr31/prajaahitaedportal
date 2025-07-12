// src\auth.js
import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

const adapter = PrismaAdapter(prisma);

// Custom error class
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid credentials";
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        if (!user) {
          throw new Error("Invalid Credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user,  account }) {
      if(user){
        token.id = user.id;
        token.role = user.role;
      }
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },

    // This callback is called whenever a session is checked.
    // We pass the role from the JWT to the session object that client-side components access.
    async session({ session, token }) {
      // If `token` contains custom properties from the `jwt` callback,
      // they will be available here.
      if (token) {
        session.user.id = token.id; // Ensure user ID is in session
        session.user.role = token.role; // <-- IMPORTANT: Add role to session
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});

