// src/app/api/students/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single student
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const student = await prisma.student.findUnique({
      where: { id },
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
        volunteerAssigned: true,
        programmeEnrolled: {
          include: { group: true }
        },
        organisation: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT - Update student profile and potentially linked user data
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log('PUT /api/students/[id] - ID:', id);
    console.log('PUT /api/students/[id] - Body:', body);

    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // If email is being changed, update it in the User model as well
    if (body.email && body.email !== existingStudent.user.email) {
      const emailExistsInUser = await prisma.user.findUnique({
        where: { email: body.email }
      });

      if (emailExistsInUser && emailExistsInUser.id !== existingStudent.userId) {
        return NextResponse.json(
          { success: false, error: 'Email already exists for another user' },
          { status: 400 }
        );
      }
    }

    const updatedStudent = await prisma.$transaction(async (tx) => {
      // Handle programme change
      const oldProgrammeId = existingStudent.programmeEnrolledId;
      const newProgrammeId = body.programmeEnrolledId || null;

      // First, update the User record if necessary
      const userUpdateData = {};
      if (body.name && body.name !== existingStudent.user.name) {
        userUpdateData.name = body.name;
      }
      if (body.age !== undefined && parseInt(body.age) !== existingStudent.user.age) {
        userUpdateData.age = body.age ? parseInt(body.age) : null;
      }
      if (body.email && body.email !== existingStudent.user.email) {
        userUpdateData.email = body.email;
      }

      // Update user if there are changes
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingStudent.userId },
          data: userUpdateData
        });
      }

      // Prepare student update data
      const studentUpdateData = {
        name: body.name || existingStudent.name,
        age: body.age ? parseInt(body.age) : existingStudent.age,
        email: body.email || existingStudent.email,
        skills: body.skills || existingStudent.skills,
        areaOfInterest: body.areaOfInterest || existingStudent.areaOfInterest,
        readingCapacity: body.readingCapacity || existingStudent.readingCapacity,
        preferredLanguages: body.preferredLanguages || existingStudent.preferredLanguages,
        fineMotorDevelopment: body.fineMotorDevelopment || existingStudent.fineMotorDevelopment,
        interactionCapacity: body.interactionCapacity || existingStudent.interactionCapacity,
        onlineClassExperience: body.onlineClassExperience || existingStudent.onlineClassExperience,
        attentionSpan: body.attentionSpan || existingStudent.attentionSpan,
        triggeringFactors: body.triggeringFactors || existingStudent.triggeringFactors,
        happyMoments: body.happyMoments || existingStudent.happyMoments,
        disability: body.disability || existingStudent.disability,
        // Handle foreign key relationships
        volunteerAssignedId: body.volunteerAssignedId || null,
        programmeEnrolledId: body.programmeEnrolledId || null,
        organisationId: body.organisationId || null,
      };

      // Update the student record
      const student = await tx.student.update({
        where: { id },
        data: studentUpdateData,
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
          volunteerAssigned: true,
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
            data: { students: { decrement: 1 } }
          });
        }
        if (newProgrammeId) {
          await tx.programme.update({
            where: { id: newProgrammeId },
            data: { students: { increment: 1 } }
          });
        }
      }

      return student;
    });

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });

  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update student', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE student
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existingStudent = await prisma.student.findUnique({
      where: { id }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.student.delete({
        where: { id }
      });

      // Update programme count
      if (existingStudent.programmeEnrolledId) {
        await tx.programme.update({
          where: { id: existingStudent.programmeEnrolledId },
          data: { students: { decrement: 1 } }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}