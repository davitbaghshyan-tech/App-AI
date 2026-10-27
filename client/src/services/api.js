const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function createStory(data) {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`)
  }

  return response.json()
}
