// // src/app/api/experts/[id]/route.js
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// // GET single expert
// export async function GET(request, { params }) {
//   try {
//     const { id } = params;

//     const expert = await prisma.expert.findUnique({
//       where: { id },
//       include: {
//         user: { // Include the associated User data
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             age: true,
//             role: true,
//             image: true,
//             companyName: true,
//             phoneNumber: true,
//             country: true,
//           }
//         },
//         assignedVolunteers: {
//           include: {
//             assignedStudents: {
//               select: { id: true, name: true, email: true }
//             }
//           }
//         },
//         programmeEnrolled: {
//           include: { group: true }
//         },
//         organisation: true
//       }
//     });

//     if (!expert) {
//       return NextResponse.json(
//         { success: false, error: 'Expert not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: expert
//     });
//   } catch (error) {
//     console.error('Error fetching expert:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch expert' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update expert profile and potentially linked user data
// export async function PUT(request, { params }) {
//   try {
//     const { id } = params;
//     const body = await request.json();

//     const existingExpert = await prisma.expert.findUnique({
//       where: { id },
//       include: { user: true } // Include the linked user to check email and update
//     });

//     if (!existingExpert) {
//       return NextResponse.json(
//         { success: false, error: 'Expert not found' },
//         { status: 404 }
//       );
//     }

//     // If email is being changed, update it in the User model as well
//     if (body.email && body.email !== existingExpert.user.email) {
//       const emailExistsInUser = await prisma.user.findUnique({
//         where: { email: body.email }
//       });

//       if (emailExistsInUser && emailExistsInUser.id !== existingExpert.userId) {
//         return NextResponse.json(
//           { success: false, error: 'Email already exists for another user' },
//           { status: 400 }
//         );
//       }
//       // Update the user's email
//       await prisma.user.update({
//         where: { id: existingExpert.userId },
//         data: { email: body.email }
//       });
//     }

//     const updatedExpert = await prisma.$transaction(async (tx) => {
//       const oldProgrammeId = existingExpert.programmeEnrolledId;
//       const newProgrammeId = body.programmeEnrolledId;

//       const expert = await tx.expert.update({
//         where: { id },
//         data: {
//           ...body,
//           age: body.age ? parseInt(body.age) : undefined,
//           email: body.email || existingExpert.user.email,
//           user: {
//             update: {
//               name: body.name || existingExpert.user.name,
//               age: body.age ? parseInt(body.age) : existingExpert.user.age,
//             }
//           }
//         },
//         include: {
//           user: true,
//           assignedVolunteers: true,
//           programmeEnrolled: true,
//           organisation: true
//         }
//       });

//       // Update programme counts if programme changed
//       if (oldProgrammeId !== newProgrammeId) {
//         if (oldProgrammeId) {
//           await tx.programme.update({
//             where: { id: oldProgrammeId },
//             data: { specialEducators: { decrement: 1 } }
//           });
//         }
//         if (newProgrammeId) {
//           await tx.programme.update({
//             where: { id: newProgrammeId },
//             data: { specialEducators: { increment: 1 } }
//           });
//         }
//       }

//       return expert;
//     });

//     return NextResponse.json({
//       success: true,
//       data: updatedExpert,
//       message: 'Expert updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating expert:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to update expert' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE expert profile and update user's role
// export async function DELETE(request, { params }) {
//   try {
//     const { id } = params;

//     const existingExpert = await prisma.expert.findUnique({
//       where: { id },
//       include: { assignedVolunteers: true, user: true } // Include linked user
//     });

//     if (!existingExpert) {
//       return NextResponse.json(
//         { success: false, error: 'Expert not found' },
//         { status: 404 }
//       );
//     }

//     // Check if expert has assigned volunteers
//     if (existingExpert.assignedVolunteers.length > 0) {
//       return NextResponse.json(
//         { success: false, error: 'Cannot delete expert with assigned volunteers' },
//         { status: 400 }
//       );
//     }

//     await prisma.$transaction(async (tx) => {
//       // Delete the expert profile
//       await tx.expert.delete({
//         where: { id }
//       });

//       // Update the associated User's role to null or a default role
//       await tx.user.update({
//         where: { id: existingExpert.userId },
//         data: { role: null } // Or 'user', 'unassigned', etc.
//       });

