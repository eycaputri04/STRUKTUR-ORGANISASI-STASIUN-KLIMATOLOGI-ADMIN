import { apiUrl } from '@/lib/utils/apiUrl';

export async function getAktivitasTerbaru() {
  const res = await fetch(apiUrl('/aktivitas/terbaru'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengambil aktivitas terbaru');

  return data;
}
