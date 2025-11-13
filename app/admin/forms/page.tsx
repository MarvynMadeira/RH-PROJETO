// app/admin/forms/page.tsx

'use client';
import Link from 'next/link';
import { Edit, Star } from 'lucide-react';
import { ReactNode } from 'react';

// Mock do Formulário Padrão (Item Fixo)
const STANDARD_FORM = {
  id: 'standard',
  name: 'Formulário Padrão de Cadastro Inicial',
  description:
    'Este formulário coleta os dados e documentos essenciais, e é o único que cria o acesso (Usuário/Senha) do novo Associado no sistema.',
  createdAt: '2023-01-01T00:00:00Z',
};

// Componente Card simples focado no Formulário Padrão
const StandardFormCard = ({ form }: { form: typeof STANDARD_FORM }) => (
  <div className='flex flex-col items-start justify-between rounded-xl border-l-8 border-yellow-500 bg-white p-6 shadow-xl ring-4 ring-yellow-100 transition md:flex-row md:items-center'>
    <div className='mb-4 flex-grow md:mb-0'>
      <div className='mb-2 flex items-center space-x-2'>
        <Star size={24} className='fill-yellow-400 text-yellow-600' />
        {/* Ponto 2: Título destacado/escuro */}
        <h4 className='text-2xl font-bold text-gray-900'>{form.name}</h4>
      </div>

      {/* Ponto 2: Descrição destacada/escura */}
      <p className='mt-1 text-base text-gray-700'>{form.description}</p>
      <p className='mt-3 text-xs text-gray-500'>
        Implementado em: {new Date(form.createdAt).toLocaleDateString()}
      </p>
    </div>

    <div className='mt-4 flex space-x-3 md:mt-0'>
      {/* O link de edição do Formulário Padrão aponta para a rota que você irá construir */}
      <Link
        // Rota para a página de construção do formulário (a ser criada)
        href='/admin/forms/builder/standard'
        className='flex items-center space-x-2 rounded-lg border border-blue-600 px-4 py-2 text-base font-medium text-blue-600 transition hover:bg-blue-50'
        title='Abrir o construtor para editar o conteúdo do formulário'
      >
        <Edit size={18} />
        {/* Ponto 1: Linguagem simples para o usuário */}
        <span>Ajustar o Conteúdo</span>
      </Link>
    </div>
  </div>
);

export default function GerenciamentoFormularioPadraoPage() {
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        {/* Ponto 2: Título destacado/escuro */}
        <h2 className='text-3xl font-bold text-gray-900'>
          Formulário Padrão de Cadastro
        </h2>
        {/* O botão "Criar Novo Formulário" foi removido daqui */}
      </div>

      {/* Ponto 2: Texto de introdução destacado/escuro */}
      <p className='mb-6 text-gray-800'>
        Use esta seção para editar o formulário mestre. Quando um associado
        completa este formulário, todos os dados e arquivos são salvos
        diretamente no banco de dados.
      </p>

      <hr className='mb-8 border-gray-200' />

      {/* SEÇÃO PRINCIPAL: FORMULÁRIO PADRÃO (FIXO) */}
      <div className='mx-auto max-w-4xl'>
        <StandardFormCard form={STANDARD_FORM} />
      </div>

      <div className='mt-12 border-t border-gray-200 p-8 text-center'>
        <h3 className='mb-2 text-xl font-bold text-gray-800'>
          Atenção: Não há opção para criar novos formulários.
        </h3>
        <p className='text-gray-600'>
          Se precisar de outro formulário, edite o formulário padrão acima.
        </p>
      </div>
    </div>
  );
}
