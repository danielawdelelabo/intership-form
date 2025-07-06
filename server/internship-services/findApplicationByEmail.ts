import { query } from "../config/db";
import { ApiResponse, DatabaseApplication } from "../interfaces/Types";

/**
 * Finds an internship application by email
 */
export async function findApplicationByEmail(email: string): Promise<ApiResponse<DatabaseApplication>> {
  try {
    const selectQuery = 'SELECT * FROM internship_applications WHERE email = $1';
    const result = await query<DatabaseApplication>(selectQuery, [email]);
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Application not found'
      };
    }

    return {
      success: true,
      data: result.rows[0]
    };

  } catch (error) {
    console.error('Error finding application by email:', error);
    return {
      success: false,
      error: 'Internal server error while finding application'
    };
  }
}