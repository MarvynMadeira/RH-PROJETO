'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatarCPF } from '@/lib/validations';

interface Associado {
  id: string;
  dados_pessoais: {
    nomeCompleto: string;
    cpf: string;
    contato: {
      email: string;
      telefone: string;
    };
  };
  ativo: boolean;
  status?: {
    estadoAtual: string;
  };
  created_at: string;
}

interface TabelaAssociadosProps {
  associados: Associado[];
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export default function TabelaAssociados({
  associados,
  onSearch,
  showSearch = true,
}: TabelaAssociadosProps) {
  const [busca, setBusca] = useState('');

  const handleBusca = (value: string) => {
    setBusca(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div>
      {showSearch && (
        <div className='mb-6'>
          <div className='relative'>
            <input
              type='text'
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              placeholder='Buscar por nome...'
              className='w-full rounded-md border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
            />
            <div className='absolute top-2.5 left-3 text-gray-400'>
              <svg
                className='h-5 w-5'
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
          </div>
        </div>
      )}

      <div className='overflow-hidden rounded-lg bg-white shadow'>
        {associados.length === 0 ? (
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
                  d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                />
              </svg>
            </div>
            <p className='text-gray-600'>Nenhum associado encontrado</p>
          </div>
        ) : (
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
              {associados.map((associado) => (
                <tr key={associado.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {associado.dados_pessoais.nomeCompleto}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-600'>
                      {formatarCPF(associado.dados_pessoais.cpf)}
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
        )}
      </div>
    </div>
  );
}
