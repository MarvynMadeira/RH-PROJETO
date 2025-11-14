'use client';

import { useState } from 'react';
import { formatarCPF, formatarTelefone } from '@/lib/validations';

interface EditarAssociadoProps {
  associado: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function EditarAssociado({
  associado,
  onSave,
  onCancel,
}: EditarAssociadoProps) {
  const [dados, setDados] = useState(associado);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'pessoais' | 'funcional' | 'formacao'>(
    'pessoais',
  );

  const atualizarCampo = (path: string, valor: any) => {
    const keys = path.split('.');
    const newDados = { ...dados };
    let current = newDados;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = valor;
    setDados(newDados);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(dados);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='rounded-lg bg-white shadow'>
      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex'>
          <button
            onClick={() => setTab('pessoais')}
            className={`px-6 py-3 text-sm font-medium ${
              tab === 'pessoais'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setTab('funcional')}
            className={`px-6 py-3 text-sm font-medium ${
              tab === 'funcional'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Situação Funcional
          </button>
          <button
            onClick={() => setTab('formacao')}
            className={`px-6 py-3 text-sm font-medium ${
              tab === 'formacao'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Formação
          </button>
        </nav>
      </div>

      <div className='p-6'>
        {/* Dados Pessoais */}
        {tab === 'pessoais' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Nome Completo
                </label>
                <input
                  type='text'
                  value={dados.dados_pessoais.nomeCompleto}
                  onChange={(e) =>
                    atualizarCampo(
                      'dados_pessoais.nomeCompleto',
                      e.target.value,
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  CPF
                </label>
                <input
                  type='text'
                  value={formatarCPF(dados.dados_pessoais.cpf)}
                  disabled
                  className='w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Data de Nascimento
                </label>
                <input
                  type='date'
                  value={dados.dados_pessoais.dataNascimento}
                  onChange={(e) =>
                    atualizarCampo(
                      'dados_pessoais.dataNascimento',
                      e.target.value,
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  value={dados.dados_pessoais.contato.email}
                  onChange={(e) =>
                    atualizarCampo(
                      'dados_pessoais.contato.email',
                      e.target.value,
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Telefone
                </label>
                <input
                  type='tel'
                  value={dados.dados_pessoais.contato.telefone}
                  onChange={(e) =>
                    atualizarCampo(
                      'dados_pessoais.contato.telefone',
                      e.target.value,
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                />
              </div>
            </div>

            <div className='border-t pt-4'>
              <h4 className='text-md mb-3 font-semibold text-gray-900'>
                Endereço
              </h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    CEP
                  </label>
                  <input
                    type='text'
                    value={dados.dados_pessoais.endereco.cep}
                    onChange={(e) =>
                      atualizarCampo(
                        'dados_pessoais.endereco.cep',
                        e.target.value,
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Logradouro
                  </label>
                  <input
                    type='text'
                    value={dados.dados_pessoais.endereco.logradouro}
                    onChange={(e) =>
                      atualizarCampo(
                        'dados_pessoais.endereco.logradouro',
                        e.target.value,
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Número
                  </label>
                  <input
                    type='text'
                    value={dados.dados_pessoais.endereco.numero}
                    onChange={(e) =>
                      atualizarCampo(
                        'dados_pessoais.endereco.numero',
                        e.target.value,
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Bairro
                  </label>
                  <input
                    type='text'
                    value={dados.dados_pessoais.endereco.bairro}
                    onChange={(e) =>
                      atualizarCampo(
                        'dados_pessoais.endereco.bairro',
                        e.target.value,
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                  />
                </div>

                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Cidade
                  </label>
                  <input
                    type='text'
                    value={dados.dados_pessoais.endereco.cidade}
                    onChange={(e) =>
                      atualizarCampo(
                        'dados_pessoais.endereco.cidade',
                        e.target.value,
                      )
                    }
                    className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Situação Funcional */}
        {tab === 'funcional' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Forma de Ingresso
                </label>
                <input
                  type='text'
                  value={dados.situacao_funcional.formaIngresso}
                  disabled
                  className='w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Jornada de Trabalho (horas)
                </label>
                <input
                  type='number'
                  value={dados.situacao_funcional.jornadaTrabalho}
                  onChange={(e) =>
                    atualizarCampo(
                      'situacao_funcional.jornadaTrabalho',
                      parseInt(e.target.value),
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                />
              </div>
            </div>

            <div className='border-t pt-4'>
              <h4 className='text-md mb-3 font-semibold text-gray-900'>
                Matrículas
              </h4>
              <div className='space-y-3'>
                {dados.situacao_funcional.matriculas.map(
                  (mat: any, idx: number) => (
                    <div key={idx} className='rounded-lg bg-gray-50 p-4'>
                      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                        <div>
                          <label className='mb-1 block text-xs font-medium text-gray-700'>
                            Lotação
                          </label>
                          <input
                            type='text'
                            value={mat.lotacao}
                            onChange={(e) => {
                              const newMats = [
                                ...dados.situacao_funcional.matriculas,
                              ];
                              newMats[idx].lotacao = e.target.value;
                              atualizarCampo(
                                'situacao_funcional.matriculas',
                                newMats,
                              );
                            }}
                            className='w-full rounded border border-gray-300 px-2 py-1 text-sm'
                          />
                        </div>
                        <div>
                          <label className='mb-1 block text-xs font-medium text-gray-700'>
                            Matrícula
                          </label>
                          <input
                            type='text'
                            value={mat.numeroMatricula}
                            disabled
                            className='w-full rounded border border-gray-300 bg-gray-100 px-2 py-1 text-sm'
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Formação */}
        {tab === 'formacao' && (
          <div className='space-y-4'>
            <div>
              <h4 className='text-md mb-3 font-semibold text-gray-900'>
                Graduações
              </h4>
              <div className='space-y-3'>
                {dados.titulos_formacao.graduacoes.map(
                  (grad: any, idx: number) => (
                    <div key={idx} className='rounded-lg bg-gray-50 p-4'>
                      <p className='text-sm font-medium'>
                        {grad.nomeGraduacao}
                      </p>
                      <p className='text-xs text-gray-600'>
                        {grad.instituicao}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {new Date(grad.dataConclusao).toLocaleDateString(
                          'pt-BR',
                        )}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {dados.titulos_formacao.posGraduacoes?.length > 0 && (
              <div className='border-t pt-4'>
                <h4 className='text-md mb-3 font-semibold text-gray-900'>
                  Pós-Graduações
                </h4>
                <div className='space-y-3'>
                  {dados.titulos_formacao.posGraduacoes.map(
                    (pos: any, idx: number) => (
                      <div key={idx} className='rounded-lg bg-gray-50 p-4'>
                        <p className='text-sm font-medium'>
                          {pos.posGraduadoEm}
                        </p>
                        <p className='text-xs text-gray-600'>
                          {pos.instituicao}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className='mt-6 flex justify-end gap-3 border-t pt-6'>
          <button
            onClick={onCancel}
            className='rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50'
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className='rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50'
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
