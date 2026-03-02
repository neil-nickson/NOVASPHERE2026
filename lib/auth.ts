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
          mobileNumber: user.mobileNumber,
          college: user.college,
          course: user.course,
          year: user.year,
          emailVerified: user.emailVerified
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.mobileNumber = (user as any).mobileNumber;
        token.college = (user as any).college;
        token.course = (user as any).course;
        token.year = (user as any).year;
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).mobileNumber = token.mobileNumber;
        (session.user as any).college = token.college;
        (session.user as any).course = token.course;
        (session.user as any).year = token.year;
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

