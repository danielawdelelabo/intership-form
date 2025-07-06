import { NextResponse } from 'next/server';
import { testConnection } from '../../../../server/config/db';

export async function GET() {
  try {
    const isConnected = await testConnection();
    return NextResponse.json({ success: isConnected });
  } catch (error) {
    console.error('Error testing database connection:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}