'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';

import Button from './Button';
import InputField from './Input';
import { getAllPetugas } from '@/lib/api/petugas/get-petugas/router';
import { editStrukturOrganisasi } from '@/lib/api/struktur/put-struktur/router';

interface StrukturForm {
  id: string;
  petugas: string;
  periode: string;
}

interface Petugas {
  NIP: string;
  Nama_Depan_Petugas: string;
  Nama_Belakang_Petugas: string;
}

interface EditStrukturProps {
  isOpen: boolean;
  onClose: () => void;
  struktur: StrukturForm | null;
  onSuccess: () => Promise<void>;
}

export const EditStruktur: React.FC<EditStrukturProps> = ({
  isOpen,
  onClose,
  struktur,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<StrukturForm>({
    id: '',
    petugas: '',
    periode: '',
  });

  const [listPetugas, setListPetugas] = useState<Petugas[]>([]);

  useEffect(() => {
    if (struktur) {
      setFormData(struktur);
    }

    if (isOpen) {
      getAllPetugas()
        .then(setListPetugas)
        .catch(() => toast.error('Gagal memuat daftar petugas'));
    }
  }, [isOpen, struktur]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.petugas || !formData.periode) {
      toast.error('Semua kolom wajib diisi');
      return;
    }

    try {
      await editStrukturOrganisasi(formData);
      toast.success('Struktur berhasil diperbarui');
      await onSuccess();
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Detail error:', error.message);
      }
    }
  };

  const handleClose = () => {
    setFormData({ id: '', petugas: '', periode: '' });
    onClose();
  };

  if (!isOpen || !struktur) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Struktur Organisasi</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4" autoComplete="off">
          {/* ID Struktur - read only */}
          <div className="flex flex-col gap-1">
            <label htmlFor="id" className="text-sm font-medium text-gray-700">ID Struktur</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              readOnly
              className="border rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Pilih Petugas */}
          <div className="flex flex-col gap-1">
            <label htmlFor="petugas" className="text-sm font-medium text-gray-700">Petugas</label>
            <select
              name="petugas"
              value={formData.petugas}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="">Pilih Petugas</option>
              {listPetugas.map((p) => (
                <option key={p.NIP} value={p.NIP}>
                  {p.NIP} - {p.Nama_Depan_Petugas} {p.Nama_Belakang_Petugas}
                </option>
              ))}
            </select>
          </div>

          {/* Periode */}
          <InputField
            label="Periode"
            name="periode"
            value={formData.periode}
            onChange={handleChange}
            placeholder="Contoh: 2024–2026"
          />

          {/* Tombol */}
          <div className="flex justify-end gap-2 mt-4">
            <Button label="BATAL" onClick={handleClose} type="button" styleButton="bg-gray-600 text-white" />
            <Button label="SIMPAN" type="submit" styleButton="bg-blue-800 text-white" />
          </div>
        </form>
      </div>
    </div>
  );
};
