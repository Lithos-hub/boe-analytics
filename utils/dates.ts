export const formatDate = (year: number, month: number, day: number) => {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

export const formatDateToLocaleString = (date: string) => {
  return new Date(date).toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const isFutureDate = (year: number, month: number, day: number) => {
  const today = new Date();
  const date = new Date(year, month - 1, day);
  return date > today;
};

export const isYearLessThan1960 = (year: number) => {
  return year < 1960;
};

export const isToday = (year: number, month: number, day: number) => {
  const today = new Date();
  const date = new Date(year, month - 1, day);
  return date.toDateString() === today.toDateString();
};

export const getCurrentDate = () => {
  return {
    dateRaw: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
};