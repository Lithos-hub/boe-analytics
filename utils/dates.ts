export const formatDateToYYYYMMDD = (
  year: number,
  month: number,
  day: number,
) => {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

export const formatDateToDDMMYYYY = (
  year: number,
  month: number,
  day: number,
) => {
  return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
};

export const formatDateToLocaleString = (date: string) => {
  return new Date(date).toLocaleDateString('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateForScraping = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${year}/${month}/${day}`;
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
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return {
    dateRaw: `${day}-${month}-${year}`,
    year,
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
};
