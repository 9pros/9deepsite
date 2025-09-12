import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Store images locally in the public directory

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ namespace: string; repoId: string }> }
) {
  try {
    const param = await params;
    const { namespace, repoId } = param;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', namespace, repoId, 'images');
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ 
        ok: true, 
        images: [],
        message: 'No images uploaded yet'
      }, { status: 200 });
    }

    const files = await readdir(uploadDir);
    const imageUrls = files
      .filter(file => /\.(jpg|jpeg|png|gif|svg|webp|avif|heic|heif|ico|bmp|tiff|tif)$/i.test(file))
      .map(file => `/uploads/${namespace}/${repoId}/images/${file}`);

    return NextResponse.json({ 
      ok: true, 
      images: imageUrls,
      count: imageUrls.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to list images",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ namespace: string; repoId: string }> }
) {
  try {
    const param = await params;
    const { namespace, repoId } = param;

    // Allow uploads even without authentication for local development
    // This enables image uploads before project publication

    // Parse the FormData to get the images
    const formData = await req.formData();
    const imageFiles = formData.getAll("images") as File[];

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "At least one image file is required under the 'images' key",
        },
        { status: 400 }
      );
    }

    // Validate all files are images
    for (const file of imageFiles) {
      // In Node.js environment, check if it's a Blob/File-like object
      if (!file || typeof file !== 'object') {
        return NextResponse.json(
          {
            ok: false,
            error: "Invalid file format - all items under 'images' key must be files",
          },
          { status: 400 }
        );
      }

      // Check file type
      const fileType = file.type || '';
      if (!fileType.startsWith('image/')) {
        return NextResponse.json(
          {
            ok: false,
            error: `File ${file.name} is not an image`,
          },
          { status: 400 }
        );
      }
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', namespace, repoId, 'images');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];
    
    // Save files locally
    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const originalName = file.name.replace(/^images\//, ''); // Remove 'images/' prefix if present
      const extension = path.extname(originalName);
      const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9-_]/g, '_'); // Sanitize filename
      const uniqueFileName = `${baseName}-${timestamp}-${randomString}${extension}`;
      
      const filePath = path.join(uploadDir, uniqueFileName);
      await writeFile(filePath, buffer);
      
      // Create public URL for the uploaded image
      const publicUrl = `/uploads/${namespace}/${repoId}/images/${uniqueFileName}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({ 
      ok: true, 
      message: `Successfully uploaded ${imageFiles.length} image(s) to local storage`,
      uploadedFiles: uploadedUrls,
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to upload images",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
