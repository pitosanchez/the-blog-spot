// Medical terminology database for autocomplete
export interface MedicalTerm {
  term: string;
  definition: string;
  category: string;
  synonyms?: string[];
  relatedTerms?: string[];
}

export interface DrugInfo {
  name: string;
  genericName?: string;
  brandNames: string[];
  category: string;
  indication: string;
  dosage?: string;
  warnings?: string[];
}

export interface ICDCode {
  code: string;
  description: string;
  category: string;
  subcategory?: string;
}

export interface CPTCode {
  code: string;
  description: string;
  category: string;
  rvu?: number; // Relative Value Units
}

// Medical terminology database
export const medicalTerminology: MedicalTerm[] = [
  // Cardiology
  {
    term: "myocardial infarction",
    definition: "Death of heart muscle due to insufficient blood supply",
    category: "cardiology",
    synonyms: ["heart attack", "MI"],
    relatedTerms: ["coronary artery disease", "atherosclerosis", "angina"]
  },
  {
    term: "atrial fibrillation",
    definition: "Irregular heart rhythm originating in the atria",
    category: "cardiology",
    synonyms: ["AFib", "AF"],
    relatedTerms: ["arrhythmia", "stroke risk", "anticoagulation"]
  },
  {
    term: "hypertension",
    definition: "High blood pressure, typically >140/90 mmHg",
    category: "cardiology",
    synonyms: ["high blood pressure", "HTN"],
    relatedTerms: ["cardiovascular disease", "stroke", "kidney disease"]
  },
  
  // Neurology
  {
    term: "cerebrovascular accident",
    definition: "Sudden loss of brain function due to vascular cause",
    category: "neurology",
    synonyms: ["stroke", "CVA"],
    relatedTerms: ["ischemia", "hemorrhage", "TIA"]
  },
  {
    term: "transient ischemic attack",
    definition: "Temporary neurological symptoms due to decreased blood flow",
    category: "neurology",
    synonyms: ["TIA", "mini-stroke"],
    relatedTerms: ["stroke", "carotid stenosis", "emboli"]
  },
  
  // Respiratory
  {
    term: "pneumonia",
    definition: "Infection of lung tissue causing inflammation",
    category: "pulmonology",
    synonyms: ["lung infection"],
    relatedTerms: ["respiratory failure", "sepsis", "chest X-ray"]
  },
  {
    term: "chronic obstructive pulmonary disease",
    definition: "Progressive lung disease with airflow limitation",
    category: "pulmonology",
    synonyms: ["COPD", "emphysema", "chronic bronchitis"],
    relatedTerms: ["smoking", "spirometry", "bronchodilators"]
  },
  
  // Gastroenterology
  {
    term: "gastroesophageal reflux disease",
    definition: "Chronic acid reflux causing esophageal irritation",
    category: "gastroenterology",
    synonyms: ["GERD", "acid reflux"],
    relatedTerms: ["heartburn", "proton pump inhibitors", "endoscopy"]
  },
  
  // Endocrinology
  {
    term: "diabetes mellitus",
    definition: "Metabolic disorder characterized by high blood glucose",
    category: "endocrinology",
    synonyms: ["diabetes", "DM"],
    relatedTerms: ["insulin", "glucose", "HbA1c", "neuropathy"]
  },
  {
    term: "hypothyroidism",
    definition: "Underactive thyroid gland producing insufficient hormones",
    category: "endocrinology",
    synonyms: ["underactive thyroid"],
    relatedTerms: ["TSH", "levothyroxine", "fatigue", "weight gain"]
  },
  
  // Infectious Disease
  {
    term: "sepsis",
    definition: "Life-threatening response to infection",
    category: "infectious disease",
    synonyms: ["blood poisoning"],
    relatedTerms: ["SIRS", "septic shock", "antibiotics", "organ failure"]
  },
  
  // Oncology
  {
    term: "metastasis",
    definition: "Spread of cancer from primary site to distant locations",
    category: "oncology",
    synonyms: ["secondary cancer", "cancer spread"],
    relatedTerms: ["staging", "prognosis", "chemotherapy", "radiation"]
  }
];

