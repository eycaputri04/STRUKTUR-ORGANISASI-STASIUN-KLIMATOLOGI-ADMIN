'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import InputField from '@/components/Input';
import Button from '@/components/Button';
import AuthLeftPanel from '@/components/AuthLeftPanel';
import { loginUser } from '@/lib/api/auth/auth-login/router';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      toast.success('Login berhasil!');
      router.push('/beranda');
    } catch (err) {
      setError((err as Error).message || 'Gagal login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="flex min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 transition-all">
        {/* Panel Kiri */}
        <AuthLeftPanel />

        {/* Form Login */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col justify-center items-center w-full md:w-1/2 p-8"
        >
          <h1 className="text-3xl font-bold mb-2 text-gray-800 tracking-wide">
            Login Admin
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            Silakan masuk untuk mengelola sistem
          </p>

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

            {error && <p className="text-sm text-red-500 -mt-2">{error}</p>}

            <div className="text-right text-sm text-blue-700 hover:underline">
              <Link href="/lupa-password">Lupa Kata Sandi?</Link>
            </div>

            <Button
              label={loading ? 'Memproses...' : 'Masuk'}
              onClick={handleLogin}
              disabled={loading}
            />

            {/*
            <div className="text-sm text-center text-gray-600">
              Belum punya akun?{' '}
              <Link href="/daftar" className="text-blue-700 font-medium hover:underline">
                Buat akun
              </Link>
            </div>*/}
          </div>
        </motion.div>
      </div>
    </>
  );
}
