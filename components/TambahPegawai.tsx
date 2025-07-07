'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import InputField from './Input';
import Button from './Button';
import Image from 'next/image';
import { tambahPetugas } from '@/lib/api/petugas/post-petugas/router';
import { getAllJabatan } from '@/lib/api/jabatan/get-jabatan/router';

interface TambahPegawaiProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

interface FormData {
  NIP: string;
  ID_Jabatan: string;
  Nama_Depan_Petugas: string;
  Nama_Belakang_Petugas: string;
  No_Telepon_Petugas: string;
  Masa_Bakti: string;
}

const initialForm: FormData = {
  NIP: '',
  ID_Jabatan: '',
  Nama_Depan_Petugas: '',
  Nama_Belakang_Petugas: '',
  No_Telepon_Petugas: '',
  Masa_Bakti: '',
};

export const TambahPegawai: React.FC<TambahPegawaiProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jabatanList, setJabatanList] = useState<{ id: string; nama: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadJabatan() {
      try {
        const data = await getAllJabatan();
        setJabatanList(data);
      } catch {
        toast.error('Gagal memuat jabatan');
      }
    }

    if (isOpen) {
      loadJabatan();
      setForm(initialForm);
      setSelectedFile(null);
    }
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'Foto_Petugas' && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return toast.error('Foto wajib diunggah');
    if (!form.ID_Jabatan) return toast.error('Pilih jabatan');

    setLoading(true);

    try {
      const fotoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Gagal membaca file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const namaJabatan = jabatanList.find(j => j.id === form.ID_Jabatan)?.nama || '';

      const payload = {
        NIP: form.NIP,
        ID_Jabatan: form.ID_Jabatan,
        Jabatan: namaJabatan,
        Nama_Depan_Petugas: form.Nama_Depan_Petugas,
        Nama_Belakang_Petugas: form.Nama_Belakang_Petugas,
        No_Telepon_Petugas: form.No_Telepon_Petugas,
        Masa_Bakti: form.Masa_Bakti,
        Foto_Petugas: fotoBase64,
      };

      await tambahPetugas(payload);
      toast.success('Pegawai berhasil ditambahkan');
      await onSuccess();
      setForm(initialForm);
      setSelectedFile(null);
      onClose();

    } catch (err) {
      if (err instanceof Error) {
        console.error('Detail error:', err.message);

        const isAxiosLike = typeof err === 'object' &&
          'response' in err &&
          typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string';

        const errorMessage = isAxiosLike
          ? (err as { response: { data: { message: string } } }).response.data.message
          : err.message;

        if (
          errorMessage.toLowerCase().includes('nip') ||
          errorMessage.toLowerCase().includes('duplicate')
        ) {
          toast.error('NIP sudah digunakan. Silakan gunakan NIP lain.');
        } else {
          toast.error('Gagal menambahkan pegawai.');
        }
      } else {
        console.error('Terjadi kesalahan tidak diketahui:', err);
        toast.error('Gagal menambahkan pegawai.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Tambah Pegawai</h2>
        <form className="space-y-4" autoComplete="off">
          <InputField name="NIP" placeholder="NIP" value={form.NIP} onChange={handleChange} />

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
            placeholder="Masa Bakti (e.g. 2025-2029)"
            value={form.Masa_Bakti}
            onChange={handleChange}
          />

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
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded border"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button label="Batal" onClick={onClose} type="button" styleButton="bg-gray-500" />
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
