'use client';

import { useState, useEffect } from 'react';

export default function GerarRequisicaoPage() {
  const [view, setView] = useState<'criar' | 'minhas'>('criar');
  const [requisicoes, setRequisicoes] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState('');
  const [cpfs, setCpfs] = useState('');
  const [associados, setAssociados] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [novaReq, setNovaReq] = useState({
    nome: '',
    descricao: '',
    campos: [{ label: '', tipo: 'text' }],
  });

  useEffect(() => {
    carregarRequisicoes();
  }, []);

  const carregarRequisicoes = async () => {
    try {
      const res = await fetch('/api/formularios/requisicao');
      const data = await res.json();
      setRequisicoes(data.requisicoes || []);
    } catch (err) {
      console.error('Erro ao carregar requisições:', err);
    }
  };

  const criarRequisicao = async () => {
    if (!novaReq.nome) {
      alert('Nome da requisição é obrigatório');
      return;
    }

    setLoading(true);

    try {
      // Criar survey JSON simples
      const surveyJson = {
        title: novaReq.nome,
        description: novaReq.descricao,
        pages: [
          {
            elements: novaReq.campos.map((campo) => ({
              type: campo.tipo,
              name: campo.label.toLowerCase().replace(/\s/g, '_'),
              title: campo.label,
              isRequired: true,
            })),
          },
        ],
      };

      const res = await fetch('/api/formularios/requisicao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novaReq.nome,
          descricao: novaReq.descricao,
          surveyJson,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar requisição');
      }

      alert('Requisição criada!');
      setNovaReq({
        nome: '',
        descricao: '',
        campos: [{ label: '', tipo: 'text' }],
      });
      carregarRequisicoes();
      setView('minhas');
    } catch (err) {
      alert('Erro ao criar requisição');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const gerarTokens = async () => {
    if (!selectedReq || associados.length === 0) {
      alert('Selecione uma requisição e busque os associados');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/formularios/requisicao/gerar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requisicaoId: selectedReq,
          associadoIds: associados.map((a) => a.id),
        }),
      });

      const data = await res.json();
      setTokens(data.tokens || []);
      alert('Links gerados com sucesso!');
    } catch (err) {
      alert('Erro ao gerar links');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletarRequisicao = async (id: string) => {
    if (!confirm('Deseja realmente deletar esta requisição?')) return;

    try {
      const res = await fetch(`/api/formularios/requisicao?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erro ao deletar');
      }

      alert('Requisição deletada!');
      carregarRequisicoes();
    } catch (err) {
      alert('Erro ao deletar requisição');
      console.error(err);
    }
  };

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Gerar Requisição</h1>
        <p className='mt-2 text-gray-600'>
          Crie requisições customizadas para seus associados
        </p>
      </div>

      <div className='mb-6 rounded-lg bg-white shadow'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex'>
            <button
              onClick={() => setView('criar')}
              className={`px-6 py-3 text-sm font-medium ${
                view === 'criar'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Criar Nova
            </button>
            <button
              onClick={() => setView('minhas')}
              className={`px-6 py-3 text-sm font-medium ${
                view === 'minhas'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Minhas Requisições
            </button>
          </nav>
        </div>

        <div className='p-6'>
          {view === 'criar' ? (
            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Nome da Requisição
                </label>
                <input
                  type='text'
                  value={novaReq.nome}
                  onChange={(e) =>
                    setNovaReq({ ...novaReq, nome: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Descrição (opcional)
                </label>
                <textarea
                  value={novaReq.descricao}
                  onChange={(e) =>
                    setNovaReq({ ...novaReq, descricao: e.target.value })
                  }
                  rows={3}
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Campos
                </label>
                {novaReq.campos.map((campo, idx) => (
                  <div key={idx} className='mb-2 flex gap-2'>
                    <input
                      type='text'
                      placeholder='Label do campo'
                      value={campo.label}
                      onChange={(e) => {
                        const newCampos = [...novaReq.campos];
                        newCampos[idx].label = e.target.value;
                        setNovaReq({ ...novaReq, campos: newCampos });
                      }}
                      className='flex-1 rounded-md border border-gray-300 px-3 py-2'
                    />
                    <select
                      value={campo.tipo}
                      onChange={(e) => {
                        const newCampos = [...novaReq.campos];
                        newCampos[idx].tipo = e.target.value;
                        setNovaReq({ ...novaReq, campos: newCampos });
                      }}
                      className='rounded-md border border-gray-300 px-3 py-2'
                    >
                      <option value='text'>Texto</option>
                      <option value='comment'>Texto Longo</option>
                      <option value='radiogroup'>Múltipla Escolha</option>
                      <option value='checkbox'>Checkbox</option>
                      <option value='file'>Arquivo</option>
                    </select>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setNovaReq({
                      ...novaReq,
                      campos: [...novaReq.campos, { label: '', tipo: 'text' }],
                    })
                  }
                  className='text-sm text-indigo-600 hover:text-indigo-700'
                >
                  + Adicionar Campo
                </button>
              </div>

              <button
                onClick={criarRequisicao}
                disabled={loading}
                className='rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50'
              >
                {loading ? 'Criando...' : 'Criar Requisição'}
              </button>
            </div>
          ) : (
            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Selecionar Requisição
                </label>
                <select
                  value={selectedReq}
                  onChange={(e) => setSelectedReq(e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                >
                  <option value=''>Selecione...</option>
                  {requisicoes.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  CPF(s) dos Associados
                </label>
                <input
                  type='text'
                  value={cpfs}
                  onChange={(e) => setCpfs(e.target.value)}
                  placeholder='123.456.789-00, 987.654.321-00'
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
                <button
                  onClick={buscarAssociados}
                  disabled={loading}
                  className='mt-2 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
                >
                  Buscar
                </button>
              </div>

              {associados.length > 0 && (
                <div>
                  <p className='mb-2 text-sm font-medium text-gray-700'>
                    Associados encontrados: {associados.length}
                  </p>
                  <button
                    onClick={gerarTokens}
                    disabled={loading}
                    className='rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700'
                  >
                    Gerar Links
                  </button>
                </div>
              )}

              {tokens.length > 0 && (
                <div className='mt-4 space-y-2'>
                  <p className='font-medium text-gray-900'>Links Gerados:</p>
                  {tokens.map((token, idx) => (
                    <div key={idx} className='rounded border bg-gray-50 p-3'>
                      <p className='mb-1 text-sm text-gray-600'>
                        Associado:{' '}
                        {
                          associados.find((a) => a.id === token.associadoId)
                            ?.dados_pessoais.nomeCompleto
                        }
                      </p>
                      <input
                        type='text'
                        value={token.link}
                        readOnly
                        className='w-full rounded border bg-white px-2 py-1 text-xs'
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className='mt-6 border-t pt-4'>
                <h4 className='mb-3 font-medium text-gray-900'>
                  Requisições Salvas:
                </h4>
                <div className='space-y-2'>
                  {requisicoes.map((req) => (
                    <div
                      key={req.id}
                      className='flex items-center justify-between rounded border p-3'
                    >
                      <div>
                        <p className='font-medium'>{req.nome}</p>
                        <p className='text-sm text-gray-600'>{req.descricao}</p>
                      </div>
                      <button
                        onClick={() => deletarRequisicao(req.id)}
                        className='rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50'
                      >
                        Deletar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
