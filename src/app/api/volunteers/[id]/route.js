import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET single volunteer
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: {
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

// PUT - Update volunteer
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id }
    });

    if (!existingVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingVolunteer.email) {
      const emailExists = await prisma.volunteer.findUnique({
        where: { email: body.email }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedVolunteer = await prisma.$transaction(async (tx) => {
      const oldProgrammeId = existingVolunteer.programmeEnrolledId;
      const newProgrammeId = body.programmeEnrolledId;

      const volunteer = await tx.volunteer.update({
        where: { id },
        data: {
          ...body,
          age: body.age ? parseInt(body.age) : undefined
        },
        include: {
          assignedStudents: true,
          expertAssigned: true,
          programmeEnrolled: true,
          organisation: true
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
      { success: false, error: 'Failed to update volunteer' },
      { status: 500 }
    );
  }
}

// DELETE volunteer
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: { assignedStudents: true }
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
      await tx.volunteer.delete({
        where: { id }
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
      message: 'Volunteer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete volunteer' },
      { status: 500 }
    );
  }
}