// Drug database
export const drugDatabase: DrugInfo[] = [
  {
    name: "lisinopril",
    genericName: "lisinopril",
    brandNames: ["Prinivil", "Zestril"],
    category: "ACE Inhibitor",
    indication: "Hypertension, heart failure, post-MI",
    dosage: "5-40mg daily",
    warnings: ["Hyperkalemia", "Angioedema", "Renal impairment"]
  },
  {
    name: "metformin",
    genericName: "metformin",
    brandNames: ["Glucophage", "Fortamet"],
    category: "Biguanide",
    indication: "Type 2 diabetes mellitus",
    dosage: "500-2000mg daily",
    warnings: ["Lactic acidosis", "Renal impairment", "Contrast allergy"]
  },
  {
    name: "atorvastatin",
    genericName: "atorvastatin",
    brandNames: ["Lipitor"],
    category: "Statin",
    indication: "Hyperlipidemia, cardiovascular disease prevention",
    dosage: "10-80mg daily",
    warnings: ["Myopathy", "Liver dysfunction", "Drug interactions"]
  },
  {
    name: "warfarin",
    genericName: "warfarin",
    brandNames: ["Coumadin", "Jantoven"],
    category: "Anticoagulant",
    indication: "Atrial fibrillation, DVT/PE, mechanical heart valves",
    dosage: "Variable based on INR",
    warnings: ["Bleeding risk", "Drug interactions", "Regular INR monitoring"]
  },
  {
    name: "amoxicillin",
    genericName: "amoxicillin",
    brandNames: ["Amoxil"],
    category: "Penicillin Antibiotic",
    indication: "Bacterial infections",
    dosage: "250-875mg every 8-12 hours",
    warnings: ["Penicillin allergy", "C. diff colitis", "Drug interactions"]
  }
];

// ICD-10 codes (sample)
export const icd10Codes: ICDCode[] = [
  {
    code: "I21.9",
    description: "Acute myocardial infarction, unspecified",
    category: "Diseases of the circulatory system",
    subcategory: "Ischemic heart diseases"
  },
  {
    code: "I48.91",
    description: "Unspecified atrial fibrillation",
    category: "Diseases of the circulatory system",
    subcategory: "Other forms of heart disease"
  },
  {
    code: "I10",
    description: "Essential (primary) hypertension",
    category: "Diseases of the circulatory system",
    subcategory: "Hypertensive diseases"
  },
  {
    code: "I63.9",
    description: "Cerebral infarction, unspecified",
    category: "Diseases of the circulatory system",
    subcategory: "Cerebrovascular diseases"
  },
  {
    code: "J44.1",
    description: "Chronic obstructive pulmonary disease with acute exacerbation",
    category: "Diseases of the respiratory system",
    subcategory: "Chronic lower respiratory diseases"
  },
  {
    code: "E11.9",
    description: "Type 2 diabetes mellitus without complications",
    category: "Endocrine, nutritional and metabolic diseases",
    subcategory: "Diabetes mellitus"
  }
];

// CPT codes (sample)
export const cptCodes: CPTCode[] = [
  {
    code: "99213",
    description: "Office visit, established patient, level 3",
    category: "Evaluation and Management",
    rvu: 1.3
  },
  {
    code: "99214",
    description: "Office visit, established patient, level 4",
    category: "Evaluation and Management",
    rvu: 2.0
  },
  {
    code: "93000",
    description: "Electrocardiogram, routine ECG with 12 leads",
    category: "Cardiovascular",
    rvu: 0.17
  },
  {
    code: "80053",
    description: "Comprehensive metabolic panel",
    category: "Pathology and Laboratory",
    rvu: 0.0
  },
  {
    code: "71020",
    description: "Chest X-ray, 2 views",
    category: "Radiology",
    rvu: 0.22
  },
  {
    code: "45378",
    description: "Colonoscopy, flexible, diagnostic",
    category: "Surgery",
    rvu: 4.43
  }
];

