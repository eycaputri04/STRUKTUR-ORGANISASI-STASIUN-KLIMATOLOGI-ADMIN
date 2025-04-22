'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import InputField from '@/components/Input';
import Button from '@/components/Button';
import Logo from '@/public/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    // tambahkan logika autentikasi di sini
  };

  return (
    <div className="flex min-h-screen">
      {/* Kiri: Panel Logo & Judul */}
      <div className="bg-[#004AAD] text-white flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">
          STRUKTUR ORGANISASI
        </h1>
        <h2 className="text-lg sm:text-xl font-bold text-center mb-6">
          STASIUN KLIMATOLOGI
        </h2>
        <Image
          src={Logo}
          alt="Logo BMKG"
          width={150}
          height={150}
          priority
        />
        <h2 className="text-md sm:text-lg font-bold text-center mt-6">
          PROVINSI BENGKULU
        </h2>
      </div>

      {/* Kanan: Form Login */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-2xl font-bold mb-6">Login Admin</h1>
        <div className="w-full max-w-sm flex flex-col gap-4">
          <InputField
            name="email"
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Masukkan Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right text-sm text-blue-700 hover:underline cursor-pointer">
            Lupa Kata Sandi?
          </div>

          <Button
            label="Masuk"
            onClick={handleLogin}
          />

          <div className="text-sm text-center">
            Belum punya akun?{' '}
            <span className="text-blue-700 font-medium hover:underline cursor-pointer">
              Buat akun
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
