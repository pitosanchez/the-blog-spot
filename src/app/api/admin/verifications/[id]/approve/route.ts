import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notes } = await request.json();
    const documentId = params.id;

    // Update document status
    const document = await prisma.verificationDocument.update({
      where: { id: documentId },
      data: {
        status: "APPROVED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: notes || null,
      },
      include: {
        user: true,
      },
    });

    // Check if user should be verified
    // If this is a medical license and it's approved, mark user as verified
    if (document.type === "MEDICAL_LICENSE") {
      await prisma.user.update({
        where: { id: document.userId },
        data: {
          verificationStatus: "VERIFIED",
        },
      });
    }

    // Log approval for HIPAA compliance
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        activity: "DOCUMENT_APPROVED",
        metadata: {
          documentId,
          documentType: document.type,
          verifiedUserId: document.userId,
          notes,
          timestamp: new Date(),
        },
      },
    });

    // Log user verification status change
    await prisma.auditLog.create({
      data: {
        userId: document.userId,
        activity: "VERIFICATION_STATUS_CHANGED",
        metadata: {
          previousStatus: document.user.verificationStatus,
          newStatus: "VERIFIED",
          approvedBy: session.user.id,
          documentId,
          timestamp: new Date(),
        },
      },
    });

    // TODO: Send email notification to user about approval
    // await sendApprovalEmail(document.user.email, document.type);

    return NextResponse.json({
      success: true,
      message: "Document approved successfully",
      document,
    });

  } catch (error) {
    console.error("Error approving document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}