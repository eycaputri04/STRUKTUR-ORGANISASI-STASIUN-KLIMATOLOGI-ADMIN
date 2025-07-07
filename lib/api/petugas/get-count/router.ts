// lib/api/petugas/get-count/router.ts
import { apiUrl } from '@/lib/utils/apiUrl';

export async function getTotalPegawai() {
  const res = await fetch(apiUrl('/petugas/count'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengambil total petugas');

  return data.count; 
}
