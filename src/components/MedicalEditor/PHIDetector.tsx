// HIPAA-compliant PHI detection and redaction tools

export interface PHIDetectionResult {
  hasPHI: boolean;
  warnings: string[];
  detectedItems: PHIItem[];
  confidence: 'low' | 'medium' | 'high';
}

export interface PHIItem {
  type: PHIType;
  text: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  suggestion?: string;
}

export type PHIType = 
  | 'name'
  | 'ssn'
  | 'phone'
  | 'email'
  | 'address'
  | 'date_of_birth'
  | 'medical_record_number'
  | 'account_number'
  | 'certificate_license_number'
  | 'device_identifier'
  | 'web_url'
  | 'ip_address'
  | 'biometric_identifier'
  | 'photograph'
  | 'other_unique_identifier';

export class PHIDetector {
  // Regex patterns for different types of PHI
  private static patterns = {
    // Social Security Numbers
    ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    
    // Phone numbers (various formats)
    phone: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    
    // Email addresses
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    
    // Medical Record Numbers (common patterns)
    mrn: /\b(?:MRN|mrn|medical\s*record\s*number?)\s*:?\s*([A-Z0-9]{6,15})\b/gi,
    
    // Account numbers
    account: /\b(?:account|acct)\s*#?\s*:?\s*([A-Z0-9]{8,20})\b/gi,
    
    // Dates that could be DOB (MM/DD/YYYY, MM-DD-YYYY, etc.)
    date_birth: /\b(?:0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}\b/g,
    
    // License numbers
    license: /\b(?:license|lic)\s*#?\s*:?\s*([A-Z0-9]{6,15})\b/gi,
    
    // Device identifiers
    device: /\b(?:device\s*id|serial\s*number|model)\s*:?\s*([A-Z0-9]{8,20})\b/gi,
    
    // IP addresses
    ip: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    
    // Web URLs
    url: /https?:\/\/[^\s]+/g,
    
    // Potential names (basic pattern - high false positive rate)
    name: /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g,
    
    // Street addresses (basic pattern)
    address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct|Circle|Cir)\b/gi,
  };

  // Common medical terms that are NOT PHI (to reduce false positives)
  private static medicalTermsAllowlist = new Set([
    'heart rate', 'blood pressure', 'temperature', 'oxygen saturation',
    'respiratory rate', 'white blood cell', 'red blood cell', 'hemoglobin',
    'glucose', 'cholesterol', 'triglycerides', 'creatinine', 'bun',
    'sodium', 'potassium', 'chloride', 'co2', 'anion gap',
    'chest pain', 'shortness of breath', 'abdominal pain', 'headache',
    'nausea', 'vomiting', 'diarrhea', 'constipation', 'fatigue',
    'john doe', 'jane doe', 'patient', 'male', 'female', 'year old',
    'emergency department', 'operating room', 'intensive care unit',
    'medical history', 'physical examination', 'vital signs',
    'laboratory results', 'imaging studies', 'treatment plan',
    'prescription', 'medication', 'dosage', 'follow up'
  ]);

  // Common first names (to help identify potential name PHI)
  private static commonFirstNames = new Set([
    'james', 'mary', 'john', 'patricia', 'robert', 'jennifer', 'michael',
    'elizabeth', 'william', 'linda', 'david', 'barbara', 'richard', 'susan',
    'joseph', 'jessica', 'thomas', 'sarah', 'christopher', 'karen',
    'charles', 'nancy', 'daniel', 'betty', 'matthew', 'helen', 'anthony',
    'sandra', 'mark', 'donna', 'donald', 'carol', 'steven', 'ruth',
    'paul', 'sharon', 'andrew', 'michelle', 'joshua', 'laura', 'kenneth',
    'sarah', 'kevin', 'kimberly', 'brian', 'deborah', 'george', 'dorothy',
    'edward', 'lisa', 'ronald', 'nancy', 'timothy', 'karen', 'jason',
    'betty', 'jeffrey', 'helen', 'ryan', 'sandra', 'jacob', 'donna'
  ]);

  static detectPHI(content: string): PHIDetectionResult {
    const detectedItems: PHIItem[] = [];
    const warnings: string[] = [];
    
    // Remove HTML tags for analysis
    const textContent = content.replace(/<[^>]*>/g, ' ');
    
    // Check for various PHI types
    this.checkSSN(textContent, detectedItems);
    this.checkPhoneNumbers(textContent, detectedItems);
    this.checkEmails(textContent, detectedItems);
    this.checkMedicalRecordNumbers(textContent, detectedItems);
    this.checkAccountNumbers(textContent, detectedItems);
    this.checkDatesOfBirth(textContent, detectedItems);
    this.checkLicenseNumbers(textContent, detectedItems);
    this.checkDeviceIdentifiers(textContent, detectedItems);
    this.checkIPAddresses(textContent, detectedItems);
    this.checkURLs(textContent, detectedItems);
    this.checkAddresses(textContent, detectedItems);
    this.checkNames(textContent, detectedItems);

    // Generate warnings based on detected PHI
    if (detectedItems.length > 0) {
      const types = [...new Set(detectedItems.map(item => item.type))];
      warnings.push(`Potential PHI detected: ${types.join(', ')}`);
      
      if (types.includes('ssn')) {
        warnings.push('Social Security Numbers must be removed before publication');
      }
      if (types.includes('name') && detectedItems.filter(i => i.type === 'name').length > 2) {
        warnings.push('Multiple potential patient names detected');
      }
      if (types.includes('date_of_birth')) {
        warnings.push('Dates of birth must be de-identified (use age ranges instead)');
      }
      if (types.includes('medical_record_number')) {
        warnings.push('Medical record numbers must be removed or de-identified');
      }
    }

    // Determine overall confidence
    const highConfidenceTypes = ['ssn', 'phone', 'email', 'ip'];
    const hasHighConfidence = detectedItems.some(item => 
      highConfidenceTypes.includes(item.type) && item.confidence > 0.8
    );
    
    const confidence = hasHighConfidence ? 'high' : 
                     detectedItems.length > 3 ? 'medium' : 'low';

    return {
      hasPHI: detectedItems.length > 0,
      warnings,
      detectedItems,
      confidence
    };
  }

  private static checkSSN(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.ssn);
    for (const match of matches) {
      if (match.index !== undefined) {
        items.push({
          type: 'ssn',
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.95,
          suggestion: 'Remove or replace with "XXX-XX-XXXX"'
        });
      }
    }
  }

  private static checkPhoneNumbers(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.phone);
    for (const match of matches) {
      if (match.index !== undefined) {
        items.push({
          type: 'phone',
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.9,
          suggestion: 'Remove or replace with "XXX-XXX-XXXX"'
        });
      }
    }
  }

  private static checkEmails(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.email);
    for (const match of matches) {
      if (match.index !== undefined) {
        // Skip institutional emails
        if (!match[0].includes('@hospital.') && !match[0].includes('@clinic.')) {
          items.push({
            type: 'email',
            text: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            confidence: 0.85,
            suggestion: 'Remove or replace with "patient@example.com"'
          });
        }
      }
    }
  }

  private static checkMedicalRecordNumbers(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.mrn);
    for (const match of matches) {
      if (match.index !== undefined && match[1]) {
        items.push({
          type: 'medical_record_number',
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.9,
          suggestion: 'Remove or replace with "MRN: XXXXXXX"'
        });
      }
    }
  }

  private static checkAccountNumbers(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.account);
    for (const match of matches) {
      if (match.index !== undefined && match[1]) {
        items.push({
          type: 'account_number',
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.8,
          suggestion: 'Remove or de-identify account number'
        });
      }
    }
  }

  private static checkDatesOfBirth(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.date_birth);
    for (const match of matches) {
      if (match.index !== undefined) {
        // Check if it's in a DOB context
        const beforeText = text.substring(Math.max(0, match.index - 20), match.index).toLowerCase();
        const afterText = text.substring(match.index + match[0].length, match.index + match[0].length + 20).toLowerCase();
        
        if (beforeText.includes('birth') || beforeText.includes('dob') || 
            afterText.includes('birth') || afterText.includes('dob')) {
          items.push({
            type: 'date_of_birth',
            text: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            confidence: 0.85,
            suggestion: 'Replace with age or age range (e.g., "65-year-old")'
          });
        }
      }
    }
  }

  private static checkLicenseNumbers(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.license);
    for (const match of matches) {
      if (match.index !== undefined && match[1]) {
        items.push({
          type: 'certificate_license_number',
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.8,
          suggestion: 'Remove or de-identify license number'
        });
      }
    }
  }

  private static checkDeviceIdentifiers(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.device);
    for (const match of matches) {
      if (match.index !== undefined && match[1]) {
        items.push({
          type: 'device_identifier',
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.7,
          suggestion: 'Remove or de-identify device identifier'
        });
      }
    }
  }

  private static checkIPAddresses(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.ip);
    for (const match of matches) {
      if (match.index !== undefined) {
        items.push({
          type: 'ip_address',
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.9,
          suggestion: 'Remove IP address'
        });
      }
    }
  }

  private static checkURLs(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.url);
    for (const match of matches) {
      if (match.index !== undefined) {
        // Check if URL might contain PHI
        if (match[0].includes('patient') || match[0].includes('record') || 
            match[0].includes('personal')) {
          items.push({
            type: 'web_url',
            text: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            confidence: 0.6,
            suggestion: 'Review URL for potential PHI'
          });
        }
      }
    }
  }

  private static checkAddresses(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.address);
    for (const match of matches) {
      if (match.index !== undefined) {
        // Skip hospital/medical facility addresses
        if (!match[0].toLowerCase().includes('hospital') && 
            !match[0].toLowerCase().includes('clinic') &&
            !match[0].toLowerCase().includes('medical')) {
          items.push({
            type: 'address',
            text: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            confidence: 0.7,
            suggestion: 'Remove or generalize address (e.g., city/state only)'
          });
        }
      }
    }
  }

  private static checkNames(text: string, items: PHIItem[]): void {
    const matches = text.matchAll(this.patterns.name);
    for (const match of matches) {
      if (match.index !== undefined) {
        const name = match[0].toLowerCase();
        
        // Skip if it's a medical term or common phrase
        if (this.medicalTermsAllowlist.has(name)) {
          continue;
        }
        
        // Check if first word is a common first name
        const firstWord = name.split(' ')[0];
        if (this.commonFirstNames.has(firstWord)) {
          // Check context to see if it's likely a patient name
          const beforeText = text.substring(Math.max(0, match.index - 30), match.index).toLowerCase();
          const afterText = text.substring(match.index + match[0].length, match.index + match[0].length + 30).toLowerCase();
          
          if (beforeText.includes('patient') || beforeText.includes('mr.') || 
              beforeText.includes('mrs.') || beforeText.includes('ms.') ||
              afterText.includes('patient') || afterText.includes('complained') ||
              afterText.includes('presented') || afterText.includes('reported')) {
            items.push({
              type: 'name',
              text: match[0],
              startIndex: match.index,
              endIndex: match.index + match[0].length,
              confidence: 0.6,
              suggestion: 'Replace with "Patient" or initials only'
            });
          }
        }
      }
    }
  }

  // Redaction helper methods
  static redactText(text: string, items: PHIItem[]): string {
    let redactedText = text;
    
    // Sort items by start index in descending order to avoid index shifting
    const sortedItems = items.sort((a, b) => b.startIndex - a.startIndex);
    
    for (const item of sortedItems) {
      const replacement = this.getRedactionReplacement(item);
      redactedText = redactedText.substring(0, item.startIndex) + 
                   replacement + 
                   redactedText.substring(item.endIndex);
    }
    
    return redactedText;
  }

  private static getRedactionReplacement(item: PHIItem): string {
    switch (item.type) {
      case 'name':
        return '[PATIENT NAME]';
      case 'ssn':
        return 'XXX-XX-XXXX';
      case 'phone':
        return 'XXX-XXX-XXXX';
      case 'email':
        return '[EMAIL ADDRESS]';
      case 'address':
        return '[ADDRESS]';
      case 'date_of_birth':
        return '[DATE OF BIRTH]';
      case 'medical_record_number':
        return '[MRN: XXXXXXX]';
      case 'account_number':
        return '[ACCOUNT NUMBER]';
      case 'ip_address':
        return '[IP ADDRESS]';
      default:
        return '[REDACTED]';
    }
  }

  // Generate de-identification suggestions
  static generateDeIdentificationSuggestions(items: PHIItem[]): string[] {
    const suggestions: string[] = [];
    
    if (items.some(item => item.type === 'name')) {
      suggestions.push('Replace patient names with "Patient", "the patient", or initials only');
    }
    
    if (items.some(item => item.type === 'date_of_birth')) {
      suggestions.push('Replace specific dates of birth with age or age ranges (e.g., "65-year-old male")');
    }
    
    if (items.some(item => item.type === 'address')) {
      suggestions.push('Remove specific addresses; use only city/state or general region if needed');
    }
    
    if (items.some(item => item.type === 'medical_record_number')) {
      suggestions.push('Remove medical record numbers or replace with sequential case numbers');
    }
    
    if (items.some(item => ['ssn', 'phone', 'email'].includes(item.type))) {
      suggestions.push('Remove all contact information and identifiers');
    }
    
    suggestions.push('Review content for any other identifying information not automatically detected');
    suggestions.push('Consider having a second reviewer check for PHI before publication');
    
    return suggestions;
  }
}