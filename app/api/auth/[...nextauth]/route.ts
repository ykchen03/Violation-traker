import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/app/lib/supabase";

declare module "next-auth" {
    interface Session {
      user: {
        role?: string;
        id?: string;
      } & DefaultSession["user"];
    }
  
    interface User extends DefaultUser {
      role?: string;
    }
  }
  
declare module "next-auth/jwt" { 
  interface JWT extends DefaultJWT {
    role?: string;
    id?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          return null;
        }

        // Get user data from your users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        return {
          id: data.user.id,
          email: data.user.email,
          name: userData?.name,
          role: userData?.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: process.env.NODE_ENV === "production" ? 30 * 24 * 60 : 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
