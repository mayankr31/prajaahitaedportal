// //src\app\api\activities\route.js
// import { NextResponse } from 'next/server';
// import {prisma} from '@/lib/prisma';

// // GET all activities with prerequisites
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const includePrerequisites = searchParams.get('include') === 'prerequisites';
    
//     const activities = await prisma.activity.findMany({
//       include: {
//         prerequisites: includePrerequisites
//       },
//       orderBy: {
//         date: 'desc'
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: activities
//     });
//   } catch (error) {
//     console.error('Error fetching activities:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch activities' },
//       { status: 500 }
//     );
//   }
// }

// // POST create new activity
// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { imageUrl, title, date, time, category, pdfUrl, feedback, prerequisites } = body;

//     // Validate required fields
//     if (!imageUrl || !title || !date || !category) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields: imageUrl, title, date, category' },
//         { status: 400 }
//       );
//     }

//     const activity = await prisma.activity.create({
//       data: {
//         imageUrl,
//         title,
//         date: new Date(date),
//         time: time || null,
//         category,
//         pdfUrl: pdfUrl || null,
//         feedback: feedback || null,
//         prerequisites: prerequisites ? {
//           create: prerequisites.map((prereq) => ({
//             imageUrl: prereq.imageUrl
//           }))
//         } : undefined
//       },
//       include: {
//         prerequisites: true
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: activity
//     }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating activity:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to create activity' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/activities/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // Assuming you have NextAuth.js configured with this import

// GET all activities with prerequisites, filtered by approval status and user role
export async function GET(request) {
  const session = await auth(); // Get session
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const includePrerequisites = searchParams.get('include') === 'prerequisites';

    let whereClause = {};

    if (userRole === "student") {
      // Students only see approved activities
      whereClause.approvalStatus = "APPROVED";
    } else if (userRole === "volunteer") {
      // Volunteers see their own created activities (pending/rejected/approved)
      // and all approved activities
      whereClause = {
        OR: [
          { createdById: userId },
          { approvalStatus: "APPROVED" }
        ]
      };
    }
    // Admin and Expert can see all activities (they'll filter on the frontend for pending)

    const activities = await prisma.activity.findMany({
      where: whereClause,
      include: {
        prerequisites: includePrerequisites,
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
        date: 'desc' // Changed from createdAt to date for more logical ordering for activities
      }
    });

    return NextResponse.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST create new activity
export async function POST(request) {
  const session = await auth(); // Get session
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { imageUrl, title, date, time, category, pdfUrl, prerequisites } = body; // Removed feedback as it's not set on creation

    // Validate required fields
    if (!title || !date || !category) { // imageUrl is now defaultable, so not strictly required here
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, date, category' },
        { status: 400 }
      );
    }

    let approvalStatus = "PENDING";
    if (userRole === "admin" || userRole === "expert") {
      approvalStatus = "APPROVED";
    }

    const activity = await prisma.activity.create({
      data: {
        imageUrl: imageUrl || "https://techterms.com/img/lg/pdf_109.png", // Provide a default if not uploaded
        title,
        date: new Date(date),
        time: time || null,
        category,
        pdfUrl: pdfUrl || null,
        approvalStatus: approvalStatus,
        createdById: userId, // Set createdBy to the current user's ID
        prerequisites: prerequisites ? {
          create: prerequisites.map((prereq) => ({
            imageUrl: prereq.imageUrl
          }))
        } : undefined
      },
      include: {
        prerequisites: true,
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
      data: activity,
      message: 'Activity created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}