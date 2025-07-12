// // src/app/api/volunteers/[id]/route.js
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// // GET single volunteer
// export async function GET(request, { params }) {
//   try {
//     const { id } = params;

//     const volunteer = await prisma.volunteer.findUnique({
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
//         assignedStudents: true,
//         expertAssigned: true,
//         programmeEnrolled: {
//           include: { group: true }
//         },
//         organisation: true
//       }
//     });

//     if (!volunteer) {
//       return NextResponse.json(
//         { success: false, error: 'Volunteer not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: volunteer
//     });
//   } catch (error) {
//     console.error('Error fetching volunteer:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch volunteer' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update volunteer profile and potentially linked user data
// export async function PUT(request, { params }) {
//   try {
//     const { id } = params;
//     const body = await request.json();

//     const existingVolunteer = await prisma.volunteer.findUnique({
//       where: { id },
//       include: { user: true } // Include the linked user to check email and update
//     });

//     if (!existingVolunteer) {
//       return NextResponse.json(
//         { success: false, error: 'Volunteer not found' },
//         { status: 404 }
//       );
//     }

//     // If email is being changed, update it in the User model as well
//     if (body.email && body.email !== existingVolunteer.user.email) {
//       const emailExistsInUser = await prisma.user.findUnique({
//         where: { email: body.email }
//       });

//       if (emailExistsInUser && emailExistsInUser.id !== existingVolunteer.userId) {
//         return NextResponse.json(
//           { success: false, error: 'Email already exists for another user' },
//           { status: 400 }
//         );
//       }
//       // Update the user's email
//       await prisma.user.update({
//         where: { id: existingVolunteer.userId },
//         data: { email: body.email }
//       });
//     }

//     const updatedVolunteer = await prisma.$transaction(async (tx) => {
//       const oldProgrammeId = existingVolunteer.programmeEnrolledId;
//       const newProgrammeId = body.programmeEnrolledId;

//       const volunteer = await tx.volunteer.update({
//         where: { id },
//         data: {
//           ...body,
//           age: body.age ? parseInt(body.age) : undefined,
//           email: body.email || existingVolunteer.user.email,
//           user: {
//             update: {
//               name: body.name || existingVolunteer.user.name,
//               age: body.age ? parseInt(body.age) : existingVolunteer.user.age,
//             }
//           }
//         },
//         include: {
//           user: true,
//           assignedStudents: true,
//           expertAssigned: true,
//           programmeEnrolled: true,
//           organisation: true
//         }
//       });

//       // Update programme counts if programme changed
//       if (oldProgrammeId !== newProgrammeId) {
//         if (oldProgrammeId) {
//           await tx.programme.update({
//             where: { id: oldProgrammeId },
//             data: { volunteers: { decrement: 1 } }
//           });
//         }
//         if (newProgrammeId) {
//           await tx.programme.update({
//             where: { id: newProgrammeId },
//             data: { volunteers: { increment: 1 } }
//           });
//         }
//       }

//       return volunteer;
//     });

//     return NextResponse.json({
//       success: true,
//       data: updatedVolunteer,
//       message: 'Volunteer updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating volunteer:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to update volunteer' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE volunteer profile and update user's role
// export async function DELETE(request, { params }) {
//   try {
//     const { id } = params;

//     const existingVolunteer = await prisma.volunteer.findUnique({
//       where: { id },
//       include: { assignedStudents: true, user: true } // Include linked user
//     });

//     if (!existingVolunteer) {
//       return NextResponse.json(
//         { success: false, error: 'Volunteer not found' },
//         { status: 404 }
//       );
//     }

//     // Check if volunteer has assigned students
//     if (existingVolunteer.assignedStudents.length > 0) {
//       return NextResponse.json(
//         { success: false, error: 'Cannot delete volunteer with assigned students' },
//         { status: 400 }
//       );
//     }

//     await prisma.$transaction(async (tx) => {
//       // Delete the volunteer profile
//       await tx.volunteer.delete({
//         where: { id }
//       });

//       // Update the associated User's role to null or a default role
//       await tx.user.update({
//         where: { id: existingVolunteer.userId },
//         data: { role: null } // Or 'user', 'unassigned', etc.
//       });

