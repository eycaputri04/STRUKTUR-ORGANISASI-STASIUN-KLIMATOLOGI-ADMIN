const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteJabatan(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}jabatan/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menghapus jabatan');
    }
  } catch (error) {
    throw new Error((error as Error).message || 'Terjadi kesalahan saat menghapus jabatan');
  }
}
