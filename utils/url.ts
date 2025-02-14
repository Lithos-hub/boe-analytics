export const buildBoeUrl = (id?: string) => {
  if (!id) return '';
  return `https://www.boe.es/diario_boe/txt.php?id=${id}`;
};
