import type { InternshipApplication } from "./types";
import pool from "@/lib/db";

export const createApplication = async (application: InternshipApplication) => {
  try {
    const query = `
      INSERT INTO internship_applications (
        email,
        full_name,
        date_of_birth,
        residence_address,
        date_of_agreement,
        signature_image_url,
        id_document_url,
        terms_accepted
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      application.email,
      application.fullName,
      application.dateOfBirth,
      application.residenceAddress,
      application.dateOfAgreement,
      application.signatureImageUrl,
      application.idDocumentUrl,
      application.termsAccepted,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};
