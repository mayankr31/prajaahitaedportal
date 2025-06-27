import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/organisations - Get all organisations
export async function GET(request) {
  try {
    const organisations = await prisma.organisation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: organisations
    })
  } catch (error) {
    console.error('Error fetching organisations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organisations' },
      { status: 500 }
    )
  }
}

// POST /api/organisations - Create a new organisation
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, imageUrl } = body
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const organisation = await prisma.organisation.create({
      data: {
        name,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json({
      success: true,
      data: organisation,
      message: 'Organisation created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating organisation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create organisation' },
      { status: 500 }
    )
  }
}