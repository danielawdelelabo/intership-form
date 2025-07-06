import { InternshipAppForm } from "../interfaces/Types";
import { isValidEmail } from "../utils/isValidEmail";
import { isValidUrl } from "../utils/isValidUrl";

/**
 * Validates the internship application form data
 */
export function validateInternshipForm(formData: Partial<InternshipAppForm>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Required field validation
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.push('Valid email address is required');
  }

  if (!formData.fullName || formData.fullName.trim().length < 2 || /[!@#$%^&*(),.?":{}|<>]/.test(formData.fullName)) {
    errors.push('Full name must be at least 2 characters long and not contain special characters');
  }

  if (!formData.dateOfBirth || isNaN(new Date(formData.dateOfBirth).getTime())) {
    errors.push('Date of birth is required');
  } else {
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18 || age > 40) {
      errors.push('Applicant must be between 18 and 40 years old');
    }
  }
  
  if (!formData.residenceAddress || formData.residenceAddress.trim().length < 5) {
    errors.push('Residence address must be at least 5 characters long');
  }

  if (!formData.dateOfAgreement) {
    errors.push('Date of agreement is required');
  }
  
  if (!formData.signatureImageUrl || !isValidUrl(formData.signatureImageUrl)) {
    errors.push('Valid signature image URL is required');
  }
  
  if (!formData.idDocumentUrl || !isValidUrl(formData.idDocumentUrl)) {
    errors.push('Valid ID document URL is required');
  }
  
  if (!formData.termsAccepted || typeof formData.termsAccepted !== 'boolean') {
    errors.push('Terms and conditions must be accepted');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}