import { deleteFileFromFirebase } from "@/server/utils/deleteFirebaseFiles";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fileUrl } = await request.json();
    
    if (!fileUrl) {
      return NextResponse.json({ 
        error: "File URL is required" 
      }, { status: 400 });
    }

    console.log('Testing Firebase file deletion for URL:', fileUrl);
    const result = await deleteFileFromFirebase(fileUrl);
    
    return NextResponse.json({ 
      success: result,
      message: result ? "File deleted successfully" : "Failed to delete file"
    }, { status: 200 });
  } catch (error) {
    console.error("Error testing Firebase deletion:", error);
    return NextResponse.json(
      { error: "Failed to test deletion" },
      { status: 500 }
    );
  }
}
