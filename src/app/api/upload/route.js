import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    // Check for 'file' (from PdfUpload) or 'image' (from ImageUpload) for compatibility
    const file = formData.get('file') || formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // --- Key Change: Allow both image and PDF types ---
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and PDFs are allowed.' }, { status: 400 });
    }

    // --- Key Change: Increase size limit to accommodate larger PDFs ---
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSizeInBytes) {
      return NextResponse.json({ error: `File size must be less than ${maxSizeInBytes / 1024 / 1024}MB` }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename (logic remains the same)
    const timestamp = Date.now();
    const originalName = file.name || 'file';
    const filename = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Convert file to buffer and save it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const finalPath = path.join(uploadsDir, filename);
    fs.writeFileSync(finalPath, buffer);

    // Return the public URL path
    const publicPath = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}