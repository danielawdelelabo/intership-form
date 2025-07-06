import { PoolClient } from "pg";
import { ApiResponse, DatabaseApplication, InternshipAppForm } from "../interfaces/Types";
import { validateInternshipForm } from "./validateInternshipForm";
import { transaction } from "../config/db";

/**
 * Bulk insert multiple applications (useful for data migration)
 */
export async function createMultipleApplications(
  applications: InternshipAppForm[]
): Promise<ApiResponse<DatabaseApplication[]>> {
  try {
    return await transaction(async (client: PoolClient) => {
      const results: DatabaseApplication[] = [];
      
      for (const app of applications) {
        // Validate each application
        const validation = validateInternshipForm(app);
        if (!validation.isValid) {
          throw new Error(`Validation failed for ${app.email}: ${validation.errors.join(', ')}`);
        }

        const insertQuery = `
          INSERT INTO internship_applications (
            email, full_name, date_of_birth, residence_address, 
            date_of_agreement, signature_image_url, id_document_url, 
            terms_accepted, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING *;
        `;

        const values = [
          app.email,
          app.fullName,
          app.dateOfBirth,
          app.residenceAddress,
          app.dateOfAgreement,
          app.signatureImageUrl,
          app.idDocumentUrl,
          app.termsAccepted
        ];

        const result = await client.query<DatabaseApplication>(insertQuery, values);
        results.push(result.rows[0]);
      }

      return {
        success: true,
        data: results
      };
    });

  } catch (error) {
    console.error('Error creating multiple applications:', error);
    return {
      success: false,
      error: `Failed to create applications: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}