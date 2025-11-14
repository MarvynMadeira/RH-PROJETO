import Link from 'next/link';
import {
  FiFileText,
  FiLock,
  FiDatabase,
  FiLogIn,
  FiUserPlus,
} from 'react-icons/fi';

export default function HomePage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg'>
        {/* Header */}
        <div className='bg-indigo-600 p-6 text-white'>
          <h1 className='text-3xl font-bold'>RH-Helper</h1>
          <p className='mt-2 opacity-90'>Solução completa para gestão de RH</p>
        </div>

        {/* Features */}
        <div className='grid gap-8 p-8 md:grid-cols-3'>
          <div className='flex flex-col items-center text-center'>
            <FiFileText className='mb-4 text-4xl text-indigo-600' />
            <h3 className='mb-2 text-lg font-semibold'>
              Formulários Corporativos
            </h3>
            <p className='text-gray-600'>
              Crie e gerencie formulários corporativos com eficiência.
            </p>
          </div>

          <div className='flex flex-col items-center text-center'>
            <FiLock className='mb-4 text-4xl text-indigo-600' />
            <h3 className='mb-2 text-lg font-semibold'>Segurança de Dados</h3>
            <p className='text-gray-600'>
              Controle o acesso às informações de colaboradores com segurança.
            </p>
          </div>

          <div className='flex flex-col items-center text-center'>
            <FiDatabase className='mb-4 text-4xl text-indigo-600' />
            <h3 className='mb-2 text-lg font-semibold'>Centralização</h3>
            <p className='text-gray-600'>
              Centralize dados e facilite a rotina do RH em um único lugar.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className='flex flex-col justify-center gap-4 bg-gray-50 px-8 py-6 sm:flex-row'>
          <Link
            href='/register'
            className='flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700'
          >
            <FiUserPlus />
            Registrar
          </Link>
          <Link
            href='/login'
            className='flex items-center justify-center gap-2 rounded-lg border border-indigo-600 px-6 py-3 font-medium text-indigo-600 transition-colors hover:bg-indigo-50'
          >
            <FiLogIn />
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
