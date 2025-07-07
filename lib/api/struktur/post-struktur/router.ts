import { apiUrl } from '@/lib/utils/apiUrl';

interface StrukturPayload {
  petugas: string;
  periode: string;
}

export async function tambahStrukturOrganisasi({ petugas, periode }: StrukturPayload) {
  try {
    const response = await fetch(apiUrl('struktur-organisasi'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        Petugas: petugas,
        Periode: periode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `Gagal menambahkan struktur (${response.status})`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Detail error:', error.message);
    }
  }
}
