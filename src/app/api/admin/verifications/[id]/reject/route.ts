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

    const { reason } = await request.json();
    const documentId = params.id;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Update document status
    const document = await prisma.verificationDocument.update({
      where: { id: documentId },
      data: {
        status: "REJECTED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: reason,
      },
      include: {
        user: true,
      },
    });

    // Check if user should remain unverified
    // If this is a medical license rejection, ensure user stays unverified
    if (document.type === "MEDICAL_LICENSE") {
      await prisma.user.update({
        where: { id: document.userId },
        data: {
          verificationStatus: "REJECTED",
        },
      });
    }

    // Log rejection for HIPAA compliance
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        activity: "DOCUMENT_REJECTED",
        metadata: {
          documentId,
          documentType: document.type,
          rejectedUserId: document.userId,
          reason,
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
          newStatus: "REJECTED",
          rejectedBy: session.user.id,
          documentId,
          rejectionReason: reason,
          timestamp: new Date(),
        },
      },
    });

    // TODO: Send email notification to user about rejection with reason
    // await sendRejectionEmail(document.user.email, document.type, reason);

    return NextResponse.json({
      success: true,
      message: "Document rejected",
      document,
    });

  } catch (error) {
    console.error("Error rejecting document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}