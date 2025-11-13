'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AssociadosPage() {
  const [associados, setAssociados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtrados, setFiltrados] = useState<any[]>([]);

  useEffect(() => {
    carregarAssociados();
  }, []);

  useEffect(() => {
    if (busca) {
      const resultados = associados.filter((a) =>
        a.dados_pessoais.nomeCompleto
          .toLowerCase()
          .includes(busca.toLowerCase()),
      );
      setFiltrados(resultados);
    } else {
      setFiltrados(associados);
    }
  }, [busca, associados]);

  const carregarAssociados = async () => {
    try {
      const res = await fetch('/api/associados');
      const data = await res.json();
      setAssociados(data.associados || []);
      setFiltrados(data.associados || []);
    } catch (err) {
      console.error('Erro ao carregar associados:', err);
    } finally {
      setLoading(false);
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
          Lista de Associados
        </h1>
        <p className='mt-2 text-gray-600'>
          Total: {filtrados.length} associado(s)
        </p>
      </div>

      <div className='mb-6 rounded-lg bg-white p-6 shadow'>
        <input
          type='text'
          placeholder='Buscar por nome...'
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className='w-full rounded-md border border-gray-300 px-4 py-2'
        />
      </div>

      {filtrados.length === 0 ? (
        <div className='rounded-lg bg-white p-12 text-center shadow'>
          <p className='text-gray-600'>Nenhum associado encontrado</p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-lg bg-white shadow'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Nome
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  CPF
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {filtrados.map((associado) => (
                <tr key={associado.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {associado.dados_pessoais.nomeCompleto}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-600'>
                      {associado.dados_pessoais.cpf}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-600'>
                      {associado.dados_pessoais.contato.email}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        associado.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {associado.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm whitespace-nowrap'>
                    <Link
                      href={`/associados/${associado.id}`}
                      className='font-medium text-indigo-600 hover:text-indigo-900'
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
