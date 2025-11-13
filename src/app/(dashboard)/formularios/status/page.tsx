'use client';

import { useState } from 'react';

export default function StatusPage() {
  const [cpfs, setCpfs] = useState('');
  const [associados, setAssociados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarAssociados = async () => {
    setLoading(true);

    try {
      const cpfList = cpfs
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const results = [];

      for (const cpf of cpfList) {
        const res = await fetch(`/api/associados/search?q=${cpf}&tipo=cpf`);
        const data = await res.json();

        if (data.associados && data.associados.length > 0) {
          results.push(...data.associados);
        }
      }

      setAssociados(results);
    } catch (err) {
      alert('Erro ao buscar associados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (
    associadoId: string,
    campo: string,
    valor: any,
  ) => {
    try {
      const resGet = await fetch(`/api/associados/${associadoId}`);
      const { associado } = await resGet.json();

      const novoStatus = {
        ...associado.status,
        [campo]: valor,
      };

      // Se desvinculado, marcar como inativo
      const updates: any = { status: novoStatus };

      if (campo === 'estadoAtual' && valor === 'desvinculado') {
        updates.ativo = false;
      }

      const res = await fetch(`/api/associados/${associadoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar');
      }

      alert('Status atualizado!');

      // Atualizar lista local
      setAssociados(
        associados.map((a) =>
          a.id === associadoId ? { ...a, ...updates } : a,
        ),
      );
    } catch (err) {
      alert('Erro ao atualizar status');
      console.error(err);
    }
  };

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Status</h1>
        <p className='mt-2 text-gray-600'>
          Atualize o status do estágio probatório e vínculo dos associados
        </p>
      </div>

      <div className='mb-6 rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Buscar Associados
        </h3>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              CPF(s) - separados por vírgula
            </label>
            <input
              type='text'
              value={cpfs}
              onChange={(e) => setCpfs(e.target.value)}
              placeholder='123.456.789-00, 987.654.321-00'
              className='w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </div>

          <button
            onClick={buscarAssociados}
            disabled={loading}
            className='rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50'
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {associados.length > 0 && (
        <div className='space-y-4'>
          {associados.map((associado) => (
            <div key={associado.id} className='rounded-lg bg-white p-6 shadow'>
              <div className='mb-4'>
                <h4 className='text-lg font-semibold text-gray-900'>
                  {associado.dados_pessoais.nomeCompleto}
                </h4>
                <p className='text-sm text-gray-600'>
                  CPF: {associado.dados_pessoais.cpf}
                </p>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Estágio Probatório
                  </label>
                  <select
                    value={
                      associado.status?.estagioProbatorio || 'em_andamento'
                    }
                    onChange={(e) =>
                      atualizarStatus(
                        associado.id,
                        'estagioProbatorio',
                        e.target.value,
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2'
                  >
                    <option value='em_andamento'>Em Andamento</option>
                    <option value='aprovado'>Aprovado</option>
                    <option value='reprovado'>Reprovado</option>
                    <option value='suspenso'>Suspenso</option>
                  </select>
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Estado Atual
                  </label>
                  <select
                    value={associado.status?.estadoAtual || 'vinculado'}
                    onChange={(e) =>
                      atualizarStatus(
                        associado.id,
                        'estadoAtual',
                        e.target.value,
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2'
                  >
                    <option value='vinculado'>Vinculado</option>
                    <option value='desvinculado'>Desvinculado</option>
                  </select>
                </div>

                {associado.status?.estadoAtual === 'desvinculado' && (
                  <div className='rounded-md border border-yellow-200 bg-yellow-50 p-4'>
                    <p className='text-sm text-yellow-800'>
                      ⚠️ Este associado está desvinculado e será movido para a
                      lista de inativos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
