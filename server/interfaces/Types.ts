export interface InternshipAppForm {
  email: string;
  fullName: string;
  dateOfBirth: Date;
  residenceAddress: string;
  dateOfAgreement: Date;
  signatureImageUrl: string;
  idDocumentUrl: string;
  termsAccepted: boolean;
}

export interface DatabaseApplication extends InternshipAppForm {
  id: number;
  created_at: string;
  updated_at: string;
}

// Database row interface with actual database field names (snake_case)
export interface DatabaseApplicationRow {
  id: number;
  email: string;
  full_name: string;
  date_of_birth: string;
  residence_address: string;
  date_of_agreement: string;
  signature_image_url: string;
  id_document_url: string;
  terms_accepted: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}