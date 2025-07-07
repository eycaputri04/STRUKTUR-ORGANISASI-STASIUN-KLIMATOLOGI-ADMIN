const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahJabatan(jabatan: {
  ID_Jabatan: string;
  Nama_Jabatan: string;
}) {
  const response = await fetch(`${API_BASE_URL}jabatan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jabatan),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Gagal menambahkan jabatan');
  }

  return data;
}
