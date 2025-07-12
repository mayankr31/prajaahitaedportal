// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// // GET /api/programmes/[id] - Get a specific programme
// export async function GET(request, { params }) {
//   try {
//     const { id } = params

//     const programme = await prisma.programme.findUnique({
//       where: { id },
//       include: {
//         group: {
//           select: {
//             id: true,
//             name: true,
//             imageUrl: true
//           }
//         }
//       }
//     })

//     if (!programme) {
//       return NextResponse.json(
//         { success: false, error: 'Programme not found' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json({
//       success: true,
//       data: programme
//     })
//   } catch (error) {
//     console.error('Error fetching programme:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch programme' },
//       { status: 500 }
//     )
//   }
// }

// // PUT /api/programmes/[id] - Update a programme
// export async function PUT(request, { params }) {
//   try {
//     const { id } = params
//     const body = await request.json()
//     const { students, volunteers, specialEducators, imageUrl } = body

//     // Check if programme exists
//     const existingProgramme = await prisma.programme.findUnique({
//       where: { id }
//     })

//     if (!existingProgramme) {
//       return NextResponse.json(
//         { success: false, error: 'Programme not found' },
//         { status: 404 }
//       )
//     }

//     const updateData = {}
//     if (students !== undefined) updateData.students = students
//     if (volunteers !== undefined) updateData.volunteers = volunteers
//     if (specialEducators !== undefined) updateData.specialEducators = specialEducators
//     if (imageUrl !== undefined) updateData.imageUrl = imageUrl

//     const programme = await prisma.programme.update({
//       where: { id },
//       data: updateData,
//       include: {
//         group: {
//           select: {
//             id: true,
//             name: true,
//             imageUrl: true
//           }
//         }
//       }
//     })

//     return NextResponse.json({
//       success: true,
//       data: programme,
//       message: 'Programme updated successfully'
//     })
//   } catch (error) {
//     console.error('Error updating programme:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to update programme' },
//       { status: 500 }
//     )
//   }
// }

// // DELETE /api/programmes/[id] - Delete a programme
// export async function DELETE(request, { params }) {
//   try {
//     const { id } = params

//     // Check if programme exists
//     const existingProgramme = await prisma.programme.findUnique({
//       where: { id },
//       include: {
//         group: {
//           select: {
//             name: true
//           }
//         }
//       }
//     })

//     if (!existingProgramme) {
//       return NextResponse.json(
//         { success: false, error: 'Programme not found' },
//         { status: 404 }
//       )
//     }

//     await prisma.programme.delete({
//       where: { id }
//     })

//     return NextResponse.json({
//       success: true,
//       message: `Programme from group "${existingProgramme.group.name}" deleted successfully`
//     })
//   } catch (error) {
//     console.error('Error deleting programme:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to delete programme' },
//       { status: 500 }
//     )
//   }
// }

// src\app\api\programmes\[id]\route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/programmes/[id] - Get a specific programme
export async function GET(request, { params }) {
  try {
    const { id } = params

    const programme = await prisma.programme.findUnique({
      where: { id },
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

    if (!programme) {
      return NextResponse.json(
        { success: false, error: 'Programme not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: programme
    })
  } catch (error) {
    console.error('Error fetching programme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programme' },
      { status: 500 }
    )
  }
}

// PUT /api/programmes/[id] - Update a programme
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, students, volunteers, specialEducators, imageUrl } = body

    // Check if programme exists
    const existingProgramme = await prisma.programme.findUnique({
      where: { id }
    })

    if (!existingProgramme) {
      return NextResponse.json(
        { success: false, error: 'Programme not found' },
        { status: 404 }
      )
    }

    const updateData = {}
    
    // Handle name updates with validation
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json(
          { success: false, error: 'Programme name cannot be empty' },
          { status: 400 }
        )
      }

      if (name.trim().length < 3) {
        return NextResponse.json(
          { success: false, error: 'Programme name must be at least 3 characters long' },
          { status: 400 }
        )
      }

      // Check if another programme in the same group already has this name
      const duplicateProgramme = await prisma.programme.findFirst({
        where: {
          groupId: existingProgramme.groupId,
          name: name.trim(),
          id: { not: id } // Exclude current programme
        }
      })

      if (duplicateProgramme) {
        return NextResponse.json(
          { success: false, error: 'A programme with this name already exists in this group' },
          { status: 409 }
        )
      }

      updateData.name = name.trim()
    }

    // Handle other field updates
    if (students !== undefined) updateData.students = students
    if (volunteers !== undefined) updateData.volunteers = volunteers
    if (specialEducators !== undefined) updateData.specialEducators = specialEducators
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl

    const programme = await prisma.programme.update({
      where: { id },
      data: updateData,
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
      message: 'Programme updated successfully'
    })
  } catch (error) {
    console.error('Error updating programme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update programme' },
      { status: 500 }
    )
  }
}

// DELETE /api/programmes/[id] - Delete a programme
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Check if programme exists
    const existingProgramme = await prisma.programme.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            name: true
          }
        }
      }
    })

    if (!existingProgramme) {
      return NextResponse.json(
        { success: false, error: 'Programme not found' },
        { status: 404 }
      )
    }

    await prisma.programme.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Programme "${existingProgramme.name}" from group "${existingProgramme.group.name}" deleted successfully`
    })
  } catch (error) {
    console.error('Error deleting programme:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete programme' },
      { status: 500 }
    )
  }
}