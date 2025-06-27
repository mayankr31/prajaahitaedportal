import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

// GET all experts
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

    const [experts, total] = await Promise.all([
      prisma.expert.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedVolunteers: {
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
      prisma.expert.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: experts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching experts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experts' },
      { status: 500 }
    );
  }
}

// POST - Create new expert
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      name,
      age,
      email,
      profession,
      educationalQualification,
      feedback,
      programmeEnrolledId,
      organisationId
    } = body;

    // Validation
    if (!name || !age || !email) {
      return NextResponse.json(
        { success: false, error: 'Name, age, and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingExpert = await prisma.expert.findUnique({
      where: { email }
    });

    if (existingExpert) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    const expert = await prisma.$transaction(async (tx) => {
      const newExpert = await tx.expert.create({
        data: {
          name,
          age: parseInt(age),
          email,
          profession,
          educationalQualification,
          feedback,
          programmeEnrolledId: programmeEnrolledId || null,
          organisationId: organisationId || null
        },
        include: {
          assignedVolunteers: true,
          programmeEnrolled: true,
          organisation: true
        }
      });

      // Update programme expert count
      if (programmeEnrolledId) {
        await tx.programme.update({
          where: { id: programmeEnrolledId },
          data: { specialEducators: { increment: 1 } }
        });
      }

      return newExpert;
    });

    return NextResponse.json({
      success: true,
      data: expert,
      message: 'Expert created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating expert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create expert' },
      { status: 500 }
    );
  }
}