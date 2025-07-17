// // app/api/users/[id]/route.js
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma'; // Adjust the import path as needed
// // import bcrypt from 'bcryptjs'; // Commented out as per user instruction

// // GET /api/users/[id] - Get a single user by ID with their associated role profile
// export async function GET(request, { params }) {
//   try {
//     const { id } = params;

//     const user = await prisma.user.findUnique({
//       where: { id },
//       include: {
//         studentProfile: true,    // Include student profile if it exists
//         volunteerProfile: true,  // Include volunteer profile if it exists
//         expertProfile: true,     // Include expert profile if it exists
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
//     }

//     // Depending on the role, attach the specific profile to the response
//     let userProfileData = { ...user };
//     if (user.role === 'student' && user.studentProfile) {
//       userProfileData.profile = user.studentProfile;
//     } else if (user.role === 'volunteer' && user.volunteerProfile) {
//       userProfileData.profile = user.volunteerProfile;
//     } else if (user.role === 'expert' && user.expertProfile) {
//       userProfileData.profile = user.expertProfile;
//     }

//     // Remove sensitive data like password before sending
//     const { password, accounts, sessions, Authenticator, studentProfile, volunteerProfile, expertProfile, ...safeUser } = userProfileData;

//     return NextResponse.json({ success: true, data: safeUser }, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching user:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch user' },
//       { status: 500 }
//     );
//   }
// }

// // PUT /api/users/[id] - Update a user's general information and their associated role profile
// export async function PUT(request, { params }) {
//   try {
//     const { id } = params;
//     const body = await request.json();
//     const {
//       name,
//       email,
//       password, // Allow password update (will be stored as plain text)
//       age,
//       role, // Allow role update (with caution)
//       image,
//       companyName,
//       phoneNumber,
//       country,
//       // Destructure specific profile data based on roles
//       // For student
//       skills, areaOfInterest, readingCapacity, preferredLanguages, fineMotorDevelopment,
//       interactionCapacity, onlineClassExperience, attentionSpan, triggeringFactors,
//       happyMoments, disability, volunteerAssignedId, programmeEnrolledId_student, organisationId_student,
//       // For volunteer
//       contactNumber, educationalQualification_volunteer, preferredLanguages_volunteer, experience,
//       profession_volunteer, whatMotivatesYou, feedback_volunteer, programmeEnrolledId_volunteer,
//       organisationId_volunteer, expertAssignedId,
//       // For expert
//       profession_expert, educationalQualification_expert, feedback_expert,
//       programmeEnrolledId_expert, organisationId_expert
//     } = body;

//     const existingUser = await prisma.user.findUnique({
//       where: { id },
//       include: { studentProfile: true, volunteerProfile: true, expertProfile: true }
//     });

//     if (!existingUser) {
//       return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
//     }

//     // Prepare data for User update
//     const userDataToUpdate = {};
//     if (name !== undefined) userDataToUpdate.name = name;
//     if (age !== undefined) userDataToUpdate.age = parseInt(age);
//     if (image !== undefined) userDataToUpdate.image = image;
//     if (companyName !== undefined) userDataToUpdate.companyName = companyName;
//     if (phoneNumber !== undefined) userDataToUpdate.phoneNumber = phoneNumber;
//     if (country !== undefined) userDataToUpdate.country = country;
//     if (password !== undefined && password !== '') {
//       // Password handling: Storing plain text as per current instruction.
//       // In a real application, you MUST hash the password here:
//       // userDataToUpdate.password = await bcrypt.hash(password, 10);
//       userDataToUpdate.password = password; // Using plain text password
//     }

//     // Handle email change and uniqueness check
//     if (email !== undefined && email !== existingUser.email) {
//       const emailExists = await prisma.user.findUnique({
//         where: { email }
//       });
//       if (emailExists && emailExists.id !== id) {
//         return NextResponse.json(
//           { success: false, message: 'Email already exists for another user' },
//           { status: 400 }
//         );
//       }
//       userDataToUpdate.email = email;
//     }

//     let updatedUser;
//     let updatedProfile;

