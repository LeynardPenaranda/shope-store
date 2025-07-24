import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { adapter } from "next/dist/server/web/adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";

import { cookies } from "next/headers";
import { authConfig } from "./auth.config";

export const config = {
  pages: {
    signIn: "/signIn",
    error: "/signIn",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //Find user to the database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if the user exist and if the password matches

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // if password is correct

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        //if user does not exist or password does not match return null
        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      //set user id from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      //if there's an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role ?? "user"; // default role if none

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              //Delete Current User Cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              //Assigned New Cart

              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      return token;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
