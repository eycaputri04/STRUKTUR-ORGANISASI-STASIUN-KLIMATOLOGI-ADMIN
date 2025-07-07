// lib/api/struktur/delete-struktur/router.ts
import { apiUrl } from '@/lib/utils/apiUrl';

export async function deleteStrukturOrganisasi(id: string) {
  try {
    const response = await fetch(apiUrl(`struktur-organisasi/${id}`), {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `Gagal menghapus struktur (${response.status})`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Detail error:', error.message);
    }
  }
}
