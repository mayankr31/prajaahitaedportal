// //src\app\api\prerequisites\route.js
// import { NextResponse } from 'next/server';
// import {prisma} from '@/lib/prisma';

// // GET all prerequisites
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const activityId = searchParams.get('activityId');

//     const where = activityId ? { activityId } : {};

//     const prerequisites = await prisma.prerequisite.findMany({
//       where,
//       include: {
//         activity: true
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: prerequisites
//     });
//   } catch (error) {
//     console.error('Error fetching prerequisites:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch prerequisites' },
//       { status: 500 }
//     );
//   }
// }

// // POST create new prerequisite
// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { imageUrl, activityId } = body;

//     // Validate required fields
//     if (!imageUrl || !activityId) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields: imageUrl, activityId' },
//         { status: 400 }
//       );
//     }

//     // Check if activity exists
//     const activity = await prisma.activity.findUnique({
//       where: { id: activityId }
//     });

//     if (!activity) {
//       return NextResponse.json(
//         { success: false, error: 'Activity not found' },
//         { status: 404 }
//       );
//     }

//     const prerequisite = await prisma.prerequisite.create({
//       data: {
//         imageUrl,
//         activityId
//       },
//       include: {
//         activity: true
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: prerequisite
//     }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating prerequisite:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to create prerequisite' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // Assuming 'auth' is how you get the session

// GET all prerequisites
export async function GET(request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');

    let whereClause = {};

    // Filter by activityId if provided
    if (activityId) {
      whereClause.activityId = activityId;
    }

    if (userRole === "student") {
      // Students only see approved prerequisites
      whereClause.approvalStatus = "APPROVED";
    } else if (userRole === "volunteer") {
      // Volunteers see their own created prerequisites (pending/rejected/approved)
      // and all approved prerequisites
      whereClause = {
        AND: [
          { activityId: activityId }, // Ensure we still filter by activityId
          {
            OR: [
              { createdById: userId },
              { approvalStatus: "APPROVED" }
            ]
          }
        ]
      };
    }
    // Admin and Expert can see all prerequisites (they'll filter on the frontend for pending)

    const prerequisites = await prisma.prerequisite.findMany({
      where: whereClause,
      include: {
        activity: true,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: prerequisites
    });
  } catch (error) {
    console.error('Error fetching prerequisites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prerequisites' },
      { status: 500 }
    );
  }
}

// POST create new prerequisite
export async function POST(request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { imageUrl, activityId } = body;

    // Validate required fields
    if (!imageUrl || !activityId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: imageUrl, activityId' },
        { status: 400 }
      );
    }

    // Check if activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId }
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    let approvalStatus = "PENDING";
    if (userRole === "admin" || userRole === "expert") {
      approvalStatus = "APPROVED";
    }

    const prerequisite = await prisma.prerequisite.create({
      data: {
        imageUrl,
        activityId,
        approvalStatus: approvalStatus,
        createdById: userId, // Set createdBy to the current user's ID
      },
      include: {
        activity: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: prerequisite
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating prerequisite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prerequisite' },
      { status: 500 }
    );
  }
}