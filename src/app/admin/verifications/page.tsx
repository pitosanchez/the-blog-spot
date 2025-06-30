"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface VerificationDocument {
  id: string;
  userId: string;
  type: string;
  status: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  issuer?: string;
  licenseNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  state?: string;
  specialty?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    medicalCredentials: any;
    specialties: string[];
  };
}

export default function VerificationDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<VerificationDocument | null>(null);
  const [filter, setFilter] = useState("PENDING_REVIEW");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/login");
      return;
    }
    
    fetchDocuments();
  }, [session, status, router, filter]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/admin/verifications?status=${filter}&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/verifications/${documentId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        await fetchDocuments();
        setSelectedDocument(null);
      } else {
        alert("Failed to approve document");
      }
    } catch (error) {
      alert("Network error during approval");
    }
  };

  const handleReject = async (documentId: string, reason: string) => {
    if (!reason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      const response = await fetch(`/api/admin/verifications/${documentId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        await fetchDocuments();
        setSelectedDocument(null);
      } else {
        alert("Failed to reject document");
      }
    } catch (error) {
      alert("Network error during rejection");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return "bg-yellow-100 text-yellow-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      case "EXPIRED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      "MEDICAL_LICENSE": "Medical License",
      "BOARD_CERTIFICATION": "Board Certification",
      "DEA_CERTIFICATE": "DEA Certificate",
      "HOSPITAL_PRIVILEGES": "Hospital Privileges",
      "DIPLOMA": "Medical Diploma",
      "RESIDENCY_CERTIFICATE": "Residency Certificate",
      "FELLOWSHIP_CERTIFICATE": "Fellowship Certificate",
      "STATE_LICENSE": "State License",
    };
    return types[type] || type;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Credential Verification</h1>
              <p className="mt-2 text-gray-600">Review and approve medical professionals' credentials</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {documents.length} documents
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-4 py-4 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Filter</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="ALL">All Documents</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  placeholder="Search by email, license number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {documents.map((document) => (
                <li key={document.id}>
                  <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {document.user.email}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                            {document.status.replace("_", " ")}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {getDocumentTypeDisplay(document.type)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(document.fileSize)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {document.licenseNumber && (
                          <p className="text-sm text-gray-500 mt-1">
                            License: {document.licenseNumber} {document.state && `(${document.state})`}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDocument(document)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Review
                      </button>
                      
                      {document.status === "PENDING_REVIEW" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(document.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt("Reason for rejection:");
                              if (reason) handleReject(document.id, reason);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {documents.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No verification documents match your current filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Review Modal */}
      {selectedDocument && (
        <DocumentReviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

function DocumentReviewModal({ 
  document, 
  onClose, 
  onApprove, 
  onReject 
}: { 
  document: VerificationDocument;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Document Review - {document.user.email}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Viewer */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Document Preview</h4>
            <div className="border rounded-lg p-4 bg-gray-50">
              {document.fileUrl.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={document.fileUrl}
                  className="w-full h-96 border rounded"
                  title="Document Preview"
                />
              ) : (
                <img
                  src={document.fileUrl}
                  alt="Document"
                  className="w-full h-96 object-contain border rounded"
                />
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">{document.fileName}</span>
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Open in new tab →
                </a>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Document Details</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Document Type</label>
                <p className="text-sm text-gray-900">{document.type.replace("_", " ")}</p>
              </div>
              
              {document.licenseNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <p className="text-sm text-gray-900">{document.licenseNumber}</p>
                </div>
              )}
              
              {document.state && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <p className="text-sm text-gray-900">{document.state}</p>
                </div>
              )}
              
              {document.issuer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Issuing Authority</label>
                  <p className="text-sm text-gray-900">{document.issuer}</p>
                </div>
              )}
              
              {document.specialty && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialty</label>
                  <p className="text-sm text-gray-900">{document.specialty}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Uploaded</label>
                <p className="text-sm text-gray-900">{new Date(document.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* User Information */}
            <h4 className="text-md font-semibold text-gray-900 mt-6 mb-3">User Information</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{document.user.email}</p>
              </div>
              
              {document.user.medicalCredentials && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical Credentials</label>
                  <pre className="text-sm text-gray-900 bg-gray-100 p-2 rounded">
                    {JSON.stringify(document.user.medicalCredentials, null, 2)}
                  </pre>
                </div>
              )}
              
              {document.user.specialties.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialties</label>
                  <p className="text-sm text-gray-900">{document.user.specialties.join(", ")}</p>
                </div>
              )}
            </div>

            {/* Review Actions */}
            {document.status === "PENDING_REVIEW" && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Review Actions</h4>
                
                {!showRejectionForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Review Notes (Optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add any notes about this verification..."
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onApprove(document.id, notes)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Approve Document
                      </button>
                      <button
                        onClick={() => setShowRejectionForm(true)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject Document
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rejection Reason *</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please provide a detailed reason for rejection..."
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          if (rejectionReason.trim()) {
                            onReject(document.id, rejectionReason);
                          }
                        }}
                        disabled={!rejectionReason.trim()}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => setShowRejectionForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}