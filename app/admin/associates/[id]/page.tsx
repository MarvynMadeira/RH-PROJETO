'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AssociateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [associate, setAssociate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const [activeTab, setActiveTab] = useState<'dados' | 'historico' | 'status'>(
    'dados',
  );

  useEffect(() => {
    loadAssociate();
  }, [params.id]);

  const loadAssociate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/associates/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar associado');
      }

      const data = await response.json();
      setAssociate(data);
      setEditData(data.formData || {});
    } catch (error) {
      console.error('Erro ao carregar associado:', error);
      setAssociate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/associates/${params.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: editData }),
      });

      if (response.ok) {
        alert('Dados atualizados com sucesso!');
        setEditing(false);
        loadAssociate();
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações');
    }
  };

  const handleInactivate = async () => {
    const reason = prompt('Motivo da desvinculação:');
    if (!reason || reason.trim() === '') {
      alert('O motivo é obrigatório para desvincular.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/associates/${params.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'inactive',
          inactiveReason: reason,
        }),
      });

      if (response.ok) {
        alert('Associado desvinculado com sucesso');
        loadAssociate();
      } else {
        throw new Error('Falha ao desvincular');
      }
    } catch (error) {
      console.error('Erro ao desvincular associado:', error);
      alert('Erro ao desvincular associado');
    }
  };

  const handleReactivate = async () => {
    if (!confirm('Deseja reativar este associado?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/associates/${params.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'active',
          inactiveReason: null,
        }),
      });

      if (response.ok) {
        alert('Associado reativado com sucesso');
        loadAssociate();
      } else {
        throw new Error('Falha ao reativar');
      }
    } catch (error) {
      console.error('Erro ao reativar associado:', error);
      alert('Erro ao reativar associado');
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!associate) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='mb-4 text-red-600'>
            Associado não encontrado ou erro ao carregar.
          </p>
          <Link
            href='/admin/associates'
            className='text-blue-600 hover:text-blue-700'
          >
            ← Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Link
                href='/admin/associates'
                className='text-gray-600 hover:text-gray-900'
              >
                ← Voltar
              </Link>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {associate.formData?.dadosPessoais?.nomeCompleto ||
                    associate.username}
                </h1>
                <p className='text-sm text-gray-600'>@{associate.username}</p>
              </div>
            </div>
            <div className='flex gap-2'>
              {!editing && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className='rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
                  >
                    Editar Dados
                  </button>
                  {associate.status === 'active' ? (
                    <button
                      onClick={handleInactivate}
                      className='rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700'
                    >
                      Desvincular
                    </button>
                  ) : (
                    <button
                      onClick={handleReactivate}
                      className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
                    >
                      Reativar
                    </button>
                  )}
                </>
              )}
              {editing && (
                <>
                  <button
                    onClick={handleSave}
                    className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditData(associate.formData);
                    }}
                    className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50'
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        {/* Status Badge */}
        <div className='mb-6'>
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
              associate.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {associate.status === 'active' ? '✓ Ativo' : '✕ Desvinculado'}
            {associate.status === 'inactive' && associate.inactiveReason && (
              <span className='ml-2 text-xs'>({associate.inactiveReason})</span>
            )}
          </span>
        </div>

        {/* Tabs */}
        <div className='rounded-t-xl bg-white shadow'>
          <div className='border-b'>
            <div className='flex'>
              <button
                onClick={() => setActiveTab('dados')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'dados'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dados Pessoais e Funcionais
              </button>
              <button
                onClick={() => setActiveTab('historico')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'historico'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Histórico Funcional
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'status'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Status
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'dados' && (
              <DadosTab
                data={editing ? editData : associate.formData}
                editing={editing}
                onChange={setEditData}
              />
            )}

            {activeTab === 'historico' && (
              <HistoricoTab
                associateId={params.id}
                data={associate.formData?.historicoFuncional}
              />
            )}

            {activeTab === 'status' && (
              <StatusTab
                associateId={params.id}
                data={associate.formData?.status}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DadosTab({
  data,
  editing,
  onChange,
}: {
  data: any;
  editing: boolean;
  onChange: (data: any) => void;
}) {
  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(data || {})); // Deep copy
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onChange(newData);
  };

  const renderField = (label: string, path: string, value: any) => {
    if (editing) {
      return (
        <div className='mb-4'>
          <label className='mb-1 block text-sm font-medium text-gray-700'>
            {label}
          </label>
          <input
            type='text'
            value={value || ''}
            onChange={(e) => updateField(path, e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500'
          />
        </div>
      );
    }
    return (
      <div className='mb-4'>
        <dt className='text-sm font-medium text-gray-600'>{label}</dt>
        <dd className='mt-1 text-sm text-gray-900'>{value || '-'}</dd>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* 1. Dados Pessoais */}
      <div>
        <h3 className='mb-4 border-b pb-2 text-lg font-bold text-gray-900'>
          1. Dados Pessoais
        </h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {renderField(
            'Nome Completo',
            'dadosPessoais.nomeCompleto',
            data?.dadosPessoais?.nomeCompleto,
          )}
          {renderField(
            'Data de Nascimento',
            'dadosPessoais.dataNascimento',
            data?.dadosPessoais?.dataNascimento,
          )}
          {renderField(
            'Naturalidade',
            'dadosPessoais.naturalidade',
            data?.dadosPessoais?.naturalidade,
          )}
          {renderField('CPF', 'dadosPessoais.cpf', data?.dadosPessoais?.cpf)}
          {renderField('RG', 'dadosPessoais.rg', data?.dadosPessoais?.rg)}
          {renderField(
            'Órgão Expedidor',
            'dadosPessoais.orgaoExpedidor',
            data?.dadosPessoais?.orgaoExpedidor,
          )}
          {renderField(
            'Nome da Mãe',
            'dadosPessoais.vinculacaoParental.nomeMae',
            data?.dadosPessoais?.vinculacaoParental?.nomeMae,
          )}
          {renderField(
            'Nome do Pai',
            'dadosPessoais.vinculacaoParental.nomePai',
            data?.dadosPessoais?.vinculacaoParental?.nomePai,
          )}
          {renderField(
            'Estado Civil',
            'dadosPessoais.estadoCivil',
            data?.dadosPessoais?.estadoCivil,
          )}
          {renderField(
            'PIS/PASEP',
            'dadosPessoais.pisPasep',
            data?.dadosPessoais?.pisPasep,
          )}
          {renderField(
            'Email',
            'dadosPessoais.contato.email',
            data?.dadosPessoais?.contato?.email,
          )}
          {renderField(
            'Telefone',
            'dadosPessoais.contato.telefone',
            data?.dadosPessoais?.contato?.telefone,
          )}
        </div>
        {/* Endereço */}
        <h4 className='text-md mt-6 mb-3 font-semibold text-gray-800'>
          Endereço
        </h4>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {renderField(
            'CEP',
            'dadosPessoais.endereco.cep',
            data?.dadosPessoais?.endereco?.cep,
          )}
          {renderField(
            'Logradouro',
            'dadosPessoais.endereco.logradouro',
            data?.dadosPessoais?.endereco?.logradouro,
          )}
          {renderField(
            'Número',
            'dadosPessoais.endereco.numero',
            data?.dadosPessoais?.endereco?.numero,
          )}
          {renderField(
            'Complemento',
            'dadosPessoais.endereco.complemento',
            data?.dadosPessoais?.endereco?.complemento,
          )}
          {renderField(
            'Bairro',
            'dadosPessoais.endereco.bairro',
            data?.dadosPessoais?.endereco?.bairro,
          )}
          {renderField(
            'Cidade',
            'dadosPessoais.endereco.cidade',
            data?.dadosPessoais?.endereco?.cidade,
          )}
          {renderField(
            'Estado',
            'dadosPessoais.endereco.estado',
            data?.dadosPessoais?.endereco?.estado,
          )}
        </div>

        {/* Dependentes (Read-only) */}
        {data?.dadosPessoais?.dependentes &&
          data.dadosPessoais.dependentes.length > 0 && (
            <>
              <h4 className='text-md mt-6 mb-3 font-semibold text-gray-800'>
                Dependentes
              </h4>
              {data.dadosPessoais.dependentes.map((dep: any, idx: number) => (
                <div key={idx} className='mb-3 rounded-lg bg-gray-50 p-4'>
                  <p className='font-medium'>{dep.nome}</p>
                  <p className='text-sm text-gray-600'>CPF: {dep.cpf}</p>
                  <p className='text-sm text-gray-600'>
                    Nascimento: {dep.dataNascimento}
                  </p>
                </div>
              ))}
            </>
          )}
      </div>

      {/* 2. Situação Funcional */}
      <div>
        <h3 className='mb-4 border-b pb-2 text-lg font-bold text-gray-900'>
          2. Situação Funcional
        </h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {renderField(
            'Forma de Ingresso',
            'situacaoFuncional.formaIngresso',
            data?.situacaoFuncional?.formaIngresso,
          )}
          {renderField(
            'Nº Diário Oficial',
            'situacaoFuncional.numeroDiarioOficial',
            data?.situacaoFuncional?.numeroDiarioOficial,
          )}
          {renderField(
            'Data de Posse',
            'situacaoFuncional.dataPosse',
            data?.situacaoFuncional?.dataPosse,
          )}
          {renderField(
            'Jornada de Trabalho (h)',
            'situacaoFuncional.jornadaTrabalho',
            data?.situacaoFuncional?.jornadaTrabalho,
          )}
        </div>

        {/* Matrículas (Read-only) */}
        {data?.situacaoFuncional?.matriculas &&
          data.situacaoFuncional.matriculas.length > 0 && (
            <>
              <h4 className='text-md mt-6 mb-3 font-semibold text-gray-800'>
                Matrículas
              </h4>
              {data.situacaoFuncional.matriculas.map(
                (mat: any, idx: number) => (
                  <div key={idx} className='mb-3 rounded-lg bg-gray-50 p-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-600'>Lotação</p>
                        <p className='font-medium'>{mat.lotacao}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Cargo/Função</p>
                        <p className='font-medium'>{mat.cargoFuncao}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-600'>Matrícula</p>
                        <p className='font-medium'>{mat.numeroMatricula}</p>
                      </div>
                      {mat.areaDisciplina && (
                        <div>
                          <p className='text-sm text-gray-600'>
                            Área/Disciplina
                          </p>
                          <p className='font-medium'>{mat.areaDisciplina}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </>
          )}
      </div>

      {/* 3. Títulos de Formação (Read-only) */}
      <div>
        <h3 className='mb-4 border-b pb-2 text-lg font-bold text-gray-900'>
          3. Títulos de Formação
        </h3>
        {/* Graduações */}
        {data?.titulosFormacao?.graduacoes &&
          data.titulosFormacao.graduacoes.length > 0 && (
            <>
              <h4 className='text-md mb-3 font-semibold text-gray-800'>
                Graduação
              </h4>
              {data.titulosFormacao.graduacoes.map((grad: any, idx: number) => (
                <div key={idx} className='mb-3 rounded-lg bg-gray-50 p-4'>
                  <p className='font-medium'>{grad.nomeGraduacao}</p>
                  <p className='text-sm text-gray-600'>
                    {grad.instituicao} - Conclusão: {grad.dataConclusao}
                  </p>
                </div>
              ))}
            </>
          )}
        {/* Pós-Graduações */}
        {data?.titulosFormacao?.posGraduacoes &&
          data.titulosFormacao.posGraduacoes.length > 0 && (
            <>
              <h4 className='text-md mt-4 mb-3 font-semibold text-gray-800'>
                Pós-Graduação
              </h4>
              {data.titulosFormacao.posGraduacoes.map(
                (pos: any, idx: number) => (
                  <div key={idx} className='mb-3 rounded-lg bg-gray-50 p-4'>
                    <p className='font-medium'>{pos.posGraduadoEm}</p>
                    <p className='text-sm text-gray-600'>
                      {pos.instituicao} - {pos.dataConclusao}
                    </p>
                  </div>
                ),
              )}
            </>
          )}
      </div>

      {/* Campos Customizados (Read-only) */}
      {data?.customFields && Object.keys(data.customFields).length > 0 && (
        <div>
          <h3 className='mb-4 border-b pb-2 text-lg font-bold text-gray-900'>
            Campos Customizados
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {Object.entries(data.customFields).map(([key, value]) => (
              <div key={key} className='mb-4'>
                <dt className='text-sm font-medium text-gray-600'>{key}</dt>
                <dd className='mt-1 text-sm text-gray-900'>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </dd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoricoTab({
  associateId,
  data,
}: {
  associateId: string;
  data: any;
}) {
  const [editing, setEditing] = useState(false);
  const [historico, setHistorico] = useState(
    data || { movimentacoes: [], alteracoesCargaHoraria: [] },
  );

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/associates/${associateId}/historico`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historico),
        },
      );
      if (response.ok) {
        alert('Histórico atualizado com sucesso!');
        setEditing(false);
      } else {
        throw new Error('Falha ao salvar histórico');
      }
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      alert('Erro ao salvar histórico');
    }
  };

  const addMovimentacao = () => {
    setHistorico({
      ...historico,
      movimentacoes: [
        ...(historico.movimentacoes || []),
        { escolaSetorUnidade: '', data: '' },
      ],
    });
  };

  const addAlteracaoCarga = () => {
    setHistorico({
      ...historico,
      alteracoesCargaHoraria: [
        ...(historico.alteracoesCargaHoraria || []),
        { de: 0, para: 0, dataAlteracao: '' },
      ],
    });
  };

  const formatDataDisplay = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold text-gray-900'>Histórico Funcional</h3>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className='rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
          >
            {data ? 'Editar' : 'Adicionar Histórico'}
          </button>
        ) : (
          <div className='flex gap-2'>
            <button
              onClick={handleSave}
              className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setHistorico(
                  data || { movimentacoes: [], alteracoesCargaHoraria: [] },
                );
              }}
              className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50'
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Movimentações */}
      <div>
        <div className='mb-3 flex items-center justify-between'>
          <h4 className='text-md font-semibold text-gray-800'>Movimentações</h4>
          {editing && (
            <button
              onClick={addMovimentacao}
              className='rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 transition hover:bg-blue-200'
            >
              + Adicionar
            </button>
          )}
        </div>

        {historico.movimentacoes && historico.movimentacoes.length > 0 ? (
          historico.movimentacoes.map((mov: any, idx: number) => (
            <div key={idx} className='mb-3 rounded-lg bg-gray-50 p-4'>
              {editing ? (
                <div className='grid grid-cols-2 gap-3'>
                  <input
                    type='text'
                    value={mov.escolaSetorUnidade}
                    onChange={(e) => {
                      const newMovs = [...historico.movimentacoes];
                      newMovs[idx].escolaSetorUnidade = e.target.value;
                      setHistorico({
                        ...historico,
                        movimentacoes: newMovs,
                      });
                    }}
                    placeholder='Escola/Setor/Unidade'
                    className='rounded-lg border border-gray-300 px-3 py-2'
                  />
                  <input
                    type='date'
                    value={mov.data}
                    onChange={(e) => {
                      const newMovs = [...historico.movimentacoes];
                      newMovs[idx].data = e.target.value;
                      setHistorico({
                        ...historico,
                        movimentacoes: newMovs,
                      });
                    }}
                    className='rounded-lg border border-gray-300 px-3 py-2'
                  />
                </div>
              ) : (
                <>
                  <p className='font-medium'>{mov.escolaSetorUnidade}</p>
                  <p className='text-sm text-gray-600'>
                    Data: {formatDataDisplay(mov.data)}
                  </p>
                </>
              )}
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-500'>
            Nenhuma movimentação registrada
          </p>
        )}
      </div>

      {/* Alterações de Carga Horária */}
      <div>
        <div className='mb-3 flex items-center justify-between'>
          <h4 className='text-md font-semibold text-gray-800'>
            Alterações de Carga Horária
          </h4>
          {editing && (
            <button
              onClick={addAlteracaoCarga}
              className='rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 transition hover:bg-blue-200'
            >
              + Adicionar
            </button>
          )}
        </div>

        {historico.alteracoesCargaHoraria &&
        historico.alteracoesCargaHoraria.length > 0 ? (
          historico.alteracoesCargaHoraria.map((alt: any, idx: number) => (
            <div key={idx} className='mb-3 rounded-lg bg-gray-50 p-4'>
              {editing ? (
                <div className='grid grid-cols-3 gap-3'>
                  <input
                    type='number'
                    value={alt.de}
                    onChange={(e) => {
                      const newAlts = [...historico.alteracoesCargaHoraria];
                      newAlts[idx].de = parseInt(e.target.value);
                      setHistorico({
                        ...historico,
                        alteracoesCargaHoraria: newAlts,
                      });
                    }}
                    placeholder='De (horas)'
                    className='rounded-lg border border-gray-300 px-3 py-2'
                  />
                  <input
                    type='number'
                    value={alt.para}
                    onChange={(e) => {
                      const newAlts = [...historico.alteracoesCargaHoraria];
                      newAlts[idx].para = parseInt(e.target.value);
                      setHistorico({
                        ...historico,
                        alteracoesCargaHoraria: newAlts,
                      });
                    }}
                    placeholder='Para (horas)'
                    className='rounded-lg border border-gray-300 px-3 py-2'
                  />
                  <input
                    type='date'
                    value={alt.dataAlteracao}
                    onChange={(e) => {
                      const newAlts = [...historico.alteracoesCargaHoraria];
                      newAlts[idx].dataAlteracao = e.target.value;
                      setHistorico({
                        ...historico,
                        alteracoesCargaHoraria: newAlts,
                      });
                    }}
                    className='rounded-lg border border-gray-300 px-3 py-2'
                  />
                </div>
              ) : (
                <>
                  <p className='font-medium'>
                    {alt.de}h semanais → {alt.para}h semanais
                  </p>
                  <p className='text-sm text-gray-600'>
                    Data: {formatDataDisplay(alt.dataAlteracao)}
                  </p>
                </>
              )}
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-500'>
            Nenhuma alteração de carga horária registrada
          </p>
        )}
      </div>
    </div>
  );
}

// --- Component: Status Tab ---
function StatusTab({ associateId, data }: { associateId: string; data: any }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(
    data || {
      estagioProbatorio: 'em_andamento',
      periodosAvaliacoes: [],
      estadoAtual: 'vinculado',
      desvinculacao: { data: '', observacoes: '' }, // Garante o objeto
    },
  );

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/admin/associates/${associateId}/status`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(status),
        },
      );
      if (response.ok) {
        alert('Status atualizado com sucesso!');
        setEditing(false);
        window.location.reload(); // Recarrega a página para refletir (simples)
      } else {
        throw new Error('Falha ao salvar status');
      }
    } catch (error) {
      console.error('Erro ao salvar status:', error);
      alert('Erro ao salvar status');
    }
  };

  const addPeriodoAvaliacao = () => {
    setStatus({
      ...status,
      periodosAvaliacoes: [
        ...(status.periodosAvaliacoes || []),
        { data: '', observacoes: '' },
      ],
    });
  };

  const formatDataDisplay = (dateString: string) => {
    if (!dateString) return '-';
    // Adiciona 1 dia para corrigir problemas de fuso horário (input date é local)
    const date = new Date(dateString);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold text-gray-900'>Status do Associado</h3>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className='rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
          >
            {data ? 'Editar' : 'Adicionar Status'}
          </button>
        ) : (
          <div className='flex gap-2'>
            <button
              onClick={handleSave}
              className='rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700'
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setStatus(
                  data || {
                    estagioProbatorio: 'em_andamento',
                    periodosAvaliacoes: [],
                    estadoAtual: 'vinculado',
                    desvinculacao: { data: '', observacoes: '' },
                  },
                );
              }}
              className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50'
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Estágio Probatório */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Estágio Probatório
        </label>
        {editing ? (
          <select
            value={status.estagioProbatorio}
            onChange={(e) =>
              setStatus({ ...status, estagioProbatorio: e.target.value })
            }
            className='w-full rounded-lg border border-gray-300 px-3 py-2'
          >
            <option value='aprovado'>Aprovado</option>
            <option value='em_andamento'>Em Andamento</option>
            <option value='reprovado'>Reprovado</option>
            {/* CORREÇÃO: Sintaxe da tag <option> */}
            <option value='suspenso'>Suspenso</option>
          </select>
        ) : (
          <p className='text-sm text-gray-900'>
            {status.estagioProbatorio === 'aprovado' && '✓ Aprovado'}
            {status.estagioProbatorio === 'em_andamento' && '⏳ Em Andamento'}
            {status.estagioProbatorio === 'reprovado' && '✕ Reprovado'}
            {status.estagioProbatorio === 'suspenso' && '⏸ Suspenso'}
          </p>
        )}
      </div>

      {/* Períodos de Avaliações */}
      <div>
        <div className='mb-3 flex items-center justify-between'>
          <h4 className='text-md font-semibold text-gray-800'>
            Períodos de Avaliações
          </h4>
          {editing && (
            <button
              onClick={addPeriodoAvaliacao}
              className='rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 transition hover:bg-blue-200'
            >
              + Adicionar Período
            </button>
          )}
        </div>

        {status.periodosAvaliacoes && status.periodosAvaliacoes.length > 0 ? (
          status.periodosAvaliacoes.map((periodo: any, idx: number) => (
            <div key={idx} className='mb-3 rounded-lg bg-gray-50 p-4'>
              {editing ? (
                <div className='space-y-2'>
                  <input
                    type='date'
                    value={periodo.data}
                    onChange={(e) => {
                      const newPeriodos = [...status.periodosAvaliacoes];
                      newPeriodos[idx].data = e.target.value;
                      setStatus({ ...status, periodosAvaliacoes: newPeriodos });
                    }}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2'
                  />
                  <textarea
                    value={periodo.observacoes}
                    onChange={(e) => {
                      const newPeriodos = [...status.periodosAvaliacoes];
                      newPeriodos[idx].observacoes = e.target.value;
                      setStatus({ ...status, periodosAvaliacoes: newPeriodos });
                    }}
                    placeholder='Observações (opcional)'
                    rows={2}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2'
                  />
                </div>
              ) : (
                <>
                  <p className='font-medium'>
                    {formatDataDisplay(periodo.data)}
                  </p>
                  {periodo.observacoes && (
                    <p className='mt-1 text-sm text-gray-600'>
                      {periodo.observacoes}
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-500'>
            Nenhum período de avaliação registrado
          </p>
        )}
      </div>

      {/* Estado Atual */}
      <div>
        <label className='mb-2 block text-sm font-medium text-gray-700'>
          Estado Atual
        </label>
        {editing ? (
          <>
            <div className='mb-4 space-y-2'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  value='vinculado'
                  checked={status.estadoAtual === 'vinculado'}
                  onChange={(e) =>
                    setStatus({ ...status, estadoAtual: e.target.value })
                  }
                  className='mr-2'
                />
                Vinculado
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  value='desvinculado'
                  checked={status.estadoAtual === 'desvinculado'}
                  onChange={(e) =>
                    setStatus({ ...status, estadoAtual: e.target.value })
                  }
                  className='mr-2'
                />
                Desvinculado
              </label>
            </div>

            {status.estadoAtual === 'desvinculado' && (
              <div className='space-y-3 rounded-lg bg-yellow-50 p-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Data da Desvinculação
                  </label>
                  <input
                    type='date'
                    value={status.desvinculacao?.data || ''}
                    onChange={(e) =>
                      setStatus({
                        ...status,
                        desvinculacao: {
                          ...status.desvinculacao,
                          data: e.target.value,
                        },
                      })
                    }
                    className='w-full rounded-lg border border-gray-300 px-3 py-2'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Observações/Motivo
                  </label>
                  <textarea
                    value={status.desvinculacao?.observacoes || ''}
                    onChange={(e) =>
                      setStatus({
                        ...status,
                        desvinculacao: {
                          ...status.desvinculacao,
                          observacoes: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2'
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className='mb-2 text-sm text-gray-900'>
              {status.estadoAtual === 'vinculado'
                ? '✓ Vinculado'
                : '✕ Desvinculado'}
            </p>
            {status.estadoAtual === 'desvinculado' &&
              status.desvinculacao?.data && (
                <div className='rounded-lg bg-red-50 p-4'>
                  <p className='mb-2 text-sm font-medium text-red-900'>
                    Data: {formatDataDisplay(status.desvinculacao.data)}
                  </p>
                  <p className='text-sm text-red-800'>
                    {status.desvinculacao.observacoes}
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
