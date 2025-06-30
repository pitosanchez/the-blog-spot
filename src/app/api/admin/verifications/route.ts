import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING_REVIEW";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          licenseNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          fileName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Fetch documents with user information
    const documents = await prisma.verificationDocument.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            medicalCredentials: true,
            specialties: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.verificationDocument.count({ where });

    // Log admin access for HIPAA compliance
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        activity: "ADMIN_VERIFICATION_ACCESS",
        metadata: {
          status,
          search,
          documentsReturned: documents.length,
          timestamp: new Date(),
        },
      },
    });

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching verification documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}