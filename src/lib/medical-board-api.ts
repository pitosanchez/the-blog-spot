// Mock Medical Board API Integration
// In production, this would integrate with actual state medical board APIs

export interface MedicalBoardVerification {
  licenseNumber: string;
  state: string;
  isValid: boolean;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "REVOKED" | "EXPIRED";
  licenseType: string;
  issueDate: Date;
  expirationDate: Date;
  disciplinaryActions: DisciplinaryAction[];
  physician: {
    firstName: string;
    lastName: string;
    middleName?: string;
    licenseNumber: string;
    specialties: string[];
    education: Education[];
    addresses: Address[];
  };
}

export interface DisciplinaryAction {
  actionType: string;
  actionDate: Date;
  description: string;
  status: "ACTIVE" | "CLOSED";
}

export interface Education {
  institutionName: string;
  degree: string;
  graduationYear: number;
  specialty?: string;
}

export interface Address {
  type: "PRACTICE" | "RESIDENCE";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
}

// Mock data for different states
const mockLicenseDatabase: Record<string, MedicalBoardVerification[]> = {
  "CA": [
    {
      licenseNumber: "A12345",
      state: "CA",
      isValid: true,
      status: "ACTIVE",
      licenseType: "Physician and Surgeon",
      issueDate: new Date("2020-01-15"),
      expirationDate: new Date("2025-01-15"),
      disciplinaryActions: [],
      physician: {
        firstName: "John",
        lastName: "Smith",
        licenseNumber: "A12345",
        specialties: ["Internal Medicine", "Cardiology"],
        education: [
          {
            institutionName: "Stanford University School of Medicine",
            degree: "MD",
            graduationYear: 2018,
          },
        ],
        addresses: [
          {
            type: "PRACTICE",
            street: "123 Medical Center Dr",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102",
            phone: "(415) 555-0123",
          },
        ],
      },
    },
  ],
  "NY": [
    {
      licenseNumber: "NY67890",
      state: "NY",
      isValid: true,
      status: "ACTIVE",
      licenseType: "Medicine",
      issueDate: new Date("2019-06-01"),
      expirationDate: new Date("2024-06-01"),
      disciplinaryActions: [],
      physician: {
        firstName: "Sarah",
        lastName: "Johnson",
        licenseNumber: "NY67890",
        specialties: ["Emergency Medicine"],
        education: [
          {
            institutionName: "NYU School of Medicine",
            degree: "MD",
            graduationYear: 2017,
          },
        ],
        addresses: [
          {
            type: "PRACTICE",
            street: "456 Hospital Ave",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            phone: "(212) 555-0456",
          },
        ],
      },
    },
  ],
  "TX": [
    {
      licenseNumber: "TX54321",
      state: "TX",
      isValid: false,
      status: "SUSPENDED",
      licenseType: "Medicine",
      issueDate: new Date("2018-03-10"),
      expirationDate: new Date("2023-03-10"),
      disciplinaryActions: [
        {
          actionType: "Temporary Suspension",
          actionDate: new Date("2023-01-15"),
          description: "Pending investigation of patient care concerns",
          status: "ACTIVE",
        },
      ],
      physician: {
        firstName: "Michael",
        lastName: "Brown",
        licenseNumber: "TX54321",
        specialties: ["Surgery"],
        education: [
          {
            institutionName: "Baylor College of Medicine",
            degree: "MD",
            graduationYear: 2016,
          },
        ],
        addresses: [
          {
            type: "PRACTICE",
            street: "789 Surgery Center Blvd",
            city: "Houston",
            state: "TX",
            zipCode: "77001",
            phone: "(713) 555-0789",
          },
        ],
      },
    },
  ],
};

export class MedicalBoardAPI {
  // Simulate API delay
  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Verify medical license with state board
  async verifyLicense(licenseNumber: string, state: string): Promise<MedicalBoardVerification | null> {
    await this.simulateDelay();

    const stateRecords = mockLicenseDatabase[state.toUpperCase()];
    if (!stateRecords) {
      throw new Error(`State medical board API not available for ${state}`);
    }

    const record = stateRecords.find(
      r => r.licenseNumber.toLowerCase() === licenseNumber.toLowerCase()
    );

    return record || null;
  }

