import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">RH Helper</h1>
        <p className="text-gray-600">Sistema de Gestão de Associados</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-block px-6 py-2 border rounded"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </div>
  );
}
