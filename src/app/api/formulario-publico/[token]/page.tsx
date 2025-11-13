'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { officialFormSurveyJSON } from '@/schemas/officialForm';

export default function FormularioPublicoPage() {
  const params = useParams();
  const router = useRouter();
  const [valid, setValid] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const verificarLink = async () => {
      try {
        const res = await fetch(
          `/api/formularios/link-publico?token=${params?.token}`,
        );
        const data = await res.json();

        if (!res.ok) {
          setValid(false);
          return;
        }

        setValid(data.valid);
        setAdminId(data.adminId);
      } catch (err) {
        setValid(false);
      }
    };

    verificarLink();
  }, [params?.token]);

  const handleComplete = async (sender: Model) => {
    setSubmitting(true);

    try {
      const data = sender.data;

      // Upload de arquivos para S3
      const uploadedData = await uploadFiles(data);

      // Salvar associado
      const res = await fetch('/api/associados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadedData),
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar');
      }

      alert('Cadastro realizado com sucesso!');
      router.push('/');
    } catch (err) {
      alert('Erro ao enviar formulário');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFiles = async (data: any) => {
    // Helper para fazer upload de arquivos
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

    // Clonar dados
    const newData = JSON.parse(JSON.stringify(data));

    // Upload de todos os arquivos (RG, comprovantes, etc)
    if (data.dadosPessoais?.endereco?.comprovacaoResidencia?.[0]) {
      newData.dadosPessoais.endereco.comprovacaoResidencia = await uploadFile(
        data.dadosPessoais.endereco.comprovacaoResidencia[0],
      );
    }

    if (data.dadosPessoais?.rgAnexoFrente?.[0]) {
      newData.dadosPessoais.rgAnexoFrente = await uploadFile(
        data.dadosPessoais.rgAnexoFrente[0],
      );
    }

    if (data.dadosPessoais?.rgAnexoTras?.[0]) {
      newData.dadosPessoais.rgAnexoTras = await uploadFile(
        data.dadosPessoais.rgAnexoTras[0],
      );
    }

    if (data.dadosPessoais?.certificadoReservista?.[0]) {
      newData.dadosPessoais.certificadoReservista = await uploadFile(
        data.dadosPessoais.certificadoReservista[0],
      );
    }

    if (data.responsavel?.assinatura?.[0]) {
      newData.responsavel.assinatura = await uploadFile(
        data.responsavel.assinatura[0],
      );
    }

    // Graduações
    if (data.titulosFormacao?.graduacoes) {
      newData.titulosFormacao.graduacoes = await Promise.all(
        data.titulosFormacao.graduacoes.map(async (grad: any) => {
          if (grad.certificado?.[0]) {
            return {
              ...grad,
              certificado: await uploadFile(grad.certificado[0]),
            };
          }
          return grad;
        }),
      );
    }

    return newData;
  };

  if (valid === null) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-16 w-16 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow'>
          <div className='mb-4 text-red-600'>
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
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-2xl font-bold text-gray-900'>
            Link Inválido
          </h2>
          <p className='text-gray-600'>
            Este link expirou ou não é válido. Entre em contato com o
            administrador para obter um novo link.
          </p>
        </div>
      </div>
    );
  }

  const survey = new Model(officialFormSurveyJSON);
  survey.onComplete.add(handleComplete);

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='mx-auto max-w-4xl px-4'>
        <div className='rounded-lg bg-white p-6 shadow'>
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Formulário de Cadastro de Associado
            </h1>
            <p className='mt-2 text-gray-600'>
              Preencha todos os campos obrigatórios com atenção
            </p>
          </div>

          {submitting ? (
            <div className='py-12 text-center'>
              <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600'></div>
              <p className='text-gray-600'>Enviando formulário...</p>
            </div>
          ) : (
            <Survey model={survey} />
          )}
        </div>
      </div>
    </div>
  );
}
