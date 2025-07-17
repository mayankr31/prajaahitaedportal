// api/meetings/[id]/approve-reject/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // Assuming you have this for session management

export async function PUT(request, { params }) {
  const session = await auth();

  if (!session || (session.user.role !== "admin" && session.user.role !== "expert")) {
    return NextResponse.json({ success: false, error: "Forbidden: Only Admins or Experts can approve/reject meetings" }, { status: 403 });
  }

  const { id } = params; // Meeting ID
  const { action, rejectionMessage } = await request.json(); // 'approve' or 'reject'
  const approvedById = session.user.id;

  try {
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id },
    });

    if (!existingMeeting) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 });
    }

    let updatedMeeting;
    if (action === "approve") {
      updatedMeeting = await prisma.meeting.update({
        where: { id },
        data: {
          approvalStatus: "APPROVED",
          approvedById: approvedById,
          rejectionMessage: null, // Clear rejection message on approval
        },
        include: { // Include createdBy and approvedBy in the response
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
      updatedMeeting = await prisma.meeting.update({
        where: { id },
        data: {
          approvalStatus: "REJECTED",
          approvedById: approvedById,
          rejectionMessage: rejectionMessage.trim(),
        },
        include: { // Include createdBy and approvedBy in the response
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

    return NextResponse.json({ success: true, data: updatedMeeting, message: `Meeting ${action}d successfully` });
  } catch (error) {
    console.error(`Error ${action}ing meeting:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to ${action} meeting` },
      { status: 500 }
    );
  }
}
