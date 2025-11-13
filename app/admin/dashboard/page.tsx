'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Tipagem para as estatísticas
interface Stats {
  totalAssociates: number;
  activeAssociates: number;
  inactiveAssociates: number;
  totalForms: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalAssociates: 0,
    activeAssociates: 0,
    inactiveAssociates: 0,
    totalForms: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Efeito para carregar dados e verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.type !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(parsedUser);
    loadStats(token);
  }, [router]);

  // Função para carregar as estatísticas (cards do topo)
  const loadStats = async (token: string) => {
    try {
      const [associatesRes, formsRes] = await Promise.all([
        // Assumindo que você tem uma rota GET /api/admin/associates
        fetch('/api/admin/associates', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/forms', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!associatesRes.ok || !formsRes.ok) {
        throw new Error('Falha ao buscar dados da API.');
      }

      const associatesData = await associatesRes.json();
      const formsData = await formsRes.json();

      setStats({
        totalAssociates: associatesData.associates?.length || 0,
        activeAssociates:
          associatesData.associates?.filter((a: any) => a.status === 'active')
            .length || 0,
        inactiveAssociates:
          associatesData.associates?.filter((a: any) => a.status === 'inactive')
            .length || 0,
        totalForms: formsData.forms?.length || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navega para a página de busca com a query
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/admin/associates?search=${encodeURIComponent(searchQuery)}`,
      );
    } else {
      router.push('/admin/associates');
    }
  };

  // Desloga o usuário
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // ---- RENDERIZAÇÃO ----

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>RH Helper</h1>
              <p className='text-sm text-gray-600'>
                Bem-vindo, {user?.name || 'Admin'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className='rounded-lg px-4 py-2 text-red-600 transition hover:bg-red-50'
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className='container mx-auto px-4 py-8'>
        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          {/* Card Total Associados */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm text-gray-600'>
                  Total de Associados
                </p>
                <p className='text-3xl font-bold text-gray-900'>
                  {stats.totalAssociates}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                {/* Ícone de Usuários */}
                <svg
                  className='h-6 w-6 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* Card Ativos */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm text-gray-600'>Ativos</p>
                <p className='text-3xl font-bold text-green-600'>
                  {stats.activeAssociates}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                {/* Ícone Check */}
                <svg
                  className='h-6 w-6 text-green-600'
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
            </div>
          </div>
          {/* Card Desvinculados */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm text-gray-600'>Desvinculados</p>
                <p className='text-3xl font-bold text-red-600'>
                  {stats.inactiveAssociates}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-red-100'>
                {/* Ícone X */}
                <svg
                  className='h-6 w-6 text-red-600'
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
            </div>
          </div>
          {/* Card Formulários */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm text-gray-600'>Formulários</p>
                <p className='text-3xl font-bold text-purple-600'>
                  {stats.totalForms}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100'>
                {/* Ícone Documento */}
                <svg
                  className='h-6 w-6 text-purple-600'
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
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* Card Buscar (COM A BUSCA DENTRO) */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <h3 className='mb-4 flex items-center text-lg font-bold text-gray-900'>
              <svg
                className='mr-2 h-5 w-5 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              Buscar Associados
            </h3>
            <p className='mb-4 text-sm text-gray-600'>
              Use a busca avançada para encontrar associados
            </p>

            {/*
              *** MODIFICAÇÃO AQUI ***
              - Adicionado 'flex-col sm:flex-row' para empilhar em telas móveis e alinhar lado a lado em telas maiores.
              - Adicionado 'w-full' e 'sm:w-auto'/'sm:flex-1' para responsividade.
            */}
            <div className='mb-3 flex flex-col gap-2 sm:flex-row'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Ex: nome João, status ativo'
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:flex-1'
              />
              <button
                onClick={handleSearch}
                className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:w-auto'
              >
                Buscar
              </button>
            </div>
            {/* *** FIM DA MODIFICAÇÃO *** */}

            <Link
              href='/admin/associates'
              className='text-sm text-blue-600 hover:text-blue-700'
            >
              Ver todos os associados →
            </Link>
          </div>

          {/* Card Formulários (MODIFICADO) */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <h3 className='mb-4 flex items-center text-lg font-bold text-gray-900'>
              <svg
                className='mr-2 h-5 w-5 text-green-600'
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
              Formulário Padrão
            </h3>
            <p className='mb-4 text-sm text-gray-600'>
              Gerencie o formulário padrão e gere links para associados
            </p>
            <div className='space-y-2'>
              <Link
                href='/admin/forms'
                className='block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-white transition hover:bg-green-700'
              >
                Gerenciar Formulário
              </Link>
            </div>
          </div>

          {/* Card Campos Customizados */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <h3 className='mb-4 flex items-center text-lg font-bold text-gray-900'>
              <svg
                className='mr-2 h-5 w-5 text-purple-600'
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
              Campos Customizados
            </h3>
            <p className='mb-4 text-sm text-gray-600'>
              Adicione novos campos ao formulário padrão
            </p>
            <div className='space-y-2'>
              <Link
                href='/admin/custom-fields'
                className='block w-full rounded-lg bg-purple-600 px-4 py-2 text-center text-white transition hover:bg-purple-700'
              >
                Gerenciar Campos
              </Link>
              <Link
                href='/admin/custom-fields/create'
                className='block w-full rounded-lg border border-purple-600 px-4 py-2 text-center text-purple-600 transition hover:bg-purple-50'
              >
                Criar Novo Campo
              </Link>
            </div>
          </div>
        </div>

        {/* Ações Rápidas (CENTRALIZADO) */}
        <div className='rounded-xl bg-white p-6 shadow'>
          <h3 className='mb-4 text-lg font-bold text-gray-900'>
            Ações Rápidas
          </h3>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            {/* Desvinculados */}
            <Link
              href='/admin/inactive'
              className='group rounded-lg border-2 border-gray-200 p-4 text-center transition hover:border-blue-500'
            >
              <div className='mb-2 text-3xl'>📋</div>
              <p className='text-sm font-medium text-gray-700 group-hover:text-blue-600'>
                Desvinculados
              </p>
            </Link>

            {/* Ajuda (Link de E-mail) */}
            <a
              href='mailto:rh.helper2025@gmail.com?subject=Suporte%20RH%20Helper%20Admin'
              className='group rounded-lg border-2 border-gray-200 p-4 text-center transition hover:border-blue-500'
            >
              <div className='mb-2 text-3xl'>📧</div>
              <p className='text-sm font-medium text-gray-700 group-hover:text-blue-600'>
                Falar com Suporte
              </p>
            </a>

            {/* Buscar Associados */}
            <Link
              href='/admin/associates'
              className='group rounded-lg border-2 border-gray-200 p-4 text-center transition hover:border-blue-500'
            >
              <div className='mb-2 text-3xl'>👥</div>
              <p className='text-sm font-medium text-gray-700 group-hover:text-blue-600'>
                Buscar Associados
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
