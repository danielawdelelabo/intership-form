import { query } from "../config/db";
import { ApiResponse, DatabaseApplication, InternshipAppForm } from "../interfaces/Types";
import { findApplicationById } from "./findApplicationById";
import { validateInternshipForm } from "./validateInternshipForm";

/**
 * Updates an existing internship application
 */
export async function updateInternshipApplication(
  id: number,
  formData: Partial<InternshipAppForm>
): Promise<ApiResponse<DatabaseApplication>> {
  try {
    // First check if application exists
    const existingApp = await findApplicationById(id);
    if (!existingApp.success || !existingApp.data) {
      return {
        success: false,
        error: 'Application not found'
      };
    }

    // Validate updated data
    const mergedData = { ...existingApp.data, ...formData };
    const validation = validateInternshipForm(mergedData);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      };
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (formData.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(formData.email);
    }
    if (formData.fullName !== undefined) {
      updates.push(`full_name = $${paramIndex++}`);
      values.push(formData.fullName);
    }
    if (formData.dateOfBirth !== undefined) {
      updates.push(`date_of_birth = $${paramIndex++}`);
      values.push(formData.dateOfBirth);
    }
    if (formData.residenceAddress !== undefined) {
      updates.push(`residence_address = $${paramIndex++}`);
      values.push(formData.residenceAddress);
    }
    if (formData.dateOfAgreement !== undefined) {
      updates.push(`date_of_agreement = $${paramIndex++}`);
      values.push(formData.dateOfAgreement);
    }
    if (formData.signatureImageUrl !== undefined) {
      updates.push(`signature_image_url = $${paramIndex++}`);
      values.push(formData.signatureImageUrl);
    }
    if (formData.idDocumentUrl !== undefined) {
      updates.push(`id_document_url = $${paramIndex++}`);
      values.push(formData.idDocumentUrl);
    }
    if (formData.termsAccepted !== undefined) {
      updates.push(`terms_accepted = $${paramIndex++}`);
      values.push(formData.termsAccepted);
    }

    if (updates.length === 0) {
      return {
        success: false,
        error: 'No fields to update'
      };
    }

    updates.push(`updated_at = NOW()`);
    values.push(id); // Add ID for WHERE clause

    const updateQuery = `
      UPDATE internship_applications 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const result = await query<DatabaseApplication>(updateQuery, values);
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Application not found or update failed'
      };
    }

    return {
      success: true,
      data: result.rows[0]
    };

  } catch (error) {
    console.error('Error updating internship application:', error);
    return {
      success: false,
      error: 'Internal server error while updating application'
    };
  }
}
