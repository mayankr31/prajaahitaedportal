import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/groups/[id] - Get a specific group with its programmes
export async function GET(request, { params }) {
  try {
    const { id } = params

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        programmes: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            programmes: true
          }
        }
      }
    })

    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: group
    })
  } catch (error) {
    console.error('Error fetching group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch group' },
      { status: 500 }
    )
  }
}

// PUT /api/groups/[id] - Update a group
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, imageUrl } = body

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id }
    })

    if (!existingGroup) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      )
    }

    const updateData = {}
    if (name && name.trim()) updateData.name = name.trim()
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl

    const group = await prisma.group.update({
      where: { id },
      data: updateData,
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
      message: 'Group updated successfully'
    })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update group' },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id] - Delete a group
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            programmes: true
          }
        }
      }
    })

    if (!existingGroup) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      )
    }

    // Delete group (programmes will be cascade deleted)
    await prisma.group.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Group "${existingGroup.name}" and its ${existingGroup._count.programmes} programmes deleted successfully`
    })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete group' },
      { status: 500 }
    )
  }
}