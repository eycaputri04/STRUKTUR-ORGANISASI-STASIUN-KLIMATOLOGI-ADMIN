export const deletePetugas = async (nip: string) => {
  try {
    const response = await fetch(`https://radiant-illumination-production.up.railway.app/petugas/${nip}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal menghapus petugas dengan NIP: ${nip}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saat menghapus petugas:', error);
    throw error;
  }
};