//     await prisma.$transaction(async (tx) => {
//       // Handle role change logic first (if role is provided and different)
//       if (role !== undefined && role !== existingUser.role) {
//         // Delete old profile if it exists
//         if (existingUser.role === 'student' && existingUser.studentProfile) {
//           await tx.student.delete({ where: { userId: id } });
//         } else if (existingUser.role === 'volunteer' && existingUser.volunteerProfile) {
//           await tx.volunteer.delete({ where: { userId: id } });
//         } else if (existingUser.role === 'expert' && existingUser.expertProfile) {
//           await tx.expert.delete({ where: { userId: id } });
//         }
//         // Set the new role in user data
//         userDataToUpdate.role = role;
//       }

//       // Update the User record
//       updatedUser = await tx.user.update({
//         where: { id },
//         data: userDataToUpdate,
//       });

//       // Update or create the associated profile based on the (potentially new) role
//       const currentRole = role || existingUser.role; // Use new role if provided, else existing

//       switch (currentRole) {
//         case 'student':
//           updatedProfile = await tx.student.upsert({
//             where: { userId: id },
//             update: {
//               name: name || updatedUser.name,
//               age: age ? parseInt(age) : updatedUser.age,
//               email: email || updatedUser.email,
//               skills,
//               areaOfInterest,
//               readingCapacity,
//               preferredLanguages,
//               fineMotorDevelopment,
//               interactionCapacity,
//               onlineClassExperience,
//               attentionSpan,
//               triggeringFactors,
//               happyMoments,
//               disability,
//               volunteerAssignedId: volunteerAssignedId || null,
//               programmeEnrolledId: programmeEnrolledId_student || null,
//               organisationId: organisationId_student || null,
//             },
//             create: {
//               userId: id,
//               name: name || updatedUser.name || 'N/A',
//               age: age ? parseInt(age) : (updatedUser.age || 0),
//               email: email || updatedUser.email,
//               skills,
//               areaOfInterest,
//               readingCapacity,
//               preferredLanguages,
//               fineMotorDevelopment,
//               interactionCapacity,
//               onlineClassExperience,
//               attentionSpan,
//               triggeringFactors,
//               happyMoments,
//               disability,
//               volunteerAssignedId: volunteerAssignedId || null,
//               programmeEnrolledId: programmeEnrolledId_student || null,
//               organisationId: organisationId_student || null,
//             },
//           });
//           // Handle programme count update for student (if programmeEnrolledId_student changed)
//           if (programmeEnrolledId_student !== existingUser.studentProfile?.programmeEnrolledId) {
//             if (existingUser.studentProfile?.programmeEnrolledId) {
//               await tx.programme.update({
//                 where: { id: existingUser.studentProfile.programmeEnrolledId },
//                 data: { students: { decrement: 1 } }
//               });
//             }
//             if (programmeEnrolledId_student) {
//               await tx.programme.update({
//                 where: { id: programmeEnrolledId_student },
//                 data: { students: { increment: 1 } }
//               });
//             }
//           }
//           break;
//         case 'volunteer':
//           updatedProfile = await tx.volunteer.upsert({
//             where: { userId: id },
//             update: {
//               name: name || updatedUser.name,
//               age: age ? parseInt(age) : updatedUser.age,
//               email: email || updatedUser.email,
//               contactNumber,
//               educationalQualification: educationalQualification_volunteer,
//               preferredLanguages: preferredLanguages_volunteer,
//               experience,
//               profession: profession_volunteer,
//               whatMotivatesYou,
//               feedback: feedback_volunteer,
//               programmeEnrolledId: programmeEnrolledId_volunteer || null,
//               organisationId: organisationId_volunteer || null,
//               expertAssignedId: expertAssignedId || null,
//             },
//             create: {
//               userId: id,
//               name: name || updatedUser.name || 'N/A',
//               age: age ? parseInt(age) : (updatedUser.age || 0),
//               email: email || updatedUser.email,
//               contactNumber,
//               educationalQualification: educationalQualification_volunteer,
//               preferredLanguages: preferredLanguages_volunteer,
//               experience,
//               profession: profession_volunteer,
//               whatMotivatesYou,
//               feedback: feedback_volunteer,
//               programmeEnrolledId: programmeEnrolledId_volunteer || null,
//               organisationId: organisationId_volunteer || null,
//               expertAssignedId: expertAssignedId || null,
//             },
//           });
//           // Handle programme count update for volunteer
//           if (programmeEnrolledId_volunteer !== existingUser.volunteerProfile?.programmeEnrolledId) {
//             if (existingUser.volunteerProfile?.programmeEnrolledId) {
//               await tx.programme.update({
//                 where: { id: existingUser.volunteerProfile.programmeEnrolledId },
//                 data: { volunteers: { decrement: 1 } }
//               });
//             }
//             if (programmeEnrolledId_volunteer) {
//               await tx.programme.update({
//                 where: { id: programmeEnrolledId_volunteer },
//                 data: { volunteers: { increment: 1 } }
//               });
//             }
//           }
//           break;
//         case 'expert':
//           updatedProfile = await tx.expert.upsert({
//             where: { userId: id },
//             update: {
//               name: name || updatedUser.name,
//               age: age ? parseInt(age) : updatedUser.age,
//               email: email || updatedUser.email,
//               profession: profession_expert,
//               educationalQualification: educationalQualification_expert,
//               feedback: feedback_expert,
//               programmeEnrolledId: programmeEnrolledId_expert || null,
//               organisationId: organisationId_expert || null,
//             },
//             create: {
//               userId: id,
//               name: name || updatedUser.name || 'N/A',
//               age: age ? parseInt(age) : (updatedUser.age || 0),
//               email: email || updatedUser.email,
//               profession: profession_expert,
//               educationalQualification: educationalQualification_expert,
//               feedback: feedback_expert,
//               programmeEnrolledId: programmeEnrolledId_expert || null,
//               organisationId: organisationId_expert || null,
//             },
//           });
//           // Handle programme count update for expert
//           if (programmeEnrolledId_expert !== existingUser.expertProfile?.programmeEnrolledId) {
//             if (existingUser.expertProfile?.programmeEnrolledId) {
//               await tx.programme.update({
//                 where: { id: existingUser.expertProfile.programmeEnrolledId },
//                 data: { specialEducators: { decrement: 1 } }
//               });
//             }
//             if (programmeEnrolledId_expert) {
//               await tx.programme.update({
//                 where: { id: programmeEnrolledId_expert },
//                 data: { specialEducators: { increment: 1 } }
//               });
//             }
//           }
//           break;
//         default:
//           // If role is changed to null or an unrecognized role, delete existing profiles
//           if (existingUser.studentProfile) await tx.student.delete({ where: { userId: id } });
//           if (existingUser.volunteerProfile) await tx.volunteer.delete({ where: { userId: id } });
//           if (existingUser.expertProfile) await tx.expert.delete({ where: { userId: id } });
//           updatedProfile = null;
//           break;
//       }
//     });

