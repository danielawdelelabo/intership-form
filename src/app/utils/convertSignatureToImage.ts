import { uploadMediaToFirebase } from './uploadMediaToFirebase';
import SignaturePad from 'react-signature-canvas';

/**
 * Converts signature pad data to an image (PNG or JPG) and uploads it to Firebase
 * @param {SignaturePad} signaturePad - Reference to the react-signature-canvas component
 * @param {string} fullName - User's full name for file path organization
 * @param {'png' | 'jpg'} format - Desired image format ('png' or 'jpg')
 * @param {number} folderTimestamp - Optional timestamp for folder naming (for grouping files from same form)
 * @returns {Promise<string>} - URL of the uploaded signature image
 */
export const convertAndUploadSignature = async (
  signaturePad: SignaturePad | null,
  fullName: string,
  format: 'png' | 'jpg' = 'png',
  folderTimestamp?: number
): Promise<string> => {
  try {
    if (!signaturePad || signaturePad.isEmpty()) {
      throw new Error('Signature is empty');
    }

    // Get the signature as a base64 image in the desired format
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const dataUrl = signaturePad.getTrimmedCanvas().toDataURL(mimeType);

    // Convert dataURL to File object
    function dataURLtoFile(dataurl: string, filename: string) {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      return new File([u8arr], filename, { type: mime });    }
    
    // Generate a filename (timestamp will be added automatically by uploadMediaToFirebase)
    const fileName = `signature.${format}`;
    const file = dataURLtoFile(dataUrl, fileName);    // Convert File to ArrayBuffer for Firebase upload
    const arrayBuffer = await file.arrayBuffer();
      // Upload to Firebase with client-side SDK
    const signatureUrl = await uploadMediaToFirebase(arrayBuffer, fullName, fileName, folderTimestamp);
    return signatureUrl;

  } catch (error) {
    console.error('Error processing signature:', error);
    throw new Error('Failed to process and upload signature');
  }
};