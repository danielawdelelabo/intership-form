import pool from "../config/database";

export interface InternshipApplication {
  email: string;
  fullName: string;
  dateOfBirth: Date;
  residenceAddress: string;
  dateOfAgreement: Date;
  signatureData: string;
  termsAccepted: boolean;
}

export const createApplication = async (application: InternshipApplication) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO internship_applications 
       (email, full_name, date_of_birth, residence_address, date_of_agreement, signature_data, terms_accepted)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        application.email,
        application.fullName,
        application.dateOfBirth,
        application.residenceAddress,
        application.dateOfAgreement,
        application.signatureData,
        application.termsAccepted,
      ]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getApplication = async (id: number) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM internship_applications WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const updateApplicationStatus = async (
  id: number,
  status: string,
  notes?: string
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update the application status
    await client.query(
      "UPDATE internship_applications SET status = $1 WHERE id = $2",
      [status, id]
    );

    // Add status history
    await client.query(
      "INSERT INTO application_status_history (application_id, status, notes) VALUES ($1, $2, $3)",
      [id, status, notes]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
