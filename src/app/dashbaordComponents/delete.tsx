export async function deleteApplicationById(id: string): Promise<void> {
  const response = await fetch(`/api/internship-services/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete application");
  }
}
