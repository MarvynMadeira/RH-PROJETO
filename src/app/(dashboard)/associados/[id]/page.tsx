'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AssociadoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [associado, setAssociado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [dadosEditados, setDadosEditados] = useState<any>(null);

  useEffect(() => {
    carregarAssociado();
  }, []);

  const carregarAssociado = async () => {
    try {
      const res = await fetch(`/api/associados/${params?.id}`);
      const data = await res.json();
      setAssociado(data.associado);
      setDadosEditados(data.associado);
    } catch (err) {
      console.error('Erro ao carregar associado:', err);
    } finally {
      setLoading(false);
    }
  };

  const salvarEdicao = async () => {
    try {
      const res = await fetch(`/api/associados/${params?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEditados),
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar');
      }

      alert('Dados atualizados!');
      setAssociado(dadosEditados);
      setEditando(false);
    } catch (err) {
      alert('Erro ao salvar alterações');
      console.error(err);
    }
  };

  const atualizarCampo = (path: string, valor: any) => {
    const pathArray = path.split('.');
    const newData = { ...dadosEditados };
    let current = newData;

    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }

    current[pathArray[pathArray.length - 1]] = valor;
    setDadosEditados(newData);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (!associado) {
    return (
      <div className='py-12 text-center'>
        <p className='text-gray-600'>Associado não encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-8 flex items-start justify-between'>
        <div>
          <button
            onClick={() => router.back()}
            className='mb-2 text-sm text-indigo-600 hover:text-indigo-700'
          >
            ← Voltar
          </button>
          <h1 className='text-3xl font-bold text-gray-900'>
            {associado.dados_pessoais.nomeCompleto}
          </h1>
          <p className='mt-1 text-gray-600'>
            CPF: {associado.dados_pessoais.cpf}
          </p>
        </div>

        <div className='space-x-2'>
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className='rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
            >
              Editar
            </button>
          ) : (
            <>
              <button
                onClick={salvarEdicao}
                className='rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700'
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditando(false);
                  setDadosEditados(associado);
                }}
                className='rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className='space-y-6'>
        {/* Dados Pessoais */}
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Dados Pessoais
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Data de Nascimento
              </label>
              {editando ? (
                <input
                  type='date'
                  value={dadosEditados.dados_pessoais.dataNascimento}
                  onChange={(e) =>
                    atualizarCampo(
                      'dados_pessoais.dataNascimento',
                      e.target.value,
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
              ) : (
                <p className='text-gray-900'>
                  {new Date(
                    associado.dados_pessoais.dataNascimento,
                  ).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Email
              </label>
              {editando ? (
                <input
                  type='email'
                  value={dadosEditados.dados_pessoais.contato.email}
                  onChange={(e) =>
                    atualizarCampo(
                      'dados_pessoais.contato.email',
                      e.target.value,
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
              ) : (
                <p className='text-gray-900'>
                  {associado.dados_pessoais.contato.email}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Telefone
              </label>
              {editando ? (
                <input
                  type='tel'
                  value={dadosEditados.dados_pessoais.contato.telefone}
                  onChange={(e) =>
                    atualizarCampo(
                      'dados_pessoais.contato.telefone',
                      e.target.value,
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                />
              ) : (
                <p className='text-gray-900'>
                  {associado.dados_pessoais.contato.telefone}
                </p>
              )}
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Endereço
              </label>
              <p className='text-sm text-gray-900'>
                {associado.dados_pessoais.endereco.logradouro},{' '}
                {associado.dados_pessoais.endereco.numero}
                <br />
                {associado.dados_pessoais.endereco.bairro},{' '}
                {associado.dados_pessoais.endereco.cidade} -{' '}
                {associado.dados_pessoais.endereco.estado}
              </p>
            </div>
          </div>
        </div>

        {/* Situação Funcional */}
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Situação Funcional
          </h3>
          <div className='space-y-3'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Forma de Ingresso
              </label>
              <p className='text-gray-900'>
                {associado.situacao_funcional.formaIngresso}
              </p>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Matrículas
              </label>
              <div className='space-y-2'>
                {associado.situacao_funcional.matriculas.map(
                  (mat: any, idx: number) => (
                    <div key={idx} className='rounded bg-gray-50 p-3'>
                      <p className='text-sm'>
                        <strong>Lotação:</strong> {mat.lotacao}
                      </p>
                      <p className='text-sm'>
                        <strong>Cargo:</strong> {mat.cargoFuncao}
                      </p>
                      <p className='text-sm'>
                        <strong>Número:</strong> {mat.numeroMatricula}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className='rounded-lg bg-white p-6 shadow'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>Status</h3>
          <div className='space-y-3'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Estágio Probatório
              </label>
              <p className='text-gray-900'>
                {associado.status?.estagioProbatorio || 'Não definido'}
              </p>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Estado Atual
              </label>
              <p className='text-gray-900'>
                {associado.status?.estadoAtual || 'Vinculado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
