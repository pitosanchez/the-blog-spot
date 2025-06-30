import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, validateMedicalPassword } from "@/lib/password";
import { trackLoginAttempt } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(12, "Password must be at least 12 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["READER", "CREATOR"]),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown";

    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password, firstName, lastName, role } = validatedData;

    // Validate password strength for medical compliance
    const passwordValidation = validateMedicalPassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: "Password does not meet security requirements",
          details: passwordValidation.errors 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Log suspicious registration attempt
      await prisma.auditLog.create({
        data: {
          userId: existingUser.id,
          activity: "DUPLICATE_REGISTRATION_ATTEMPT",
          metadata: {
            ip: clientIP,
            timestamp: new Date(),
          },
        },
      });

      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        // Store name in medical credentials for now
        medicalCredentials: {
          firstName,
          lastName,
          registrationDate: new Date(),
        },
        specialties: [],
        verificationStatus: role === "CREATOR" ? "PENDING" : "VERIFIED",
      },
    });

    // Log successful registration
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        activity: "USER_REGISTERED",
        metadata: {
          role,
          ip: clientIP,
          timestamp: new Date(),
          requiresVerification: role === "CREATOR",
        },
      },
    });

    // Send verification email (placeholder)
    await sendVerificationEmail(email, newUser.id);

    return NextResponse.json(
      {
        message: "Account created successfully",
        userId: newUser.id,
        requiresVerification: role === "CREATOR",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}

// Placeholder for email verification service
async function sendVerificationEmail(email: string, userId: string): Promise<void> {
  // In production, integrate with email service (Resend, SendGrid, etc.)
  console.log(`Verification email would be sent to: ${email} for user: ${userId}`);
  
  // Generate verification token
  const verificationToken = generateVerificationToken();
  
  // Store token with expiration (24 hours)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      resetToken: verificationToken,
      resetTokenExpiry: expiresAt,
    },
  });

  // TODO: Send actual email with verification link
  // const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
}

function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}