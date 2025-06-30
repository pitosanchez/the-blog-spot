import { UserRole, VerificationStatus } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      verificationStatus: VerificationStatus;
      specialties: string[];
      medicalCredentials: any;
      licenseNumber?: string | null;
      institution?: string | null;
      profileImage?: string | null;
    };
  }

  interface User {
    role: UserRole;
    verificationStatus: VerificationStatus;
    specialties: string[];
    medicalCredentials: any;
    licenseNumber?: string | null;
    institution?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    verificationStatus: VerificationStatus;
    specialties: string[];
    medicalCredentials: any;
    licenseNumber?: string | null;
    institution?: string | null;
  }
}