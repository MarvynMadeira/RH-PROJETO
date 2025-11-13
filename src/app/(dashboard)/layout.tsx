import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex'>
              <Link href='/formularios' className='flex items-center'>
                <span className='text-xl font-bold text-indigo-600'>
                  RH Helper
                </span>
              </Link>

              <div className='hidden sm:ml-8 sm:flex sm:space-x-4'>
                <Link
                  href='/formularios'
                  className='inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                >
                  Formulários
                </Link>
                <Link
                  href='/associados'
                  className='inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                >
                  Associados
                </Link>
                <Link
                  href='/busca-avancada'
                  className='inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                >
                  Busca Avançada
                </Link>
                <Link
                  href='/inativos'
                  className='inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                >
                  Inativos
                </Link>
              </div>
            </div>

            <div className='flex items-center'>
              <span className='mr-4 text-sm text-gray-700'>
                {user.user_metadata?.nome || user.email}
              </span>
              <form action='/api/auth/signout' method='POST'>
                <button
                  type='submit'
                  className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {children}
      </main>
    </div>
  );
}
