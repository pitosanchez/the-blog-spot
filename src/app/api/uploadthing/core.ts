import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Medical document upload for verification
  medicalDocuments: f({
    "application/pdf": { maxFileSize: "16MB", maxFileCount: 1 },
    "image/jpeg": { maxFileSize: "8MB", maxFileCount: 1 },
    "image/png": { maxFileSize: "8MB", maxFileCount: 1 },
    "image/webp": { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Check if user is authenticated
      const session = await getServerSession(authOptions);
      if (!session?.user) throw new Error("Unauthorized");
      
      // Only allow CREATOR role users to upload verification documents
      if (session.user.role !== "CREATOR") {
        throw new Error("Only creators can upload verification documents");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Medical document uploaded:", {
        userId: metadata.userId,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      });

      // Here you could automatically create a VerificationDocument record
      // or handle the file processing
      
      return { uploadedBy: metadata.userId };
    }),

  // Profile image upload
  profileImage: f({
    "image/jpeg": { maxFileSize: "4MB", maxFileCount: 1 },
    "image/png": { maxFileSize: "4MB", maxFileCount: 1 },
    "image/webp": { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      if (!session?.user) throw new Error("Unauthorized");
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image uploaded:", {
        userId: metadata.userId,
        fileName: file.name,
        fileUrl: file.url,
      });
      
      return { uploadedBy: metadata.userId };
    }),

  // Medical content media (for publications)
  contentMedia: f({
    "image/jpeg": { maxFileSize: "16MB", maxFileCount: 10 },
    "image/png": { maxFileSize: "16MB", maxFileCount: 10 },
    "image/webp": { maxFileSize: "16MB", maxFileCount: 10 },
    "application/pdf": { maxFileSize: "32MB", maxFileCount: 5 },
    "video/mp4": { maxFileSize: "512MB", maxFileCount: 1 },
    "video/webm": { maxFileSize: "512MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      if (!session?.user) throw new Error("Unauthorized");
      
      // Only verified creators can upload content media
      if (session.user.role !== "CREATOR" || session.user.verificationStatus !== "VERIFIED") {
        throw new Error("Only verified creators can upload content media");
      }
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Content media uploaded:", {
        userId: metadata.userId,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: file.url,
      });
      
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;