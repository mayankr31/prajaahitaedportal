//src\app\api\prerequisites\[id]\route.js
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET single prerequisite by ID
export async function GET(
  request,
  { params }
) {
  try {
    const prerequisite = await prisma.prerequisite.findUnique({
      where: {
        id: params.id
      },
      include: {
        activity: true
      }
    });

    if (!prerequisite) {
      return NextResponse.json(
        { success: false, error: 'Prerequisite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: prerequisite
    });
  } catch (error) {
    console.error('Error fetching prerequisite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prerequisite' },
      { status: 500 }
    );
  }
}

// PUT update prerequisite by ID
export async function PUT(
  request,
  { params }
) {
  try {
    const body = await request.json();
    const { imageUrl, activityId } = body;

    // Check if prerequisite exists
    const existingPrerequisite = await prisma.prerequisite.findUnique({
      where: { id: params.id }
    });

    if (!existingPrerequisite) {
      return NextResponse.json(
        { success: false, error: 'Prerequisite not found' },
        { status: 404 }
      );
    }

    // If activityId is being updated, check if the new activity exists
    if (activityId && activityId !== existingPrerequisite.activityId) {
      const activity = await prisma.activity.findUnique({
        where: { id: activityId }
      });

      if (!activity) {
        return NextResponse.json(
          { success: false, error: 'Activity not found' },
          { status: 404 }
        );
      }
    }

    const prerequisite = await prisma.prerequisite.update({
      where: {
        id: params.id
      },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(activityId && { activityId })
      },
      include: {
        activity: true
      }
    });

    return NextResponse.json({
      success: true,
      data: prerequisite
    });
  } catch (error) {
    console.error('Error updating prerequisite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update prerequisite' },
      { status: 500 }
    );
  }
}

// DELETE prerequisite by ID
export async function DELETE(
  request,
  { params }
) {
  try {
    // Check if prerequisite exists
    const existingPrerequisite = await prisma.prerequisite.findUnique({
      where: { id: params.id }
    });

    if (!existingPrerequisite) {
      return NextResponse.json(
        { success: false, error: 'Prerequisite not found' },
        { status: 404 }
      );
    }

    await prisma.prerequisite.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Prerequisite deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting prerequisite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete prerequisite' },
      { status: 500 }
    );
  }
}