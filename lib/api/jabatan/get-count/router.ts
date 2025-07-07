// lib/api/jabatan/get-count/router.ts
import { apiUrl } from '@/lib/utils/apiUrl';

export async function getTotalJabatan() {
  const res = await fetch(apiUrl('/jabatan/count'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengambil total jabatan');

  return data.count;
}
