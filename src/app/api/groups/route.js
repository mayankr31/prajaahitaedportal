import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/groups - Get all groups with programme count
export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: {
            programmes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: groups
    })
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

// POST /api/groups - Create a new group (for "Add New Group" button)
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, imageUrl } = body
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Group name is required' },
        { status: 400 }
      )
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        imageUrl: imageUrl || null
      },
      include: {
        _count: {
          select: {
            programmes: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: group,
      message: 'Group created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create group' },
      { status: 500 }
    )
  }
}