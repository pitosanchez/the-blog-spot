import { UserRole, VerificationStatus } from "@prisma/client";

interface VerificationBadgeProps {
  verificationStatus: VerificationStatus;
  role: UserRole;
  specialties?: string[];
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export default function VerificationBadge({
  verificationStatus,
  role,
  specialties = [],
  size = "md",
  showTooltip = true,
  className = "",
}: VerificationBadgeProps) {
  const getVerificationInfo = () => {
    if (role === "READER") {
      return {
        show: false,
        color: "",
        icon: null,
        text: "",
        tooltip: "",
      };
    }

    switch (verificationStatus) {
      case "VERIFIED":
        return {
          show: true,
          color: "bg-blue-600 text-white",
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          text: "Verified",
          tooltip: "Medically verified professional",
        };
      case "PENDING":
        return {
          show: true,
          color: "bg-yellow-500 text-white",
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          ),
          text: "Pending",
          tooltip: "Verification in progress",
        };
      case "REJECTED":
        return {
          show: true,
          color: "bg-red-500 text-white",
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
          text: "Unverified",
          tooltip: "Verification failed or incomplete",
        };
      default:
        return {
          show: false,
          color: "",
          icon: null,
          text: "",
          tooltip: "",
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1 text-sm";
    }
  };

  const verificationInfo = getVerificationInfo();

  if (!verificationInfo.show) {
    return null;
  }

  const badgeElement = (
    <span
      className={`
        inline-flex items-center space-x-1 rounded-full font-medium
        ${verificationInfo.color}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {verificationInfo.icon}
      <span>{verificationInfo.text}</span>
    </span>
  );

  if (showTooltip) {
    return (
      <div className="relative group">
        {badgeElement}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            {verificationInfo.tooltip}
            {verificationStatus === "VERIFIED" && specialties.length > 0 && (
              <div className="text-xs text-gray-300 mt-1">
                {specialties.slice(0, 2).join(", ")}
                {specialties.length > 2 && ` +${specialties.length - 2} more`}
              </div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return badgeElement;
}

// Specialty Badge Component
interface SpecialtyBadgeProps {
  specialty: string;
  size?: "sm" | "md";
  className?: string;
}

export function SpecialtyBadge({ 
  specialty, 
  size = "sm", 
  className = "" 
}: SpecialtyBadgeProps) {
  const getSpecialtyColor = (specialty: string) => {
    // Color mapping for different medical specialties
    const colorMap: Record<string, string> = {
      "Cardiology": "bg-red-100 text-red-800",
      "Neurology": "bg-purple-100 text-purple-800",
      "Orthopedic Surgery": "bg-blue-100 text-blue-800",
      "Pediatrics": "bg-pink-100 text-pink-800",
      "Internal Medicine": "bg-green-100 text-green-800",
      "Emergency Medicine": "bg-orange-100 text-orange-800",
      "Radiology": "bg-gray-100 text-gray-800",
      "Anesthesiology": "bg-indigo-100 text-indigo-800",
      "Pathology": "bg-yellow-100 text-yellow-800",
      "Surgery": "bg-red-100 text-red-800",
      "Psychiatry": "bg-purple-100 text-purple-800",
      "Dermatology": "bg-pink-100 text-pink-800",
      "Oncology": "bg-gray-100 text-gray-800",
      "Gastroenterology": "bg-green-100 text-green-800",
      "Pulmonology": "bg-blue-100 text-blue-800",
    };
    
    return colorMap[specialty] || "bg-gray-100 text-gray-800";
  };

  const getSizeClasses = () => {
    return size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm";
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${getSpecialtyColor(specialty)}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {specialty}
    </span>
  );
}

// Multiple Specialties Component
interface SpecialtyBadgesProps {
  specialties: string[];
  maxVisible?: number;
  size?: "sm" | "md";
  className?: string;
}

export function SpecialtyBadges({ 
  specialties, 
  maxVisible = 3, 
  size = "sm",
  className = "" 
}: SpecialtyBadgesProps) {
  const visibleSpecialties = specialties.slice(0, maxVisible);
  const remainingCount = specialties.length - maxVisible;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleSpecialties.map((specialty, index) => (
        <SpecialtyBadge 
          key={index} 
          specialty={specialty} 
          size={size} 
        />
      ))}
      {remainingCount > 0 && (
        <span
          className={`
            inline-flex items-center rounded-full font-medium bg-gray-100 text-gray-600
            ${size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"}
          `}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

// Combined Profile Badge (Verification + Specialties)
interface ProfileBadgeProps {
  verificationStatus: VerificationStatus;
  role: UserRole;
  specialties?: string[];
  showSpecialties?: boolean;
  maxSpecialties?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProfileBadge({
  verificationStatus,
  role,
  specialties = [],
  showSpecialties = true,
  maxSpecialties = 2,
  size = "md",
  className = "",
}: ProfileBadgeProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <VerificationBadge
        verificationStatus={verificationStatus}
        role={role}
        specialties={specialties}
        size={size}
      />
      {showSpecialties && specialties.length > 0 && verificationStatus === "VERIFIED" && (
        <SpecialtyBadges
          specialties={specialties}
          maxVisible={maxSpecialties}
          size={size === "lg" ? "md" : "sm"}
        />
      )}
    </div>
  );
}