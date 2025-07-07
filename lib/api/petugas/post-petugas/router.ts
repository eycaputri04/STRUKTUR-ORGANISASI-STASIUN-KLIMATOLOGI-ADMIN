const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

export interface PetugasPayload {
  NIP: string;
  ID_Jabatan: string;
  Jabatan: string;
  Nama_Depan_Petugas: string;
  Nama_Belakang_Petugas: string;
  No_Telepon_Petugas: string;
  Masa_Bakti: string;
  Foto_Petugas: string;
}

export interface PetugasResponse {
  message: string;
  data: {
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

export async function tambahPetugas(
  payload: PetugasPayload
): Promise<PetugasResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/petugas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Terjadi kesalahan saat menambahkan pegawai';

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const errorBody: { message?: string } = await response.json();

        if (errorBody?.message) {
          errorMessage = errorBody.message;
        }

        if (
          response.status === 400 &&
          errorBody?.message?.toLowerCase().includes('duplicate') &&
          errorBody?.message?.toLowerCase().includes('nip')
        ) {
          errorMessage = 'NIP sudah terdaftar. Silakan gunakan NIP yang berbeda.';
        }
      } else {
        const text = await response.text();
        if (text) errorMessage = text;
      }

      throw new Error(errorMessage);
    }

    const data: PetugasResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Detail error:', err.message);
      throw err;
    } else {
      throw new Error('Kesalahan tak terduga saat menambahkan petugas.');
    }
  }
}
