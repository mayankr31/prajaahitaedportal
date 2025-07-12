// //src\app\api\students\route.js
// import { NextResponse } from 'next/server';
// import {prisma} from '@/lib/prisma';

// // GET all students
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const search = searchParams.get('search') || '';
//     const programmeId = searchParams.get('programmeId');
//     const organisationId = searchParams.get('organisationId');

//     const skip = (page - 1) * limit;
//     const where = {};
    
//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: 'insensitive' } },
//         { email: { contains: search, mode: 'insensitive' } }
//       ];
//     }
    
//     if (programmeId) where.programmeEnrolledId = programmeId;
//     if (organisationId) where.organisationId = organisationId;

//     const [students, total] = await Promise.all([
//       prisma.student.findMany({
//         where,
//         skip,
//         take: limit,
//         include: {
//           volunteerAssigned: {
//             select: { id: true, name: true, email: true }
//           },
//           programmeEnrolled: {
//             select: { id: true, groupId: true }
//           },
//           organisation: {
//             select: { id: true, name: true }
//           }
//         },
//         orderBy: { createdAt: 'desc' }
//       }),
//       prisma.student.count({ where })
//     ]);

//     return NextResponse.json({
//       success: true,
//       data: students,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch students' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create new student
// export async function POST(request) {
//   try {
//     const body = await request.json();
    
//     const {
//       name,
//       age,
//       email,
//       volunteerAssignedId,
//       programmeEnrolledId,
//       organisationId,
//       skills,
//       areaOfInterest,
//       readingCapacity,
//       preferredLanguages,
//       fineMotorDevelopment,
//       interactionCapacity,
//       onlineClassExperience,
//       attentionSpan,
//       triggeringFactors,
//       happyMoments,
//       disability
//     } = body;

//     // Validation
//     if (!name || !age || !email) {
//       return NextResponse.json(
//         { success: false, error: 'Name, age, and email are required' },
//         { status: 400 }
//       );
//     }

//     // Check if email already exists
//     const existingStudent = await prisma.student.findUnique({
//       where: { email }
//     });

//     if (existingStudent) {
//       return NextResponse.json(
//         { success: false, error: 'Email already exists' },
//         { status: 400 }
//       );
//     }

//     // Create student and update programme count if needed
//     const student = await prisma.$transaction(async (tx) => {
//       const newStudent = await tx.student.create({
//         data: {
//           name,
//           age: parseInt(age),
//           email,
//           volunteerAssignedId: volunteerAssignedId || null,
//           programmeEnrolledId: programmeEnrolledId || null,
//           organisationId: organisationId || null,
//           skills,
//           areaOfInterest,
//           readingCapacity,
//           preferredLanguages,
//           fineMotorDevelopment,
//           interactionCapacity,
//           onlineClassExperience,
//           attentionSpan,
//           triggeringFactors,
//           happyMoments,
//           disability
//         },
//         include: {
//           volunteerAssigned: true,
//           programmeEnrolled: true,
//           organisation: true
//         }
//       });

//       // Update programme student count
//       if (programmeEnrolledId) {
//         await tx.programme.update({
//           where: { id: programmeEnrolledId },
//           data: { students: { increment: 1 } }
//         });
//       }

//       return newStudent;
//     });

//     return NextResponse.json({
//       success: true,
//       data: student,
//       message: 'Student created successfully'
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error creating student:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to create student' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/students/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all students
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const programmeId = searchParams.get('programmeId');
    const organisationId = searchParams.get('organisationId');

    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (programmeId) where.programmeEnrolledId = programmeId;
    if (organisationId) where.organisationId = organisationId;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { // Include the associated User data
            select: {
              id: true,
              name: true,
              email: true,
              age: true,
              role: true,
              image: true,
              companyName: true,
              phoneNumber: true,
              country: true,
            }
          },
          volunteerAssigned: {
            select: { id: true, name: true, email: true }
          },
          programmeEnrolled: {
            select: { id: true, groupId: true }
          },
          organisation: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.student.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST - Create new student profile linked to an existing User
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      userId, // Expect userId to link to an existing User
      name, // Name might be redundant if pulled from User, but kept for schema consistency
      age, // Age might be redundant if pulled from User, but kept for schema consistency
      email, // Email might be redundant if pulled from User, but kept for schema consistency
      volunteerAssignedId,
      programmeEnrolledId,
      organisationId,
      skills,
      areaOfInterest,
      readingCapacity,
      preferredLanguages,
      fineMotorDevelopment,
      interactionCapacity,
      onlineClassExperience,
      attentionSpan,
      triggeringFactors,
      happyMoments,
      disability
    } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required to create a student profile' },
        { status: 400 }
      );
    }

    // 1. Find the associated User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true } // Include existing student profile
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found for the provided userId' },
        { status: 404 }
      );
    }

    // 2. Check if a student profile already exists for this user
    if (user.studentProfile) {
      return NextResponse.json(
        { success: false, error: 'A student profile already exists for this user' },
        { status: 400 }
      );
    }

    // 3. Ensure the user's role is set to 'student'
    // If the user's role is not 'student', update it.
    if (user.role !== 'student') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'student' }
      });
    }

    // 4. Create student profile and update programme count if needed
    const student = await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: {
          userId: user.id, // Link to the existing user
          name: name || user.name || 'N/A', // Use provided name, or user's name, or default
          age: age ? parseInt(age) : (user.age || 0), // Use provided age, or user's age, or default
          email: email || user.email, // Use provided email, or user's email (ensure consistency)
          volunteerAssignedId: volunteerAssignedId || null,
          programmeEnrolledId: programmeEnrolledId || null,
          organisationId: organisationId || null,
          skills,
          areaOfInterest,
          readingCapacity,
          preferredLanguages,
          fineMotorDevelopment,
          interactionCapacity,
          onlineClassExperience,
          attentionSpan,
          triggeringFactors,
          happyMoments,
          disability
        },
        include: {
          user: true, // Include the linked user in the response
          volunteerAssigned: true,
          programmeEnrolled: true,
          organisation: true
        }
      });

      // Update programme student count
      if (programmeEnrolledId) {
        await tx.programme.update({
          where: { id: programmeEnrolledId },
          data: { students: { increment: 1 } }
        });
      }

      return newStudent;
    });

    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student profile created successfully and linked to user'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating student profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student profile' },
      { status: 500 }
    );
  }
}
