export function formatarTelefone(telefone: string): string {
  telefone = telefone.replace(/\D/g, '');
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

export function formatarCEP(cep: string): string {
  cep = cep.replace(/\D/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}
