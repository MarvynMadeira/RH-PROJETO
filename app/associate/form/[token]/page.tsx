export default function AssociateFormPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Formulário</h1>
      <p>Token: {params.token}</p>
    </div>
  );
}
