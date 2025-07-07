// lib/api/struktur/get-count/router.ts
import { apiUrl } from '@/lib/utils/apiUrl';

export async function getTotalStruktur() {
  const res = await fetch(apiUrl('/struktur-organisasi/count'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengambil total struktur');

  return data.count; 
}
