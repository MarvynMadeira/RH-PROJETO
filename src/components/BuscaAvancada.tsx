'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatarCPF } from '@/lib/validations';

export default function BuscaAvancada() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pesquisado, setPesquisado] = useState(false);

  const buscar = async () => {
    if (!query.trim()) {
      alert('Digite algo para buscar');
      return;
    }

    setLoading(true);
    setPesquisado(true);

    try {
      // Detectar tipo de busca
      let tipo = 'campo';

      // Se contém apenas números ou formato de CPF
      if (/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(query)) {
        tipo = 'cpf';
      }

      const res = await fetch(
        `/api/associados/search?q=${encodeURIComponent(query)}&tipo=${tipo}`,
      );
      const data = await res.json();

      setResultados(data.associados || []);
    } catch (err) {
      alert('Erro na busca');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscar();
    }
  };

  return (
    <div className='space-y-6'>
      {/* Campo de busca */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Digite sua busca
        </label>
        <div className='flex gap-2'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Ex: "matrícula 2", "professor", "maria", "geografia"'
            className='flex-1 rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
          />
          <button
            onClick={buscar}
            disabled={loading}
            className='rounded-md bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50'
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Dicas */}
        <div className='mt-4 rounded-md border border-blue-200 bg-blue-50 p-4'>
          <p className='mb-2 text-sm font-medium text-blue-800'>
            💡 Dicas de busca:
          </p>
          <ul className='ml-4 list-disc space-y-1 text-sm text-blue-800'>
            <li>Digite o CPF completo para buscar por CPF</li>
            <li>Digite um nome ou parte dele</li>
            <li>Digite uma função: "professor", "gari", etc</li>
            <li>Digite uma disciplina: "geografia", "matemática"</li>
            <li>Digite um número de matrícula</li>
          </ul>
        </div>
      </div>

      {/* Resultados */}
      {pesquisado && (
        <div className='rounded-lg bg-white shadow'>
          {resultados.length > 0 ? (
            <>
              <div className='border-b border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {resultados.length} resultado(s) encontrado(s)
                </h3>
              </div>

              <div className='divide-y divide-gray-200'>
                {resultados.map((associado) => (
                  <div key={associado.id} className='p-6 hover:bg-gray-50'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h4 className='text-lg font-semibold text-gray-900'>
                          {associado.dados_pessoais.nomeCompleto}
                        </h4>
                        <div className='mt-2 space-y-1'>
                          <p className='text-sm text-gray-600'>
                            <strong>CPF:</strong>{' '}
                            {formatarCPF(associado.dados_pessoais.cpf)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            <strong>Email:</strong>{' '}
                            {associado.dados_pessoais.contato.email}
                          </p>
                          <p className='text-sm text-gray-600'>
                            <strong>Telefone:</strong>{' '}
                            {associado.dados_pessoais.contato.telefone}
                          </p>

                          {associado.situacao_funcional.matriculas && (
                            <div className='mt-3'>
                              <p className='mb-1 text-sm font-medium text-gray-700'>
                                Matrículas:
                              </p>
                              {associado.situacao_funcional.matriculas.map(
                                (mat: any, idx: number) => (
                                  <p
                                    key={idx}
                                    className='ml-2 text-sm text-gray-600'
                                  >
                                    • <strong>{mat.numeroMatricula}</strong> -{' '}
                                    {mat.cargoFuncao} - {mat.lotacao}
                                    {mat.Disciplina && ` (${mat.Disciplina})`}
                                  </p>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/associados/${associado.id}`}
                        className='ml-4 rounded-md bg-indigo-600 px-4 py-2 text-sm whitespace-nowrap text-white hover:bg-indigo-700'
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='p-12 text-center'>
              <div className='mb-4 text-gray-400'>
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
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <p className='text-gray-600'>
                Nenhum resultado encontrado para "{query}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
