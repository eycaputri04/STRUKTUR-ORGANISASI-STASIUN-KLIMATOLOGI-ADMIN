const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, ''); // Hindari double slash

export async function getAllStruktur() {
  try {
    const response = await fetch(`${API_BASE_URL}/struktur-organisasi`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || 'Gagal mengambil data struktur organisasi';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Detail error:', error.message);
    }
  }
}
