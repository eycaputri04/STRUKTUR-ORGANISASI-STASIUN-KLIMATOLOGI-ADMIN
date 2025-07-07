'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';

import InputField from './Input';
import Button from './Button';
import { tambahStrukturOrganisasi } from '@/lib/api/struktur/post-struktur/router';
import { getAllPetugas } from '@/lib/api/petugas/get-petugas/router';

interface TambahStrukturProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

interface Petugas {
  NIP: string;
  Nama_Depan_Petugas: string;
  Nama_Belakang_Petugas: string;
}

export const TambahStruktur: React.FC<TambahStrukturProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    petugas: '',
    periode: '',
  });

  const [listPetugas, setListPetugas] = useState<Petugas[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ petugas: '', periode: '' });
      getAllPetugas()
        .then(setListPetugas)
        .catch(() => toast.error('Gagal memuat daftar petugas'));
    }
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.petugas || !formData.periode) {
      toast.error('Semua kolom wajib diisi');
      return;
    }

    setLoading(true);

    try {
      await tambahStrukturOrganisasi({
        petugas: formData.petugas,
        periode: formData.periode,
      });

      toast.success('Struktur berhasil ditambahkan');
      await onSuccess();
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Detail error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ petugas: '', periode: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Tambah Struktur Organisasi</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4" autoComplete="off">
          {/* Pilih Petugas */}
          <div className="flex flex-col gap-1">
            <label htmlFor="petugas" className="text-sm font-medium text-gray-700">
              Petugas
            </label>
            <select
              name="petugas"
              value={formData.petugas}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none"
              required
            >
              <option value="">Pilih Petugas</option>
              {listPetugas.map((p) => (
                <option key={p.NIP} value={p.NIP}>
                  {p.Nama_Depan_Petugas} {p.Nama_Belakang_Petugas}
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
            <Button
              label="BATAL"
              onClick={handleClose}
              type="button"
              styleButton="bg-gray-600 text-white"
            />
            <Button
              label={loading ? 'Menyimpan...' : 'SIMPAN'}
              type="submit"
              disabled={loading}
              styleButton="bg-blue-800 text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