//     // Remove sensitive data before sending response
//     const { password: updatedPassword, accounts, sessions, Authenticator, ...safeUpdatedUser } = updatedUser;

//     return NextResponse.json({
//       success: true,
//       message: 'User and profile updated successfully',
//       data: {
//         ...safeUpdatedUser,
//         profile: updatedProfile,
//       },
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error updating user:', error);
//     // Handle unique constraint violation for email
//     if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
//       return NextResponse.json(
//         { success: false, message: 'Email already exists for another user.' },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { success: false, message: 'Failed to update user' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE /api/users/[id] - Delete a user and their associated role profile
// export async function DELETE(request, { params }) {
//   try {
//     const { id } = params;

//     const existingUser = await prisma.user.findUnique({
//       where: { id },
//       include: {
//         studentProfile: true,
//         volunteerProfile: true,
//         expertProfile: true,
//       }
//     });

//     if (!existingUser) {
//       return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
//     }

//     await prisma.$transaction(async (tx) => {
//       // First, delete the associated role profile if it exists
//       if (existingUser.role === 'student' && existingUser.studentProfile) {
//         await tx.student.delete({ where: { userId: id } });
//         // Decrement programme count if applicable
//         if (existingUser.studentProfile.programmeEnrolledId) {
//           await tx.programme.update({
//             where: { id: existingUser.studentProfile.programmeEnrolledId },
//             data: { students: { decrement: 1 } }
//           });
//         }
//       } else if (existingUser.role === 'volunteer' && existingUser.volunteerProfile) {
//         // Check if volunteer has assigned students before deleting
//         const volunteerWithStudents = await tx.volunteer.findUnique({
//           where: { userId: id },
//           include: { assignedStudents: true }
//         });
//         if (volunteerWithStudents && volunteerWithStudents.assignedStudents.length > 0) {
//           throw new Error('Cannot delete volunteer with assigned students. Please unassign students first.');
//         }
//         await tx.volunteer.delete({ where: { userId: id } });
//         // Decrement programme count if applicable
//         if (existingUser.volunteerProfile.programmeEnrolledId) {
//           await tx.programme.update({
//             where: { id: existingUser.volunteerProfile.programmeEnrolledId },
//             data: { volunteers: { decrement: 1 } }
//           });
//         }
//       } else if (existingUser.role === 'expert' && existingUser.expertProfile) {
//         // Check if expert has assigned volunteers before deleting
//         const expertWithVolunteers = await tx.expert.findUnique({
//           where: { userId: id },
//           include: { assignedVolunteers: true }
//         });
//         if (expertWithVolunteers && expertWithVolunteers.assignedVolunteers.length > 0) {
//           throw new Error('Cannot delete expert with assigned volunteers. Please unassign volunteers first.');
//         }
//         await tx.expert.delete({ where: { userId: id } });
//         // Decrement programme count if applicable
//         if (existingUser.expertProfile.programmeEnrolledId) {
//           await tx.programme.update({
//             where: { id: existingUser.expertProfile.programmeEnrolledId },
//             data: { specialEducators: { decrement: 1 } }
//           });
//         }
//       }

