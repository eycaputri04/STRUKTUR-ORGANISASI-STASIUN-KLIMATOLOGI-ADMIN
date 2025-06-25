'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from '@/components/Input';
import Button from '@/components/Button';
import AuthLeftPanel from '@/components/AuthLeftPanel';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);

  const params = useSearchParams();
  const token = params.get('token');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      alert('Token tidak ditemukan.');
      router.push('/');
    }
  }, [token]);

  const handleReset = () => {
    if (password !== confirm) {
      alert('Kata sandi tidak cocok!');
      return;
    }

    console.log(`Reset password dengan token: ${token}, password baru: ${password}`);
    setTimeout(() => {
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-2xl font-bold mb-6">Atur Ulang Kata Sandi</h1>
        <div className="w-full max-w-sm flex flex-col gap-4 text-center">
          {success ? (
            <p className="text-gray-700">
              Kata sandi berhasil diubah.{' '}
              <span
                onClick={() => router.push('/')}
                className="underline cursor-pointer text-blue-700 hover:text-blue-900"
              >
                Login sekarang
              </span>
            </p>
          ) : (
            <>
              <InputField
                name="new-password"
                type="password"
                placeholder="Password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputField
                name="confirm-password"
                type="password"
                placeholder="Konfirmasi password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <Button
                label="Simpan Password Baru"
                onClick={handleReset}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
