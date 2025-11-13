import Link from 'next/link';

export default function FormulariosPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Formulários</h1>
        <p className='mt-2 text-gray-600'>
          Gerencie os formulários e requisições para seus associados
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Link
          href='/formularios/registro-associados'
          className='block rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md'
        >
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg
                className='h-8 w-8 text-indigo-600'
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
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Registro de Associados
              </h3>
              <p className='mt-2 text-sm text-gray-600'>
                Gere links públicos para registro de novos associados. Válido
                por 7 dias.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href='/formularios/historico-funcional'
          className='block rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md'
        >
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg
                className='h-8 w-8 text-indigo-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Histórico Funcional
              </h3>
              <p className='mt-2 text-sm text-gray-600'>
                Adicione movimentações e alterações de carga horária aos
                associados.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href='/formularios/status'
          className='block rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md'
        >
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg
                className='h-8 w-8 text-indigo-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Status</h3>
              <p className='mt-2 text-sm text-gray-600'>
                Atualize o status do estágio probatório e vínculo dos
                associados.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href='/formularios/gerar-requisicao'
          className='block rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md'
        >
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg
                className='h-8 w-8 text-indigo-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Gerar Requisição
              </h3>
              <p className='mt-2 text-sm text-gray-600'>
                Crie requisições customizadas e envie links individuais para
                associados.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
