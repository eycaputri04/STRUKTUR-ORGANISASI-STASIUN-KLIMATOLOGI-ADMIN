'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import InputField from './Input';
import Button from './Button';
import Image from 'next/image';
import { updatePetugas } from '@/lib/api/petugas/put-petugas/router';
import { getAllJabatan } from '@/lib/api/jabatan/get-jabatan/router';

export interface Pegawai {
  NIP: string;
  ID_Jabatan: string;
  Jabatan: {
    Nama_Jabatan: string;
  };
  Nama_Depan_Petugas: string;
  Nama_Belakang_Petugas: string;
  No_Telepon_Petugas: string;
  Foto_Petugas: string;
  Masa_Bakti: string;
}


interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData: Pegawai | null;
}

export const EditPegawai: React.FC<EditProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<Pegawai | null>(null);
  const [jabatanList, setJabatanList] = useState<{ id: string; nama: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setSelectedFile(null);
    }

    const fetchJabatan = async () => {
      try {
        const data = await getAllJabatan();
        if (Array.isArray(data)) {
          setJabatanList(data);
        } else {
          toast.error('Format data jabatan tidak valid');
        }
      } catch {
        toast.error('Gagal memuat data jabatan');
      }
    };


    if (isOpen) {
      fetchJabatan();
    }
  }, [isOpen, initialData]);

  if (!isOpen || !form) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'Foto_Petugas') {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        setSelectedFile(input.files[0]);
      }
    } else {
      setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const getImagePreview = (): string => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    if (!form?.Foto_Petugas) return '';

    if (form.Foto_Petugas.startsWith('data:image')) {
      return form.Foto_Petugas;
    }

    if (form.Foto_Petugas.startsWith('http') || form.Foto_Petugas.startsWith('/')) {
      return form.Foto_Petugas;
    }

    return `data:image/jpeg;base64,${form.Foto_Petugas}`;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let encodedFoto: string | undefined;

      if (selectedFile) {
        encodedFoto = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Gagal membaca file'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      } else if (form.Foto_Petugas?.startsWith('data:image')) {
        encodedFoto = form.Foto_Petugas;
      }

      const namaJabatan = jabatanList.find(j => j.id === form.ID_Jabatan)?.nama || '';

      await updatePetugas(form.NIP, {
        ID_Jabatan: form.ID_Jabatan,
        Nama_Depan_Petugas: form.Nama_Depan_Petugas,
        Nama_Belakang_Petugas: form.Nama_Belakang_Petugas,
        No_Telepon_Petugas: form.No_Telepon_Petugas,
        Masa_Bakti: form.Masa_Bakti,
        Foto_Petugas: encodedFoto,
        Jabatan: namaJabatan,
      });

      toast.success('Data pegawai berhasil diperbarui');
      onSubmit();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Detail error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Pegawai</h2>
        <form className="space-y-4" autoComplete="off">
          <InputField name="NIP" placeholder="NIP" value={form.NIP} onChange={() => {}} disabled />

          <select
            name="ID_Jabatan"
            value={form.ID_Jabatan}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          >
            <option value="">-- Pilih Jabatan --</option>
            {jabatanList.map((jabatan, index) => (
              <option key={jabatan.id || `jabatan-${index}`} value={jabatan.id}>
                {jabatan.nama}
              </option>
            ))}
          </select>

          <InputField
            name="Nama_Depan_Petugas"
            placeholder="Nama Depan"
            value={form.Nama_Depan_Petugas}
            onChange={handleChange}
          />
          <InputField
            name="Nama_Belakang_Petugas"
            placeholder="Nama Belakang"
            value={form.Nama_Belakang_Petugas}
            onChange={handleChange}
          />
          <InputField
            name="No_Telepon_Petugas"
            placeholder="No Telepon"
            value={form.No_Telepon_Petugas}
            onChange={handleChange}
          />
          <InputField
            name="Masa_Bakti"
            placeholder="Masa Bakti (contoh: 2025–2029)"
            value={form.Masa_Bakti}
            onChange={handleChange}
          />

          {/* File Upload dengan Custom Style */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Foto Pegawai</label>
            <div className="relative">
              <input
                type="file"
                name="Foto_Petugas"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <div className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <span>{selectedFile ? selectedFile.name : 'Pilih file...'}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-md">Browse</span>
              </div>
            </div>
            {getImagePreview() && (
              <div className="mt-2 flex items-center gap-2">
                <Image
                  src={getImagePreview()}
                  alt="Foto Pegawai"
                  width={80}
                  height={80}
                  className="rounded border object-cover"
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Batal
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              label="Batal"
              onClick={onClose}
              type="button"
              styleButton="bg-gray-700 text-white hover:bg-gray-500"
            />
            <Button
              label={loading ? 'Menyimpan...' : 'Simpan'}
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              styleButton="bg-blue-800 text-white hover:bg-blue-900"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
