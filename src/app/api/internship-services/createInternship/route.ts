import { createInternshipApplication } from "@/server/internship-services/createIntership";
import { NextResponse } from "next/server";


/**
 * Creates a new internship application
 * @param request - The request object containing the application data
 * @returns A JSON response indicating success or failure
 */
export async function POST(request: Request) {
    try {
        const applicationData = await request.json();
        const application = await createInternshipApplication(applicationData);
        if (!application.success) {
            return NextResponse.json({ success: false, error: application.error }, { status: 404 });
        }
         return NextResponse.json({ success: true, data: application });
    } catch (error) {
        console.error('Error creating internship application:', error);
        return NextResponse.json({ success: false, error: 'Failed to create application' });
    }
}