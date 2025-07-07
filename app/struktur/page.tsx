'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { MdOutlineSearch } from 'react-icons/md';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { TambahStruktur } from '@/components/TambahStruktur';
import { EditStruktur } from '@/components/EditStruktur';
import { getAllStruktur } from '@/lib/api/struktur/get-struktur/router';
import { deleteStrukturOrganisasi } from '@/lib/api/struktur/delete-struktur/router';
import { toast } from 'react-toastify';

interface Struktur {
  ID_Struktur: string;
  Petugas: string;
  Periode: string;
  PetugasDetail?: {
    Nama_Depan_Petugas: string;
    Nama_Belakang_Petugas: string;
  };
}

export default function StrukturPage() {
  const [strukturList, setStrukturList] = useState<Struktur[]>([]);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStruktur, setSelectedStruktur] = useState<Struktur | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStruktur = useCallback(async () => {
    try {
      const data = await getAllStruktur();
      setStrukturList(data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, []);

  useEffect(() => {
    fetchStruktur();
  }, [fetchStruktur]);

  const handleDelete = async (struktur: Struktur) => {
    const fullName = struktur.PetugasDetail
      ? `${struktur.PetugasDetail.Nama_Depan_Petugas} ${struktur.PetugasDetail.Nama_Belakang_Petugas}`
      : struktur.Petugas;

    const confirmDelete = confirm(`Yakin ingin menghapus struktur milik ${fullName}?`);
    if (!confirmDelete) return;

    try {
      setDeletingId(struktur.ID_Struktur);
      await deleteStrukturOrganisasi(struktur.ID_Struktur);
      toast.success('Struktur berhasil dihapus');
      await fetchStruktur();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Detail error:', error.message);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (struktur: Struktur) => {
    setSelectedStruktur(struktur);
    setIsEditOpen(true);
  };

  const filteredStruktur = strukturList.filter((s) =>
    s.PetugasDetail
      ? `${s.PetugasDetail.Nama_Depan_Petugas} ${s.PetugasDetail.Nama_Belakang_Petugas}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : s.Petugas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active="Struktur Organisasi" />
      <main className="flex-1 p-8">
        <Navbar title="Struktur Organisasi" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <button
            onClick={() => setIsTambahOpen(true)}
            className="bg-blue-800 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-900 text-sm flex items-center gap-2"
          >
            <FaPlus /> Tambah
          </button>

          <TambahStruktur
            isOpen={isTambahOpen}
            onClose={() => setIsTambahOpen(false)}
            onSuccess={fetchStruktur}
          />

          <EditStruktur
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            struktur={
              selectedStruktur
                ? {
                    id: selectedStruktur.ID_Struktur,
                    petugas: selectedStruktur.Petugas,
                    periode: selectedStruktur.Periode,
                  }
                : null
            }
            onSuccess={fetchStruktur}
          />

          <div className="relative w-full md:w-64 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Cari"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-blue-800 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
            />
            <MdOutlineSearch className="absolute top-2.5 left-3 text-blue-800 text-lg" />
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-x-auto shadow-md p-2">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl">ID Struktur</th>
                <th className="px-4 py-3">Petugas</th>
                <th className="px-4 py-3">Periode</th>
                <th className="px-4 py-3 text-center rounded-tr-xl rounded-br-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredStruktur.map((struktur, index) => (
                <tr key={index} className="border-b border-white">
                  <td className="px-4 py-3">{struktur.ID_Struktur}</td>
                  <td className="px-4 py-3">
                    {struktur.PetugasDetail
                      ? `${struktur.PetugasDetail.Nama_Depan_Petugas} ${struktur.PetugasDetail.Nama_Belakang_Petugas}`
                      : struktur.Petugas}
                  </td>
                  <td className="px-4 py-3">{struktur.Periode}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <FaEdit
                        className="text-blue-800 cursor-pointer"
                        onClick={() => handleEditClick(struktur)}
                      />
                      <FaTrash
                        className={`cursor-pointer ${
                          deletingId === struktur.ID_Struktur ? 'opacity-50 cursor-not-allowed' : 'text-blue-800'
                        }`}
                        onClick={() =>
                          deletingId === struktur.ID_Struktur ? null : handleDelete(struktur)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStruktur.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Tidak ada data struktur ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
