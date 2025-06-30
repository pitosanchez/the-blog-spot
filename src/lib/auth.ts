import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User, UserRole, VerificationStatus } from "@prisma/client";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

// Extended user type for NextAuth
interface ExtendedUser extends User {
  role: UserRole;
  verificationStatus: VerificationStatus;
  specialties: string[];
  medicalCredentials: any;
  licenseNumber?: string | null;
  institution?: string | null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text", optional: true },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
          }

          // Validate input
          const validatedFields = loginSchema.safeParse({
            email: credentials.email,
            password: credentials.password,
          });

          if (!validatedFields.success) {
            throw new Error("Invalid credentials format");
          }

          const { email, password } = validatedFields.data;

          // Check for login attempts (rate limiting)
          const attemptKey = `login_attempts:${email}`;
          const attempts = await getLoginAttempts(email);
          
          if (attempts >= parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5")) {
            throw new Error("Account temporarily locked due to too many failed attempts");
          }

          // Find user
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              // Include relations if needed for 2FA
            },
          });

          if (!user) {
            await incrementLoginAttempts(email);
            throw new Error("Invalid credentials");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            await incrementLoginAttempts(email);
            throw new Error("Invalid credentials");
          }

          // Check 2FA if enabled
          if (user.twoFactorEnabled && credentials.twoFactorCode) {
            const is2FAValid = await verify2FA(user.id, credentials.twoFactorCode);
            if (!is2FAValid) {
              await incrementLoginAttempts(email);
              throw new Error("Invalid 2FA code");
            }
          } else if (user.twoFactorEnabled && !credentials.twoFactorCode) {
            throw new Error("2FA code required");
          }

          // Reset login attempts on successful login
          await resetLoginAttempts(email);

          // Log successful login for HIPAA compliance
          await logUserActivity(user.id, "LOGIN_SUCCESS", {
            timestamp: new Date(),
            ip: "unknown", // Will be set in middleware
          });

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            verificationStatus: user.verificationStatus,
            specialties: user.specialties,
            medicalCredentials: user.medicalCredentials,
            licenseNumber: user.licenseNumber,
            institution: user.institution,
            profileImage: user.profileImage,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.SESSION_TIMEOUT || "900"), // 15 minutes default
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: parseInt(process.env.SESSION_TIMEOUT || "900"),
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.verificationStatus = user.verificationStatus;
        token.specialties = user.specialties;
        token.medicalCredentials = user.medicalCredentials;
        token.licenseNumber = user.licenseNumber;
        token.institution = user.institution;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.user.verificationStatus = token.verificationStatus as VerificationStatus;
        session.user.specialties = token.specialties as string[];
        session.user.medicalCredentials = token.medicalCredentials;
        session.user.licenseNumber = token.licenseNumber as string | null;
        session.user.institution = token.institution as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log sign-in for HIPAA compliance
      await logUserActivity(user.id, "SIGN_IN", {
        timestamp: new Date(),
        provider: account?.provider,
        isNewUser,
      });
    },
    async signOut({ session }) {
      // Log sign-out for HIPAA compliance
      if (session?.user?.id) {
        await logUserActivity(session.user.id, "SIGN_OUT", {
          timestamp: new Date(),
        });
      }
    },
  },
};

// Helper functions for rate limiting and logging
async function getLoginAttempts(email: string): Promise<number> {
  // In production, use Redis or similar
  // For now, return 0 (implement with Redis later)
  return 0;
}

async function incrementLoginAttempts(email: string): Promise<void> {
  // Implement with Redis for production
  console.log(`Failed login attempt for: ${email}`);
}

async function resetLoginAttempts(email: string): Promise<void> {
  // Implement with Redis for production
  console.log(`Reset login attempts for: ${email}`);
}

async function verify2FA(userId: string, code: string): Promise<boolean> {
  // Implement 2FA verification logic
  // This will be expanded in the 2FA implementation
  return true;
}

async function logUserActivity(
  userId: string,
  activity: string,
  metadata: any
): Promise<void> {
  try {
    // Log to database for HIPAA compliance
    await prisma.auditLog.create({
      data: {
        userId,
        activity,
        metadata,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
}