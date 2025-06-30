import { prisma } from "@/lib/prisma";

// In-memory store for development (use Redis in production)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const sessionStore = new Map<string, { lastActivity: number; violations: number }>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
}

// Track login attempts and implement lockout
export async function trackLoginAttempt(
  email: string,
  success: boolean,
  ip?: string
): Promise<RateLimitResult> {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
  const lockoutDuration = parseInt(process.env.LOCKOUT_DURATION || "1800000"); // 30 minutes
  const now = Date.now();

  const key = `${email}:${ip || "unknown"}`;
  const current = loginAttempts.get(key) || { count: 0, lockUntil: 0 };

  // Check if currently locked
  if (current.lockUntil > now) {
    const resetTime = current.lockUntil;
    await logSecurityEvent(email, "LOGIN_BLOCKED", {
      reason: "Account locked",
      attemptsRemaining: 0,
      resetTime: new Date(resetTime),
      ip,
    });
    
    return {
      success: false,
      remaining: 0,
      resetTime,
      error: `Account locked. Try again after ${new Date(resetTime).toLocaleTimeString()}`,
    };
  }

  if (success) {
    // Reset attempts on successful login
    loginAttempts.delete(key);
    await logSecurityEvent(email, "LOGIN_SUCCESS", { ip });
    
    return {
      success: true,
      remaining: maxAttempts,
      resetTime: 0,
    };
  } else {
    // Increment failed attempts
    const newCount = current.count + 1;
    const isLocked = newCount >= maxAttempts;
    const lockUntil = isLocked ? now + lockoutDuration : 0;

    loginAttempts.set(key, {
      count: newCount,
      lockUntil,
    });

    await logSecurityEvent(email, "LOGIN_FAILED", {
      attempts: newCount,
      maxAttempts,
      locked: isLocked,
      ip,
    });

    if (isLocked) {
      // Send security alert for account lockout
      await sendSecurityAlert(email, "ACCOUNT_LOCKED", {
        attempts: newCount,
        lockDuration: lockoutDuration / 1000 / 60, // minutes
        ip,
      });
    }

    return {
      success: false,
      remaining: Math.max(0, maxAttempts - newCount),
      resetTime: lockUntil,
      error: isLocked 
        ? `Account locked after ${maxAttempts} failed attempts. Try again in ${lockoutDuration / 1000 / 60} minutes.`
        : `Invalid credentials. ${Math.max(0, maxAttempts - newCount)} attempts remaining.`,
    };
  }
}

// Monitor session activity for suspicious behavior
export async function trackSessionActivity(
  userId: string,
  activity: string,
  metadata: any = {}
): Promise<void> {
  const now = Date.now();
  const session = sessionStore.get(userId) || { lastActivity: now, violations: 0 };

  // Update last activity
  session.lastActivity = now;

  // Check for suspicious patterns
  const suspiciousActivities = [
    "RAPID_PAGE_ACCESS",
    "UNUSUAL_DOWNLOAD_PATTERN",
    "MULTIPLE_FAILED_ACTIONS",
  ];

  if (suspiciousActivities.includes(activity)) {
    session.violations += 1;

    // Alert on repeated violations
    if (session.violations >= 3) {
      await sendSecurityAlert(userId, "SUSPICIOUS_ACTIVITY", {
        violations: session.violations,
        activity,
        metadata,
      });
    }
  } else {
    // Reset violations on normal activity
    session.violations = Math.max(0, session.violations - 0.1);
  }

  sessionStore.set(userId, session);

  // Log activity for HIPAA compliance
  await logUserActivity(userId, activity, {
    ...metadata,
    timestamp: new Date(now),
    sessionViolations: session.violations,
  });
}

// Check if session is still valid based on timeout
export function isSessionValid(userId: string): boolean {
  const sessionTimeout = parseInt(process.env.SESSION_TIMEOUT || "900000"); // 15 minutes
  const session = sessionStore.get(userId);
  
  if (!session) {
    return false;
  }

  const now = Date.now();
  const isValid = (now - session.lastActivity) < sessionTimeout;

  if (!isValid) {
    sessionStore.delete(userId);
  }

  return isValid;
}

// Clean up expired entries (call periodically)
export function cleanupExpiredEntries(): void {
  const now = Date.now();

  // Clean up login attempts
  for (const [key, data] of loginAttempts.entries()) {
    if (data.lockUntil > 0 && data.lockUntil < now) {
      loginAttempts.delete(key);
    }
  }

  // Clean up inactive sessions
  const sessionTimeout = parseInt(process.env.SESSION_TIMEOUT || "900000");
  for (const [userId, session] of sessionStore.entries()) {
    if (now - session.lastActivity > sessionTimeout) {
      sessionStore.delete(userId);
    }
  }
}

// Log security events to audit log
async function logSecurityEvent(
  identifier: string,
  event: string,
  metadata: any
): Promise<void> {
  try {
    // For email-based events, try to find user ID
    let userId = identifier;
    if (identifier.includes("@")) {
      const user = await prisma.user.findUnique({
        where: { email: identifier },
        select: { id: true },
      });
      userId = user?.id || identifier;
    }

    await prisma.auditLog.create({
      data: {
        userId,
        activity: event,
        metadata: {
          ...metadata,
          timestamp: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

// Log general user activity
async function logUserActivity(
  userId: string,
  activity: string,
  metadata: any
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        activity,
        metadata,
      },
    });
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
}

// Send security alerts (placeholder - implement with email service)
async function sendSecurityAlert(
  identifier: string,
  alertType: string,
  data: any
): Promise<void> {
  console.log(`Security Alert [${alertType}] for ${identifier}:`, data);
  
  // In production, implement with email service:
  // - Account lockout notifications
  // - Suspicious activity alerts
  // - Login from new device notifications
  // - Failed 2FA attempts
}

// Get current rate limit status for user
export function getRateLimitStatus(email: string, ip?: string): {
  attempts: number;
  remaining: number;
  lockedUntil: number;
} {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
  const key = `${email}:${ip || "unknown"}`;
  const current = loginAttempts.get(key) || { count: 0, lockUntil: 0 };

  return {
    attempts: current.count,
    remaining: Math.max(0, maxAttempts - current.count),
    lockedUntil: current.lockUntil,
  };
}