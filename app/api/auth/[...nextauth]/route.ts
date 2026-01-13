import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import connectDB from "@/lib/mongodb";
import mongoClient from "@/lib/mongodb-client";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";

interface ExtendedSession extends Session {
  user?: Session["user"] & { id?: string };
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(mongoClient),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    // 1. Save the user ID into the JWT token right after sign in
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // 2. Pass the ID from the token into the session object for the client
    async session({ session, token }): Promise<ExtendedSession> {
      if (session.user && token.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session as ExtendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
