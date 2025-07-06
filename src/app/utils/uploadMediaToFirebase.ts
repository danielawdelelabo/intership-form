import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseApp from '../firebase/firebaseApp';
import path from 'path';

/**
 * Gets the content type based on file extension
 * @param {string} fileName - The name of the file
 * @returns {string} - The content type
 */
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Cleans a filename by removing special characters and spaces
 * @param {string} fileName - The original filename
 * @returns {string} - The cleaned filename
 */
function cleanFileName(fileName: string): string {
  const ext = path.extname(fileName);
  const nameWithoutExt = path.basename(fileName, ext);
  // Replace special characters and spaces with hyphens, remove multiple hyphens
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${cleanName}${ext}`;
}

/**
 * Adds timestamp to filename
 * @param {string} fileName - The original filename
 * @returns {string} - Filename with timestamp
 */
function addTimestampToFileName(fileName: string): string {
  const timestamp = Date.now();
  const ext = path.extname(fileName);
  const nameWithoutExt = path.basename(fileName, ext);
  return `${nameWithoutExt}-${timestamp}${ext}`;
}

/**
 * Uploads a media file to Firebase Storage using client-side SDK.
 * @param {Buffer | Uint8Array | ArrayBuffer | Blob} fileBuffer - The buffer of the file to upload.
 * @param {string} fullName - The user's full name for folder organization.
 * @param {string} originalFileName - The original name of the file.
 * @param {number} folderTimestamp - Optional timestamp for folder naming (for grouping files from same form).
 * @returns {Promise<string>} - The URL of the uploaded file.
 * @throws {Error} - If file type is not supported or upload fails
 */
export async function uploadMediaToFirebase(
  fileBuffer: Buffer | Uint8Array | ArrayBuffer, 
  fullName: string, 
  originalFileName: string,
  folderTimestamp?: number
): Promise<string> {
  try {
    // Get client-side Firebase storage reference
    const storage = getStorage(firebaseApp);    // Clean and add timestamp to filename
    const cleanedFileName = cleanFileName(originalFileName);
    const fileNameWithTimestamp = addTimestampToFileName(cleanedFileName);

      // Define the folder structure with forward slashes for Firebase
    const sanitizedName = fullName.replace(/[.@]/g, '-');
    const sessionTimestamp = folderTimestamp || Date.now();
    const folderPath = `internships/${sanitizedName}-${sessionTimestamp}`;
    const filePath = `${folderPath}/${fileNameWithTimestamp}`;

    // Create a storage reference
    const storageRef = ref(storage, filePath);
    
    // Get the content type based on file extension
    const contentType = getContentType(originalFileName);
    if (!contentType) {
      throw new Error('Unsupported file type. Only JPG, JPEG, PNG, and PDF files are allowed.');
    }

    // Upload the file with metadata
    const metadata = {
      contentType,
    };
    
    console.log(`Uploading file to path: ${filePath}`);
    const snapshot = await uploadBytes(storageRef, fileBuffer, metadata);
    console.log('Uploaded file successfully');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`File available at: ${downloadURL}`);
    
    return downloadURL;  } catch (error: unknown) {
    // Error logging
    const err = error as Error;
    console.error('Error uploading file to Firebase:', error);    console.error('Error details:', {
      message: err.message,
      code: (error as {code?: string}).code,
      stack: err.stack,
      fileName: originalFileName,
      fullName: fullName
    });
    throw new Error(`Failed to upload file: ${err.message || 'Unknown error'}`);
  }
}