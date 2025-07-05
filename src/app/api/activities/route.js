import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET all activities with prerequisites
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includePrerequisites = searchParams.get('include') === 'prerequisites';
    
    const activities = await prisma.activity.findMany({
      include: {
        prerequisites: includePrerequisites
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST create new activity
export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl, title, date, prerequisites } = body;

    // Validate required fields
    if (!imageUrl || !title || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: imageUrl, title, date' },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        imageUrl,
        title,
        date: new Date(date),
        prerequisites: prerequisites ? {
          create: prerequisites.map((prereq) => ({
            imageUrl: prereq.imageUrl
          }))
        } : undefined
      },
      include: {
        prerequisites: true
      }
    });

    return NextResponse.json({
      success: true,
      data: activity
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}