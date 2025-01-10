export const formatDate = (year: number, month: number, day: number) => {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

export const isFutureDate = (year: number, month: number, day: number) => {
  const today = new Date();
  const date = new Date(year, month - 1, day);
  return date > today;
};
