// // app/api/users/route.js
// import { NextResponse } from 'next/server';
// import {prisma} from '@/lib/prisma'; // Adjust the import path as needed

// // GET /api/users - Get all users with pagination
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 10;
//     const role = searchParams.get('role');
//     const search = searchParams.get('search');

//     const skip = (page - 1) * limit;

//     // Build where clause for filtering
//     const where = {};
//     if (role) {
//       where.role = role;
//     }
//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: 'insensitive' } },
//         { email: { contains: search, mode: 'insensitive' } },
//         { companyName: { contains: search, mode: 'insensitive' } }
//       ];
//     }

//     const [users, totalCount] = await Promise.all([
//       prisma.user.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: { createdAt: 'desc' },
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           age: true,
//           role: true,
//           image: true,
//           companyName: true,
//           phoneNumber: true,
//           country: true,
//           createdAt: true,
//           updatedAt: true
//         }
//       }),
//       prisma.user.count({ where })
//     ]);

//     const totalPages = Math.ceil(totalCount / limit);

//     return NextResponse.json({
//       success: true,
//       data: users,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch users' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // POST /api/users - Create a new user
// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const {
//       name,
//       email,
//       password,
//       age,
//       role,
//       image,
//       companyName,
//       phoneNumber,
//       country
//     } = body;

//     // Basic validation
//     if (!email) {
//       return NextResponse.json(
//         { success: false, message: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email }
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { success: false, message: 'User with this email already exists' },
//         { status: 400 }
//       );
//     }

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password,
//         age: age ? parseInt(age) : null,
//         role,
//         image,
//         companyName,
//         phoneNumber,
//         country
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         age: true,
//         role: true,
//         image: true,
//         companyName: true,
//         phoneNumber: true,
//         country: true,
//         createdAt: true,
//         updatedAt: true
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       data: user,
//       message: 'User created successfully'
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error creating user:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to create user' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// app/api/users/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import path as needed
// import bcrypt from 'bcryptjs'; // Commented out as per user instruction

