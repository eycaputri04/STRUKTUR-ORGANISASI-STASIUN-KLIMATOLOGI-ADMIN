import { apiUrl } from '@/lib/utils/apiUrl';

interface EditStrukturPayload {
  id: string;
  petugas: string;
  periode: string;
}

export async function editStrukturOrganisasi({
  id,
  petugas,
  periode,
}: EditStrukturPayload) {
  const response = await fetch(apiUrl(`struktur-organisasi/${id}`), {
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json',
      'user_id': 'dummy-user', 
    },
    body: JSON.stringify({
      Petugas: petugas,
      Periode: periode,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Gagal memperbarui struktur');
  }

  return data;
}
