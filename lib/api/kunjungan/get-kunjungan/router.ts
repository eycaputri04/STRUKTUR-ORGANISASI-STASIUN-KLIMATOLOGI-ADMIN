import { apiUrl } from '@/lib/utils/apiUrl';

export async function getKunjunganChart() {
  const res = await fetch(apiUrl('kunjungan'), {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data kunjungan');
  }

  return res.json();
}
