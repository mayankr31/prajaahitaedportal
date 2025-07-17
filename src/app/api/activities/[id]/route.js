//src\app\api\activities\[id]\route.js
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET single activity by ID
export async function GET(
  request,
  { params }
) {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: params.id
      },
      include: {
        prerequisites: true
      }
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}

// PUT update activity by ID
export async function PUT(
  request,
  { params }
) {
  try {
    const body = await request.json();
    const { imageUrl, title, date, time, category, pdfUrl, feedback, prerequisites } = body;

    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id: params.id }
    });

    if (!existingActivity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Update activity with prerequisites
    const activity = await prisma.activity.update({
      where: {
        id: params.id
      },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(title && { title }),
        ...(date && { date: new Date(date) }),
        ...(time !== undefined && { time: time || null }),
        ...(category && { category }),
        ...(pdfUrl !== undefined && { pdfUrl: pdfUrl || null }),
        ...(feedback !== undefined && { feedback: feedback || null }),
        ...(prerequisites && {
          prerequisites: {
            deleteMany: {}, // Delete existing prerequisites
            create: prerequisites.map((prereq) => ({
              imageUrl: prereq.imageUrl
            }))
          }
        })
      },
      include: {
        prerequisites: true
      }
    });

    return NextResponse.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

// DELETE activity by ID
export async function DELETE(
  request,
  { params }
) {
  try {
    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id: params.id }
    });

    if (!existingActivity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Delete activity (prerequisites will be cascade deleted)
    await prisma.activity.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}