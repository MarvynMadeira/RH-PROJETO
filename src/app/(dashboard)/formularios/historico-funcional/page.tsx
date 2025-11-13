'use client';

import { useState } from 'react';

export default function HistoricoFuncionalPage() {
  const [cpfs, setCpfs] = useState('');
  const [associados, setAssociados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    escolaSetorUnidade: '',
    data: '',
  });

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

  const adicionarHistorico = async (associadoId: string) => {
    if (!formData.escolaSetorUnidade || !formData.data) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      // Buscar associado atual
      const resGet = await fetch(`/api/associados/${associadoId}`);
      const { associado } = await resGet.json();

      // Adicionar novo histórico
      const historicoAtual = associado.historico_funcional || [];
      const novoHistorico = {
        movimentacoes: [
          ...(historicoAtual.movimentacoes || []),
          {
            escolaSetorUnidade: formData.escolaSetorUnidade,
            data: formData.data,
          },
        ],
      };

      // Atualizar
      const res = await fetch(`/api/associados/${associadoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historico_funcional: novoHistorico,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar');
      }

      alert('Histórico adicionado com sucesso!');

      // Atualizar lista
      setAssociados(
        associados.map((a) =>
          a.id === associadoId
            ? { ...a, historico_funcional: novoHistorico }
            : a,
        ),
      );

      // Limpar form
      setFormData({ escolaSetorUnidade: '', data: '' });
    } catch (err) {
      alert('Erro ao adicionar histórico');
      console.error(err);
    }
  };

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Histórico Funcional
        </h1>
        <p className='mt-2 text-gray-600'>
          Adicione movimentações e alterações aos associados
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
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Adicionar Movimentação
          </h3>

          <div className='mb-6 space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Escola/Setor/Unidade
                </label>
                <input
                  type='text'
                  value={formData.escolaSetorUnidade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      escolaSetorUnidade: e.target.value,
                    })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Data
                </label>
                <input
                  type='date'
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            {associados.map((associado) => (
              <div
                key={associado.id}
                className='rounded-lg border border-gray-200 p-4'
              >
                <div className='mb-2 flex items-start justify-between'>
                  <div>
                    <h4 className='font-semibold text-gray-900'>
                      {associado.dados_pessoais.nomeCompleto}
                    </h4>
                    <p className='text-sm text-gray-600'>
                      CPF: {associado.dados_pessoais.cpf}
                    </p>
                  </div>
                  <button
                    onClick={() => adicionarHistorico(associado.id)}
                    className='rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700'
                  >
                    Adicionar
                  </button>
                </div>

                {associado.historico_funcional?.movimentacoes && (
                  <div className='mt-3 border-t border-gray-200 pt-3'>
                    <p className='mb-2 text-sm font-medium text-gray-700'>
                      Histórico:
                    </p>
                    <div className='space-y-1'>
                      {associado.historico_funcional.movimentacoes.map(
                        (mov: any, idx: number) => (
                          <p key={idx} className='text-sm text-gray-600'>
                            {mov.data} - {mov.escolaSetorUnidade}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
