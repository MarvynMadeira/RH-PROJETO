'use client';

import { useEffect } from 'react';

export default function VerifyEmailPage() {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const token = urlSearchParams.get('token');

    if (token) {
      window.location.replace(`/api/auth/verify-email?token=${token}`);
    } else {
      window.location.replace('/login?error=missing_token');
    }
  }, []);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='rounded-xl bg-white p-8 text-center shadow-lg'>
        <div className='mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-blue-600'></div>
        <h1 className='mb-2 text-2xl font-bold text-gray-800'>
          Validando seu E-mail...
        </h1>
        <p className='text-gray-600'>
          Por favor, aguarde. Você será redirecionado em breve.
        </p>
      </div>
    </div>
  );
}