  // Batch verification for multiple licenses
  async verifyMultipleLicenses(
    licenses: Array<{ licenseNumber: string; state: string }>
  ): Promise<Array<{ licenseNumber: string; state: string; result: MedicalBoardVerification | null }>> {
    await this.simulateDelay();

    const results = [];
    for (const license of licenses) {
      try {
        const result = await this.verifyLicense(license.licenseNumber, license.state);
        results.push({
          licenseNumber: license.licenseNumber,
          state: license.state,
          result,
        });
      } catch (error) {
        results.push({
          licenseNumber: license.licenseNumber,
          state: license.state,
          result: null,
        });
      }
    }

    return results;
  }

  // Search physician by name (for admin verification)
  async searchPhysician(
    firstName: string,
    lastName: string,
    state?: string
  ): Promise<MedicalBoardVerification[]> {
    await this.simulateDelay();

    const searchStates = state ? [state.toUpperCase()] : Object.keys(mockLicenseDatabase);
    const results: MedicalBoardVerification[] = [];

    for (const stateCode of searchStates) {
      const stateRecords = mockLicenseDatabase[stateCode] || [];
      const matches = stateRecords.filter(
        record =>
          record.physician.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
          record.physician.lastName.toLowerCase().includes(lastName.toLowerCase())
      );
      results.push(...matches);
    }

    return results;
  }

  // Check for disciplinary actions
  async getDisciplinaryHistory(licenseNumber: string, state: string): Promise<DisciplinaryAction[]> {
    const verification = await this.verifyLicense(licenseNumber, state);
    return verification?.disciplinaryActions || [];
  }

  // Validate DEA number format (basic validation)
  validateDEANumber(deaNumber: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const cleanDEA = deaNumber.replace(/\s+/g, "").toUpperCase();

    // DEA number format: 2 letters + 7 digits
    if (!/^[A-Z]{2}\d{7}$/.test(cleanDEA)) {
      errors.push("DEA number must be 2 letters followed by 7 digits");
    }

    // First letter must be A, B, F, or M
    if (cleanDEA.length >= 1 && !["A", "B", "F", "M"].includes(cleanDEA[0])) {
      errors.push("First letter must be A, B, F, or M");
    }

    // Checksum validation (simplified)
    if (cleanDEA.length === 9) {
      const digits = cleanDEA.slice(2);
      const sum1 = parseInt(digits[0]) + parseInt(digits[2]) + parseInt(digits[4]) + parseInt(digits[6]);
      const sum2 = parseInt(digits[1]) + parseInt(digits[3]) + parseInt(digits[5]);
      const checksum = (sum1 + sum2 * 2) % 10;
      
      if (checksum !== parseInt(digits[6])) {
        errors.push("Invalid DEA number checksum");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get supported states
  getSupportedStates(): string[] {
    return Object.keys(mockLicenseDatabase);
  }

  // Check if state board API is available
  isStateSupported(state: string): boolean {
    return state.toUpperCase() in mockLicenseDatabase;
  }
}

// Singleton instance
export const medicalBoardAPI = new MedicalBoardAPI();

// Helper function to format verification results for display
export function formatVerificationResult(result: MedicalBoardVerification | null): {
  isValid: boolean;
  statusColor: string;
  statusText: string;
  warnings: string[];
} {
  if (!result) {
    return {
      isValid: false,
      statusColor: "text-red-600",
      statusText: "License not found",
      warnings: ["License number not found in state database"],
    };
  }

  const warnings: string[] = [];
  let statusColor = "text-green-600";
  let statusText = "Valid License";
  let isValid = true;

  // Check license status
  switch (result.status) {
    case "SUSPENDED":
      isValid = false;
      statusColor = "text-red-600";
      statusText = "License Suspended";
      warnings.push("License is currently suspended");
      break;
    case "REVOKED":
      isValid = false;
      statusColor = "text-red-600";
      statusText = "License Revoked";
      warnings.push("License has been revoked");
      break;
    case "EXPIRED":
      isValid = false;
      statusColor = "text-orange-600";
      statusText = "License Expired";
      warnings.push("License has expired");
      break;
    case "INACTIVE":
      isValid = false;
      statusColor = "text-orange-600";
      statusText = "License Inactive";
      warnings.push("License is inactive");
      break;
  }

  // Check expiration date
  if (result.expirationDate < new Date()) {
    isValid = false;
    statusColor = "text-orange-600";
    statusText = "License Expired";
    warnings.push("License expired on " + result.expirationDate.toLocaleDateString());
  }

  // Check for disciplinary actions
  const activeDisciplinary = result.disciplinaryActions.filter(action => action.status === "ACTIVE");
  if (activeDisciplinary.length > 0) {
    warnings.push(`${activeDisciplinary.length} active disciplinary action(s)`);
  }

  return {
    isValid,
    statusColor,
    statusText,
    warnings,
  };
}