// GET /api/users - Get all users with pagination and include role-specific profiles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
          createdAt: true,
          updatedAt: true,
          // Include related profiles based on the user's role
          studentProfile: {
            select: {
              id: true,
              skills: true,
              areaOfInterest: true,
              readingCapacity: true,
              preferredLanguages: true,
              fineMotorDevelopment: true,
              interactionCapacity: true,
              onlineClassExperience: true,
              attentionSpan: true,
              triggeringFactors: true,
              happyMoments: true,
              disability: true,
              volunteerAssignedId: true,
              programmeEnrolledId: true,
              organisationId: true,
            }
          },
          volunteerProfile: {
            select: {
              id: true,
              contactNumber: true,
              educationalQualification: true,
              preferredLanguages: true,
              experience: true,
              profession: true,
              whatMotivatesYou: true,
              feedback: true,
              programmeEnrolledId: true,
              organisationId: true,
              expertAssignedId: true,
              assignedStudents: true,
            }
          },
          expertProfile: {
            select: {
              id: true,
              profession: true,
              educationalQualification: true,
              feedback: true,
              programmeEnrolledId: true,
              organisationId: true,
              assignedVolunteers: true,
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    // Format the data to include the specific profile under a 'profile' key
    const formattedUsers = users.map(user => {
      const { studentProfile, volunteerProfile, expertProfile, ...userData } = user;
      let profile = null;

      if (userData.role === 'student' && studentProfile) {
        profile = studentProfile;
      } else if (userData.role === 'volunteer' && volunteerProfile) {
        profile = volunteerProfile;
      } else if (userData.role === 'expert' && expertProfile) {
        profile = expertProfile;
      }

      return { ...userData, profile };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user and their associated role profile for signup
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password, // Password will be stored as plain text as per current instruction.
                // For production, always hash passwords (e.g., using bcryptjs).
      age,
      role,
      image,
      companyName,
      phoneNumber,
      country,
      // Destructure specific profile data based on roles
      // For student
      skills, areaOfInterest, readingCapacity, preferredLanguages, fineMotorDevelopment,
      interactionCapacity, onlineClassExperience, attentionSpan, triggeringFactors,
      happyMoments, disability, volunteerAssignedId, programmeEnrolledId_student, organisationId_student,
      // For volunteer
      contactNumber, educationalQualification_volunteer, preferredLanguages_volunteer, experience,
      profession_volunteer, whatMotivatesYou, feedback_volunteer, programmeEnrolledId_volunteer,
      organisationId_volunteer, expertAssignedId,
      // For expert
      profession_expert, educationalQualification_expert, feedback_expert,
      programmeEnrolledId_expert, organisationId_expert
    } = body;

    // Basic validation for user creation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 } // Conflict status code
      );
    }

    // Password handling: Storing plain text as per current instruction.
    // In a real application, you MUST hash the password here:
    // const hashedPassword = await bcrypt.hash(password, 10);
    const storedPassword = password; // Using plain text password

    let newUser;
    let newProfile;

    // Use a transaction to ensure atomicity: either both user and profile are created, or neither are.
    await prisma.$transaction(async (tx) => {
      // Create the User record
      newUser = await tx.user.create({
        data: {
          name,
          email,
          password: storedPassword, // Store plain text password
          age: age ? parseInt(age) : null,
          role,
          image,
          companyName,
          phoneNumber,
          country
        }
      });

      // Create the associated profile based on the role
      switch (role) {
        case 'student':
          newProfile = await tx.student.create({
            data: {
              userId: newUser.id,
              name: name || newUser.name || 'N/A',
              age: age ? parseInt(age) : (newUser.age || 0),
              email: email || newUser.email,
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
              disability,
              volunteerAssignedId: volunteerAssignedId || null,
              programmeEnrolledId: programmeEnrolledId_student || null,
              organisationId: organisationId_student || null,
            },
          });
          // Update programme student count if needed
          if (programmeEnrolledId_student) {
            await tx.programme.update({
              where: { id: programmeEnrolledId_student },
              data: { students: { increment: 1 } }
            });
          }
          break;
        case 'volunteer':
          newProfile = await tx.volunteer.create({
            data: {
              userId: newUser.id,
              name: name || newUser.name || 'N/A',
              age: age ? parseInt(age) : (newUser.age || 0),
              email: email || newUser.email,
              contactNumber,
              educationalQualification: educationalQualification_volunteer,
              preferredLanguages: preferredLanguages_volunteer,
              experience,
              profession: profession_volunteer,
              whatMotivatesYou,
              feedback: feedback_volunteer,
              programmeEnrolledId: programmeEnrolledId_volunteer || null,
              organisationId: organisationId_volunteer || null,
              expertAssignedId: expertAssignedId || null,
            },
          });
          // Update programme volunteer count if needed
          if (programmeEnrolledId_volunteer) {
            await tx.programme.update({
              where: { id: programmeEnrolledId_volunteer },
              data: { volunteers: { increment: 1 } }
            });
          }
          break;
        case 'expert':
          newProfile = await tx.expert.create({
            data: {
              userId: newUser.id,
              name: name || newUser.name || 'N/A',
              age: age ? parseInt(age) : (newUser.age || 0),
              email: email || newUser.email,
              profession: profession_expert,
              educationalQualification: educationalQualification_expert,
              feedback: feedback_expert,
              programmeEnrolledId: programmeEnrolledId_expert || null,
              organisationId: organisationId_expert || null,
            },
          });
          // Update programme expert count if needed
          if (programmeEnrolledId_expert) {
            await tx.programme.update({
              where: { id: programmeEnrolledId_expert },
              data: { specialEducators: { increment: 1 } }
            });
          }
          break;
        default:
          // If no specific role profile is created, newProfile remains undefined
          console.warn(`No specific profile created for role: ${role}`);
          break;
      }
    });

    // Return success response with user and created profile (if any)
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newProfile, // Include the created profile
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    // Handle unique constraint violation for email
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
