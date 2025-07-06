import { query } from "../config/db";
import { ApiResponse, DatabaseApplication, InternshipAppForm } from "../interfaces/Types";
import { findApplicationByEmail } from "./findApplicationByEmail";
import { validateInternshipForm } from "./validateInternshipForm";

/**
 * Creates a new internship application in the database
 */
export async function createInternshipApplication(
  formData: InternshipAppForm
): Promise<ApiResponse<DatabaseApplication>> {
  try {
    // Validate form data
    const validation = validateInternshipForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      };
    }

    // Check if email already exists
    const existingApp = await findApplicationByEmail(formData.email);
    if (existingApp.success && existingApp.data) {
      return {
        success: false,
        error: 'An application with this email already exists'
      };
    }

    // Insert new application
    const insertQuery = `
      INSERT INTO internship_applications (
        email, full_name, date_of_birth, residence_address, 
        date_of_agreement, signature_image_url, id_document_url, 
        terms_accepted, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      formData.email.trim().toLowerCase(), // Normalize email
      formData.fullName,
      formData.dateOfBirth,
      formData.residenceAddress,
      formData.dateOfAgreement,
      formData.signatureImageUrl,
      formData.idDocumentUrl,
      formData.termsAccepted
    ];

    const result = await query<DatabaseApplication>(insertQuery, values);
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Failed to create application'
      };
    }

    return {
      success: true,
      data: result.rows[0]
    };

  } catch (error) {
    console.error('Error creating internship application:', error);
    return {
      success: false,
      error: 'Internal server error while creating application'
    };
  }
}