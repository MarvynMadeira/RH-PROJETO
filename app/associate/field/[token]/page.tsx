'use client';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';

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

// Tipagem do campo
interface CustomFieldDef {
  fieldKey: string;
  fieldLabel: string;
  description?: string;
  fieldType: string;
  options?: string[];
  isRequired: boolean;
}

const DynamicInput = ({
  field,
  value,
  onChange,
}: {
  field: CustomFieldDef;
  value: any;
  onChange: (value: any) => void;
}) => {
  const commonProps = {
    id: field.fieldKey,
    required: field.isRequired,
    className:
      'mt-1 block w-full rounded-lg border border-gray-300 p-2 shadow-sm',
    onChange: (e: any) => onChange(e.target.value),
    value: value || '',
  };

  if (field.fieldType === 'textarea') {
    return <textarea {...commonProps} rows={5} />;
  }
  if (field.fieldType === 'dropdown') {
    return (
      <select {...commonProps}>
        <option value=''>Selecione...</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (field.fieldType === 'date') {
    return <input type='date' {...commonProps} />;
  }
  if (field.fieldType === 'number') {
    return <input type='number' {...commonProps} />;
  }
  if (field.fieldType === 'file') {
    // A API [cite: 177] espera 'data:' string
    return (
      <input
        type='file'
        id={field.fieldKey}
        required={field.isRequired}
        className={commonProps.className}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result);
              reader.onerror = (e) => reject(e);
              reader.readAsDataURL(file);
            });
            onChange(dataUrl);
          }
        }}
      />
    );
  }
  // Default 'text'
  return <input type='text' {...commonProps} />;
};

export default function AssociateFieldPage() {
  const params = useParams();
  const token = params.token as string;

  const [fieldDef, setFieldDef] = useState<CustomFieldDef | null>(null);
  const [value, setValue] = useState<any>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchFieldDef = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/associate/field/${token}`); //
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.message || 'Link inválido, expirado ou já utilizado.',
          ); // [cite: 168, 169]
        }
        const data = await response.json();
        setFieldDef(data); // [cite: 169]
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFieldDef();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldDef?.isRequired && !value) {
      setError('Este campo é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/associate/field/submit', {
        method: 'POST', //
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          value: value, // [cite: 177]
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao enviar dados.');
      }

      setSubmitSuccess(true); // [cite: 181]
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner />{' '}
        <span className='ml-2'>Carregando solicitação...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='text-center'>
          <h2 className='text-2xl font-bold text-red-600'>Erro</h2>
          <p className='mt-2 text-gray-700'>{error}</p>
        </Card>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
        <Card className='max-w-lg text-center'>
          <h1 className='text-2xl font-bold text-green-700'>Obrigado!</h1>
          <p className='mt-4'>
            Sua informação foi enviada com sucesso. Você já pode fechar esta
            página.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <Card className='mx-auto max-w-lg'>
        <header className='border-b pb-4'>
          <h1 className='text-3xl font-bold text-gray-800'>
            {fieldDef?.fieldLabel}
          </h1>
          <p className='mt-1 text-gray-600'>
            {fieldDef?.description ||
              'Por favor, preencha a informação solicitada.'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          {error && (
            <p className='rounded-lg bg-red-100 p-4 text-red-700'>{error}</p>
          )}

          {fieldDef && (
            <div>
              <label
                htmlFor={fieldDef.fieldKey}
                className='block text-sm font-medium text-gray-700'
              >
                {fieldDef.fieldLabel}{' '}
                {fieldDef.isRequired && <span className='text-red-500'>*</span>}
              </label>
              <DynamicInput
                field={fieldDef}
                value={value}
                onChange={setValue}
              />
            </div>
          )}

          <Button
            type='submit'
            disabled={isSubmitting}
            className='flex w-full items-center justify-center space-x-2'
          >
            {isSubmitting ? (
              <Loader2 size={20} className='animate-spin' />
            ) : (
              <Send size={20} />
            )}
            <span>{isSubmitting ? 'Enviando...' : 'Enviar Informação'}</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
