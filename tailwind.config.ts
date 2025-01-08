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
};
