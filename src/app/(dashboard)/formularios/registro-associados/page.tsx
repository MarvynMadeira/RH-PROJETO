'use client';

import { useState } from 'react';

export default function RegistroAssociadosPage() {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');

  const gerarLink = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/formularios/link-publico', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setLink(data.link);
      setExpiresAt(new Date(data.expiresAt).toLocaleString('pt-BR'));
    } catch (err) {
      alert('Erro ao gerar link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(link);
    alert('Link copiado!');
  };

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Registro de Associados
        </h1>
        <p className='mt-2 text-gray-600'>
          Gere um link público para que associados possam se registrar
        </p>
      </div>

      <div className='rounded-lg bg-white p-6 shadow'>
        <div className='space-y-4'>
          <div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Como funciona:
            </h3>
            <ul className='list-inside list-disc space-y-2 text-gray-600'>
              <li>Clique em "Gerar Link" para criar um link de registro</li>
              <li>O link será válido por 7 dias</li>
              <li>Compartilhe o link com os associados que deseja registrar</li>
              <li>Após 7 dias, gere um novo link se necessário</li>
            </ul>
          </div>

          <div className='border-t pt-4'>
            <button
              onClick={gerarLink}
              disabled={loading}
              className='rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? 'Gerando...' : 'Gerar Link'}
            </button>
          </div>

          {link && (
            <div className='space-y-3 border-t pt-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Link gerado:
                </label>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={link}
                    readOnly
                    className='flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2'
                  />
                  <button
                    onClick={copiarLink}
                    className='rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <p className='text-sm text-gray-600'>
                Expira em: <strong>{expiresAt}</strong>
              </p>

              <div className='rounded-md border border-blue-200 bg-blue-50 p-4'>
                <p className='text-sm text-blue-800'>
                  <strong>Dica:</strong> Envie este link por email, WhatsApp ou
                  qualquer meio de comunicação. Os associados poderão acessar e
                  preencher o formulário de cadastro.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
