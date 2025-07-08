import { NextRequest, NextResponse } from 'next/server';
import { findApplicationByEmail } from '../../../../server/internship-services/findApplicationByEmail';

/**
 * POST /api/check-email
 * Checks if an email already exists in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email parameter
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email is required and must be a string' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Check if email exists in database
    const result = await findApplicationByEmail(email.toLowerCase().trim());
    
    // If findApplicationByEmail returns success: true, it means the email exists
    const emailExists = result.success;

    return NextResponse.json({
      success: true,
      exists: emailExists,
      message: emailExists 
        ? 'Email already exists in the system' 
        : 'Email is available'
    });

  } catch (error) {
    console.error('Error in check-email API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error while checking email' 
      },
      { status: 500 }
    );
  }
}