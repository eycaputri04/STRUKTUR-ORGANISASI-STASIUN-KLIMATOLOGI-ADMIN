'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { MdOutlineSearch } from 'react-icons/md';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { TambahPegawai } from '@/components/TambahPegawai';
import { EditPegawai, Pegawai } from '@/components/EditPegawai';
import { getAllPetugas } from '@/lib/api/petugas/get-petugas/router';
import { deletePetugas } from '@/lib/api/petugas/delete-petugas/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function PegawaiPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const data = await getAllPetugas();

      const normalized = data.map((item) => ({
        ...item,
        Jabatan:
          typeof item.Jabatan === 'string'
            ? { Nama_Jabatan: item.Jabatan }
            : item.Jabatan,
      }));

      setPegawaiList(normalized);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Detail error:', error.message);
      }
      toast.error('Gagal memuat data pegawai');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setIsEditOpen(true);
  };

  const handleDelete = async (nip: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await deletePetugas(nip);
      toast.success('Data berhasil dihapus');
      fetchData();
    } catch {
      toast.error('Gagal menghapus data');
    }
  };

  const filteredList = pegawaiList.filter((p) =>
    p.Nama_Depan_Petugas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.Nama_Belakang_Petugas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <TambahPegawai isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} />
      <EditPegawai
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={fetchData}
        initialData={selectedPegawai}
      />

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar active="Pegawai" />
        <main className="flex-1 p-8">
          <Navbar title="Pegawai" />

          {/* Header Aksi */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-800 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-900 text-sm flex items-center gap-2"
            >
              <FaPlus /> Tambah
            </button>

            <div className="relative w-full md:w-64 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Cari nama"
                className="w-full border border-blue-800 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdOutlineSearch className="absolute top-2.5 left-3 text-blue-800 text-lg" />
            </div>
          </div>

          {/* Tabel Data */}
          <div className="bg-white rounded-xl overflow-x-auto shadow-md p-2">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl">NIP</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Nama Depan</th>
                  <th className="px-4 py-3">Nama Belakang</th>
                  <th className="px-4 py-3">No Telepon</th>
                  <th className="px-4 py-3">Foto</th>
                  <th className="px-4 py-3">Masa Bakti</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl rounded-br-xl">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((pegawai) => (
                  <tr key={pegawai.NIP} className="border-b border-white">
                    <td className="px-4 py-3">{pegawai.NIP}</td>
                    <td className="px-4 py-3">{pegawai.Jabatan?.Nama_Jabatan || '-'}</td>
                    <td className="px-4 py-3">{pegawai.Nama_Depan_Petugas}</td>
                    <td className="px-4 py-3">{pegawai.Nama_Belakang_Petugas}</td>
                    <td className="px-4 py-3">{pegawai.No_Telepon_Petugas}</td>
                    <td className="px-4 py-3">
                      <Image
                        src={pegawai.Foto_Petugas}
                        alt="Foto Petugas"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">{pegawai.Masa_Bakti}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <FaEdit
                          className="text-blue-800 hover:text-gray-600 cursor-pointer"
                          onClick={() => handleEditClick(pegawai)}
                        />
                        <FaTrash
                          className="text-blue-800 hover:text-gray-600 cursor-pointer"
                          onClick={() => handleDelete(pegawai.NIP)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-4">
                      Tidak ada pegawai ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
