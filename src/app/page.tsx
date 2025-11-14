export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
      <div className='w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg'>
        <h1 className='mb-4 text-3xl font-bold text-gray-900'>
          Bem-vindo ao <span className='text-indigo-600'>RH-Helper</span>
        </h1>

        <p className='mb-8 text-gray-600'>
          Crie e gerencie formulários para associados. Tenha controle dos dados
          — tudo em um só lugar.
        </p>

        <div className='flex flex-col gap-4'>
          <a
            href='/login'
            className='w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700'
          >
            Fazer Login
          </a>

          <a
            href='/register'
            className='w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100'
          >
            Criar Conta
          </a>
        </div>
      </div>
    </main>
  );
}