//       // Update programme count
//       if (existingVolunteer.programmeEnrolledId) {
//         await tx.programme.update({
//           where: { id: existingVolunteer.programmeEnrolledId },
//           data: { volunteers: { decrement: 1 } }
//         });
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Volunteer profile deleted successfully and user role updated'
//     });

//   } catch (error) {
//     console.error('Error deleting volunteer:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to delete volunteer' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/volunteers/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single volunteer
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const volunteer = await prisma.volunteer.findUnique({
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
        assignedStudents: true,
        expertAssigned: true,
        programmeEnrolled: {
          include: { group: true }
        },
        organisation: true
      }
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteer' },
      { status: 500 }
    );
  }
}

// PUT - Update volunteer profile and potentially linked user data
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log('Updating volunteer with ID:', id);
    console.log('Request body:', body);

    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and validate uniqueness
    if (body.email && body.email !== existingVolunteer.user.email) {
      const emailExistsInUser = await prisma.user.findUnique({
        where: { email: body.email }
      });

      if (emailExistsInUser && emailExistsInUser.id !== existingVolunteer.userId) {
        return NextResponse.json(
          { success: false, error: 'Email already exists for another user' },
          { status: 400 }
        );
      }
    }

    const updatedVolunteer = await prisma.$transaction(async (tx) => {
      const oldProgrammeId = existingVolunteer.programmeEnrolledId;
      const newProgrammeId = body.programmeEnrolledId || null;

      // Prepare volunteer data (exclude user-specific fields)
      const volunteerData = {
        name: body.name,
        age: body.age ? parseInt(body.age) : null,
        email: body.email,
        contactNumber: body.contactNumber,
        educationalQualification: body.educationalQualification,
        preferredLanguages: body.preferredLanguages,
        experience: body.experience,
        profession: body.profession,
        whatMotivatesYou: body.whatMotivatesYou,
        feedback: body.feedback,
        programmeEnrolledId: newProgrammeId,
        organisationId: body.organisationId || null,
        expertAssignedId: body.expertAssignedId || null,
      };

      // Update volunteer record
      const volunteer = await tx.volunteer.update({
        where: { id },
        data: volunteerData,
        include: {
          user: true,
          assignedStudents: true,
          expertAssigned: true,
          programmeEnrolled: true,
          organisation: true
        }
      });

      // Update associated user record
      await tx.user.update({
        where: { id: existingVolunteer.userId },
        data: {
          name: body.name || existingVolunteer.user.name,
          email: body.email || existingVolunteer.user.email,
          age: body.age ? parseInt(body.age) : existingVolunteer.user.age,
        }
      });

      // Update programme counts if programme changed
      if (oldProgrammeId !== newProgrammeId) {
        if (oldProgrammeId) {
          await tx.programme.update({
            where: { id: oldProgrammeId },
            data: { volunteers: { decrement: 1 } }
          });
        }
        if (newProgrammeId) {
          await tx.programme.update({
            where: { id: newProgrammeId },
            data: { volunteers: { increment: 1 } }
          });
        }
      }

      return volunteer;
    });

    return NextResponse.json({
      success: true,
      data: updatedVolunteer,
      message: 'Volunteer updated successfully'
    });

  } catch (error) {
    console.error('Error updating volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update volunteer', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE volunteer profile and update user's role
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: { assignedStudents: true, user: true }
    });

    if (!existingVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    // Check if volunteer has assigned students
    if (existingVolunteer.assignedStudents.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete volunteer with assigned students' },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Delete the volunteer profile
      await tx.volunteer.delete({
        where: { id }
      });

      // Update the associated User's role to null or a default role
      await tx.user.update({
        where: { id: existingVolunteer.userId },
        data: { role: null }
      });

      // Update programme count
      if (existingVolunteer.programmeEnrolledId) {
        await tx.programme.update({
          where: { id: existingVolunteer.programmeEnrolledId },
          data: { volunteers: { decrement: 1 } }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Volunteer profile deleted successfully and user role updated'
    });

  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete volunteer' },
      { status: 500 }
    );
  }
}