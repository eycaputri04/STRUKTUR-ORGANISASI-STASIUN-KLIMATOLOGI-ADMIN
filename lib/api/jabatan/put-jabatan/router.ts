const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateJabatan(id: string, nama: string) {
  try {
    const response = await fetch(`${API_BASE_URL}jabatan/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Nama_Jabatan: nama,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Gagal memperbarui jabatan');
    }

    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
