const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Petugas {
  NIP: string;
  ID_Jabatan: string;
  Jabatan: { Nama_Jabatan: string };
  Nama_Depan_Petugas: string;
  Nama_Belakang_Petugas: string;
  No_Telepon_Petugas: string;
  Foto_Petugas: string;
  Masa_Bakti: string;
}


export async function getAllPetugas(): Promise<Petugas[]> {
  try {
    const response = await fetch(`${API_BASE_URL}petugas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengambil data petugas');
    }

    const data: Petugas[] = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error((error as Error).message || 'Terjadi kesalahan saat mengambil data petugas');
  }
}