//       // Finally, delete the User record
//       await tx.user.delete({
//         where: { id }
//       });
//     });

//     return NextResponse.json({ success: true, message: 'User and associated profile deleted successfully' }, { status: 200 });

//   } catch (error) {
//     console.error('Error deleting user:', error);
//     // Provide a more user-friendly error message if deletion is blocked
//     if (error.message.includes('Cannot delete')) {
//       return NextResponse.json(
//         { success: false, message: error.message },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { success: false, message: 'Failed to delete user' },
//       { status: 500 }
//     );
//   }
// }

// app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import path as needed
// import bcrypt from 'bcryptjs'; // Commented out as per user instruction

// GET /api/users/[id] - Get a single user by ID with their associated role profile
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: true,    // Include student profile if it exists
        volunteerProfile: true,  // Include volunteer profile if it exists
        expertProfile: true,     // Include expert profile if it exists
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Depending on the role, attach the specific profile to the response
    let userProfileData = { ...user };
    if (user.role === 'student' && user.studentProfile) {
      userProfileData.profile = user.studentProfile;
    } else if (user.role === 'volunteer' && user.volunteerProfile) {
      userProfileData.profile = user.volunteerProfile;
    } else if (user.role === 'expert' && user.expertProfile) {
      userProfileData.profile = user.expertProfile;
    }

    // Remove sensitive data like password before sending
    const { password, accounts, sessions, Authenticator, studentProfile, volunteerProfile, expertProfile, ...safeUser } = userProfileData;

    return NextResponse.json({ success: true, data: safeUser }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user's general information and their associated role profile
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      email,
      password, // Allow password update (will be stored as plain text)
      age,
      dateOfBirth, // New: dateOfBirth field
      role, // Allow role update (with caution)
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

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { studentProfile: true, volunteerProfile: true, expertProfile: true }
    });

    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Prepare data for User update
    const userDataToUpdate = {};
    if (name !== undefined) userDataToUpdate.name = name;
    if (age !== undefined) userDataToUpdate.age = parseInt(age);
    if (dateOfBirth !== undefined) userDataToUpdate.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null; // New: parse dateOfBirth
    if (image !== undefined) userDataToUpdate.image = image;
    if (companyName !== undefined) userDataToUpdate.companyName = companyName;
    if (phoneNumber !== undefined) userDataToUpdate.phoneNumber = phoneNumber;
    if (country !== undefined) userDataToUpdate.country = country;
    if (password !== undefined && password !== '') {
      // Password handling: Storing plain text as per current instruction.
      // In a real application, you MUST hash the password here:
      // userDataToUpdate.password = await bcrypt.hash(password, 10);
      userDataToUpdate.password = password; // Using plain text password
    }

    // Handle email change and uniqueness check
    if (email !== undefined && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExists && emailExists.id !== id) {
        return NextResponse.json(
          { success: false, message: 'Email already exists for another user' },
          { status: 400 }
        );
      }
      userDataToUpdate.email = email;
    }

    let updatedUser;
    let updatedProfile;

    await prisma.$transaction(async (tx) => {
      // Handle role change logic first (if role is provided and different)
      if (role !== undefined && role !== existingUser.role) {
        // Delete old profile if it exists
        if (existingUser.role === 'student' && existingUser.studentProfile) {
          await tx.student.delete({ where: { userId: id } });
        } else if (existingUser.role === 'volunteer' && existingUser.volunteerProfile) {
          await tx.volunteer.delete({ where: { userId: id } });
        } else if (existingUser.role === 'expert' && existingUser.expertProfile) {
          await tx.expert.delete({ where: { userId: id } });
        }
        // Set the new role in user data
        userDataToUpdate.role = role;
      }

      // Update the User record
      updatedUser = await tx.user.update({
        where: { id },
        data: userDataToUpdate,
      });

      // Update or create the associated profile based on the (potentially new) role
      const currentRole = role || existingUser.role; // Use new role if provided, else existing

      switch (currentRole) {
        case 'student':
          updatedProfile = await tx.student.upsert({
            where: { userId: id },
            update: {
              name: name || updatedUser.name,
              age: age ? parseInt(age) : updatedUser.age,
              email: email || updatedUser.email,
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
            create: {
              userId: id,
              name: name || updatedUser.name || 'N/A',
              age: age ? parseInt(age) : (updatedUser.age || 0),
              email: email || updatedUser.email,
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
          // Handle programme count update for student (if programmeEnrolledId_student changed)
          if (programmeEnrolledId_student !== existingUser.studentProfile?.programmeEnrolledId) {
            if (existingUser.studentProfile?.programmeEnrolledId) {
              await tx.programme.update({
                where: { id: existingUser.studentProfile.programmeEnrolledId },
                data: { students: { decrement: 1 } }
              });
            }
            if (programmeEnrolledId_student) {
              await tx.programme.update({
                where: { id: programmeEnrolledId_student },
                data: { students: { increment: 1 } }
              });
            }
          }
          break;
        case 'volunteer':
          updatedProfile = await tx.volunteer.upsert({
            where: { userId: id },
            update: {
              name: name || updatedUser.name,
              age: age ? parseInt(age) : updatedUser.age,
              email: email || updatedUser.email,
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
            create: {
              userId: id,
              name: name || updatedUser.name || 'N/A',
              age: age ? parseInt(age) : (updatedUser.age || 0),
              email: email || updatedUser.email,
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
          // Handle programme count update for volunteer
          if (programmeEnrolledId_volunteer !== existingUser.volunteerProfile?.programmeEnrolledId) {
            if (existingUser.volunteerProfile?.programmeEnrolledId) {
              await tx.programme.update({
                where: { id: existingUser.volunteerProfile.programmeEnrolledId },
                data: { volunteers: { decrement: 1 } }
              });
            }
            if (programmeEnrolledId_volunteer) {
              await tx.programme.update({
                where: { id: programmeEnrolledId_volunteer },
                data: { volunteers: { increment: 1 } }
              });
            }
          }
          break;
        case 'expert':
          updatedProfile = await tx.expert.upsert({
            where: { userId: id },
            update: {
              name: name || updatedUser.name,
              age: age ? parseInt(age) : updatedUser.age,
              email: email || updatedUser.email,
              profession: profession_expert,
              educationalQualification: educationalQualification_expert,
              feedback: feedback_expert,
              programmeEnrolledId: programmeEnrolledId_expert || null,
              organisationId: organisationId_expert || null,
            },
            create: {
              userId: id,
              name: name || updatedUser.name || 'N/A',
              age: age ? parseInt(age) : (updatedUser.age || 0),
              email: email || updatedUser.email,
              profession: profession_expert,
              educationalQualification: educationalQualification_expert,
              feedback: feedback_expert,
              programmeEnrolledId: programmeEnrolledId_expert || null,
              organisationId: organisationId_expert || null,
            },
          });
          // Handle programme count update for expert
          if (programmeEnrolledId_expert !== existingUser.expertProfile?.programmeEnrolledId) {
            if (existingUser.expertProfile?.programmeEnrolledId) {
              await tx.programme.update({
                where: { id: existingUser.expertProfile.programmeEnrolledId },
                data: { specialEducators: { decrement: 1 } }
              });
            }
            if (programmeEnrolledId_expert) {
              await tx.programme.update({
                where: { id: programmeEnrolledId_expert },
                data: { specialEducators: { increment: 1 } }
              });
            }
          }
          break;
        default:
          // If role is changed to null or an unrecognized role, delete existing profiles
          if (existingUser.studentProfile) await tx.student.delete({ where: { userId: id } });
          if (existingUser.volunteerProfile) await tx.volunteer.delete({ where: { userId: id } });
          if (existingUser.expertProfile) await tx.expert.delete({ where: { userId: id } });
          updatedProfile = null;
          break;
      }
    });

    // Remove sensitive data before sending response
    const { password: updatedPassword, accounts, sessions, Authenticator, ...safeUpdatedUser } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'User and profile updated successfully',
      data: {
        ...safeUpdatedUser,
        profile: updatedProfile,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating user:', error);
    // Handle unique constraint violation for email
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { success: false, message: 'Email already exists for another user.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user and their associated role profile
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: true,
        volunteerProfile: true,
        expertProfile: true,
      }
    });

    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // First, delete the associated role profile if it exists
      if (existingUser.role === 'student' && existingUser.studentProfile) {
        await tx.student.delete({ where: { userId: id } });
        // Decrement programme count if applicable
        if (existingUser.studentProfile.programmeEnrolledId) {
          await tx.programme.update({
            where: { id: existingUser.studentProfile.programmeEnrolledId },
            data: { students: { decrement: 1 } }
          });
        }
      } else if (existingUser.role === 'volunteer' && existingUser.volunteerProfile) {
        // Check if volunteer has assigned students before deleting
        const volunteerWithStudents = await tx.volunteer.findUnique({
          where: { userId: id },
          include: { assignedStudents: true }
        });
        if (volunteerWithStudents && volunteerWithStudents.assignedStudents.length > 0) {
          throw new Error('Cannot delete volunteer with assigned students. Please unassign students first.');
        }
        await tx.volunteer.delete({ where: { userId: id } });
        // Decrement programme count if applicable
        if (existingUser.volunteerProfile.programmeEnrolledId) {
          await tx.programme.update({
            where: { id: existingUser.volunteerProfile.programmeEnrolledId },
            data: { volunteers: { decrement: 1 } }
          });
        }
      } else if (existingUser.role === 'expert' && existingUser.expertProfile) {
        // Check if expert has assigned volunteers before deleting
        const expertWithVolunteers = await tx.expert.findUnique({
          where: { userId: id },
          include: { assignedVolunteers: true }
        });
        if (expertWithVolunteers && expertWithVolunteers.assignedVolunteers.length > 0) {
          throw new Error('Cannot delete expert with assigned volunteers. Please unassign volunteers first.');
        }
        await tx.expert.delete({ where: { userId: id } });
        // Decrement programme count if applicable
        if (existingUser.expertProfile.programmeEnrolledId) {
          await tx.programme.update({
            where: { id: existingUser.expertProfile.programmeEnrolledId },
            data: { specialEducators: { decrement: 1 } }
          });
        }
      }

      // Finally, delete the User record
      await tx.user.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true, message: 'User and associated profile deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting user:', error);
    // Provide a more user-friendly error message if deletion is blocked
    if (error.message.includes('Cannot delete')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
