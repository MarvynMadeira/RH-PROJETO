'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AssociatesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [associates, setAssociates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadAssociates();
  }, []);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const loadAssociates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/associates', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setAssociates(data.associates || []);
    } catch (error) {
      console.error('Erro ao carregar associados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query?: string) => {
    const searchText = query || searchQuery;
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/associates/search', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchText }),
      });

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setSearching(false);
    }
  };

  const displayData =
    searchResults.length > 0 || searchQuery ? searchResults : associates;

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
            <div className='flex items-center space-x-4'>
              <Link
                href='/admin/dashboard'
                className='text-gray-600 hover:text-gray-900'
              >
                ← Dashboard
              </Link>
              <h1 className='text-2xl font-bold text-gray-900'>Associados</h1>
            </div>
            <Link
              href='/admin/forms'
              className='rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
            >
              + Adicionar Associado
            </Link>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Search Bar */}
        <div className='mb-6 rounded-xl bg-white p-6 shadow'>
          <div className='mb-4'>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Busca Avançada
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Ex: nome João, matricula 1000, status ativo'
                className='flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
              <button
                onClick={() => handleSearch()}
                disabled={searching}
                className='rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:bg-blue-300'
              >
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    router.push('/admin/associates');
                  }}
                  className='rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition hover:bg-gray-50'
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className='text-sm text-gray-600'>
            <p className='mb-2 font-medium'>💡 Dicas de busca:</p>
            <ul className='list-inside list-disc space-y-1 text-xs'>
              <li>
                <strong>Busca simples:</strong> nome João (busca por "João" no
                campo nome)
              </li>
              <li>
                <strong>Busca numérica:</strong> matricula 1000 (matrícula ≥
                1000)
              </li>
              <li>
                <strong>Múltiplos valores:</strong> cargo professor coordenador
                (cargo é professor OU coordenador)
              </li>
              <li>
                <strong>Múltiplos campos:</strong> nome João, status ativo
                (separe com vírgula)
              </li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className='rounded-xl bg-white shadow'>
          <div className='border-b p-6'>
            <h2 className='text-lg font-bold text-gray-900'>
              {searchQuery
                ? `Resultados da busca (${displayData.length})`
                : `Todos os associados (${displayData.length})`}
            </h2>
          </div>

          {displayData.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              {searchQuery
                ? 'Nenhum resultado encontrado para esta busca'
                : 'Nenhum associado cadastrado ainda'}
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='border-b bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Usuário
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Nome
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Cadastrado em
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {displayData.map((associate) => (
                    <tr
                      key={associate.id}
                      className='transition hover:bg-gray-50'
                    >
                      <td className='px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900'>
                        {associate.username}
                      </td>
                      <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-900'>
                        {associate.formData?.dadosPessoais?.nomeCompleto || '-'}
                      </td>
                      <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-600'>
                        {associate.formData?.dadosPessoais?.contato?.email ||
                          '-'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            associate.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {associate.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm whitespace-nowrap text-gray-600'>
                        {new Date(associate.createdAt).toLocaleDateString(
                          'pt-BR',
                        )}
                      </td>
                      <td className='px-6 py-4 text-right text-sm font-medium whitespace-nowrap'>
                        <Link
                          href={`/admin/associates/${associate.id}`}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          Ver detalhes →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
