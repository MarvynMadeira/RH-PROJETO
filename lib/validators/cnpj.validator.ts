export function validateCNPJ(cnpj: string): boolean {
  const cleanedCNPJ = cnpj.replace(/[^\d]+/g, '');

  if (cleanedCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanedCNPJ)) {
    return false;
  }

  const cnpjArray = cleanedCNPJ.split('').map(Number);
  const DV1Weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const DV2Weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calculatedDV = (slice: number[], weights: number[]): number => {
    const sum = slice.reduce((acc, val, idx) => {
      return acc + val * weights[idx];
    }, 0);

    let moduleCnpj = sum % 11;
    return moduleCnpj < 2 ? 0 : 11 - moduleCnpj;
  };

  let sliceDV1 = cnpjArray.slice(0, 12);
  let calculatedDV1 = calculatedDV(sliceDV1, DV1Weights);
  let actualDV1 = cnpjArray[12];

  if (calculatedDV1 !== actualDV1) {
    return false;
  }

  let sliceDV2 = cnpjArray.slice(0, 13);
  let calculatedDV2 = calculatedDV(sliceDV2, DV2Weights);
  let actualDV2 = cnpjArray[13];

  if (calculatedDV2 !== actualDV2) {
    return false;
  }

  return true;
}

export function formatCNPJ(cnpj: string): string {
  const cleanedCNPJ = cnpj.replace(/[^\d]+/g, '');
  return cleanedCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

export function cleanedCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]+/g, '');
}
