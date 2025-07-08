import { query } from "../config/db";
import { ApiResponse, DatabaseApplicationRow } from "../interfaces/Types";

/**
 * Finds an internship application by ID
 */
export async function findApplicationById(id: number): Promise<ApiResponse<DatabaseApplicationRow>> {
  try {
    const selectQuery = 'SELECT * FROM internship_applications WHERE id = $1';
    const result = await query<DatabaseApplicationRow>(selectQuery, [id]);
    
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
    console.error('Error finding application by ID:', error);
    return {
      success: false,
      error: 'Internal server error while finding application'
    };
  }
}