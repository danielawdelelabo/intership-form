import { deleteApplicationById } from "@/server/internship-services/deleteApplication";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    const result = await deleteApplicationById(id);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || "Failed to delete" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Application and associated files deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
