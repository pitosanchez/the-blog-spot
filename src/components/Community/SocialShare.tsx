import { memo } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  size?: "sm" | "md" | "lg";
  variant?: "icons" | "buttons" | "minimal";
  platforms?: (
    | "facebook"
    | "twitter"
    | "linkedin"
    | "pinterest"
    | "whatsapp"
    | "email"
    | "copy"
  )[];
  onShare?: (platform: string, url: string) => void;
}

interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: (
    url: string,
    title: string,
    description?: string,
    hashtags?: string[]
  ) => string;
}

const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  facebook: {
    name: "Facebook",
    icon: "📘",
    color: "bg-blue-600 hover:bg-blue-700",
    shareUrl: (url, title, description) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(
        title + (description ? ": " + description : "")
      )}`,
  },
  twitter: {
    name: "Twitter",
    icon: "🐦",
    color: "bg-sky-500 hover:bg-sky-600",
    shareUrl: (url, title, description, hashtags) => {
      const text = title + (description ? ": " + description : "");
      const hashtagString = hashtags?.length
        ? hashtags.map((tag) => `#${tag}`).join(" ")
        : "";
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text + " " + hashtagString)}`;
    },
  },
  linkedin: {
    name: "LinkedIn",
    icon: "💼",
    color: "bg-blue-700 hover:bg-blue-800",
    shareUrl: (url, title, description) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        description || ""
      )}`,
  },
  pinterest: {
    name: "Pinterest",
    icon: "📌",
    color: "bg-red-600 hover:bg-red-700",
    shareUrl: (url, title, description) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        url
      )}&description=${encodeURIComponent(
        title + (description ? ": " + description : "")
      )}`,
  },
  whatsapp: {
    name: "WhatsApp",
    icon: "💬",
    color: "bg-green-600 hover:bg-green-700",
    shareUrl: (url, title, description) =>
      `https://wa.me/?text=${encodeURIComponent(
        title + (description ? ": " + description : "") + " " + url
      )}`,
  },
  email: {
    name: "Email",
    icon: "✉️",
    color: "bg-gray-600 hover:bg-gray-700",
    shareUrl: (url, title, description) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        (description || "") + "\n\n" + url
      )}`,
  },
};

export const SocialShare = memo<SocialShareProps>(
  ({
    url,
    title,
    description,
    hashtags = ["storytelling", "community", "theblogspot"],
    size = "md",
    variant = "icons",
    platforms = [
      "facebook",
      "twitter",
      "linkedin",
      "whatsapp",
      "email",
      "copy",
    ],
    onShare,
  }) => {
    const handleShare = async (platform: string) => {
      if (onShare) {
        onShare(platform, url);
      }

      if (platform === "copy") {
        try {
          await navigator.clipboard.writeText(url);
          // You could add a toast notification here
          console.log("URL copied to clipboard");
        } catch (err) {
          console.error("Failed to copy URL:", err);
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        return;
      }

      const socialPlatform = SOCIAL_PLATFORMS[platform];
      if (socialPlatform) {
        const shareUrl = socialPlatform.shareUrl(
          url,
          title,
          description,
          hashtags
        );
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "w-8 h-8 text-sm";
        case "lg":
          return "w-12 h-12 text-lg";
        default:
          return "w-10 h-10 text-base";
      }
    };

    const getButtonClasses = (platform: string) => {
      const baseClasses = `${getSizeClasses()} rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bodega-brick`;

      if (variant === "minimal") {
        return `${baseClasses} bg-gray-100 hover:bg-gray-200 text-gray-700`;
      }

      const socialPlatform = SOCIAL_PLATFORMS[platform];
      if (socialPlatform && variant === "icons") {
        return `${baseClasses} ${socialPlatform.color} text-white`;
      }

      return `${baseClasses} bg-bodega-brick hover:bg-community-teal text-white`;
    };

    const renderButton = (platform: string) => {
      const socialPlatform = SOCIAL_PLATFORMS[platform];
      const isSpecialPlatform = platform === "copy";

      if (variant === "buttons") {
        return (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bodega-brick ${
              socialPlatform?.color || "bg-bodega-brick hover:bg-community-teal"
            } text-white`}
            aria-label={`Share on ${
              isSpecialPlatform ? "Copy Link" : socialPlatform?.name
            }`}
          >
            <span className="text-lg">
              {isSpecialPlatform ? "🔗" : socialPlatform?.icon}
            </span>
            <span className="text-sm font-medium">
              {isSpecialPlatform ? "Copy Link" : socialPlatform?.name}
            </span>
          </button>
        );
      }

      return (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className={getButtonClasses(platform)}
          aria-label={`Share on ${
            isSpecialPlatform ? "Copy Link" : socialPlatform?.name
          }`}
          title={isSpecialPlatform ? "Copy Link" : socialPlatform?.name}
        >
          <span>{isSpecialPlatform ? "🔗" : socialPlatform?.icon}</span>
        </button>
      );
    };

    return (
      <div
        className="flex items-center space-x-2"
        role="group"
        aria-label="Share this content"
      >
        <span className="text-sm text-gray-600 mr-2">Share:</span>
        {platforms.map(renderButton)}
      </div>
    );
  }
);

SocialShare.displayName = "SocialShare";
