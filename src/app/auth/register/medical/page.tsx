"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadDropzone } from "@/lib/uploadthing";

// Step 1: Basic Information
const basicInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

// Step 2: Medical Credentials
const medicalCredentialsSchema = z.object({
  degreeType: z.enum(["MD", "DO", "PhD", "DPM", "DDS", "PharmD"], {
    required_error: "Please select your degree type",
  }),
  licenseNumber: z.string().min(3, "License number is required"),
  licenseState: z.string().min(2, "License state is required"),
  boardCertifications: z.array(z.string()).min(1, "At least one specialty is required"),
  graduationYear: z.number().min(1950).max(new Date().getFullYear()),
  medicalSchool: z.string().min(2, "Medical school name is required"),
});

// Step 3: Document Upload
const documentUploadSchema = z.object({
  medicalLicense: z.string().min(1, "Medical license document is required"),
  boardCertificate: z.string().optional(),
  deaCertificate: z.string().optional(),
  cv: z.string().optional(),
});

// Step 4: Institutional Verification
const institutionalSchema = z.object({
  currentInstitution: z.string().min(2, "Current institution is required"),
  institutionType: z.enum(["HOSPITAL", "CLINIC", "PRIVATE_PRACTICE", "ACADEMIC", "RESEARCH"], {
    required_error: "Please select institution type",
  }),
  position: z.string().min(2, "Current position is required"),
  yearsAtInstitution: z.number().min(0).max(50),
  institutionAddress: z.string().min(10, "Institution address is required"),
  supervisorName: z.string().min(2, "Supervisor/reference name is required"),
  supervisorEmail: z.string().email("Valid supervisor email is required"),
  supervisorPhone: z.string().min(10, "Valid supervisor phone is required"),
});

type BasicInfo = z.infer<typeof basicInfoSchema>;
type MedicalCredentials = z.infer<typeof medicalCredentialsSchema>;
type DocumentUpload = z.infer<typeof documentUploadSchema>;
type Institutional = z.infer<typeof institutionalSchema>;

const medicalSpecialties = [
  "Anesthesiology", "Cardiology", "Dermatology", "Emergency Medicine", "Endocrinology",
  "Gastroenterology", "General Surgery", "Hematology", "Infectious Disease", "Internal Medicine",
  "Nephrology", "Neurology", "Neurosurgery", "Obstetrics & Gynecology", "Oncology",
  "Ophthalmology", "Orthopedic Surgery", "Otolaryngology", "Pathology", "Pediatrics",
  "Plastic Surgery", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology",
  "Urology", "Family Medicine", "Physical Medicine & Rehabilitation"
];

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  "VA", "WA", "WV", "WI", "WY"
];

