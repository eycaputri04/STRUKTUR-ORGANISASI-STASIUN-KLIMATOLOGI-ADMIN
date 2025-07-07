const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Jabatan {
  id: string;
  nama: string;
}

interface JabatanResponseItem {
  ID_Jabatan: string;
  Nama_Jabatan: string;
}

interface ApiResponse {
  data: JabatanResponseItem[];
}

export async function getAllJabatan(): Promise<Jabatan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}jabatan`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data jabatan');
    }

    const json: ApiResponse | JabatanResponseItem[] = await response.json();
    console.log('Respons API Jabatan:', json);

    const data = Array.isArray(json) ? json : json.data ?? [];

    if (!Array.isArray(data)) {
      console.error('Format data tidak valid:', data);
      return [];
    }

    return data.map((item): Jabatan => ({
      id: item.ID_Jabatan ?? '',
      nama: item.Nama_Jabatan ?? '',
    }));
  } catch (error) {
    console.error('Error fetch jabatan:', error);
    return [];
  }
}
