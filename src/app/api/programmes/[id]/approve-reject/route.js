import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // Import auth for session

export async function PUT(request, { params }) {
  const session = await auth();

  // Only Admins or Experts can approve/reject programmes
  if (!session || (session.user.role !== "admin" && session.user.role !== "expert")) {
    return NextResponse.json({ success: false, error: "Forbidden: Only Admins or Experts can approve/reject" }, { status: 403 });
  }

  const { id } = params; // Programme ID
  const { action, rejectionMessage } = await request.json(); // 'approve' or 'reject'
  const approvedById = session.user.id;

  try {
    const existingProgramme = await prisma.programme.findUnique({
      where: { id },
    });

    if (!existingProgramme) {
      return NextResponse.json({ success: false, error: 'Programme not found' }, { status: 404 });
    }

    let updatedProgramme;
    if (action === "approve") {
      updatedProgramme = await prisma.programme.update({
        where: { id },
        data: {
          approvalStatus: "APPROVED",
          approvedById: approvedById,
          rejectionMessage: null, // Clear rejection message on approval
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            }
          },
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
      updatedProgramme = await prisma.programme.update({
        where: { id },
        data: {
          approvalStatus: "REJECTED",
          approvedById: approvedById,
          rejectionMessage: rejectionMessage.trim(),
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
            }
          },
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

    return NextResponse.json({ success: true, data: updatedProgramme, message: `Programme ${action}d successfully` });
  } catch (error) {
    console.error(`Error ${action}ing programme:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to ${action} programme` },
      { status: 500 }
    );
  }
}