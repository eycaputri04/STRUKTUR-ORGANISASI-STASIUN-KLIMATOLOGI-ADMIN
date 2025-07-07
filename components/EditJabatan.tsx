'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Button from './Button';
import InputField from './Input';
import { updateJabatan } from '@/lib/api/jabatan/put-jabatan/router';
import { toast } from 'react-toastify';

interface EditJabatanProps {
  isOpen: boolean;
  onClose: () => void;
  jabatan: { id: string; nama: string } | null;
  onSuccess?: () => void;
}

export const EditJabatan: React.FC<EditJabatanProps> = ({
  isOpen,
  onClose,
  jabatan,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({ id: '', nama: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jabatan) {
      setFormData({
        id: jabatan.id,
        nama: jabatan.nama?.trim() ?? '',
      });
    }
  }, [jabatan]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedNama = formData.nama.trim();

    if (!trimmedNama) {
      toast.error('Nama jabatan tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      await updateJabatan(formData.id, trimmedNama);
      toast.success('Jabatan berhasil diperbarui');
      onSuccess?.(); // reload data
      onClose();     // tutup modal
    } catch (error) {
      toast.error((error as Error).message || 'Gagal memperbarui jabatan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !jabatan) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Jabatan</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4" autoComplete="off">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">ID Jabatan</label>
            <InputField
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Nama Jabatan</label>
            <InputField
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama jabatan"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="BATAL"
              type="button"
              onClick={onClose}
              styleButton="bg-gray-700 text-white hover:bg-gray-500"
            />
            <Button
              label={loading ? 'Menyimpan...' : 'SIMPAN'}
              type="submit"
              disabled={loading}
              styleButton="bg-blue-800 text-white hover:bg-blue-900"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
