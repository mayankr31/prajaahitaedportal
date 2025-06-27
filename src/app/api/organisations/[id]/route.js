import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/organisations/[id] - Get single organisation
export async function GET(request, { params }) {
  try {
    const { id } = params

    const organisation = await prisma.organisation.findUnique({
      where: { id }
    })

    if (!organisation) {
      return NextResponse.json(
        { success: false, error: 'Organisation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: organisation
    })
  } catch (error) {
    console.error('Error fetching organisation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organisation' },
      { status: 500 }
    )
  }
}

// PUT /api/organisations/[id] - Update organisation
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, imageUrl } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const organisation = await prisma.organisation.update({
      where: { id },
      data: {
        name,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json({
      success: true,
      data: organisation,
      message: 'Organisation updated successfully'
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Organisation not found' },
        { status: 404 }
      )
    }
    console.error('Error updating organisation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update organisation' },
      { status: 500 }
    )
  }
}

// DELETE /api/organisations/[id] - Delete organisation
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.organisation.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Organisation deleted successfully'
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Organisation not found' },
        { status: 404 }
      )
    }
    console.error('Error deleting organisation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete organisation' },
      { status: 500 }
    )
  }
}