const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

export interface UpdatePetugasPayload {
  ID_Jabatan: string;
  Jabatan: string;
  Nama_Depan_Petugas: string;
  Nama_Belakang_Petugas: string;
  No_Telepon_Petugas: string;
  Masa_Bakti: string;
  Foto_Petugas?: string;
}

export interface UpdatePetugasResponse {
  message: string;
  data?: {
    NIP: string;
    ID_Jabatan: string;
    Nama_Depan_Petugas: string;
    Nama_Belakang_Petugas: string;
    No_Telepon_Petugas: string;
    Masa_Bakti: string;
    Foto_Petugas: string;
    Jabatan: string;
  };
}

export async function updatePetugas(
  nip: string,
  updatedData: UpdatePetugasPayload
): Promise<UpdatePetugasResponse> {
  const url = `${API_BASE_URL}/petugas/${nip}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  const rawText = await response.text();

  if (!response.ok) {
    console.error('Update failed:', response.status, rawText);
    throw new Error(`Gagal update petugas: ${rawText}`);
  }

  try {
    const result: UpdatePetugasResponse = JSON.parse(rawText);
    return result;
  } catch (err) {
    console.error('JSON parse error:', err);
    throw new Error('Gagal memproses respons dari server.');
  }
}
