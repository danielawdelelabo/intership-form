import { writeFile, mkdir, unlink, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export interface FileUploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export interface FileValidationOptions {
  maxSizeInMB: number;
  allowedTypes: string[];
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Default validation options for different file types
 */
export const FILE_VALIDATION_CONFIGS = {
  signature: {
    maxSizeInMB: 2,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxWidth: 800,
    maxHeight: 400
  } as FileValidationOptions,
  
  idDocument: {
    maxSizeInMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxWidth: 1920,
    maxHeight: 1080
  } as FileValidationOptions
};

/**
 * Validates uploaded file against specified criteria
 */
export function validateFile(
  file: File | Buffer,
  fileName: string,
  mimeType: string,
  options: FileValidationOptions
): { isValid: boolean; error?: string } {
  
  // Check file type
  if (!options.allowedTypes.includes(mimeType)) {
    return {
      isValid: false,
      error: `File type ${mimeType} is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
    };
  }

  // Check file size
  const fileSizeInMB = file instanceof File ? file.size / (1024 * 1024) : file.length / (1024 * 1024);
  if (fileSizeInMB > options.maxSizeInMB) {
    return {
      isValid: false,
      error: `File size ${fileSizeInMB.toFixed(2)}MB exceeds maximum allowed size of ${options.maxSizeInMB}MB`
    };
  }

  // Additional validation for image files
  if (mimeType.startsWith('image/') && options.maxWidth && options.maxHeight) {
    // Note: For actual image dimension validation, you'd need an image processing library
    // This is a placeholder for dimension checking
  }

  return { isValid: true };
}

/**
 * Saves uploaded file to the file system
 */
export async function saveUploadedFile(
  fileBuffer: Buffer,
  originalFileName: string,
  mimeType: string,
  uploadType: 'signature' | 'idDocument'
): Promise<FileUploadResult> {
  try {
    // Get validation config for upload type
    const validationOptions = FILE_VALIDATION_CONFIGS[uploadType];
    
    // Validate file
    const validation = validateFile(fileBuffer, originalFileName, mimeType, validationOptions);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', uploadType);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }    // Generate filename with timestamp for consistency
    const timestamp = Date.now();
    const fileExtension = path.extname(originalFileName);
    const baseName = path.basename(originalFileName, fileExtension);
    const cleanBaseName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const uniqueFileName = `${cleanBaseName}-${timestamp}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save file
    await writeFile(filePath, fileBuffer);

    // Return relative path for URL generation
    const relativePath = path.join('uploads', uploadType, uniqueFileName).replace(/\\/g, '/');
    
    return {
      success: true,
      filePath: relativePath
    };

  } catch (error) {
    console.error('Error saving uploaded file:', error);
    return {
      success: false,
      error: 'Failed to save uploaded file'
    };
  }
}

/**
 * Deletes a file from the file system
 */
export async function deleteUploadedFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    // Check if file exists
    try {
      await stat(fullPath);
    } catch {
      // File doesn't exist, consider it successfully deleted
      return true;
    }

    await unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Processes a base64 encoded file upload
 */
export async function processBase64Upload(
  base64Data: string,
  fileName: string,
  uploadType: 'signature' | 'idDocument'
): Promise<FileUploadResult> {
  try {
    // Parse base64 data
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return {
        success: false,
        error: 'Invalid base64 data format'
      };
    }

    const mimeType = matches[1];
    const base64Content = matches[2];
    const fileBuffer = Buffer.from(base64Content, 'base64');

    return await saveUploadedFile(fileBuffer, fileName, mimeType, uploadType);

  } catch (error) {
    console.error('Error processing base64 upload:', error);
    return {
      success: false,
      error: 'Failed to process base64 upload'
    };
  }
}

/**
 * Generates a public URL for an uploaded file
 */
export function generateFileUrl(filePath: string, baseUrl?: string): string {
  const base = baseUrl || process.env.BASE_URL || 'http://localhost:3000';
  return `${base}/${filePath}`;
}

/**
 * Cleans up old uploaded files (useful for maintenance)
 */
export async function cleanupOldFiles(
  uploadType: 'signature' | 'idDocument',
  olderThanDays: number = 30
): Promise<{ deleted: number; errors: string[] }> {
  const errors: string[] = [];
  let deleted = 0;

  try {
    const uploadDir = path.join(process.cwd(), 'uploads', uploadType);
    
    if (!existsSync(uploadDir)) {
      return { deleted: 0, errors: [] };
    }

    const { readdir } = await import('fs/promises');
    const files = await readdir(uploadDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    for (const fileName of files) {
      try {
        const filePath = path.join(uploadDir, fileName);
        const stats = await stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await unlink(filePath);
          deleted++;
        }
      } catch (error) {
        errors.push(`Failed to process file ${fileName}: ${error}`);
      }
    }

  } catch (error) {
    errors.push(`Failed to cleanup directory: ${error}`);
  }

  return { deleted, errors };
}

/**
 * Gets file information without reading the entire file
 */
export async function getFileInfo(filePath: string): Promise<{
  exists: boolean;
  size?: number;
  mimeType?: string;
  lastModified?: Date;
}> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const stats = await stat(fullPath);
    
    // Basic mime type detection based on extension
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf'
    };

    return {
      exists: true,
      size: stats.size,
      mimeType: mimeTypes[extension] || 'application/octet-stream',
      lastModified: stats.mtime
    };

  } catch {
    return { exists: false };
  }
}
