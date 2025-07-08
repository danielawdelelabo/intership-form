import { query } from "../config/db";
import { ApiResponse, DatabaseApplication } from "../interfaces/Types";

/**
 * Gets all internship applications with pagination
 */
export async function getAllApplications(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<{ applications: DatabaseApplication[]; total: number; pages: number }>> {
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM internship_applications';
    const countResult = await query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    // Get applications with pagination
    const selectQuery = `
      SELECT * FROM internship_applications 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await query<DatabaseApplication>(selectQuery, [limit, offset]);

    return {
      success: true,
      data: {
        applications: result.rows,
        total,
        pages
      }
    };

  } catch (error) {
    console.error('Error getting all applications:', error);
    return {
      success: false,
      error: 'Internal server error while fetching applications'
    };
  }
}
