export interface InternshipApplication {
  id?: number;
  email: string;
  fullName: string;
  dateOfBirth: Date;
  residenceAddress: string;
  dateOfAgreement: Date;
  signatureImageUrl: string;
  idDocumentUrl: string;
  termsAccepted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
