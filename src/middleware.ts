import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole, VerificationStatus } from "@prisma/client";

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard": ["READER", "CREATOR", "ADMIN"],
  "/create": ["CREATOR", "ADMIN"],
  "/analytics": ["CREATOR", "ADMIN"],
  "/admin": ["ADMIN"],
  "/profile": ["READER", "CREATOR", "ADMIN"],
  "/settings": ["READER", "CREATOR", "ADMIN"],
} as const;

// Routes that require medical verification
const verificationRequiredRoutes = [
  "/create",
  "/dashboard/publish",
  "/dashboard/cme",
];

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/about",
  "/pricing",
  "/contact",
  "/api/auth",
  "/api/webhooks",
];

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const requiredRoles = getRequiredRoles(pathname);
    if (requiredRoles && !requiredRoles.includes(token.role as UserRole)) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    // Check medical verification for sensitive routes
    if (verificationRequiredRoutes.some(route => pathname.startsWith(route))) {
      if (token.verificationStatus !== "VERIFIED") {
        return NextResponse.redirect(new URL("/auth/verification-required", req.url));
      }
    }

    // Session timeout check (15 minutes)
    const sessionTimeout = parseInt(process.env.SESSION_TIMEOUT || "900000");
    const lastActivity = token.iat ? token.iat * 1000 : Date.now();
    
    if (Date.now() - lastActivity > sessionTimeout) {
      const response = NextResponse.redirect(new URL("/auth/login?expired=true", req.url));
      response.cookies.delete("next-auth.session-token");
      return response;
    }

    // Log access for HIPAA compliance
    await logAccess(token.sub as string, pathname, req);

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This runs before the middleware function
        // Return true to allow the request to continue to the middleware
        return true; // We handle auth logic in the middleware function
      },
    },
  }
);

function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return roles as string[];
    }
  }
  return null;
}

async function logAccess(userId: string, pathname: string, req: NextRequest) {
  try {
    // In production, this would log to your audit system
    const logData = {
      userId,
      pathname,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    };

    // For now, just console log (implement proper logging later)
    console.log("Access log:", logData);

    // In production, you would save this to your AuditLog table
    // await prisma.auditLog.create({
    //   data: {
    //     userId,
    //     activity: "PAGE_ACCESS",
    //     metadata: logData,
    //   },
    // });
  } catch (error) {
    console.error("Failed to log access:", error);
  }
}

// Configure which routes should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};