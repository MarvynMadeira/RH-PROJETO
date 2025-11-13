'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BuscaAvancadaPage() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!query.trim()) return;

    setLoading(true);

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
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Busca Avançada</h1>
        <p className='mt-2 text-gray-600'>
          Busque por qualquer campo: nome, CPF, função, matrícula, etc.
        </p>
      </div>

      <div className='mb-6 rounded-lg bg-white p-6 shadow'>
        <div className='space-y-4'>
          <div>
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
                className='flex-1 rounded-md border border-gray-300 px-4 py-2'
              />
              <button
                onClick={buscar}
                disabled={loading}
                className='rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50'
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          <div className='rounded-md border border-blue-200 bg-blue-50 p-4'>
            <p className='text-sm text-blue-800'>
              <strong>Dicas de busca:</strong>
            </p>
            <ul className='mt-2 list-inside list-disc space-y-1 text-sm text-blue-800'>
              <li>
                <strong>Por CPF:</strong> Digite o CPF completo (com ou sem
                pontuação)
              </li>
              <li>
                <strong>Por nome:</strong> Digite o nome ou parte dele
              </li>
              <li>
                <strong>Por função:</strong> Digite "professor", "gari", etc.
              </li>
              <li>
                <strong>Por disciplina:</strong> Digite "geografia",
                "matemática", etc.
              </li>
              <li>
                <strong>Por matrícula:</strong> Digite o número da matrícula
              </li>
            </ul>
          </div>
        </div>
      </div>

      {resultados.length > 0 && (
        <div className='rounded-lg bg-white shadow'>
          <div className='border-b border-gray-200 p-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Resultados: {resultados.length} associado(s) encontrado(s)
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
                        <strong>CPF:</strong> {associado.dados_pessoais.cpf}
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
                        <div className='mt-2'>
                          <p className='text-sm font-medium text-gray-700'>
                            Matrículas:
                          </p>
                          {associado.situacao_funcional.matriculas.map(
                            (mat: any, idx: number) => (
                              <p
                                key={idx}
                                className='ml-2 text-sm text-gray-600'
                              >
                                • {mat.numeroMatricula} - {mat.cargoFuncao} -{' '}
                                {mat.lotacao}
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
        </div>
      )}

      {!loading && query && resultados.length === 0 && (
        <div className='rounded-lg bg-white p-12 text-center shadow'>
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
  );
}
