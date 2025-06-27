import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET single student
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
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

// PUT - Update student
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingStudent = await prisma.student.findUnique({
      where: { id }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingStudent.email) {
      const emailExists = await prisma.student.findUnique({
        where: { email: body.email }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedStudent = await prisma.$transaction(async (tx) => {
      // Handle programme change
      const oldProgrammeId = existingStudent.programmeEnrolledId;
      const newProgrammeId = body.programmeEnrolledId;

      const student = await tx.student.update({
        where: { id },
        data: {
          ...body,
          age: body.age ? parseInt(body.age) : undefined
        },
        include: {
          volunteerAssigned: true,
          programmeEnrolled: true,
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
      { success: false, error: 'Failed to update student' },
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