import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/programmes - Get all programmes (optional: filter by groupId)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    const whereClause = groupId ? { groupId } : {}

    const programmes = await prisma.programme.findMany({
      where: whereClause,
      include: {
        group: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: programmes
    })
  } catch (error) {
    console.error('Error fetching programmes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programmes' },
      { status: 500 }
    )
  }
}

// POST /api/programmes - Create a new programme (for "Add New Programme" button)
export async function POST(request) {
  try {
    const body = await request.json()
    const { groupId, students, volunteers, specialEducators, imageUrl } = body
    
    if (!groupId) {
      return NextResponse.json(
        { success: false, error: 'Group ID is required' },
        { status: 400 }
      )
    }

    // Verify group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      )
    }

    const programme = await prisma.programme.create({
      data: {
        groupId,
        students: students || 0,
        volunteers: volunteers || 0,
        specialEducators: specialEducators || 0,
        imageUrl: imageUrl || null
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: programme,
      message: 'Programme created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating programme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create programme' },
      { status: 500 }
    )
  }
}