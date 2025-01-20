export const months = [
  {
    name: 'Enero',
    id: 1,
  },
  {
    name: 'Febrero',
    id: 2,
  },
  {
    name: 'Marzo',
    id: 3,
  },
  {
    name: 'Abril',
    id: 4,
  },
  {
    name: 'Mayo',
    id: 5,
  },
  {
    name: 'Junio',
    id: 6,
  },
  {
    name: 'Julio',
    id: 7,
  },
  {
    name: 'Agosto',
    id: 8,
  },
  {
    name: 'Septiembre',
    id: 9,
  },
  {
    name: 'Octubre',
    id: 10,
  },
  {
    name: 'Noviembre',
    id: 11,
  },
  {
    name: 'Diciembre',
    id: 12,
  },
];

export const weekDays = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export const weekDaysShort = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// The first released BOE year is 1960
export const years = Array.from(
  { length: new Date().getFullYear() - 1960 + 1 },
  (_, i) => ({
    name: `${1960 + i}`,
    value: 1960 + i,
  }),
);
