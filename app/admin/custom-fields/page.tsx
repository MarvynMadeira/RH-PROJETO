'use client';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Zap } from 'lucide-react';
import Link from 'next/link';

interface CustomField {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  isRequired: boolean;
  createdAt: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}
interface ButtonProps extends CardProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
const Card = ({ children, className = '' }: CardProps) => (
  <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
    {children}
  </div>
);
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

export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchFields = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/admin/custom-fields', {
        method: 'GET', //
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erro ao carregar campos.');
      const data = await response.json();
      setFields(data.fields || []); // [cite: 59]
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchFields(token);
  }, [router, fetchFields]);

  const handleDelete = async (fieldId: string) => {
    if (
      !window.confirm(
        'Tem certeza que deseja deletar este campo? Esta ação é permanente.',
      )
    )
      return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Autenticação necessária.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/custom-fields/${fieldId}`, {
        method: 'DELETE', //
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Falha ao deletar.');
      }
      alert('Campo deletado com sucesso!'); // [cite: 65]
      // Refresca a lista
      setFields((prevFields) => prevFields.filter((f) => f.id !== fieldId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGenerateFieldLink = (fieldId: string) => {
    alert(
      'Para gerar um link de campo, vá para a lista de Associados, selecione os associados e use a ação "Solicitar Preenchimento".',
    );
  };

  return (
    <div className='space-y-8 p-8'>
      <header className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Campos Customizados
        </h1>
        <Link href='/admin/custom-fields/create' passHref>
          <Button className='flex items-center space-x-2'>
            <Plus size={20} />
            <span>Novo Campo Customizado</span>
          </Button>
        </Link>
      </header>

      <hr className='border-gray-200' />

      {isLoading && <LoadingSpinner />}
      {error && (
        <p className='rounded-lg border border-red-200 bg-red-100 p-4 text-red-700'>
          Erro ao carregar dados: {error}
        </p>
      )}

      {!isLoading && fields.length === 0 && !error && (
        <Card>
          <p className='text-center text-gray-500'>
            Nenhum campo customizado encontrado.
          </p>
        </Card>
      )}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {fields.map((field) => (
          <Card key={field.id} className='flex flex-col justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-gray-800'>
                {field.fieldLabel}
              </h2>
              <p className='font-mono text-sm text-gray-500'>
                Chave: {field.fieldKey}
              </p>
              <p className='text-sm text-gray-500'>
                Tipo: {field.fieldType} |{' '}
                {field.isRequired ? 'Obrigatório' : 'Opcional'}
              </p>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button
                onClick={() => handleGenerateFieldLink(field.id)}
                className='bg-purple-500 p-2 hover:bg-purple-600'
                title='Gerar Link de Preenchimento (Ação Rápida)'
              >
                <Zap size={18} />
              </Button>
              <Button
                onClick={() => handleDelete(field.id)}
                className='bg-red-500 p-2 hover:bg-red-600'
                title='Deletar Campo'
              >
                <Trash2 size={18} />
              </Button>
            </div>
            <p className='mt-3 text-xs text-gray-400'>
              Criado em: {new Date(field.createdAt).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
