// app/admin/forms/builder/standard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

// Componentes Auxiliares (mantidos por consistência)
const Button = ({ children, className = '', ...props }: any) => (
  <button
    {...props}
    className={`rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-gray-400 ${className}`}
  >
    {children}
  </button>
);
const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
    {children}
  </div>
);

// MOCK do JSON do formulário (na vida real, seria carregado da API)
const mockSurveyJson = {
  title: 'Formulário Padrão (Dados e Documentos)',
  pages: [
    {
      name: 'page1',
      elements: [
        { type: 'text', name: 'nomeCompleto', title: 'Nome Completo' },
      ],
    },
    {
      name: 'page2',
      elements: [
        { type: 'file', name: 'rgAnexoFrente', title: 'RG Frente (Anexo)' },
      ],
    },
  ],
  // ... o JSON completo do officialFormSchema traduzido para SurveyJS
};

export default function StandardFormBuilderPage() {
  const [surveyJson, setSurveyJson] = useState<any>(mockSurveyJson);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Na vida real, o SurveyJS Builder seria inicializado aqui com 'surveyJson'

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Lógica de salvar o JSON atualizado na sua API
      // await fetch('/api/admin/forms/standard', { method: 'PUT', body: JSON.stringify(surveyJson), ... });

      alert('A estrutura do Formulário Padrão foi salva com sucesso!');
    } catch (err: any) {
      setError('Falha ao salvar. Verifique o console e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <div className='mx-auto max-w-7xl'>
        <header className='mb-6 flex items-center justify-between border-b pb-4'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Editar: Formulário Padrão de Cadastro
          </h1>
          <Link href='/admin/forms' passHref>
            <Button className='flex items-center space-x-2 bg-gray-500 hover:bg-gray-600'>
              <ArrowLeft size={20} />
              <span>Voltar para Gerenciamento</span>
            </Button>
          </Link>
        </header>

        <p className='mb-6 text-gray-700'>
          Aqui você ajusta as perguntas e campos que o Associado verá. O sistema
          garante que os dados sejam salvos (incluindo anexos) após o envio.
        </p>

        <Card className='p-8'>
          {/* Placeholder para o Construtor do SurveyJS */}
          <div className='border-4 border-dashed border-blue-200 bg-blue-50 p-12 text-center'>
            <h3 className='text-2xl font-bold text-blue-700'>
              Área do Construtor de Formulários (SurveyJS Builder)
            </h3>
            <p className='mt-2 text-blue-600'>
              A biblioteca do SurveyJS Builder seria carregada aqui para
              permitir a edição visual.
            </p>
            <pre className='mt-4 max-h-60 overflow-auto rounded bg-gray-100 p-3 text-left text-xs text-gray-900'>
              {JSON.stringify(surveyJson, null, 2)}
            </pre>
          </div>

          {error && (
            <p className='mt-4 rounded-lg bg-red-100 p-4 font-medium text-red-700'>
              {error}
            </p>
          )}

          <div className='mt-6 flex justify-end'>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className='flex items-center space-x-2 bg-green-600 hover:bg-green-700'
            >
              {isSaving ? (
                <Loader2 size={20} className='animate-spin' />
              ) : (
                <Save size={20} />
              )}
              <span>
                {isSaving ? 'Salvando...' : 'Salvar Estrutura do Formulário'}
              </span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
