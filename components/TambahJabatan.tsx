'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import InputField from './Input';
import Button from './Button';
import { tambahJabatan } from '@/lib/api/jabatan/post-jabatan/router';

interface TambahJabatanProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  namaJabatan: string;
}

const initialFormState: FormData = {
  namaJabatan: '',
};

export const TambahJabatan: React.FC<TambahJabatanProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const namaTrimmed = formData.namaJabatan.trim();
    if (!namaTrimmed) {
      toast.error('Nama jabatan tidak boleh kosong');
      return;
    }

    const dataToSend = {
      ID_Jabatan: uuidv4(),
      Nama_Jabatan: namaTrimmed,
    };

    setLoading(true);

    try {
      await tambahJabatan(dataToSend);
      toast.success('Jabatan berhasil ditambahkan');
      setFormData(initialFormState);
      onSuccess?.(); // panggil ini dulu
      onClose();     // tutup modal setelah sukses
    } catch (error) {
      toast.error((error as Error).message || 'Gagal menambahkan jabatan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Tambah Jabatan</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4" autoComplete="off">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nama Jabatan</label>
            <InputField
              type="text"
              name="namaJabatan"
              value={formData.namaJabatan}
              onChange={handleChange}
              placeholder="Masukkan nama jabatan"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="BATAL"
              onClick={onClose}
              styleButton="bg-gray-700 text-white hover:bg-gray-500"
              type="button"
            />
            <Button
              label={loading ? "Menyimpan..." : "SIMPAN"}
              type="submit"
              styleButton="bg-blue-800 text-white hover:bg-blue-900"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
