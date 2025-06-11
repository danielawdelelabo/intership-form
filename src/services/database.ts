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

export const getApplication = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  id: number,
  status: string,
  notes?: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};