export default function MedicalRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  // Form data storage
  const [formData, setFormData] = useState({
    basicInfo: {} as BasicInfo,
    medicalCredentials: {} as MedicalCredentials,
    documentUpload: {} as DocumentUpload,
    institutional: {} as Institutional,
  });

  // Step 1 Form
  const basicInfoForm = useForm<BasicInfo>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formData.basicInfo,
  });

  // Step 2 Form
  const medicalCredentialsForm = useForm<MedicalCredentials>({
    resolver: zodResolver(medicalCredentialsSchema),
    defaultValues: formData.medicalCredentials,
  });

  // Step 3 Form
  const documentUploadForm = useForm<DocumentUpload>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: formData.documentUpload,
  });

  // Step 4 Form
  const institutionalForm = useForm<Institutional>({
    resolver: zodResolver(institutionalSchema),
    defaultValues: formData.institutional,
  });

  const handleNext = async (stepData: any) => {
    setFormData(prev => ({
      ...prev,
      [`step${currentStep === 1 ? 'basicInfo' : currentStep === 2 ? 'medicalCredentials' : currentStep === 3 ? 'documentUpload' : 'institutional'}`]: stepData,
    }));
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit final form
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register/medical", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          uploadedFiles,
        }),
      });

      if (response.ok) {
        router.push("/auth/verification-submitted");
      } else {
        const error = await response.json();
        alert(error.message || "Submission failed");
      }
    } catch (error) {
      alert("Network error during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", description: "Personal details" },
    { number: 2, title: "Medical Credentials", description: "Education and licensing" },
    { number: 3, title: "Document Upload", description: "Verification documents" },
    { number: 4, title: "Institutional Verification", description: "Current affiliation" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, stepIdx) => (
                <li key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep > step.number
                          ? "bg-blue-600 text-white"
                          : currentStep === step.number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {stepIdx < steps.length - 1 && (
                    <div className="flex-1 ml-4">
                      <div className="h-1 bg-gray-300 rounded"></div>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {currentStep === 1 && (
            <BasicInfoStep form={basicInfoForm} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <MedicalCredentialsStep 
              form={medicalCredentialsForm} 
              onNext={handleNext} 
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <DocumentUploadStep 
              form={documentUploadForm} 
              onNext={handleNext} 
              onBack={() => setCurrentStep(2)}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          )}
          {currentStep === 4 && (
            <InstitutionalStep 
              form={institutionalForm} 
              onNext={handleNext} 
              onBack={() => setCurrentStep(3)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
function BasicInfoStep({ form, onNext }: { form: any; onNext: (data: BasicInfo) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              {...form.register("firstName")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...form.register("lastName")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            {...form.register("email")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            {...form.register("phone")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.phone && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next: Medical Credentials
          </button>
        </div>
      </form>
    </div>
  );
}

function MedicalCredentialsStep({ form, onNext, onBack }: { form: any; onNext: (data: MedicalCredentials) => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Credentials</h2>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree Type</label>
            <select
              {...form.register("degreeType")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select degree type</option>
              <option value="MD">MD - Doctor of Medicine</option>
              <option value="DO">DO - Doctor of Osteopathic Medicine</option>
              <option value="PhD">PhD - Doctor of Philosophy</option>
              <option value="DPM">DPM - Doctor of Podiatric Medicine</option>
              <option value="DDS">DDS - Doctor of Dental Surgery</option>
              <option value="PharmD">PharmD - Doctor of Pharmacy</option>
            </select>
            {form.formState.errors.degreeType && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.degreeType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License State</label>
            <select
              {...form.register("licenseState")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select state</option>
              {usStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {form.formState.errors.licenseState && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.licenseState.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical License Number</label>
          <input
            {...form.register("licenseNumber")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.licenseNumber && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.licenseNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical School</label>
          <input
            {...form.register("medicalSchool")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.medicalSchool && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.medicalSchool.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
          <input
            type="number"
            {...form.register("graduationYear", { valueAsNumber: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.graduationYear && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.graduationYear.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Board Certifications/Specialties</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
            {medicalSpecialties.map(specialty => (
              <label key={specialty} className="flex items-center">
                <input
                  type="checkbox"
                  value={specialty}
                  {...form.register("boardCertifications")}
                  className="mr-2"
                />
                <span className="text-sm">{specialty}</span>
              </label>
            ))}
          </div>
          {form.formState.errors.boardCertifications && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.boardCertifications.message}</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next: Document Upload
          </button>
        </div>
      </form>
    </div>
  );
}

function DocumentUploadStep({ 
  form, 
  onNext, 
  onBack, 
  uploadedFiles, 
  setUploadedFiles 
}: { 
  form: any; 
  onNext: (data: DocumentUpload) => void; 
  onBack: () => void;
  uploadedFiles: Record<string, string>;
  setUploadedFiles: (files: Record<string, string>) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Upload</h2>
      <p className="text-gray-600 mb-6">
        Please upload clear, legible copies of your medical credentials. Accepted formats: PDF, JPG, PNG.
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical License <span className="text-red-500">*</span>
          </label>
          <UploadDropzone
            endpoint="medicalDocuments"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                setUploadedFiles(prev => ({ ...prev, medicalLicense: res[0].url }));
                form.setValue("medicalLicense", res[0].url);
              }
            }}
            onUploadError={(error) => {
              alert(`Medical license upload failed: ${error.message}`);
            }}
          />
          {uploadedFiles.medicalLicense && (
            <p className="mt-2 text-sm text-green-600">✓ Medical license uploaded</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Board Certification (Optional)
          </label>
          <UploadDropzone
            endpoint="medicalDocuments"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                setUploadedFiles(prev => ({ ...prev, boardCertificate: res[0].url }));
                form.setValue("boardCertificate", res[0].url);
              }
            }}
            onUploadError={(error) => {
              alert(`Board certification upload failed: ${error.message}`);
            }}
          />
          {uploadedFiles.boardCertificate && (
            <p className="mt-2 text-sm text-green-600">✓ Board certification uploaded</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DEA Certificate (Optional)
          </label>
          <UploadDropzone
            endpoint="medicalDocuments"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                setUploadedFiles(prev => ({ ...prev, deaCertificate: res[0].url }));
                form.setValue("deaCertificate", res[0].url);
              }
            }}
            onUploadError={(error) => {
              alert(`DEA certificate upload failed: ${error.message}`);
            }}
          />
          {uploadedFiles.deaCertificate && (
            <p className="mt-2 text-sm text-green-600">✓ DEA certificate uploaded</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNext(form.getValues())}
          disabled={!uploadedFiles.medicalLicense}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Institutional Verification
        </button>
      </div>
    </div>
  );
}

function InstitutionalStep({ 
  form, 
  onNext, 
  onBack, 
  isSubmitting 
}: { 
  form: any; 
  onNext: (data: Institutional) => void; 
  onBack: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Institutional Verification</h2>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Institution</label>
          <input
            {...form.register("currentInstitution")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.currentInstitution && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.currentInstitution.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Institution Type</label>
            <select
              {...form.register("institutionType")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              <option value="HOSPITAL">Hospital</option>
              <option value="CLINIC">Clinic</option>
              <option value="PRIVATE_PRACTICE">Private Practice</option>
              <option value="ACADEMIC">Academic Institution</option>
              <option value="RESEARCH">Research Institution</option>
            </select>
            {form.formState.errors.institutionType && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.institutionType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Position</label>
            <input
              {...form.register("position")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.position && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.position.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Institution Address</label>
          <textarea
            {...form.register("institutionAddress")}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.institutionAddress && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.institutionAddress.message}</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Supervisor/Reference Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Supervisor Name</label>
              <input
                {...form.register("supervisorName")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {form.formState.errors.supervisorName && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.supervisorName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supervisor Email</label>
              <input
                type="email"
                {...form.register("supervisorEmail")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {form.formState.errors.supervisorEmail && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.supervisorEmail.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Supervisor Phone</label>
            <input
              type="tel"
              {...form.register("supervisorPhone")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.supervisorPhone && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.supervisorPhone.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Submitting...
              </div>
            ) : (
              "Submit for Verification"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}