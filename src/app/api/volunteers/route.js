import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET all volunteers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const programmeId = searchParams.get('programmeId');
    const organisationId = searchParams.get('organisationId');

    const skip = (page - 1) * limit;
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (programmeId) where.programmeEnrolledId = programmeId;
    if (organisationId) where.organisationId = organisationId;

    const [volunteers, total] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedStudents: {
            select: { id: true, name: true, email: true }
          },
          expertAssigned: {
            select: { id: true, name: true, email: true }
          },
          programmeEnrolled: {
            select: { id: true, groupId: true }
          },
          organisation: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.volunteer.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: volunteers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}

// POST - Create new volunteer
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      name,
      age,
      email,
      contactNumber,
      educationalQualification,
      preferredLanguages,
      experience,
      profession,
      whatMotivatesYou,
      feedback,
      programmeEnrolledId,
      organisationId,
      expertAssignedId
    } = body;

    // Validation
    if (!name || !age || !email) {
      return NextResponse.json(
        { success: false, error: 'Name, age, and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingVolunteer = await prisma.volunteer.findUnique({
      where: { email }
    });

    if (existingVolunteer) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    const volunteer = await prisma.$transaction(async (tx) => {
      const newVolunteer = await tx.volunteer.create({
        data: {
          name,
          age: parseInt(age),
          email,
          contactNumber,
          educationalQualification,
          preferredLanguages,
          experience,
          profession,
          whatMotivatesYou,
          feedback,
          programmeEnrolledId: programmeEnrolledId || null,
          organisationId: organisationId || null,
          expertAssignedId: expertAssignedId || null
        },
        include: {
          assignedStudents: true,
          expertAssigned: true,
          programmeEnrolled: true,
          organisation: true
        }
      });

      // Update programme volunteer count
      if (programmeEnrolledId) {
        await tx.programme.update({
          where: { id: programmeEnrolledId },
          data: { volunteers: { increment: 1 } }
        });
      }

      return newVolunteer;
    });

    return NextResponse.json({
      success: true,
      data: volunteer,
      message: 'Volunteer created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating volunteer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create volunteer' },
      { status: 500 }
    );
  }
}