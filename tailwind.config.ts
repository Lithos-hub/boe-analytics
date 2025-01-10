import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        dark: colors.stone,
        primary: colors.indigo,
        secondary: colors.pink,
      },
    },
  },
  safelist: [
    'py-2',
    'flex',
    'list-none',
    'flex-col',
    'gap-2',
    'text-green-500',
    'text-red-500',
    'text-slate-500',
  ],
};
