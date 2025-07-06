import firebaseAdmin from '../config/firebase-admin';

/**
 * Deletes a file from Firebase Storage using the full URL with Admin SDK
 * @param {string} fileUrl - The full Firebase Storage URL of the file to delete
 * @returns {Promise<boolean>} - True if deletion was successful, false otherwise
 */
export async function deleteFileFromFirebase(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl) {
      console.log('No file URL provided, skipping deletion');
      return true; // Consider it successful if no file to delete
    }

    // Extract the file path from the Firebase URL
    // Firebase URLs look like: https://firebasestorage.googleapis.com/v0/b/bucket-name/o/path%2Fto%2Ffile.ext?alt=media&token=...
    const url = new URL(fileUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)/);
    
    if (!pathMatch) {
      console.error('Invalid Firebase URL format:', fileUrl);
      return false;
    }

    // Decode the file path (Firebase URLs encode special characters)
    const filePath = decodeURIComponent(pathMatch[1]);
    
    // Get Firebase Admin storage bucket
    const bucket = firebaseAdmin.storage().bucket();
    const file = bucket.file(filePath);

    // Check if file exists before attempting deletion
    const [exists] = await file.exists();
    if (!exists) {
    //   console.log('File not found in Firebase Storage, considering deletion successful');
      return true;
    }

    // Delete the file
    await file.delete();
    // console.log('Successfully deleted file from Firebase:', filePath);
    return true;

  } catch (error: unknown) {
    console.error('Error deleting file from Firebase:', error);
    return false;
  }
}

/**
 * Deletes multiple files from Firebase Storage
 * @param {string[]} fileUrls - Array of Firebase Storage URLs to delete
 * @returns {Promise<{success: boolean, failures: string[]}>} - Results of deletion attempts
 */
export async function deleteMultipleFilesFromFirebase(fileUrls: string[]): Promise<{
  success: boolean;
  failures: string[];
}> {
  const failures: string[] = [];
  
  for (const url of fileUrls) {
    const success = await deleteFileFromFirebase(url);
    if (!success) {
      failures.push(url);
    }
  }

  return {
    success: failures.length === 0,
    failures
  };
}
