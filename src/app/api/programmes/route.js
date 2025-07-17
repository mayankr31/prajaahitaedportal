// // src\app\api\programmes\route.js
// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// // GET /api/programmes - Get all programmes (optional: filter by groupId)
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const groupId = searchParams.get('groupId')

//     const whereClause = groupId ? { groupId } : {}

//     const programmes = await prisma.programme.findMany({
//       where: whereClause,
//       include: {
//         group: {
//           select: {
//             id: true,
//             name: true,
//             imageUrl: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     })

//     return NextResponse.json({
//       success: true,
//       data: programmes
//     })
//   } catch (error) {
//     console.error('Error fetching programmes:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch programmes' },
//       { status: 500 }
//     )
//   }
// }

// // POST /api/programmes - Create a new programme (for "Add New Programme" button)
// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { name, groupId, students, volunteers, specialEducators, imageUrl } = body
    
//     // Validation
//     if (!name || !name.trim()) {
//       return NextResponse.json(
//         { success: false, error: 'Programme name is required' },
//         { status: 400 }
//       )
//     }

//     if (name.trim().length < 3) {
//       return NextResponse.json(
//         { success: false, error: 'Programme name must be at least 3 characters long' },
//         { status: 400 }
//       )
//     }

//     if (!groupId) {
//       return NextResponse.json(
//         { success: false, error: 'Group ID is required' },
//         { status: 400 }
//       )
//     }

//     // Verify group exists
//     const group = await prisma.group.findUnique({
//       where: { id: groupId }
//     })

//     if (!group) {
//       return NextResponse.json(
//         { success: false, error: 'Group not found' },
//         { status: 404 }
//       )
//     }

//     // Check if programme name already exists in this group
//     const existingProgramme = await prisma.programme.findFirst({
//       where: {
//         groupId,
//         name: name.trim()
//       }
//     })

//     if (existingProgramme) {
//       return NextResponse.json(
//         { success: false, error: 'A programme with this name already exists in this group' },
//         { status: 409 }
//       )
//     }

//     const programme = await prisma.programme.create({
//       data: {
//         name: name.trim(),
//         groupId,
//         students: students || 0,
//         volunteers: volunteers || 0,
//         specialEducators: specialEducators || 0,
//         imageUrl: imageUrl || null
//       },
//       include: {
//         group: {
//           select: {
//             id: true,
//             name: true,
//             imageUrl: true
//           }
//         }
//       }
//     })

//     return NextResponse.json({
//       success: true,
//       data: programme,
//       message: 'Programme created successfully'
//     }, { status: 201 })
//   } catch (error) {
//     console.error('Error creating programme:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to create programme' },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // Import auth for session

// GET /api/programmes - Get all programmes (optional: filter by groupId, and by approval status/user role)
export async function GET(request) {
  const session = await auth(); // Get session
  console.log('Session programme api:', session);

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    let whereClause = {};
    if (groupId) {
      whereClause.groupId = groupId;
    }

    // Apply approval status filtering based on user role
    if (userRole === "student") {
      // Students only see approved programmes
      whereClause.approvalStatus = "APPROVED";
    } else if (userRole === "volunteer") {
      // Volunteers see their own created programmes (pending/rejected/approved) AND all approved programmes
      whereClause = {
        AND: [
          whereClause, // Keep existing groupId filter if present
          {
            OR: [
              { createdById: userId },
              { approvalStatus: "APPROVED" }
            ]
          }
        ]
      };
    }
    // Admin and Expert can see all programmes (they'll filter on the frontend for pending if needed)

    const programmes = await prisma.programme.findMany({
      where: whereClause,
      include: {
        group: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        createdBy: { // Include createdBy user details
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        approvedBy: { // Include approvedBy user details
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
      data: programmes
    });
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programmes' },
      { status: 500 }
    );
  }
}

// POST /api/programmes - Create a new programme
export async function POST(request) {
  const session = await auth(); // Get session
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { name, groupId, students, volunteers, specialEducators, imageUrl } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Programme name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Programme name must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (!groupId) {
      return NextResponse.json(
        { success: false, error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // Verify group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }

    // Check if programme name already exists in this group (only for approved/pending)
    const existingProgramme = await prisma.programme.findFirst({
      where: {
        groupId,
        name: name.trim(),
        // Consider if you want to allow a rejected programme with the same name to be created again
        // For simplicity, let's just check against all names for now.
      }
    });

    if (existingProgramme) {
      return NextResponse.json(
        { success: false, error: 'A programme with this name already exists in this group' },
        { status: 409 }
      );
    }

    let approvalStatus = "PENDING";
    if (userRole === "admin" || userRole === "expert") {
      approvalStatus = "APPROVED";
    }

    const programme = await prisma.programme.create({
      data: {
        name: name.trim(),
        groupId,
        students: students || 0,
        volunteers: volunteers || 0,
        specialEducators: specialEducators || 0,
        imageUrl: imageUrl || null,
        approvalStatus: approvalStatus,       // Set approval status
        createdById: userId,                 // Set createdBy user
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
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
      data: programme,
      message: 'Programme created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating programme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create programme' },
      { status: 500 }
    );
  }
}