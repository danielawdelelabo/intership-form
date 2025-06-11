import type { InternshipApplication } from "./types";

const API_BASE_URL = "https://bwscript.bwarabia.com/api/internship";

export const createApplication = async (application: InternshipApplication) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};
