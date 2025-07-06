/**
 * Uploads a file to the server with retry logic
 * @param file - The file to upload
 * @param fullName - The user's full name for folder organization
 * @param fileType - The type of file (e.g., "signatures", "documents")
 * @param maxRetries - Maximum number of retry attempts
 * @param folderTimestamp - Optional timestamp for folder naming (for grouping files from same form)
 * @returns The URL of the uploaded file
 */
export async function uploadFile(
  file: File, 
  fullName: string, 
  fileType: string = "documents", 
  maxRetries: number = 2,
  folderTimestamp?: number
): Promise<string> {
  let attempts = 0;
  
  while (attempts <= maxRetries) {
    try {
      attempts++;
      console.log(`Upload attempt ${attempts} for ${fileType}`);      const formData = new FormData();
      // Use the file's name when appending to FormData to ensure correct filename and type
      formData.append('file', file, file.name);
      formData.append('fullName', fullName);
      formData.append('fileType', fileType);
      if (folderTimestamp) {
        formData.append('folderTimestamp', folderTimestamp.toString());
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload file (status: ${response.status})`);
      }

      const data = await response.json();
      console.log(`Upload successful on attempt ${attempts}`);
      return data.url;
    } catch (error) {
      console.error(`Upload attempt ${attempts} failed:`, error);
      
      if (attempts > maxRetries) {
        console.error('Max retries exceeded, giving up upload');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempts - 1), 5000);
      console.log(`Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Failed to upload file after multiple attempts');
}
