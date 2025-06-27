import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET /api/meetings/[id] - Get a specific meeting by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const meeting = await prisma.meeting.findUnique({
      where: { id }
    });

    if (!meeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meeting' },
      { status: 500 }
    );
  }
}

// PUT /api/meetings/[id] - Update a specific meeting
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if meeting exists
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id }
    });

    if (!existingMeeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }

    // Validate datetime fields if provided
    if (body.date || body.startDateTime || body.endDateTime) {
      const date = body.date ? new Date(body.date) : existingMeeting.date;
      const startDateTime = body.startDateTime ? new Date(body.startDateTime) : existingMeeting.startDateTime;
      const endDateTime = body.endDateTime ? new Date(body.endDateTime) : existingMeeting.endDateTime;

      if (body.date && isNaN(date.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format' },
          { status: 400 }
        );
      }

      if (body.startDateTime && isNaN(startDateTime.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid startDateTime format' },
          { status: 400 }
        );
      }

      if (body.endDateTime && isNaN(endDateTime.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid endDateTime format' },
          { status: 400 }
        );
      }

      if (startDateTime >= endDateTime) {
        return NextResponse.json(
          { success: false, error: 'End time must be after start time' },
          { status: 400 }
        );
      }
    }

    // Validate participants if provided
    if (body.participants && (!Array.isArray(body.participants) || body.participants.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Participants must be a non-empty array' },
        { status: 400 }
      );
    }

    // Update the meeting
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.participants && { participants: body.participants }),
        ...(body.date && { date: new Date(body.date) }),
        ...(body.startDateTime && { startDateTime: new Date(body.startDateTime) }),
        ...(body.endDateTime && { endDateTime: new Date(body.endDateTime) }),
        ...(body.repeat && { repeat: body.repeat }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isAllDay !== undefined && { isAllDay: body.isAllDay }),
        ...(body.makeOpenEvent !== undefined && { makeOpenEvent: body.makeOpenEvent }),
        ...(body.videoCall !== undefined && { videoCall: body.videoCall }),
        ...(body.videoCallLink !== undefined && { videoCallLink: body.videoCallLink }),
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedMeeting
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

// PATCH /api/meetings/[id] - Partially update a meeting
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if meeting exists
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id }
    });

    if (!existingMeeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }

    // Validate datetime fields if provided
    if (body.date || body.startDateTime || body.endDateTime) {
      const date = body.date ? new Date(body.date) : existingMeeting.date;
      const startDateTime = body.startDateTime ? new Date(body.startDateTime) : existingMeeting.startDateTime;
      const endDateTime = body.endDateTime ? new Date(body.endDateTime) : existingMeeting.endDateTime;

      if (body.date && isNaN(date.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format' },
          { status: 400 }
        );
      }

      if (body.startDateTime && isNaN(startDateTime.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid startDateTime format' },
          { status: 400 }
        );
      }

      if (body.endDateTime && isNaN(endDateTime.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid endDateTime format' },
          { status: 400 }
        );
      }

      if (startDateTime >= endDateTime) {
        return NextResponse.json(
          { success: false, error: 'End time must be after start time' },
          { status: 400 }
        );
      }
    }

    // Validate participants if provided
    if (body.participants && (!Array.isArray(body.participants) || body.participants.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Participants must be a non-empty array' },
        { status: 400 }
      );
    }

    // Filter out undefined values and update only provided fields
    const updateData = Object.entries(body).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        // Convert datetime strings to Date objects
        if (key === 'startDateTime' || key === 'endDateTime' || key === 'date') {
          acc[key] = new Date(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedMeeting
    });
  } catch (error) {
    console.error('Error patching meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

// DELETE /api/meetings/[id] - Delete a specific meeting
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if meeting exists
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id }
    });

    if (!existingMeeting) {
      return NextResponse.json(
        { success: false, error: 'Meeting not found' },
        { status: 404 }
      );
    }

    // Delete the meeting
    await prisma.meeting.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete meeting' },
      { status: 500 }
    );
  }
}