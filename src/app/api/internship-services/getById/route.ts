import { findApplicationById } from "@/server/internship-services/findApplicationById";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        const application = await findApplicationById(id);
        if (!application.success) {
            return NextResponse.json({ success: false, error: application.error }, { status: 404 });
        }
         return NextResponse.json({ success: true, data: application });
    } catch (error) {
        console.error('Error fetching internship application by ID:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch application' });
    }
}