// api/groups/[id]/approve-reject/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request, { params }) {
  const session = await auth();

  if (!session || (session.user.role !== "admin" && session.user.role !== "expert")) {
    return NextResponse.json({ success: false, error: "Forbidden: Only Admins or Experts can approve/reject" }, { status: 403 });
  }

  const { id } = params; // Group ID
  const { action, rejectionMessage } = await request.json(); // 'approve' or 'reject'
  const approvedById = session.user.id;

  try {
    const existingGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return NextResponse.json({ success: false, error: 'Group not found' }, { status: 404 });
    }

    let updatedGroup;
    if (action === "approve") {
      updatedGroup = await prisma.group.update({
        where: { id },
        data: {
          approvalStatus: "APPROVED",
          approvedById: approvedById,
          rejectionMessage: null, // Clear rejection message on approval
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            }
        }
      });
    } else if (action === "reject") {
      if (!rejectionMessage || !rejectionMessage.trim()) {
        return NextResponse.json({ success: false, error: 'Rejection message is required for rejection' }, { status: 400 });
      }
      updatedGroup = await prisma.group.update({
        where: { id },
        data: {
          approvalStatus: "REJECTED",
          approvedById: approvedById,
          rejectionMessage: rejectionMessage.trim(),
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            },
            approvedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            }
        }
      });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updatedGroup, message: `Group ${action}d successfully` });
  } catch (error) {
    console.error(`Error ${action}ing group:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to ${action} group` },
      { status: 500 }
    );
  }
}