// Search functions
export function searchMedicalTerms(query: string, limit: number = 10): MedicalTerm[] {
  const lowercaseQuery = query.toLowerCase();
  
  return medicalTerminology
    .filter(term => 
      term.term.toLowerCase().includes(lowercaseQuery) ||
      term.synonyms?.some(synonym => synonym.toLowerCase().includes(lowercaseQuery)) ||
      term.definition.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, limit);
}

export function searchDrugs(query: string, limit: number = 10): DrugInfo[] {
  const lowercaseQuery = query.toLowerCase();
  
  return drugDatabase
    .filter(drug =>
      drug.name.toLowerCase().includes(lowercaseQuery) ||
      drug.genericName?.toLowerCase().includes(lowercaseQuery) ||
      drug.brandNames.some(brand => brand.toLowerCase().includes(lowercaseQuery))
    )
    .slice(0, limit);
}

export function searchICD10(query: string, limit: number = 10): ICDCode[] {
  const lowercaseQuery = query.toLowerCase();
  
  return icd10Codes
    .filter(code =>
      code.code.toLowerCase().includes(lowercaseQuery) ||
      code.description.toLowerCase().includes(lowercaseQuery) ||
      code.category.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, limit);
}

export function searchCPT(query: string, limit: number = 10): CPTCode[] {
  const lowercaseQuery = query.toLowerCase();
  
  return cptCodes
    .filter(code =>
      code.code.includes(query) ||
      code.description.toLowerCase().includes(lowercaseQuery) ||
      code.category.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, limit);
}

// Lab value ranges
export interface LabValue {
  name: string;
  unit: string;
  normalRange: {
    min?: number;
    max?: number;
    text?: string;
  };
  criticalLow?: number;
  criticalHigh?: number;
  category: string;
}

export const labValues: LabValue[] = [
  {
    name: "Hemoglobin",
    unit: "g/dL",
    normalRange: { min: 12.0, max: 15.5 },
    criticalLow: 7.0,
    criticalHigh: 20.0,
    category: "Hematology"
  },
  {
    name: "White Blood Cell Count",
    unit: "K/μL",
    normalRange: { min: 4.5, max: 11.0 },
    criticalLow: 2.0,
    criticalHigh: 30.0,
    category: "Hematology"
  },
  {
    name: "Platelet Count",
    unit: "K/μL",
    normalRange: { min: 150, max: 450 },
    criticalLow: 50,
    criticalHigh: 1000,
    category: "Hematology"
  },
  {
    name: "Glucose",
    unit: "mg/dL",
    normalRange: { min: 70, max: 99 },
    criticalLow: 40,
    criticalHigh: 400,
    category: "Chemistry"
  },
  {
    name: "Creatinine",
    unit: "mg/dL",
    normalRange: { min: 0.6, max: 1.2 },
    criticalHigh: 5.0,
    category: "Chemistry"
  },
  {
    name: "Troponin I",
    unit: "ng/mL",
    normalRange: { max: 0.04 },
    criticalHigh: 0.1,
    category: "Cardiac"
  },
  {
    name: "TSH",
    unit: "mIU/L",
    normalRange: { min: 0.4, max: 4.0 },
    category: "Endocrine"
  },
  {
    name: "HbA1c",
    unit: "%",
    normalRange: { max: 5.7 },
    category: "Endocrine"
  }
];

export function searchLabValues(query: string, limit: number = 10): LabValue[] {
  const lowercaseQuery = query.toLowerCase();
  
  return labValues
    .filter(lab =>
      lab.name.toLowerCase().includes(lowercaseQuery) ||
      lab.category.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, limit);
}