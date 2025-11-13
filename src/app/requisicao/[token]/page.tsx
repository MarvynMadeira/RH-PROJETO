'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';

export default function RequisicaoPublicaPage() {
  const params = useParams();
  const router = useRouter();
  const [step, setStep] = useState<'cpf' | 'form' | 'success'>('cpf');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [requisicao, setRequisicao] = useState<any>(null);
  const [associado, setAssociado] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const validarCPF = async () => {
    if (!cpf.trim()) {
      alert('Digite seu CPF');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/requisicao/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params?.token,
          cpf,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao validar');
      }

      setRequisicao(data.requisicao);
      setAssociado(data.associado);
      setStep('form');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (sender: Model) => {
    setSubmitting(true);

    try {
      const data = sender.data;

      // Upload de arquivos se houver
      const uploadedData = await uploadFiles(data);

      // Buscar associado atual
      const resGet = await fetch(`/api/associados/${associado.id}`);
      const { associado: associadoAtual } = await resGet.json();

      // Adicionar nova requisição customizada
      const requisicoes = associadoAtual.requisicoes_customizadas || [];
      requisicoes.push({
        requisicao_id: requisicao.id,
        nome: requisicao.nome,
        data: new Date().toISOString(),
        respostas: uploadedData,
      });

      // Atualizar associado
      const resUpdate = await fetch(`/api/associados/${associado.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requisicoes_customizadas: requisicoes,
        }),
      });

      if (!resUpdate.ok) {
        throw new Error('Erro ao salvar');
      }

      // Marcar token como respondido
      await fetch(`/api/requisicao/${params?.token}/marcar-respondido`, {
        method: 'POST',
      });

      setStep('success');
    } catch (err) {
      alert('Erro ao enviar formulário');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFiles = async (data: any) => {
    const uploadFile = async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      return result.key;
    };

    const newData = JSON.parse(JSON.stringify(data));

    for (const key in data) {
      if (
        data[key] &&
        Array.isArray(data[key]) &&
        data[key][0] instanceof File
      ) {
        newData[key] = await uploadFile(data[key][0]);
      }
    }

    return newData;
  };

  if (step === 'cpf') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 shadow'>
          <div className='mb-6 text-center'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Validação de CPF
            </h2>
            <p className='mt-2 text-gray-600'>
              Digite seu CPF para acessar a requisição
            </p>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                CPF
              </label>
              <input
                type='text'
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder='000.000.000-00'
                className='w-full rounded-md border border-gray-300 px-4 py-2'
              />
            </div>

            <button
              onClick={validarCPF}
              disabled={loading}
              className='w-full rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50'
            >
              {loading ? 'Validando...' : 'Continuar'}
            </button>
          </div>

          <div className='mt-6 rounded-md border border-blue-200 bg-blue-50 p-4'>
            <p className='text-sm text-blue-800'>
              ℹ️ Digite o CPF que você cadastrou no sistema. Se houver algum
              problema, entre em contato com o administrador.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form' && requisicao) {
    const survey = new Model(requisicao.survey_json);
    survey.onComplete.add(handleComplete);

    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-4xl px-4'>
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-gray-900'>
                {requisicao.nome}
              </h1>
              {requisicao.descricao && (
                <p className='mt-2 text-gray-600'>{requisicao.descricao}</p>
              )}
              <p className='mt-2 text-sm text-gray-500'>
                Respondendo como: <strong>{associado.nome}</strong>
              </p>
            </div>

            {submitting ? (
              <div className='py-12 text-center'>
                <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600'></div>
                <p className='text-gray-600'>Enviando requisição...</p>
              </div>
            ) : (
              <Survey model={survey} />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow'>
          <div className='mb-4 text-green-600'>
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
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>
            Requisição Enviada!
          </h2>
          <p className='text-gray-600'>
            Suas respostas foram registradas com sucesso. Você pode fechar esta
            página.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
