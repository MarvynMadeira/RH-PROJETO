'use client';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Link as LinkIcon, ArrowLeft, Loader2 } from 'lucide-react';
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

export default function GenerateFormLinkPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [expiresInDays, setExpiresInDays] = useState(7);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedUrl(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Autenticação expirou.');
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/forms/form-link', {
        method: 'POST', //
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formId, // [cite: 113]
          expiresInDays: expiresInDays, // [cite: 113]
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao gerar link.');
      }

      setGeneratedUrl(data.url); // [cite: 121]
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='space-y-8 p-8'>
      <header className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Gerar Link de Formulário
        </h1>
        <Link href='/admin/forms' passHref>
          <Button className='flex items-center space-x-2 bg-gray-500 hover:bg-gray-600'>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Button>
        </Link>
      </header>

      <hr className='border-gray-200' />

      <Card className='mx-auto max-w-2xl'>
        <div className='space-y-4'>
          {error && (
            <p className='rounded-lg bg-red-100 p-4 text-red-700'>{error}</p>
          )}

          <div>
            <label
              htmlFor='formId'
              className='block text-sm font-medium text-gray-700'
            >
              ID do Formulário
            </label>
            <input
              type='text'
              id='formId'
              value={formId}
              disabled
              className='mt-1 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 shadow-sm'
            />
          </div>

          <div>
            <label
              htmlFor='expiresInDays'
              className='block text-sm font-medium text-gray-700'
            >
              Prazo de Expiração (dias)
            </label>
            <input
              type='number'
              id='expiresInDays'
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              min='1'
              max='365' // [cite: 116]
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2 shadow-sm'
            />
          </div>

          <Button
            onClick={handleGenerateLink}
            disabled={isGenerating}
            className='flex w-full items-center justify-center space-x-2'
          >
            {isGenerating ? (
              <Loader2 size={20} className='animate-spin' />
            ) : (
              <LinkIcon size={20} />
            )}
            <span>{isGenerating ? 'Gerando...' : 'Gerar Link'}</span>
          </Button>

          {generatedUrl && (
            <div className='mt-6 space-y-2'>
              <h3 className='text-lg font-semibold text-green-700'>
                Link Gerado com Sucesso!
              </h3>
              <input
                type='text'
                readOnly
                value={generatedUrl}
                className='mt-1 block w-full rounded-lg border border-gray-300 bg-gray-100 p-2 shadow-sm'
                onFocus={(e) => e.target.select()} // Facilita copiar
              />
              <button
                onClick={() => navigator.clipboard.writeText(generatedUrl)}
                className='text-sm text-blue-600 hover:underline'
              >
                Copiar para Área de Transferência
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