//       // Update programme count
//       if (existingExpert.programmeEnrolledId) {
//         await tx.programme.update({
//           where: { id: existingExpert.programmeEnrolledId },
//           data: { specialEducators: { decrement: 1 } }
//         });
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Expert profile deleted successfully and user role updated'
//     });

//   } catch (error) {
//     console.error('Error deleting expert:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to delete expert' },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/experts/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single expert
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const expert = await prisma.expert.findUnique({
      where: { id },
      include: {
        user: {
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
        assignedVolunteers: {
          include: {
            assignedStudents: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        programmeEnrolled: {
          include: { group: true }
        },
        organisation: true
      }
    });

    if (!expert) {
      return NextResponse.json(
        { success: false, error: 'Expert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: expert
    });
  } catch (error) {
    console.error('Error fetching expert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expert' },
      { status: 500 }
    );
  }
}

// PUT - Update expert profile and linked user data
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingExpert = await prisma.expert.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingExpert) {
      return NextResponse.json(
        { success: false, error: 'Expert not found' },
        { status: 404 }
      );
    }

    // Prepare user data for update
    const userUpdateData = {};
    if (body.name !== undefined) userUpdateData.name = body.name;
    if (body.age !== undefined) userUpdateData.age = body.age ? parseInt(body.age) : null;
    if (body.email !== undefined) userUpdateData.email = body.email;

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingExpert.user.email) {
      const emailExists = await prisma.user.findFirst({
        where: { 
          email: body.email,
          id: { not: existingExpert.userId }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists for another user' },
          { status: 400 }
        );
      }
    }

    // Prepare expert data for update (excluding user fields)
    const expertUpdateData = {};
    if (body.profession !== undefined) expertUpdateData.profession = body.profession;
    if (body.educationalQualification !== undefined) expertUpdateData.educationalQualification = body.educationalQualification;
    if (body.feedback !== undefined) expertUpdateData.feedback = body.feedback;
    if (body.programmeEnrolledId !== undefined) expertUpdateData.programmeEnrolledId = body.programmeEnrolledId || null;
    if (body.organisationId !== undefined) expertUpdateData.organisationId = body.organisationId || null;

    const updatedExpert = await prisma.$transaction(async (tx) => {
      const oldProgrammeId = existingExpert.programmeEnrolledId;
      const newProgrammeId = body.programmeEnrolledId;

      // Update user data
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingExpert.userId },
          data: userUpdateData
        });
      }

      // Update expert data
      const expert = await tx.expert.update({
        where: { id },
        data: expertUpdateData,
        include: {
          user: {
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
          assignedVolunteers: {
            include: {
              assignedStudents: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          programmeEnrolled: {
            include: { group: true }
          },
          organisation: true
        }
      });

      // Update programme counts if programme changed
      if (oldProgrammeId !== newProgrammeId) {
        if (oldProgrammeId) {
          await tx.programme.update({
            where: { id: oldProgrammeId },
            data: { specialEducators: { decrement: 1 } }
          });
        }
        if (newProgrammeId) {
          await tx.programme.update({
            where: { id: newProgrammeId },
            data: { specialEducators: { increment: 1 } }
          });
        }
      }

      return expert;
    });

    return NextResponse.json({
      success: true,
      data: updatedExpert,
      message: 'Expert updated successfully'
    });

  } catch (error) {
    console.error('Error updating expert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update expert: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE expert profile and update user's role
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existingExpert = await prisma.expert.findUnique({
      where: { id },
      include: { 
        assignedVolunteers: true, 
        user: true,
        programmeEnrolled: true 
      }
    });

    if (!existingExpert) {
      return NextResponse.json(
        { success: false, error: 'Expert not found' },
        { status: 404 }
      );
    }

    // Check if expert has assigned volunteers
    if (existingExpert.assignedVolunteers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete expert with assigned volunteers' },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Update programme count before deleting
      if (existingExpert.programmeEnrolledId) {
        await tx.programme.update({
          where: { id: existingExpert.programmeEnrolledId },
          data: { specialEducators: { decrement: 1 } }
        });
      }

      // Delete the expert profile
      await tx.expert.delete({
        where: { id }
      });

      // Update the associated User's role
      await tx.user.update({
        where: { id: existingExpert.userId },
        data: { role: null }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Expert profile deleted successfully and user role updated'
    });

  } catch (error) {
    console.error('Error deleting expert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete expert: ' + error.message },
      { status: 500 }
    );
  }
}