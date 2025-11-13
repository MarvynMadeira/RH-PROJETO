'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InativosPage() {
  const [inativos, setInativos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtrados, setFiltrados] = useState<any[]>([]);

  useEffect(() => {
    carregarInativos();
  }, []);

  useEffect(() => {
    if (busca) {
      const resultados = inativos.filter((a) =>
        a.dados_pessoais.nomeCompleto
          .toLowerCase()
          .includes(busca.toLowerCase()),
      );
      setFiltrados(resultados);
    } else {
      setFiltrados(inativos);
    }
  }, [busca, inativos]);

  const carregarInativos = async () => {
    try {
      const res = await fetch('/api/associados/inativos');
      const data = await res.json();
      setInativos(data.associados || []);
      setFiltrados(data.associados || []);
    } catch (err) {
      console.error('Erro ao carregar inativos:', err);
    } finally {
      setLoading(false);
    }
  };

  const vincularNovamente = async (associadoId: string) => {
    if (!confirm('Deseja realmente vincular este associado novamente?')) {
      return;
    }

    try {
      const res = await fetch(`/api/associados/${associadoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ativo: true,
          status: {
            estadoAtual: 'vinculado',
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao vincular');
      }

      alert('Associado vinculado novamente!');

      // Remover da lista de inativos
      setInativos(inativos.filter((a) => a.id !== associadoId));
    } catch (err) {
      alert('Erro ao vincular associado');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Associados Inativos
        </h1>
        <p className='mt-2 text-gray-600'>
          Total: {filtrados.length} associado(s) inativo(s)
        </p>
      </div>

      {inativos.length > 0 && (
        <div className='mb-6 rounded-lg bg-white p-6 shadow'>
          <input
            type='text'
            placeholder='Buscar por nome...'
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className='w-full rounded-md border border-gray-300 px-4 py-2'
          />
        </div>
      )}

      {filtrados.length === 0 ? (
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
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <p className='text-gray-600'>Nenhum associado inativo</p>
        </div>
      ) : (
        <div className='divide-y divide-gray-200 rounded-lg bg-white shadow'>
          {filtrados.map((associado) => (
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
                      <strong>Desvinculado em:</strong>{' '}
                      {new Date(associado.updated_at).toLocaleDateString(
                        'pt-BR',
                      )}
                    </p>

                    {associado.status?.desvinculacao?.observacoes && (
                      <p className='mt-2 text-sm text-gray-600'>
                        <strong>Motivo:</strong>{' '}
                        {associado.status.desvinculacao.observacoes}
                      </p>
                    )}
                  </div>
                </div>

                <div className='ml-4 flex flex-col space-y-2'>
                  <button
                    onClick={() => vincularNovamente(associado.id)}
                    className='rounded-md bg-green-600 px-4 py-2 text-sm whitespace-nowrap text-white hover:bg-green-700'
                  >
                    Vincular Novamente
                  </button>
                  <Link
                    href={`/associados/${associado.id}`}
                    className='rounded-md bg-indigo-600 px-4 py-2 text-center text-sm whitespace-nowrap text-white hover:bg-indigo-700'
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
