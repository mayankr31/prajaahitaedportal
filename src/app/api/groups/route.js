// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// // GET /api/groups - Get all groups with programme count
// export async function GET() {
//   try {
//     const groups = await prisma.group.findMany({
//       include: {
//         _count: {
//           select: {
//             programmes: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     })

//     return NextResponse.json({
//       success: true,
//       data: groups
//     })
//   } catch (error) {
//     console.error('Error fetching groups:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch groups' },
//       { status: 500 }
//     )
//   }
// }

// // POST /api/groups - Create a new group (for "Add New Group" button)
// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { name, imageUrl } = body
    
//     if (!name || !name.trim()) {
//       return NextResponse.json(
//         { success: false, error: 'Group name is required' },
//         { status: 400 }
//       )
//     }

//     const group = await prisma.group.create({
//       data: {
//         name: name.trim(),
//         imageUrl: imageUrl || null
//       },
//       include: {
//         _count: {
//           select: {
//             programmes: true
//           }
//         }
//       }
//     })

//     return NextResponse.json({
//       success: true,
//       data: group,
//       message: 'Group created successfully'
//     }, { status: 201 })
//   } catch (error) {
//     console.error('Error creating group:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to create group' },
//       { status: 500 }
//     )
//   }
// }

// api/groups/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import {  } from "next-auth"; // Import getServerSession
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your authOptions
import { auth } from '@/auth';

// GET /api/groups - Get all groups with programme count, filtered by approval status and user role
export async function GET(request) {
  const session = await auth(); // Get session
  console.log('Session group api:', session);

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    let whereClause = {};

    if (userRole === "student") {
      // Students only see approved groups
      whereClause.approvalStatus = "APPROVED";
    } else if (userRole === "volunteer") {
      // Volunteers see their own created groups (pending/rejected/approved)
      // and all approved groups
      whereClause = {
        OR: [
          { createdById: userId },
          { approvalStatus: "APPROVED" }
        ]
      };
    }
    // Admin and Expert can see all groups (they'll filter on the frontend for pending)

    const groups = await prisma.group.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            programmes: true
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create a new group (for "Add New Group" button)
export async function POST(request) {
  // const session = await getServerSession(authOptions); // Get session
  const session = await auth(); // Get session
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { name, imageUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Group name is required' },
        { status: 400 }
      );
    }

    let approvalStatus = "PENDING";
    if (userRole === "admin" || userRole === "expert") {
      approvalStatus = "APPROVED";
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        imageUrl: imageUrl || null,
        approvalStatus: approvalStatus,
        createdById: userId, // Set createdBy to the current user's ID
      },
      include: {
        _count: {
          select: {
            programmes: true
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
      data: group,
      message: 'Group created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create group' },
      { status: 500 }
    );
  }
}