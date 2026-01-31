import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import connectDB from "@/lib/mongodb";
import mongoClient from "@/lib/mongodb-client";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";

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
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role || "student",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    // Handle sign in and set default role for OAuth users
    async signIn({ user, account }) {
      // For OAuth providers (GitHub), ensure user has a role
      if (account?.provider !== "credentials") {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser && !dbUser.role) {
          dbUser.role = "student";
          await dbUser.save();
        }
      }
      return true;
    },
    // 1. Save the user ID and role into the JWT token right after sign in
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Fetch role from database for OAuth users
        if (!user.role) {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          token.role = dbUser?.role || "student";
        } else {
          token.role = user.role;
        }
      }
      // Update role if session update is triggered
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    // 2. Pass the ID and role from the token into the session object for the client
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        if (token.id) {
          (session.user as { id: string; role: string }).id =
            token.id as string;
        }
        if (token.role) {
          (session.user as { id: string; role: string }).role =
            token.role as string;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
