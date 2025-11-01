export default function AssociateFieldPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Campo Customizado</h1>
      <p>Token: {params.token}</p>
    </div>
  );
}
