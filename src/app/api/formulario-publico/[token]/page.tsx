'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import { officialFormSurveyJSON } from '@/schemas/officialForm';

interface PublicLinkResponse {
  valid: boolean;
  adminId?: string;
}

export default function FormularioPublicoPage() {
  const params = useParams();
  const router = useRouter();
  const [valid, setValid] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!params?.token) {
      setValid(false);
      return;
    }

    const verificarLink = async () => {
      try {
        const res = await fetch(
          `/api/formularios/link-publico?token=${params.token}`,
        );
        const data: PublicLinkResponse = await res.json();

        if (!res.ok || !data.valid) {
          setValid(false);
          return;
        }

        setValid(true);
        if (data.adminId) setAdminId(data.adminId);
      } catch (err) {
        console.error('Erro ao verificar link público:', err);
        setValid(false);
      }
    };

    verificarLink();
  }, [params?.token]);

  const handleComplete = async (sender: Model) => {
    setSubmitting(true);

    try {
      const data = sender.data;

      const uploadedData = await uploadFiles(data);

      const res = await fetch('/api/associados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadedData),
      });

      if (!res.ok) throw new Error('Erro ao salvar cadastro');

      alert('Cadastro realizado com sucesso!');
      router.push('/');
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      alert('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFiles = async (data: any) => {
    const uploadFile = async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Erro ao enviar arquivo');

        const result = await res.json();
        return result.key;
      } catch (err) {
        console.error('Erro no upload do arquivo:', err);
        return null; // Não quebra o envio se um arquivo falhar
      }
    };

    const newData = JSON.parse(JSON.stringify(data));

    const camposArquivos = [
      'dadosPessoais.endereco.comprovacaoResidencia',
      'dadosPessoais.rgAnexoFrente',
      'dadosPessoais.rgAnexoTras',
      'dadosPessoais.certificadoReservista',
      'responsavel.assinatura',
    ];

    for (const campo of camposArquivos) {
      const partes = campo.split('.');
      let ref = newData;
      for (let i = 0; i < partes.length - 1; i++) ref = ref[partes[i]];
      const ultimo = partes[partes.length - 1];

      if (ref?.[ultimo]?.[0]) {
        const key = await uploadFile(ref[ultimo][0]);
        if (key) ref[ultimo] = key;
      }
    }

    // Upload de graduações
    if (data.titulosFormacao?.graduacoes) {
      newData.titulosFormacao.graduacoes = await Promise.all(
        data.titulosFormacao.graduacoes.map(async (grad: any) => {
          if (grad.certificado?.[0]) {
            const key = await uploadFile(grad.certificado[0]);
            return key ? { ...grad, certificado: key } : grad;
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
