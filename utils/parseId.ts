// Convertit l'id URL en nombre, retourne null si invalide
export function parseId(id: string): number | null {
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) return null;
  return num;
}
