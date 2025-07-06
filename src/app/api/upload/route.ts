import { NextRequest, NextResponse } from 'next/server';
import { uploadMediaToFirebase } from '@/app/utils/uploadMediaToFirebase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fullName = formData.get('fullName') as string;
    const folderTimestampStr = formData.get('folderTimestamp') as string;
    
    if (!file || !fullName) {
      return NextResponse.json(
        { error: 'File and fullName are required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse folderTimestamp if provided
    const folderTimestamp = folderTimestampStr ? parseInt(folderTimestampStr) : undefined;

    // Upload to Firebase
    const fileUrl = await uploadMediaToFirebase(buffer, fullName, file.name, folderTimestamp);

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
