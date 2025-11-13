// app/admin/custom-fields/create/page.tsx
'use client';
import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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

const FIELD_TYPES_MAPPING = {
  text: 'Texto Curto (Nome, CPF)',
  textarea: 'Texto Longo (Observações)',
  number: 'Número (Idade, Salário)',
  date: 'Data (Nascimento, Admissão)',
  dropdown: 'Lista de Seleção (Escolher 1 opção)',
  multiselect: 'Seleção Múltipla (Escolher Várias)',
  file: 'Upload de Arquivo (Documentos, Fotos)',
};
const FIELD_TYPES = Object.keys(FIELD_TYPES_MAPPING);

export default function CriarNovoCampoCustomizadoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fieldLabel: '',
    fieldKey: '',
    description: '',
    fieldType: 'text',
    isRequired: false,
    options: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const precisaDeOpcoes =
    formData.fieldType === 'dropdown' || formData.fieldType === 'multiselect';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Sua sessão expirou. Por favor, faça login novamente.');
      setIsSaving(false);
      return;
    }

    let optionsArray = null;
    if (precisaDeOpcoes) {
      optionsArray = formData.options
        .split(',')
        .map((opt) => opt.trim())
        .filter(Boolean);
      if (optionsArray.length === 0) {
        setError(
          'Campos de seleção (Lista ou Múltipla) precisam de opções. Preencha o campo de Opções.',
        );
        setIsSaving(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/admin/custom-fields', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldLabel: formData.fieldLabel,
          fieldKey:
            formData.fieldKey ||
            formData.fieldLabel
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, ''),
          description: formData.description,
          fieldType: formData.fieldType,
          isRequired: formData.isRequired,
          options: optionsArray,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || 'Não foi possível criar o campo no sistema.',
        );
      }

      alert('Campo criado com sucesso! Ele já está disponível para uso.');
      router.push('/admin/custom-fields');
    } catch (err: any) {
      // Ponto 1: Mensagem de erro simples
      setError(
        `Ocorreu um erro: ${err.message}. Verifique os dados e tente novamente.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='space-y-8 p-8'>
      <header className='flex items-center justify-between'>
        {/* Ponto 2: Título destacado/escuro */}
        <h1 className='text-3xl font-bold text-gray-900'>
          Criar Novo Campo para o Associado
        </h1>
        <Link href='/admin/custom-fields' passHref>
          <Button className='flex items-center space-x-2 bg-gray-500 hover:bg-gray-600'>
            <ArrowLeft size={20} />
            <span>Voltar para a Lista</span>
          </Button>
        </Link>
      </header>

      <hr className='border-gray-200' />

      <div className='mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <p className='rounded-lg bg-red-100 p-4 font-medium text-red-700'>
              {error}
            </p>
          )}

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Ponto 1: Texto simples para o usuário */}
            <div>
              <label
                htmlFor='fieldLabel'
                // Ponto 2: Label com fonte destacada/escura
                className='block text-sm font-semibold text-gray-900'
              >
                Nome do Campo (Como o associado verá) *Obrigatório
              </label>
              <p className='mb-1 text-xs text-gray-600'>
                Ex: Nome Completo, Cargo, Data de Admissão.
              </p>
              <input
                type='text'
                id='fieldLabel'
                value={formData.fieldLabel}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, fieldLabel: e.target.value }))
                }
                // Ponto 2: Garante o texto de entrada preto
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-900 shadow-sm'
                required
              />
            </div>

            {/* Ponto 1: Texto simples para o usuário */}
            <div>
              <label
                htmlFor='fieldKey'
                // Ponto 2: Label com fonte destacada/escura
                className='block text-sm font-semibold text-gray-900'
              >
                Nome Técnico para o Sistema
              </label>
              <p className='mb-1 text-xs text-gray-600'>
                Use letras minúsculas e 'underline' (_). Se deixar vazio, o
                sistema criará um.
              </p>
              <input
                type='text'
                id='fieldKey'
                value={formData.fieldKey}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, fieldKey: e.target.value }))
                }
                placeholder='ex: nome_completo'
                // Ponto 2: Garante o texto de entrada preto
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-900 shadow-sm'
              />
            </div>
          </div>

          {/* Ponto 1: Texto simples para o usuário */}
          <div>
            <label
              htmlFor='description'
              // Ponto 2: Label com fonte destacada/escura
              className='block text-sm font-semibold text-gray-900'
            >
              Ajuda ou Explicação
            </label>
            <p className='mb-1 text-xs text-gray-600'>
              Um texto curto que aparece abaixo do campo para guiar quem estiver
              preenchendo.
            </p>
            <textarea
              id='description'
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
              // Ponto 2: Garante o texto de entrada preto
              className='mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-900 shadow-sm'
            />
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Ponto 1: Texto simples para o usuário */}
            <div>
              <label
                htmlFor='fieldType'
                // Ponto 2: Label com fonte destacada/escura
                className='block text-sm font-semibold text-gray-900'
              >
                Tipo de Informação que será coletada
              </label>
              <select
                id='fieldType'
                value={formData.fieldType}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, fieldType: e.target.value }))
                }
                // Ponto 2: Garante o texto de entrada preto
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-900 shadow-sm'
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {
                      FIELD_TYPES_MAPPING[
                        type as keyof typeof FIELD_TYPES_MAPPING
                      ]
                    }
                  </option>
                ))}
              </select>
            </div>

            {/* Ponto 1: Texto simples para o usuário */}
            <div className='flex items-end'>
              <div className='flex items-center'>
                <input
                  id='isRequired'
                  type='checkbox'
                  checked={formData.isRequired}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, isRequired: e.target.checked }))
                  }
                  className='h-4 w-4 rounded border-gray-300 text-blue-600'
                />
                <label
                  htmlFor='isRequired'
                  // Ponto 2: Label com fonte destacada/escura
                  className='ml-2 block text-sm font-semibold text-gray-900'
                >
                  Tornar este campo obrigatório
                </label>
              </div>
            </div>
          </div>

          {/* Ponto 1: Texto simples para o usuário */}
          {precisaDeOpcoes && (
            <div>
              <label
                htmlFor='options'
                // Ponto 2: Label com fonte destacada/escura
                className='block text-sm font-semibold text-gray-900'
              >
                Opções de Escolha
              </label>
              <p className='mb-1 text-xs text-gray-600'>
                Digite as opções separando cada uma com uma vírgula. Ex:
                Solteiro, Casado, Divorciado
              </p>
              <textarea
                id='options'
                rows={3}
                value={formData.options}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, options: e.target.value }))
                }
                placeholder='Opção 1, Opção 2, Opção 3'
                // Ponto 2: Garante o texto de entrada preto
                className='mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-900 shadow-sm'
              />
            </div>
          )}

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
              {/* Ponto 1: Texto simples para o botão */}
              <span>{isSaving ? 'Salvando...' : 'Criar Campo'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
