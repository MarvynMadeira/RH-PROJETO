import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>RH Helper</h1>
          <p className='text-xl text-gray-600'>
            Sistema de Gestão de Associados
          </p>
        </div>

        <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-2'>
          {/* Admin Card */}
          <div className='rounded-2xl bg-white p-8 shadow-xl transition hover:shadow-2xl'>
            <div className='mb-6 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                <svg
                  className='h-8 w-8 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <h2 className='mb-2 text-2xl font-bold text-gray-900'>
                Administrador
              </h2>
              <p className='text-gray-600'>
                Gerencie associados, formulários e dados
              </p>
            </div>
            <div className='space-y-3'>
              <Link
                href='/login'
                className='block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700'
              >
                Fazer Login
              </Link>
              <Link
                href='/register'
                className='block w-full rounded-lg border-2 border-blue-600 px-6 py-3 text-center font-medium text-blue-600 transition hover:bg-blue-50'
              >
                Criar Conta
              </Link>
            </div>
          </div>

          {/* Associate Card */}
          <div className='rounded-2xl bg-white p-8 shadow-xl transition hover:shadow-2xl'>
            <div className='mb-6 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                <svg
                  className='h-8 w-8 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h2 className='mb-2 text-2xl font-bold text-gray-900'>
                Associado
              </h2>
              <p className='text-gray-600'>
                Acesse seus dados e preencha formulários
              </p>
            </div>
            <div className='space-y-3'>
              <Link
                href='/login'
                className='block w-full rounded-lg bg-green-600 px-6 py-3 text-center font-medium text-white transition hover:bg-green-700'
              >
                Fazer Login
              </Link>
              <div className='pt-2 text-center text-sm text-gray-500'>
                Você receberá suas credenciais por email após o cadastro
              </div>
            </div>
          </div>
        </div>

        <div className='mt-16 text-center'>
          <h3 className='mb-8 text-2xl font-bold text-gray-900'>
            Recursos do Sistema
          </h3>
          <div className='mx-auto grid max-w-4xl gap-6 md:grid-cols-3'>
            <div className='rounded-xl bg-white p-6 shadow'>
              <div className='mb-3 text-4xl'>📋</div>
              <h4 className='mb-2 font-bold text-gray-900'>
                Formulários Dinâmicos
              </h4>
              <p className='text-sm text-gray-600'>
                Crie e gerencie formulários customizados
              </p>
            </div>
            <div className='rounded-xl bg-white p-6 shadow'>
              <div className='mb-3 text-4xl'>🔍</div>
              <h4 className='mb-2 font-bold text-gray-900'>Busca Avançada</h4>
              <p className='text-sm text-gray-600'>
                Encontre associados rapidamente
              </p>
            </div>
            <div className='rounded-xl bg-white p-6 shadow'>
              <div className='mb-3 text-4xl'>📊</div>
              <h4 className='mb-2 font-bold text-gray-900'>
                Histórico Completo
              </h4>
              <p className='text-sm text-gray-600'>
                Acompanhe toda a trajetória funcional
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
