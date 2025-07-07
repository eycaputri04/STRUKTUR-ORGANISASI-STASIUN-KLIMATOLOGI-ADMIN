'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import DashboardCard from '@/components/DashboardCard';
import ActivityCard from '@/components/ActivityCard';
import QuickAccessCard from '@/components/QuickAccessCard';
import { getTotalPegawai } from '@/lib/api/petugas/get-count/router';
import { getTotalJabatan } from '@/lib/api/jabatan/get-count/router';
import { getTotalStruktur } from '@/lib/api/struktur/get-count/router';
import { getAktivitasTerbaru } from '@/lib/api/aktivitas/get-aktivitas/router';
import { getPetugasPerJabatan } from '@/lib/api/petugas/get-petugas-perjabatan/router';

export default function BerandaPage() {
  const router = useRouter();

  const [totalPegawai, setTotalPegawai] = useState(0);
  const [totalJabatan, setTotalJabatan] = useState(0);
  const [totalStruktur, setTotalStruktur] = useState(0);
  const [aktivitas, setAktivitas] = useState<
    { jenis: string; waktu: string; keterangan: string }[]
  >([]);
  const [petugasPerJabatan, setPetugasPerJabatan] = useState<
    { nama_jabatan: string; jumlah: number }[]
  >([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [pegawaiCount, jabatanCount, strukturCount] = await Promise.all([
          getTotalPegawai(),
          getTotalJabatan(),
          getTotalStruktur(),
        ]);
        setTotalPegawai(pegawaiCount);
        setTotalJabatan(jabatanCount);
        setTotalStruktur(strukturCount);

        const aktivitasData = await getAktivitasTerbaru();
        setAktivitas(aktivitasData);

        const jabatanData = await getPetugasPerJabatan();
        setPetugasPerJabatan(jabatanData);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Gagal memuat data dashboard:', err.message);
        }
      }
    };

    fetchAllData();
  }, []);

  const waktuRelatif = (iso: string) => {
    const now = new Date();
    const waktu = new Date(iso);
    const selisihMenit = Math.floor((now.getTime() - waktu.getTime()) / 60000);
    if (selisihMenit < 1) return 'Baru saja';
    if (selisihMenit < 60) return `${selisihMenit} menit yang lalu`;
    const jam = Math.floor(selisihMenit / 60);
    return `${jam} jam yang lalu`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar tetap dan tidak scroll */}
      <Sidebar active="Beranda" />

      {/* Main content scrollable */}
      <main className="flex-1 overflow-y-auto p-6">
        <Navbar title="Beranda" />

        {/* Kartu Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DashboardCard
            icon="mdi:account-group"
            title="Total Petugas"
            value={totalPegawai}
            onClick={() => router.push('/pegawai')}
          />
          <DashboardCard
            icon="mdi:account-tie"
            title="Total Jabatan"
            value={totalJabatan}
            onClick={() => router.push('/jabatan')}
          />
          <DashboardCard
            icon="mdi:sitemap-outline"
            title="Struktur Organisasi"
            value={totalStruktur}
            onClick={() => router.push('/struktur')}
          />
        </div>

        {/* Aktivitas Terakhir */}
        <h2 className="text-lg font-semibold mb-2">Aktivitas Terakhir</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          {aktivitas.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
          ) : (
            aktivitas.slice(0, 3).map((item, idx) => (
              <ActivityCard
                key={idx}
                text={item.keterangan}
                time={waktuRelatif(item.waktu)}
              />
            ))
          )}
        </div>

        {/* Quick Akses */}
        <h2 className="text-lg font-semibold mb-2">Quick Akses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <QuickAccessCard
            icon="mdi:account-plus"
            title="Tambah Petugas"
            subtitle="Buat entri petugas baru"
            bgColor="bg-green-100"
            iconColor="text-green-600"
            onClick={() => router.push('/pegawai')}
          />
          <QuickAccessCard
            icon="mdi:briefcase-plus"
            title="Tambah Jabatan"
            subtitle="Tambahkan jabatan baru"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            onClick={() => router.push('/jabatan')}
          />
          <QuickAccessCard
            icon="mdi:sitemap-outline"
            title="Tambah Struktur"
            subtitle="Atur struktur organisasi"
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
            onClick={() => router.push('/struktur')}
          />
        </div>

        {/* Distribusi Petugas per Jabatan */}
        <h2 className="text-lg font-semibold mb-2">Distribusi Petugas per Jabatan</h2>
        <DashboardCard
          icon="mdi:chart-bar"
          title="Visualisasi Jumlah Petugas per Jabatan"
          barData={petugasPerJabatan.map((item) => ({
            label: item.nama_jabatan,
            value: item.jumlah,
          }))}
          onClick={() => router.push('/jabatan')}
        />
      </main>
    </div>
  );
}
