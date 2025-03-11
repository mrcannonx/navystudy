import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a placeholder for development
        // In production, you would validate credentials against your database
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return {
            id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
            email: "admin@example.com",
            name: "Admin User",
            isAdmin: true,
          };
        }
        return null;
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add custom properties to token
        token.id = (user as any).id;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Add custom properties to session.user
        (session.user as any).id = token.id as string;
        (session.user as any).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export interface Session {
  user?: {
    id: string;
    email: string;
    name?: string;
    isAdmin?: boolean;
  } | null;
}

export async function auth(): Promise<Session | null> {
  try {
    // Check if we're in a real environment with auth
    if (process.env.NEXTAUTH_SECRET) {
      const nextAuthSession = await getServerSession(authOptions);
      if (nextAuthSession) {
        // Convert NextAuth session to our custom Session type
        const customSession: Session = {
          user: nextAuthSession.user ? {
            id: (nextAuthSession.user as any).id || "unknown",
            email: nextAuthSession.user.email || "unknown",
            name: nextAuthSession.user.name || undefined,
            isAdmin: (nextAuthSession.user as any).isAdmin || false,
          } : null
        };
        return customSession;
      }
    }
    
    // For development, return a mock user
    const mockSession: Session = {
      user: {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // Using a properly formatted UUID
        email: "admin@example.com",
        name: "Admin User",
        isAdmin: true,
      }
    };
    return mockSession;
  } catch (error) {
    console.error('Error in auth function:', error);
    
    // For development, return a mock user
    if (process.env.NODE_ENV === 'development') {
      const mockSession: Session = {
        user: {
          id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // Using a properly formatted UUID
          email: "admin@example.com",
          name: "Admin User",
          isAdmin: true,
        }
      };
      return mockSession;
    }
    
    return null;
  }
}
