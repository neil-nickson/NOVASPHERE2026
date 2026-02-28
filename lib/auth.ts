import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectDB } from "./db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email.trim().toLowerCase();

        await connectDB();
        const user = await User.findOne({ email }).exec();
        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

