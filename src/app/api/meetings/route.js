// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// // GET /api/meetings - Get all meetings
// export async function GET(request) {
//   try {
//     const meetings = await prisma.meeting.findMany({
//       orderBy: {
//         startDateTime: 'asc' // Order by start date/time instead of createdAt
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: meetings
//     });
//   } catch (error) {
//     console.error('Error fetching meetings:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch meetings' },
//       { status: 500 }
//     );
//   }
// }

// // POST /api/meetings - Create a new meeting
// export async function POST(request) {
//   try {
//     const body = await request.json();
   
//     // Validate required fields
//     if (!body.title || !body.participants || !body.date || !body.startDateTime || !body.endDateTime) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields: title, participants, date, startDateTime, endDateTime' },
//         { status: 400 }
//       );
//     }

//     // Validate date format
//     const date = new Date(body.date);
//     if (isNaN(date.getTime())) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid date format. Please provide a valid date.' },
//         { status: 400 }
//       );
//     }

//     // Validate datetime fields
//     const startDateTime = new Date(body.startDateTime);
//     const endDateTime = new Date(body.endDateTime);

//     if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid datetime format. Please provide valid ISO strings.' },
//         { status: 400 }
//       );
//     }

//     if (startDateTime >= endDateTime) {
//       return NextResponse.json(
//         { success: false, error: 'End time must be after start time' },
//         { status: 400 }
//       );
//     }

//     // Validate participants array
//     if (!Array.isArray(body.participants) || body.participants.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'Participants must be a non-empty array' },
//         { status: 400 }
//       );
//     }

//     // Create the meeting
//     const meeting = await prisma.meeting.create({
//       data: {
//         title: body.title,
//         participants: body.participants,
//         date: date,
//         startDateTime: startDateTime,
//         endDateTime: endDateTime,
//         repeat: body.repeat || 'Does not repeat',
//         location: body.location || null,
//         description: body.description || null,
//         isAllDay: body.isAllDay || false,
//         makeOpenEvent: body.makeOpenEvent || false,
//         videoCall: body.videoCall || null,
//         videoCallLink: body.videoCallLink || null,
//       }
//     });

//     return NextResponse.json(
//       { success: true, data: meeting },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error creating meeting:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to create meeting' },
//       { status: 500 }
//     );
//   }
// }

// api/meetings/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth'; // Assuming you have this for session management

// GET /api/meetings - Get all meetings with approval status and user roles applied
export async function GET(request) {
  const session = await auth(); // Get session
  console.log('Session meeting api:', session);

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    let whereClause = {};

    if (userRole === "student") {
      // Students only see approved meetings
      whereClause.approvalStatus = "APPROVED";
    } else if (userRole === "volunteer") {
      // Volunteers see their own created meetings (pending/rejected/approved)
      // and all approved meetings
      whereClause = {
        OR: [
          { createdById: userId },
          { approvalStatus: "APPROVED" }
        ]
      };
    }
    // Admin and Expert can see all meetings (they'll filter on the frontend for pending)

    const meetings = await prisma.meeting.findMany({
      where: whereClause,
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
      },
      orderBy: {
        startDateTime: 'asc' // Order by start date/time
      }
    });

    return NextResponse.json({
      success: true,
      data: meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

// POST /api/meetings - Create a new meeting (with approval logic)
export async function POST(request) {
  const session = await auth(); // Get session
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.participants || !body.date || !body.startDateTime || !body.endDateTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, participants, date, startDateTime, endDateTime' },
        { status: 400 }
      );
    }

    // Validate date format
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Please provide a valid date.' },
        { status: 400 }
      );
    }

    // Validate datetime fields
    const startDateTime = new Date(body.startDateTime);
    const endDateTime = new Date(body.endDateTime);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid datetime format. Please provide valid ISO strings.' },
        { status: 400 }
      );
    }

    if (startDateTime >= endDateTime) {
      return NextResponse.json(
        { success: false, error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Validate participants array
    if (!Array.isArray(body.participants) || body.participants.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Participants must be a non-empty array' },
        { status: 400 }
      );
    }

    // Determine approval status based on user role
    let approvalStatus = "PENDING";
    let approvedById = null;
    if (userRole === "admin" || userRole === "expert") {
      approvalStatus = "APPROVED";
      approvedById = userId; // Admins/Experts automatically approve their own creations
    }

    // Create the meeting
    const meeting = await prisma.meeting.create({
      data: {
        title: body.title,
        participants: body.participants,
        date: date,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        repeat: body.repeat || 'Does not repeat',
        location: body.location || null,
        description: body.description || null,
        isAllDay: body.isAllDay || false,
        makeOpenEvent: body.makeOpenEvent || false,
        videoCall: body.videoCall || null,
        videoCallLink: body.videoCallLink || null,
        approvalStatus: approvalStatus, // Set initial approval status
        createdById: userId,           // Set the creator
        approvedById: approvedById,    // Set approver if auto-approved
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

    return NextResponse.json(
      { success: true, data: meeting, message: 'Meeting created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}
