import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET all prerequisites
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');

    const where = activityId ? { activityId } : {};

    const prerequisites = await prisma.prerequisite.findMany({
      where,
      include: {
        activity: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: prerequisites
    });
  } catch (error) {
    console.error('Error fetching prerequisites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prerequisites' },
      { status: 500 }
    );
  }
}

// POST create new prerequisite
export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl, activityId } = body;

    // Validate required fields
    if (!imageUrl || !activityId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: imageUrl, activityId' },
        { status: 400 }
      );
    }

    // Check if activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId }
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    const prerequisite = await prisma.prerequisite.create({
      data: {
        imageUrl,
        activityId
      },
      include: {
        activity: true
      }
    });

    return NextResponse.json({
      success: true,
      data: prerequisite
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating prerequisite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prerequisite' },
      { status: 500 }
    );
  }
}