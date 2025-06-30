import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

// Generate 2FA secret and QR code for user setup
export async function generate2FASecret(
  userId: string,
  userEmail: string
): Promise<TwoFactorSetup> {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `MediPublish (${userEmail})`,
    issuer: "MediPublish",
    length: 32,
  });

  // Generate QR code URL
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

  // Generate backup codes
  const backupCodes = generateBackupCodes();

  // Store secret temporarily (not enabled until verified)
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: secret.base32,
      // Store backup codes encrypted in production
    },
  });

  return {
    secret: secret.base32,
    qrCodeUrl,
    backupCodes,
  };
}

// Verify 2FA token during setup
export async function verify2FASetup(
  userId: string,
  token: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.twoFactorSecret) {
    return false;
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 2, // Allow 2 time steps (60 seconds) for clock drift
  });

  if (verified) {
    // Enable 2FA for the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
      },
    });

    // Log 2FA activation for HIPAA compliance
    await prisma.auditLog.create({
      data: {
        userId,
        activity: "2FA_ENABLED",
        metadata: {
          timestamp: new Date(),
          method: "TOTP",
        },
      },
    });
  }

  return verified;
}

// Verify 2FA token during login
export async function verify2FALogin(
  userId: string,
  token: string,
  isBackupCode: boolean = false
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return false;
  }

  let verified = false;

  if (isBackupCode) {
    // Verify backup code (implement backup code verification)
    verified = await verifyBackupCode(userId, token);
  } else {
    // Verify TOTP token
    verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 2,
    });
  }

  if (verified) {
    // Log successful 2FA verification
    await prisma.auditLog.create({
      data: {
        userId,
        activity: "2FA_VERIFIED",
        metadata: {
          timestamp: new Date(),
          method: isBackupCode ? "BACKUP_CODE" : "TOTP",
        },
      },
    });
  } else {
    // Log failed 2FA attempt
    await prisma.auditLog.create({
      data: {
        userId,
        activity: "2FA_FAILED",
        metadata: {
          timestamp: new Date(),
          method: isBackupCode ? "BACKUP_CODE" : "TOTP",
        },
      },
    });
  }

  return verified;
}

// Disable 2FA for user
export async function disable2FA(userId: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    // Log 2FA deactivation
    await prisma.auditLog.create({
      data: {
        userId,
        activity: "2FA_DISABLED",
        metadata: {
          timestamp: new Date(),
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Failed to disable 2FA:", error);
    return false;
  }
}

// Generate backup codes for 2FA recovery
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate 8-digit backup code
    const code = Math.random().toString().slice(2, 10);
    codes.push(code);
  }
  
  return codes;
}

// Verify backup code (placeholder - implement with encrypted storage)
async function verifyBackupCode(userId: string, code: string): Promise<boolean> {
  // In production, store backup codes encrypted and mark as used
  // This is a placeholder implementation
  console.log(`Verifying backup code for user ${userId}: ${code}`);
  return false; // Implement with proper backup code storage
}

// Check if user has 2FA enabled
export async function is2FAEnabled(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true },
  });

  return user?.twoFactorEnabled || false;
}

// Get 2FA status for user dashboard
export async function get2FAStatus(userId: string): Promise<{
  enabled: boolean;
  backupCodesRemaining?: number;
  lastUsed?: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      twoFactorEnabled: true,
      auditLogs: {
        where: {
          activity: "2FA_VERIFIED",
        },
        orderBy: {
          timestamp: "desc",
        },
        take: 1,
      },
    },
  });

  return {
    enabled: user?.twoFactorEnabled || false,
    backupCodesRemaining: 10, // Implement with actual backup code tracking
    lastUsed: user?.auditLogs[0]?.timestamp,
  };
}