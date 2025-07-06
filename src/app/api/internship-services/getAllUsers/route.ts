import { getAllApplications } from "@/server/internship-services/getAllApplication";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const applications = await getAllApplications(page, limit);
    
    if (!applications.success) {
      return NextResponse.json({ success: false, error: applications.error }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: applications.data });
  } catch (error) {
    console.error('Error fetching internship applications:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
  }
}
