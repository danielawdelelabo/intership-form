import { query } from "../config/db";
import { ApiResponse } from "../interfaces/Types";
import { findApplicationById } from "./findApplicationById";
import { deleteMultipleFilesFromFirebase } from "../utils/deleteFirebaseFiles";

/**
 * Deletes an internship application by ID and associated Firebase files
 */
export async function deleteApplicationById(id: number): Promise<ApiResponse<boolean>> {
  try {
    // First, get the application data to retrieve file URLs
    const applicationResult = await findApplicationById(id);
    if (!applicationResult.success || !applicationResult.data) {
      return {
        success: false,
        error: 'Application not found'
      };
    }

    const application = applicationResult.data;   
    const filesToDelete: string[] = [];
    if (application.signature_image_url) {
      filesToDelete.push(application.signature_image_url);
      console.log('Found signature file to delete:', application.signature_image_url);
    }
    if (application.id_document_url) {
      filesToDelete.push(application.id_document_url);
      console.log('Found ID document file to delete:', application.id_document_url);
    }

    console.log('Total files to delete from Firebase:', filesToDelete.length);

    // Delete files from Firebase first
    if (filesToDelete.length > 0) {
      console.log('Starting Firebase file deletion...');
      const firebaseDeleteResult = await deleteMultipleFilesFromFirebase(filesToDelete);
      console.log('Firebase deletion result:', firebaseDeleteResult);
      if (!firebaseDeleteResult.success) {
        console.warn('Some files could not be deleted from Firebase:', firebaseDeleteResult.failures);
        // Continue with database deletion even if Firebase deletion partially failed
      } else {
        console.log('All Firebase files deleted successfully');
      }
    } else {
      console.log('No files to delete from Firebase');
    }

    // Delete from database
    const deleteQuery = 'DELETE FROM internship_applications WHERE id = $1 RETURNING id';
    const result = await query(deleteQuery, [id]);
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Application not found'
      };
    }

    return {
      success: true,
      data: true
    };

  } catch (error) {
    console.error('Error deleting application:', error);
    return {
      success: false,
      error: 'Internal server error while deleting application'
    };
  }
}
