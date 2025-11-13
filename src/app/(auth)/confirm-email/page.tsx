'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ConfirmarEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams?.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token não fornecido');
      return;
    }

    const confirmar = async () => {
      try {
        const res = await fetch('/api/auth/confirm-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setStatus('success');
        setMessage('Email confirmado com sucesso!');
        setTimeout(() => router.push('/login'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    confirmar();
  }, [searchParams, router]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md'>
        {status === 'loading' && (
          <>
            <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-indigo-600'></div>
            <p className='text-gray-600'>Confirmando seu email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className='mb-4 text-green-600'>
              <svg
                className='mx-auto h-16 w-16'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='mb-2 text-2xl font-bold text-gray-900'>{message}</h2>
            <p className='text-gray-600'>Redirecionando para login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className='mb-4 text-red-600'>
              <svg
                className='mx-auto h-16 w-16'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <h2 className='mb-2 text-2xl font-bold text-gray-900'>Erro</h2>
            <p className='mb-4 text-red-600'>{message}</p>
            <a
              href='/login'
              className='inline-block rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
            >
              Ir para Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
