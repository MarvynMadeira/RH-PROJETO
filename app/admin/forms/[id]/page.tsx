'use client';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

interface FormData {
  name: string;
  description: string;
  surveyJson: string;
}

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    surveyJson: '{}',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchForm = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(`/api/admin/forms/${formId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }); //
        if (!response.ok) throw new Error('Formulário não encontrado.');

        const data = await response.json();
        setFormData({
          name: data.form.name,
          description: data.form.description,
          surveyJson: JSON.stringify(data.form.surveyJson, null, 2),
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [formId],
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !formId) {
      router.push('/login');
      return;
    }
    fetchForm(token);
  }, [formId, router, fetchForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Autenticação expirou.');
      setIsSaving(false);
      return;
    }

    let parsedSurveyJson;
    try {
      parsedSurveyJson = JSON.parse(formData.surveyJson);
    } catch (jsonError) {
      setError('O Survey JSON é inválido e não pode ser salvo.');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/forms/${formId}`, {
        method: 'PUT', //
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          surveyJson: parsedSurveyJson,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Falha ao atualizar formulário.');
      }

      setSuccess('Formulário atualizado com sucesso!'); // [cite: 104]
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner />{' '}
        <span className='ml-2'>Carregando formulário...</span>
      </div>
    );
  }

  return (
    <div className='space-y-8 p-8'>
      <header className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-800'>Editar Formulário</h1>
        <Link href='/admin/forms' passHref>
          <Button className='flex items-center space-x-2 bg-gray-500 hover:bg-gray-600'>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Button>
        </Link>
      </header>

      <hr className='border-gray-200' />

      <div className='mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <p className='rounded-lg bg-red-100 p-4 text-red-700'>{error}</p>
          )}
          {success && (
            <p className='rounded-lg bg-green-100 p-4 text-green-700'>
              {success}
            </p>
          )}

          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Nome do Formulário
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData((f) => ({ ...f, name: e.target.value }))
              }
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2 shadow-sm'
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700'
            >
              Descrição
            </label>
            <textarea
              id='description'
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2 shadow-sm'
            />
          </div>

          <div>
            <label
              htmlFor='surveyJson'
              className='block text-sm font-medium text-gray-700'
            >
              Survey JSON
            </label>
            <p className='text-xs text-gray-500'>
              Cuidado ao editar. Idealmente, use um editor de SurveyJS e cole o
              JSON aqui.
            </p>
            <textarea
              id='surveyJson'
              rows={20}
              value={formData.surveyJson}
              onChange={(e) =>
                setFormData((f) => ({ ...f, surveyJson: e.target.value }))
              }
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono text-xs shadow-sm'
            />
          </div>

          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={isSaving}
              className='flex items-center space-x-2 bg-green-600 hover:bg-green-700'
            >
              {isSaving ? (
                <Loader2 size={20} className='animate-spin' />
              ) : (
                <Save size={20} />
              )}
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
