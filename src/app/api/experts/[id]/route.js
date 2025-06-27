import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET single expert
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const expert = await prisma.expert.findUnique({
      where: { id },
      include: {
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

// PUT - Update expert
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingExpert = await prisma.expert.findUnique({
      where: { id }
    });

    if (!existingExpert) {
      return NextResponse.json(
        { success: false, error: 'Expert not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingExpert.email) {
      const emailExists = await prisma.expert.findUnique({
        where: { email: body.email }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedExpert = await prisma.$transaction(async (tx) => {
      const oldProgrammeId = existingExpert.programmeEnrolledId;
      const newProgrammeId = body.programmeEnrolledId;

      const expert = await tx.expert.update({
        where: { id },
        data: {
          ...body,
          age: body.age ? parseInt(body.age) : undefined
        },
        include: {
          assignedVolunteers: true,
          programmeEnrolled: true,
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
      { success: false, error: 'Failed to update expert' },
      { status: 500 }
    );
  }
}

// DELETE expert
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existingExpert = await prisma.expert.findUnique({
      where: { id },
      include: { assignedVolunteers: true }
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
      await tx.expert.delete({
        where: { id }
      });

      // Update programme count
      if (existingExpert.programmeEnrolledId) {
        await tx.programme.update({
          where: { id: existingExpert.programmeEnrolledId },
          data: { specialEducators: { decrement: 1 } }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Expert deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting expert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete expert' },
      { status: 500 }
    );
  }
}