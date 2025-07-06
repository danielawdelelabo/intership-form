import { query } from "../config/db";
import { ApiResponse, DatabaseApplication } from "../interfaces/Types";

/**
 * Search applications by various criteria
 */
export async function searchApplications(
  searchParams: {
    email?: string;
    fullName?: string;
    dateFrom?: Date;
    dateTo?: Date;
  },
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<{ applications: DatabaseApplication[]; total: number; pages: number }>> {
  try {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (searchParams.email) {
      conditions.push(`email ILIKE $${paramIndex++}`);
      values.push(`%${searchParams.email}%`);
    }

    if (searchParams.fullName) {
      conditions.push(`full_name ILIKE $${paramIndex++}`);
      values.push(`%${searchParams.fullName}%`);
    }

    if (searchParams.dateFrom) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(searchParams.dateFrom);
    }

    if (searchParams.dateTo) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(searchParams.dateTo);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM internship_applications ${whereClause}`;
    const countResult = await query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    // Get applications with pagination
    const offset = (page - 1) * limit;
    values.push(limit, offset);
    
    const selectQuery = `
      SELECT * FROM internship_applications 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    
    const result = await query<DatabaseApplication>(selectQuery, values);

    return {
      success: true,
      data: {
        applications: result.rows,
        total,
        pages
      }
    };

  } catch (error) {
    console.error('Error searching applications:', error);
    return {
      success: false,
      error: 'Internal server error while searching applications'
    };
  }
}
