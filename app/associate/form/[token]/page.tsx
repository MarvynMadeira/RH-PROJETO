// app/associate/[token]/page.tsx
'use client';
import { useState, useEffect, ReactNode, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';

import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
//import 'survey-core/defaultV2.min.css';

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}
const Button = ({
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false,
  title,
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-gray-400 ${className}`}
  >
    {children}
  </button>
);
const LoadingSpinner = () => (
  <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
);
const Card = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
    {children}
  </div>
);

const readFilesAsDataUrls = async (formData: any) => {
  const processedData = { ...formData };

  for (const key in processedData) {
    const value = processedData[key];

    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0].file instanceof File
    ) {
      processedData[key] = await Promise.all(
        value.map(async (fileInfo) => {
          if (fileInfo.content) return fileInfo;

          // Converte o File object para data: string (Base64)
          const content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result);
            reader.onerror = reject;
            reader.readAsDataURL(fileInfo.file);
          });

          return {
            name: fileInfo.name,
            type: fileInfo.type,
            content: content,
          };
        }),
      );
    }
  }
  return processedData;
};

// === 3. Componente Renderer do Formulário (FormRenderer) ===
// Componente que renderiza a SurveyJS Model
const FormRenderer = ({
  surveyJson,
  onFormSubmit,
  setFormInstance,
}: {
  surveyJson: any;
  onFormSubmit: (data: any) => void;
  setFormInstance: (instance: any) => void;
}) => {
  const survey = useMemo(() => new Model(surveyJson || {}), [surveyJson]);

  useEffect(() => {
    const handleComplete = (sender: any) => {
      onFormSubmit(sender.data);
    };
    survey.onComplete.add(handleComplete);

    setFormInstance({
      model: survey,
      readFilesAsDataUrls: readFilesAsDataUrls,
    });

    return () => {
      survey.onComplete.remove(handleComplete);
    };
  }, [survey, onFormSubmit, setFormInstance]);

  return (
    <div className='text-gray-900'>
      <Survey model={survey} />
    </div>
  );
};

export default function AssociateFormPage() {
  const params = useParams();
  const token = params.token as string;

  const [formDef, setFormDef] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [credentials, setCredentials] = useState<{
    username: string;
    password?: string;
  } | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const [formInstance, setFormInstance] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    const fetchFormDef = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/associate/form/${token}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.message ||
              'O link de acesso está inválido ou já foi usado.',
          );
        }
        const data = await response.json();
        setFormDef(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormDef();
  }, [token]);

  const handleFormSubmit = async (formData: any) => {
    if (!formInstance || !formInstance.readFilesAsDataUrls) {
      alert('Erro interno: O formulário não está pronto para o envio.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Processa uploads de arquivos
      const processedFormData =
        await formInstance.readFilesAsDataUrls(formData);

      // 2. Envio para a API
      const response = await fetch('/api/associate/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          formData: processedFormData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Ponto 1: Mensagem simples
        throw new Error(
          data.message || 'Houve uma falha ao enviar. Tente novamente.',
        );
      }

      setCredentials(data.credentials);
      setEmailSent(data.emailSent);
      setSubmitSuccess(true);
    } catch (err: any) {
      setError(`Falha no envio: ${err.message}. Tente recarregar a página.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Telas de Status ---

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        {/* Ponto 2: Fonte destacada/escura */}
        <div className='flex items-center text-gray-800'>
          <LoadingSpinner />
          <span className='ml-2 font-medium'>
            Carregando formulário de cadastro...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        <Card className='max-w-sm text-center'>
          <h2 className='text-2xl font-bold text-red-700'>
            Acesso Negado ou Inválido
          </h2>
          {/* Ponto 2: Fonte destacada/escura */}
          <p className='mt-2 font-medium text-gray-900'>{error}</p>
          <p className='mt-4 text-sm text-gray-700'>
            Verifique se o endereço (link) está correto ou se ele não expirou.
          </p>
        </Card>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
        <Card className='max-w-lg text-center'>
          {/* Ponto 2: Fonte destacada/escura */}
          <h1 className='text-3xl font-bold text-green-700'>
            Pronto! Cadastro Concluído com Sucesso.
          </h1>
          {/* Ponto 1 & 2: Mensagem simples e destacada */}
          <p className='mt-4 text-lg font-medium text-gray-900'>
            {emailSent
              ? 'Suas informações de acesso foram enviadas para o email que você cadastrou.'
              : 'Seu cadastro foi finalizado. Por favor, anote suas credenciais abaixo para acessar o sistema.'}
          </p>

          {credentials && credentials.password && (
            <div className='mt-6 rounded-lg border-2 border-green-300 bg-green-50 p-6 text-left'>
              {/* Ponto 2: Fonte destacada/escura */}
              <p className='text-xl text-gray-900'>
                <strong>Usuário:</strong> {credentials.username}
              </p>
              {/* Ponto 2: Fonte destacada/escura */}
              <p className='mt-2 text-xl text-gray-900'>
                <strong>Senha:</strong> {credentials.password}
              </p>
              <p className='mt-4 text-sm font-medium text-red-600'>
                IMPORTANTE: Guarde esta senha em um lugar seguro. Ela não será
                mostrada novamente.
              </p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // --- Tela Principal do Formulário ---
  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <Card className='mx-auto max-w-4xl'>
        <header className='border-b pb-4'>
          {/* Ponto 2: Título destacado/escuro */}
          <h1 className='text-3xl font-bold text-gray-900'>
            {formDef?.formName || 'Formulário de Cadastro'}
          </h1>
          {/* Ponto 2: Descrição destacada/escura */}
          <p className='mt-1 text-gray-700'>
            {formDef?.description ||
              'Preencha os campos abaixo para completar seu cadastro.'}
          </p>
        </header>
        <div className='mt-6'>
          {isSubmitting && (
            <div className='mb-4 flex items-center justify-center p-4 text-gray-800'>
              <Loader2 size={24} className='animate-spin' />
              <span className='ml-2 font-medium'>
                Enviando dados e criando seu acesso...
              </span>
            </div>
          )}
          {error && (
            <p className='mb-4 rounded-lg bg-red-100 p-4 font-medium text-red-700'>
              {error}
            </p>
          )}

          <FormRenderer
            surveyJson={formDef?.surveyJson}
            onFormSubmit={handleFormSubmit}
            setFormInstance={setFormInstance}
          />

          <div className='flex justify-end pt-6'>
            {/* Ponto 1: Mensagem simples sobre o botão */}
            <p className='text-sm text-gray-500'>
              O botão de "Enviar" aparecerá no final do formulário após
              preencher a última seção.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
