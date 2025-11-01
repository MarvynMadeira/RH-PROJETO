export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded"
          />
          <button className="w-full p-2 bg-blue-500 text-white rounded">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
