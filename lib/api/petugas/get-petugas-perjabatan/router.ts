// lib/api/petugas/get-petugas-per-jabatan/router.ts
import { apiUrl } from '@/lib/utils/apiUrl';

export async function getPetugasPerJabatan() {
  const res = await fetch(apiUrl('/petugas/per-jabatan'));
  if (!res.ok) throw new Error('Gagal mengambil data petugas per jabatan');
  return res.json();
}
