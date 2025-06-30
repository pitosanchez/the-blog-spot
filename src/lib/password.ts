import bcrypt from "bcryptjs";
import { z } from "zod";

// Password requirements for HIPAA compliance
export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
  .refine(
    (password) => !hasCommonPatterns(password),
    "Password cannot contain common patterns or dictionary words"
  );

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher than default for medical data
  return bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Check for common password patterns
function hasCommonPatterns(password: string): boolean {
  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /login/i,
    /welcome/i,
    /medical/i,
    /doctor/i,
    /hospital/i,
    // Sequential patterns
    /abc/i,
    /def/i,
    /012/,
    /345/,
    /678/,
    /901/,
  ];

  return commonPatterns.some((pattern) => pattern.test(password));
}

// Generate secure random password for temporary use
export function generateSecurePassword(length: number = 16): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = "";
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to avoid predictable patterns
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isValid: boolean;
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  else feedback.push("Password should be at least 12 characters long");

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Add uppercase letters");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Add numbers");

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Add special characters");

  // Complexity bonus
  if (password.length >= 16) score += 1;
  if (/[!@#$%^&*()_+\-=[\]{}|;':\",./<>?]/.test(password)) score += 1;

  // Penalty for common patterns
  if (hasCommonPatterns(password)) {
    score -= 2;
    feedback.push("Avoid common words and patterns");
  }

  const isValid = score >= 6 && !hasCommonPatterns(password);

  return {
    score: Math.max(0, Math.min(10, score)),
    feedback,
    isValid,
  };
}

// Validate password complexity for medical professionals
export function validateMedicalPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    passwordSchema.parse(password);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((e) => e.message));
    }
    return { isValid: false, errors };
  }
}