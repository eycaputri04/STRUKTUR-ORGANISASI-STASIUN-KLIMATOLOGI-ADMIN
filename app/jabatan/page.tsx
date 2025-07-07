'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { MdOutlineSearch } from 'react-icons/md';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { TambahJabatan } from '@/components/TambahJabatan';
import { EditJabatan } from '@/components/EditJabatan';
import { getAllJabatan } from '@/lib/api/jabatan/get-jabatan/router';
import { deleteJabatan } from '@/lib/api/jabatan/delete-jabatan/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Jabatan {
  id: string;
  nama: string | null;
}

export default function JabatanPage() {
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJabatan, setSelectedJabatan] = useState<Jabatan | null>(null);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const data = await getAllJabatan();
      console.log("jabatanList:", data); // log untuk debug
      setJabatanList(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Detail error:', error.message);
      }
      toast.error('Gagal memuat data jabatan');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jabatan ini?')) return;
    try {
      await deleteJabatan(id);
      toast.success('Jabatan berhasil dihapus');
      await fetchData();
    } catch (error) {
      console.error('Detail error:', error);
      toast.error('Gagal menghapus jabatan');
    }
  };

  const handleEditClick = (jabatan: Jabatan) => {
    setSelectedJabatan(jabatan);
    setIsEditModalOpen(true);
  };

  const filteredList = jabatanList.filter(
    (j) =>
      typeof j.nama === 'string' &&
      j.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar active="Jabatan" />
        <main className="flex-1 p-8">
          <Navbar title="Jabatan" />

          {/* Header Action */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <button
              onClick={() => setIsTambahModalOpen(true)}
              className="bg-blue-800 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-900 text-sm flex items-center gap-2"
            >
              <FaPlus /> Tambah
            </button>

            <TambahJabatan
              isOpen={isTambahModalOpen}
              onClose={() => setIsTambahModalOpen(false)}
              onSuccess={fetchData}
            />

            <EditJabatan
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              jabatan={
                selectedJabatan
                  ? { id: selectedJabatan.id, nama: selectedJabatan.nama ?? '' }
                  : null
              }
              onSuccess={fetchData}
            />
            
            <div className="relative w-full md:w-64 mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Cari"
                className="w-full border border-blue-800 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdOutlineSearch className="absolute top-2.5 left-3 text-blue-800 text-lg" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl overflow-x-auto shadow-md p-2">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl">ID Jabatan</th>
                  <th className="px-4 py-3">Nama Jabatan</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl rounded-br-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredList.map((jabatan) => (
                  <tr key={jabatan.id} className="border-b border-white">
                    <td className="px-4 py-3">{jabatan.id}</td>
                    <td className="px-4 py-3">{jabatan.nama ?? '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <FaEdit
                          className="text-blue-800 hover:text-gray-600 cursor-pointer"
                          onClick={() => handleEditClick(jabatan)}
                        />
                        <FaTrash
                          className="text-blue-800 hover:text-gray-600 cursor-pointer"
                          onClick={() => handleDelete(jabatan.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-4">
                      Tidak ada jabatan ditemukan.
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
